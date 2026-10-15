#!/usr/bin/env node
import { existsSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  assertLinux,
  defaultRegistryPath,
  readCdpVersion,
  selectProfile,
} from "./registry.mjs";
import {
  acquireLease,
  defaultLeaseDirectory,
  listLeases,
  releaseLease,
} from "./lease.mjs";

export async function connectLinuxBrowser({
  name,
  purpose,
  registryPath = defaultRegistryPath,
  packagePath = resolve("package.json"),
  owner,
  task,
  scope = "tab",
  targetId,
  startUrl,
  resources = [],
  leaseDirectory = defaultLeaseDirectory,
}) {
  assertLinux();
  const profile = selectProfile({ registryPath, name, purpose });
  const version = await readCdpVersion(profile.cdp_endpoint);
  const lease = acquireLease({
    endpoint: profile.cdp_endpoint,
    instance: profile.name,
    owner,
    task,
    scope,
    browserId: version.browserId,
    targetId,
    resources,
    directory: leaseDirectory,
  });
  let browser;
  let page;
  let createdPage = false;
  let boundTargetId = targetId ?? null;
  let closed = false;
  try {
    const require = createRequire(resolve(packagePath));
    const { chromium } = require("playwright");
    browser = await chromium.connectOverCDP(version.webSocketDebuggerUrl, { timeout: 15000 });
    const context = browser.contexts()[0];
    if (!context) throw new Error("connected browser has no default context");
    if (scope === "browser") {
      if (targetId != null) throw new Error("browser leases cannot select a target");
    } else {
      const targetIdOf = async candidate => {
        const session = await context.newCDPSession(candidate);
        try { return (await session.send("Target.getTargetInfo")).targetInfo.targetId; }
        finally { await session.detach().catch(() => {}); }
      };
      const pages = context.pages();
      if (targetId != null) {
        for (const candidate of pages) {
          if (await targetIdOf(candidate) === targetId) { page = candidate; break; }
        }
        if (!page) throw new Error(`target is not an open page: ${targetId}`);
      } else {
        page = await context.newPage();
        createdPage = true;
        boundTargetId = await targetIdOf(page);
        lease.claimTab(boundTargetId);
        if (startUrl != null) await page.goto(startUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      }
    }
    if (scope === "tab" && page && typeof page.once === "function") {
      page.once("close", () => lease.markTargetGone("page closed"));
    }
    browser.once("disconnected", () => {
      if (scope === "tab") lease.markTargetGone("browser disconnected");
      lease.release();
    });
    const disconnect = browser.close.bind(browser);
    const close = async () => {
      if (closed) return;
      closed = true;
      try {
        if (createdPage && page && !page.isClosed()) await page.close();
      } finally {
        try { await disconnect(); }
        finally { lease.release(); }
      }
    };
    browser.close = close;
    return { browser, page, targetId: boundTargetId, profile, version, lease, close };
  } catch (error) {
    if (createdPage && page && !page.isClosed()) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    lease.release();
    throw error;
  }
}

export function pagesForReport(scope, contexts, ownedPage) {
  return scope === "tab"
    ? (ownedPage ? [ownedPage] : [])
    : contexts.flatMap(context => context.pages());
}

async function main() {
  const { values } = parseArgs({
    options: {
      name: { type: "string" },
      purpose: { type: "string" },
      registry: { type: "string" },
      package: { type: "string" },
      owner: { type: "string" },
      task: { type: "string" },
      scope: { type: "string", default: "tab" },
      target: { type: "string" },
      "start-url": { type: "string" },
      resource: { type: "string", multiple: true },
      "lease-directory": { type: "string" },
      status: { type: "boolean" },
      release: { type: "string" },
      "confirm-owner-stopped": { type: "boolean" },
      help: { type: "boolean" },
    },
  });
  if (values.help) {
    console.log("connect_browser.mjs --name PROFILE --owner AGENT --task TASK [--scope tab|browser] [--target TARGET_ID] [--start-url URL]");
    return;
  }
  if (values.status) {
    console.log(JSON.stringify(listLeases(values["lease-directory"] || defaultLeaseDirectory), null, 2));
    return;
  }
  if (values.release) {
    if (!values["confirm-owner-stopped"]) throw new Error("confirm the exact owner stopped before release");
    releaseLease(values.release, values["lease-directory"] || defaultLeaseDirectory);
    return;
  }
  if (!values.task?.trim()) throw new Error("--task is required");
  const connection = await connectLinuxBrowser({
    name: values.name,
    purpose: values.purpose,
    registryPath: values.registry || defaultRegistryPath,
    packagePath: values.package,
    task: values.task,
    owner: values.owner,
    scope: values.scope,
    targetId: values.target,
    startUrl: values["start-url"],
    resources: values.resource,
    leaseDirectory: values["lease-directory"] || defaultLeaseDirectory,
  });
  try {
    const contexts = connection.browser.contexts();
    const pages = pagesForReport(values.scope, contexts, connection.page);
    console.log(JSON.stringify({
      profile: connection.profile.name,
      purpose: connection.profile.purpose,
      cdp_endpoint: connection.profile.cdp_endpoint,
      browser: connection.version.Browser,
      browser_id: connection.version.browserId,
      target_id: connection.targetId,
      scope: values.scope,
      owner: values.owner,
      task: values.task,
      contexts: contexts.length,
      pages: pages.length,
      page_hosts: await Promise.all(pages.map(async (page) => {
        try { return new URL(page.url()).hostname; } catch { return "unknown"; }
      })),
      lease_run_id: connection.lease.runId,
    }, null, 2));
  } finally {
    await connection.browser.close();
  }
}

if (process.argv[1] && existsSync(process.argv[1]) && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
