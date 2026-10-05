#!/usr/bin/env node
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
  task,
  resources = [],
  leaseDirectory = defaultLeaseDirectory,
}) {
  assertLinux();
  const profile = selectProfile({ registryPath, name, purpose });
  const lease = acquireLease({
    endpoint: profile.cdp_endpoint,
    instance: profile.name,
    task,
    resources,
    directory: leaseDirectory,
  });
  try {
    const require = createRequire(resolve(packagePath));
    const { chromium } = require("playwright");
    const version = await readCdpVersion(profile.cdp_endpoint);
    const response = await fetch(new URL("/json/version", profile.cdp_endpoint), {
      signal: AbortSignal.timeout(5000),
      redirect: "error",
    });
    const metadata = await response.json();
    const socketUrl = new URL(metadata.webSocketDebuggerUrl);
    if (
      socketUrl.protocol !== "ws:" ||
      !socketUrl.pathname.startsWith("/devtools/browser/")
    ) throw new Error("CDP discovery returned an unexpected WebSocket endpoint");
    socketUrl.host = new URL(profile.cdp_endpoint).host;
    socketUrl.username = "";
    socketUrl.password = "";
    const browser = await chromium.connectOverCDP(socketUrl.href, { timeout: 15000 });
    browser.once("disconnected", lease.release);
    const disconnect = browser.close.bind(browser);
    browser.close = async (...args) => {
      const result = await disconnect(...args);
      lease.release();
      return result;
    };
    return { browser, profile, version, lease };
  } catch (error) {
    lease.release();
    throw error;
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      name: { type: "string" },
      purpose: { type: "string" },
      registry: { type: "string" },
      package: { type: "string" },
      task: { type: "string" },
      resource: { type: "string", multiple: true },
      "lease-directory": { type: "string" },
      status: { type: "boolean" },
      release: { type: "string" },
      "confirm-owner-stopped": { type: "boolean" },
      help: { type: "boolean" },
    },
  });
  if (values.help) {
    console.log("connect_browser.mjs --name PROFILE --task TASK --package /path/package.json [--resource ID]");
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
    resources: values.resource,
    leaseDirectory: values["lease-directory"] || defaultLeaseDirectory,
  });
  try {
    const contexts = connection.browser.contexts();
    const pages = contexts.flatMap((context) => context.pages());
    console.log(JSON.stringify({
      profile: connection.profile.name,
      purpose: connection.profile.purpose,
      cdp_endpoint: connection.profile.cdp_endpoint,
      browser: connection.version.Browser,
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

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
