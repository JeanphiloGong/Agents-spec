import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout } from "node:timers/promises";
import { test } from "node:test";
import {
  profileProcess,
  inspectProfile,
  readCdpVersion,
  readRegistry,
  selectProfile,
  validateProfile,
} from "./registry.mjs";
import { acquireLease, listLeases, releaseLease } from "./lease.mjs";
import { connectLinuxBrowser, pagesForReport } from "./connect_browser.mjs";

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "linux-browser-control-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const registryPath = join(directory, "registry.json");
  writeFileSync(registryPath, JSON.stringify({
    schema_version: 1,
    platform: "linux",
    root: directory,
    profiles: [{
      name: "design",
      purpose: "Design workspace",
      browser: "google-chrome",
      profile_dir: join(directory, "design"),
      cdp_endpoint: "http://127.0.0.1:19224",
    }],
  }));
  return { directory, registryPath, endpoint: "http://127.0.0.1:19224" };
}

test("registry selects a named Linux profile and rejects remote endpoints", (t) => {
  const options = fixture(t);
  const registry = readRegistry(options.registryPath);
  assert.equal(registry.platform, "linux");
  const profile = selectProfile({ registryPath: options.registryPath, name: "design" });
  assert.equal(profile.cdp_origin, options.endpoint);
  assert.deepEqual(profileProcess(profile.profile_dir), []);
  assert.throws(
    () => validateProfile({ ...profile, cdp_endpoint: "https://example.test" }, options.registryPath),
    /loopback HTTP origin/,
  );
});

function tabOptions(options, overrides = {}) {
  return {
    endpoint: options.endpoint,
    instance: "design",
    owner: "agent-a",
    task: "read-design",
    browserId: "browser-1",
    targetId: "tab-1",
    directory: join(options.directory, "leases"),
    ...overrides,
  };
}

test("different tabs coexist while the same tab and business resource stay exclusive", (t) => {
  const options = fixture(t);
  const leaseDirectory = join(options.directory, "leases");
  const first = acquireLease(tabOptions(options, { resources: ["figma:file-1"] }));
  t.after(first.release);
  const second = acquireLease(tabOptions(options, { owner: "agent-b", targetId: "tab-2" }));
  t.after(second.release);
  assert.equal(listLeases(leaseDirectory).length, 2);
  assert.equal(listLeases(leaseDirectory).find(record => record.runId === first.runId).owner, "agent-a");
  assert.throws(
    () => acquireLease(tabOptions(options, { owner: "agent-c" })),
    /occupied/,
  );
  assert.throws(
    () => acquireLease(tabOptions(options, {
      endpoint: "http://127.0.0.1:19225",
      instance: "second",
      task: "write-design",
      resources: ["figma:file-1"],
      owner: "agent-c",
    })),
    /occupied/,
  );
  const runId = first.runId;
  first.release();
  second.release();
  assert.deepEqual(listLeases(leaseDirectory), []);
  assert.throws(() => releaseLease(runId, leaseDirectory), /no lease matches/);
});

test("browser-wide leases exclude both active tabs and pending tab allocations", (t) => {
  const options = fixture(t);
  const pending = acquireLease(tabOptions(options, { targetId: undefined }));
  t.after(pending.release);
  assert.throws(() => acquireLease(tabOptions(options, { scope: "browser" })), /occupied/);
  pending.claimTab("allocated-tab");
  pending.assertOwned();
  assert.throws(() => acquireLease(tabOptions(options, { targetId: "allocated-tab" })), /occupied/);
  pending.release();
  const browser = acquireLease(tabOptions(options, { scope: "browser" }));
  t.after(browser.release);
  assert.throws(() => acquireLease(tabOptions(options)), /occupied/);
  assert.throws(() => acquireLease(tabOptions(options, { targetId: undefined })), /occupied/);
  assert.throws(() => acquireLease(tabOptions(options, { scope: "browser", instance: "alias" })), /occupied/);
});

test("a pending allocation can bind only one unoccupied target", (t) => {
  const options = fixture(t);
  const first = acquireLease(tabOptions(options));
  const pending = acquireLease(tabOptions(options, { owner: "agent-b", targetId: undefined }));
  t.after(first.release);
  t.after(pending.release);
  assert.throws(() => pending.claimTab("tab-1"), /occupied/);
  pending.claimTab("tab-2");
  assert.throws(() => pending.claimTab("tab-3"), /already/);
  pending.release();
  assert.throws(() => pending.assertOwned(), /released/);
  first.assertOwned();
});

test("heartbeats renew leases and expiry never authorizes takeover", async (t) => {
  const options = fixture(t);
  const lease = acquireLease(tabOptions(options, { heartbeatMs: 10, ttlMs: 100 }));
  t.after(lease.release);
  const before = listLeases(join(options.directory, "leases"))[0].lastHeartbeat;
  await setTimeout(40);
  const renewed = listLeases(join(options.directory, "leases"))[0];
  assert.ok(Date.parse(renewed.lastHeartbeat) > Date.parse(before));
  assert.equal(listLeases(join(options.directory, "leases"), Date.now() + 1000)[0].status, "unresponsive");
  assert.throws(() => acquireLease(tabOptions(options)), /occupied/);
});

test("lease inputs reject missing owners, unsafe endpoints and reserved resources", (t) => {
  const options = fixture(t);
  for (const override of [
    { owner: "" }, { browserId: "" }, { scope: "other" },
    { endpoint: "http://user:password@127.0.0.1:19224" },
    { endpoint: "http://127.0.0.1:19224/path" },
    { resources: ["endpoint:19224"] }, { targetId: "tab/../other" },
  ]) assert.throws(() => acquireLease(tabOptions(options, override)));
  assert.deepEqual(listLeases(join(options.directory, "leases")), []);
});

test("unknown lease records fail closed and failed claims leave existing owners intact", (t) => {
  const options = fixture(t);
  const first = acquireLease(tabOptions(options));
  t.after(first.release);
  const directory = join(options.directory, "leases");
  const recordPath = join(directory, readdirSync(directory).find(name => /^[a-f0-9]{64}$/.test(name)), "lease.json");
  writeFileSync(recordPath, "not-json");
  assert.equal(listLeases(directory)[0].status, "unknown");
  assert.throws(() => acquireLease(tabOptions(options, { targetId: "tab-2", scope: "browser" })), /occupied|unknown/);
  assert.throws(() => first.assertOwned(), /ownership|JSON|Unexpected/);
});

for (const [scenario, overrides] of [
  ["same target", {}],
  ["different targets", { targetId: "tab-2" }],
  ["browser and tab", { scope: "browser", targetId: undefined }],
]) test(`separate processes coordinate ${scenario} claims`, { timeout: 10000 }, async (t) => {
  const options = fixture(t);
  const code = `
    import { acquireLease } from ${JSON.stringify(new URL("./lease.mjs", import.meta.url).href)};
    let lease;
    process.stdin.on('data', () => {
      if (lease) { lease.release(); process.exit(0); }
      try {
        lease = acquireLease(JSON.parse(process.argv.at(-1)));
        console.log('acquired');
      } catch (error) { console.log(error.message.includes('occupied') ? 'occupied' : error.message); }
    });
    console.log('ready');
  `;
  const children = ["agent-a", "agent-b"].map((owner, index) => {
    const child = spawn(process.execPath, ["--input-type=module", "-e", code, JSON.stringify(tabOptions(options, {
      owner, ...(index === 1 ? overrides : {}),
    }))]);
    t.after(() => new Promise(resolve => {
      if (child.exitCode !== null || child.signalCode !== null) return resolve();
      child.once("exit", resolve);
      child.kill();
    }));
    const lines = createInterface({ input: child.stdout })[Symbol.asyncIterator]();
    return { child, lines };
  });
  await Promise.all(children.map(async ({ lines }) => assert.equal((await lines.next()).value, "ready")));
  children.forEach(({ child }) => child.stdin.write("go\n"));
  const outcomes = await Promise.all(children.map(async ({ lines }) => (await lines.next()).value));
  if (scenario === "different targets") assert.deepEqual(outcomes, ["acquired", "acquired"]);
  else {
    assert.ok(outcomes.includes("occupied"));
    assert.ok(outcomes.every(outcome => ["acquired", "occupied"].includes(outcome)));
    if (scenario === "same target") assert.ok(outcomes.includes("acquired"));
  }
});

async function connectionFixture(t) {
  const options = fixture(t);
  let discoveries = 0;
  const server = createServer((request, response) => {
    discoveries++;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({
      Browser: "Chrome/test", "Protocol-Version": "1.3",
      webSocketDebuggerUrl: `ws://localhost:${server.address().port}/devtools/browser/browser-${discoveries}`,
    }));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  const registry = readRegistry(options.registryPath);
  registry.profiles[0].cdp_endpoint = endpoint;
  writeFileSync(options.registryPath, JSON.stringify(registry));
  const packagePath = join(options.directory, "package.json");
  const modulePath = join(options.directory, "node_modules", "playwright");
  mkdirSync(modulePath, { recursive: true });
  writeFileSync(join(modulePath, "index.js"), "module.exports = {};\n");
  const playwright = createRequire(packagePath)("playwright");
  const pageEvents = new Map();
  const page = {
    targetId: "new-tab",
    isClosed: () => false,
    close: t.mock.fn(async () => {}),
    goto: async () => {},
    once: (event, handler) => pageEvents.set(event, handler),
  };
  const existing = { ...page, targetId: "existing-tab", close: t.mock.fn(async () => {}) };
  const disconnect = t.mock.fn(async () => {});
  const browserEvents = new Map();
  const context = {
    pages: () => [existing], newPage: async () => page,
    newCDPSession: async candidate => ({
      send: async () => ({ targetInfo: { targetId: candidate.targetId } }),
      detach: async () => {},
    }),
  };
  const browser = { contexts: () => [context], once: (event, handler) => browserEvents.set(event, handler), close: disconnect };
  playwright.chromium = { connectOverCDP: async socket => {
    assert.equal(socket, `${endpoint.replace("http:", "ws:")}/devtools/browser/browser-1`);
    return browser;
  } };
  return {
    page,
    existing,
    disconnect,
    closePage: () => pageEvents.get("close")?.(),
    disconnectBrowser: () => browserEvents.get("disconnected")?.(),
    connectionOptions: {
      name: "design",
      owner: "agent-a",
      task: "connection-check",
      registryPath: options.registryPath,
      packagePath,
      leaseDirectory: join(options.directory, "leases"),
    },
  };
}

test("navigation starts with a bound target and failure closes only the new page", async (t) => {
  const { page, existing, disconnect, connectionOptions } = await connectionFixture(t);
  page.goto = async () => {
    const [lease] = listLeases(connectionOptions.leaseDirectory);
    assert.equal(lease.targetId, "new-tab");
    assert.equal(lease.browserId, "browser-1");
    throw new Error("navigation failed");
  };
  await assert.rejects(connectLinuxBrowser({ ...connectionOptions, startUrl: "https://example.test" }), /navigation failed/);
  assert.equal(page.close.mock.callCount(), 1);
  assert.equal(existing.close.mock.callCount(), 0);
  assert.equal(disconnect.mock.callCount(), 1);
  assert.deepEqual(listLeases(connectionOptions.leaseDirectory), []);
});

test("page close failure still disconnects and releases ownership", async (t) => {
  const { page, disconnect, connectionOptions } = await connectionFixture(t);
  page.close = async () => { throw new Error("page close failed"); };
  const connection = await connectLinuxBrowser(connectionOptions);
  await assert.rejects(connection.close(), /page close failed/);
  await connection.close();
  assert.equal(disconnect.mock.callCount(), 1);
  assert.deepEqual(listLeases(connectionOptions.leaseDirectory), []);
});

test("closing a selected existing target keeps the page open", async (t) => {
  const { page, existing, disconnect, connectionOptions } = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...connectionOptions, targetId: "existing-tab" });
  assert.equal(connection.page, existing);
  await connection.close();
  assert.equal(page.close.mock.callCount(), 0);
  assert.equal(existing.close.mock.callCount(), 0);
  assert.equal(disconnect.mock.callCount(), 1);
  assert.deepEqual(listLeases(connectionOptions.leaseDirectory), []);
});

test("a closed page marks its lease target_gone and fails closed", async (t) => {
  const { closePage, connectionOptions } = await connectionFixture(t);
  const connection = await connectLinuxBrowser(connectionOptions);
  closePage();
  assert.equal(listLeases(connectionOptions.leaseDirectory)[0].status, "target_gone");
  assert.throws(() => connection.lease.assertOwned(), /target is gone/);
  await connection.close();
  assert.deepEqual(listLeases(connectionOptions.leaseDirectory), []);
});

test("a browser disconnect invalidates and releases its tab lease", async (t) => {
  const { disconnectBrowser, connectionOptions } = await connectionFixture(t);
  const connection = await connectLinuxBrowser(connectionOptions);
  disconnectBrowser();
  assert.throws(() => connection.lease.assertOwned(), /target is gone/);
  assert.deepEqual(listLeases(connectionOptions.leaseDirectory), []);
});

test("tab reports contain only the owned page", () => {
  const owned = { targetId: "owned" };
  const other = { targetId: "other" };
  assert.deepEqual(pagesForReport("tab", [{ pages: () => [owned, other] }], owned), [owned]);
  assert.deepEqual(pagesForReport("browser", [{ pages: () => [owned, other] }], owned), [owned, other]);
});

test("discovery joins live targets with owners and reports leased tabs that disappeared", async (t) => {
  const options = fixture(t);
  const server = createServer((request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(request.url === "/json/version" ? {
      Browser: "Chrome/test", "Protocol-Version": "1.3",
      webSocketDebuggerUrl: `ws://localhost:${server.address().port}/devtools/browser/browser-1`,
    } : [
      { type: "page", id: "tab-1", title: "X research", url: "https://x.com/search?q=private#fragment" },
      { type: "page", id: "tab-free", title: "Free", url: "https://chatgpt.com/" },
      { type: "service_worker", id: "worker", url: "https://x.com/worker" },
    ]));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  const first = acquireLease(tabOptions(options, { endpoint }));
  const missing = acquireLease(tabOptions(options, { endpoint, targetId: "closed-tab", owner: "agent-b" }));
  t.after(first.release);
  t.after(missing.release);
  const profile = selectProfile({ registryPath: options.registryPath, name: "design" });
  const version = await readCdpVersion(endpoint);
  assert.equal(new URL(version.webSocketDebuggerUrl).hostname, "127.0.0.1");
  const inventory = await inspectProfile({ ...profile, cdp_endpoint: endpoint }, {
    includeTabs: true, leaseDirectory: join(options.directory, "leases"),
  });
  assert.equal(inventory.tabs.length, 3);
  assert.equal(inventory.tabs.find(tab => tab.targetId === "tab-1").owner, "agent-a");
  assert.equal(inventory.tabs.find(tab => tab.targetId === "tab-1").url, "https://x.com/search");
  assert.equal(inventory.tabs.find(tab => tab.targetId === "tab-free").availability, "unclaimed");
  assert.equal(inventory.tabs.find(tab => tab.targetId === "closed-tab").availability, "missing");
});
