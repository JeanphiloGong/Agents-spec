#!/usr/bin/env node
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  acquireBrowserLease,
  listBrowserLeases,
  releaseBrowserLease,
} from "./browser_lease.mjs";

export async function connectVmBrowser({
  endpoint,
  packagePath = resolve("package.json"),
  instance,
  task,
  resources = [],
  leaseDirectory,
}) {
  const origin = new URL(endpoint);
  if (
    origin.protocol !== "http:" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname) ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  ) {
    throw new Error(
      "Use a loopback HTTP origin forwarded to the guest CDP endpoint",
    );
  }
  const lease = acquireBrowserLease({
    endpoint: origin.origin,
    instance,
    task,
    resources,
    directory: leaseDirectory,
  });
  try {
    const require = createRequire(resolve(packagePath));
    const { chromium } = require("playwright");
    const response = await fetch(new URL("/json/version", origin), {
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok)
      throw new Error(`Guest CDP discovery returned HTTP ${response.status}`);
    const version = await response.json();
    if (!version.webSocketDebuggerUrl)
      throw new Error("Guest CDP discovery has no WebSocket endpoint");
    const socketUrl = new URL(version.webSocketDebuggerUrl);
    if (
      socketUrl.protocol !== "ws:" ||
      !socketUrl.pathname.startsWith("/devtools/browser/")
    ) {
      throw new Error(
        "Guest CDP discovery returned an unexpected WebSocket endpoint",
      );
    }
    socketUrl.host = origin.host;
    socketUrl.username = "";
    socketUrl.password = "";
    const browser = await chromium.connectOverCDP(socketUrl.href, {
      timeout: 15000,
    });
    browser.once("disconnected", lease.release);
    const disconnect = browser.close.bind(browser);
    browser.close = async (...args) => {
      const result = await disconnect(...args);
      lease.release();
      return result;
    };
    return browser;
  } catch (error) {
    lease.release();
    throw error;
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      endpoint: { type: "string" },
      package: { type: "string" },
      screenshot: { type: "string" },
      help: { type: "boolean" },
      instance: { type: "string" },
      task: { type: "string" },
      resource: { type: "string", multiple: true },
      "lease-directory": { type: "string" },
      status: { type: "boolean" },
      release: { type: "string" },
      "confirm-owner-stopped": { type: "boolean" },
    },
  });
  if (values.help) {
    console.log(
      "node connect_browser.mjs --endpoint http://127.0.0.1:19223 --instance agent-design-02 --task browser-check --package /path/package.json --screenshot /tmp/vm-browser.png\nUse --status to inspect leases; --release RUN_ID --confirm-owner-stopped only after confirming the owner stopped.",
    );
    return;
  }
  if (values.status) {
    console.log(
      JSON.stringify(listBrowserLeases(values["lease-directory"]), null, 2),
    );
    return;
  }
  if (values.release) {
    if (!values["confirm-owner-stopped"])
      throw new Error("Confirm the owner stopped before releasing a lease");
    releaseBrowserLease(values.release, values["lease-directory"]);
    return;
  }
  if (!values.endpoint || !values.screenshot)
    throw new Error("--endpoint and --screenshot are required");
  const browser = await connectVmBrowser({
    endpoint: values.endpoint,
    packagePath: values.package,
    instance: values.instance,
    task: values.task,
    resources: values.resource,
    leaseDirectory: values["lease-directory"],
  });
  let context;
  try {
    context = await browser.newContext({
      viewport: { width: 1000, height: 700 },
    });
    const page = await context.newPage();
    const runtime = await page.evaluate(() => ({
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    }));
    if (
      runtime.platform !== "Win32" ||
      !runtime.userAgent.includes("Windows NT")
    ) {
      throw new Error(
        "The connected browser does not report a Windows runtime; check the VM route",
      );
    }
    await page.setContent(
      '<!doctype html><html><head><title>VM browser check</title></head><body><h1>VM browser check</h1><label>Probe <input aria-label="Probe"></label><button>Verify</button><output></output><script>document.querySelector("button").onclick=()=>document.querySelector("output").textContent=document.querySelector("input").value;</script></body></html>',
    );
    await page.getByRole("textbox", { name: "Probe" }).fill("Windows VM");
    await page.getByRole("button", { name: "Verify" }).click();
    if ((await page.locator("output").textContent()) !== "Windows VM")
      throw new Error("VM page interaction failed");
    await page.screenshot({ path: values.screenshot });
    console.log(
      JSON.stringify({
        endpoint: values.endpoint,
        browser: browser.version(),
        ...runtime,
        interaction: "passed",
        screenshot: resolve(values.screenshot),
      }),
    );
  } finally {
    try {
      if (context) await context.close();
    } finally {
      await browser.close();
    }
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
