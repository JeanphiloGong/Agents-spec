import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
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
import { connectLinuxBrowser } from "./connect_browser.mjs";

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

test("retained lease survives owner exit without an active heartbeat", async (t) => {
  const options = fixture(t);
  const directory = join(options.directory, "leases");
  const child = spawn(process.execPath, ["--input-type=module", "-e", `
    import { acquireLease, listLeases } from ${JSON.stringify(new URL("./lease.mjs", import.meta.url).href)};
    const options = JSON.parse(process.argv[1]);
    const lease = acquireLease(options);
    const before = listLeases(options.directory)[0].lastHeartbeat;
    lease.retain();
    let refused = false;
    try { lease.assertOwned(); } catch { refused = true; }
    await new Promise(resolve => setTimeout(resolve, 70));
    console.log(JSON.stringify({ runId: lease.runId, before, after: listLeases(options.directory)[0].lastHeartbeat, refused }));
  `, JSON.stringify(tabOptions(options, { directory, heartbeatMs: 10, ttlMs: 100 }))]);
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", data => { stdout += data; });
  child.stderr.on("data", data => { stderr += data; });
  const exitCode = await new Promise(resolve => child.on("exit", resolve));
  assert.equal(exitCode, 0, stderr);
  const [record] = listLeases(directory, Date.now() + 1000);
  const result = JSON.parse(stdout);
  assert.equal(record.runId, result.runId);
  assert.equal(result.before, result.after);
  assert.equal(result.refused, true);
  assert.equal(record.status, "unresponsive");
  releaseLease(record.runId, directory);
  assert.deepEqual(listLeases(directory), []);
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

async function connectionFixture(t, expectedNewWindow = false) {
  const options = fixture(t);
  const targets = new Set(["existing-tab", "other-tab"]);
  const calls = [];
  let socket;
  let failClose = false;
  let targetUrl = "about:blank";
  let pausedResponse;
  let pauseCloseResponse = false;
  const server = createServer((request, response) => {
    assert.equal(request.url, "/json/version");
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({
      Browser: "Chrome/test", "Protocol-Version": "1.3",
      webSocketDebuggerUrl: `ws://localhost:${server.address().port}/devtools/browser/browser-1`,
    }));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => { server.close(); server.closeAllConnections(); });
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  const registry = readRegistry(options.registryPath);
  registry.profiles[0].cdp_endpoint = endpoint;
  writeFileSync(options.registryPath, JSON.stringify(registry));
  class CdpSocket extends EventTarget {
    constructor(url) {
      super();
      assert.equal(url, `${endpoint.replace("http:", "ws:")}/devtools/browser/browser-1`);
      socket = this;
      queueMicrotask(() => this.dispatchEvent(new Event("open")));
    }
    send(raw) {
      const { id, method, params } = JSON.parse(raw);
      calls.push({ method, params });
      let result = {};
      let error;
      if (method === "Target.getTargets") result = { targetInfos: [...targets].map(targetId => ({ targetId, type: "page", url: targetId === "new-tab" ? targetUrl : "about:blank" })) };
      if (method === "Target.createTarget") {
        assert.deepEqual(params, { url: "about:blank", background: true, newWindow: expectedNewWindow });
        targets.add("new-tab"); result = { targetId: "new-tab" };
      }
      if (method === "Target.closeTarget") {
        if (failClose) error = { message: "close failed" };
        else targets.delete(params.targetId);
      }
      const respond = () => this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify({ id, result, ...(error ? { error } : {}) }) }));
      if (method === "Target.getTargets" && pausedResponse === true) pausedResponse = respond;
      else if (method === "Target.closeTarget" && pauseCloseResponse) { /* hold until socket close */ }
      else queueMicrotask(respond);
    }
    close() { this.dispatchEvent(new Event("close")); }
  }
  const originalSocket = globalThis.WebSocket;
  globalThis.WebSocket = CdpSocket;
  t.after(() => { globalThis.WebSocket = originalSocket; });
  const executablePath = join(options.directory, "agent-browser");
  const logPath = join(options.directory, "commands.jsonl");
  const blankPath = join(options.directory, "blank.json");
  writeFileSync(blankPath, "true");
  writeFileSync(executablePath, `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
if (args[0] === '--version') { console.log('agent-browser 0.41.2'); process.exit(0); }
const commands = args.slice(args.indexOf('--json')+1);
fs.appendFileSync(${JSON.stringify(logPath)},JSON.stringify({args,envKeys:Object.keys(process.env).filter(k=>k.startsWith('AGENT_BROWSER_'))})+'\\n');
const session = args[args.indexOf('--session')+1];
const binding = JSON.parse(fs.readFileSync(process.env.AGENT_BROWSER_SOCKET_DIR+'/'+session+'.target','utf8'));
const fail = commands.includes('fail') || commands.includes('https://fail.test');
console.log(JSON.stringify(fail ? {success:false,error:'navigation failed'} : {success:true,data:{result:commands[0] === 'eval' && commands[1].includes('document.visibilityState') ? JSON.parse(fs.readFileSync(${JSON.stringify(blankPath)},'utf8')) : binding.targetId,snapshot:'owned page only'}}));
process.exitCode = fail ? 1 : 0;
`, { mode: 0o700 });
  return {
    targets, calls, logPath,
    commands: () => readFileSync(logPath, "utf8").trim().split("\n").map(JSON.parse),
    closePage: () => {
      targets.delete("new-tab");
      socket.dispatchEvent(new MessageEvent("message", { data: JSON.stringify({ method: "Target.targetDestroyed", params: { targetId: "new-tab" } }) }));
    },
    disconnectBrowser: () => socket.close(),
    failClose: () => { failClose = true; },
    setTargetUrl: value => { targetUrl = value; },
    setBlank: value => writeFileSync(blankPath, JSON.stringify(value)),
    pauseTargetQuery: () => { pausedResponse = true; },
    pauseCloseTarget: () => { pauseCloseResponse = true; },
    resumeTargetQuery: () => { const respond = pausedResponse; pausedResponse = undefined; respond(); },
    connectionOptions: {
      name: "design", owner: "agent-a", task: "connection-check", registryPath: options.registryPath,
      executablePath, runtimeRoot: join(options.directory, "runtime"), leaseDirectory: join(options.directory, "leases"),
    },
  };
}

test("native connection binds its background page and exposes no Playwright objects", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser(f.connectionOptions);
  try {
    assert.equal(connection.page, undefined);
    assert.equal(connection.browser, undefined);
    assert.equal(connection.targetId, "new-tab");
    assert.deepEqual(f.calls.find(c => c.method === "Target.createTarget").params,
      { url: "about:blank", background: true, newWindow: false });
    assert.equal((await connection.command(["eval", "document.title"])).result, "new-tab");
    assert.ok(f.commands()[0].args.includes("--pin-tab"));
    assert.ok(f.commands().every(c => !c.envKeys.includes("AGENT_BROWSER_RESTORE")));
  } finally { await connection.close(); }
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
  assert.deepEqual(readdirSync(f.connectionOptions.runtimeRoot), []);
});

test("explicit blank-page handoff retains the created target and releases the browser lease", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
  await connection.close({ retainTarget: true });
  assert.ok(f.targets.has("new-tab"));
  assert.ok(!f.calls.some(c => c.method === "Target.closeTarget"));
  assert.ok(f.commands().some(c => c.args.includes("eval")));
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
  assert.deepEqual(readdirSync(f.connectionOptions.runtimeRoot), []);
});

test("handoff rejects a selected target or tab scope and retains the lease", async (t) => {
  for (const options of [{ scope: "tab", targetId: "existing-tab" }, { scope: "tab" }]) {
    const f = await connectionFixture(t);
    const connection = await connectLinuxBrowser({ ...f.connectionOptions, ...options });
    await assert.rejects(connection.close({ retainTarget: true }), /handoff/i);
    assert.ok(f.targets.has(connection.targetId));
    assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
    assert.ok(!f.calls.some(c => c.method === "Target.closeTarget"));
  }
});

test("handoff refuses to release ownership while another page command is in flight", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
  f.pauseTargetQuery();
  const pending = assert.rejects(connection.command(["eval", "document.body.textContent = 'changed'"]), /disconnected|retained/);
  await assert.rejects(connection.close({ retainTarget: true }), /commands to finish/);
  f.resumeTargetQuery();
  await pending;
  assert.ok(!f.commands().some(c => c.args.includes("document.body.textContent = 'changed'")));
  assert.ok(f.targets.has(connection.targetId));
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
});

test("handoff rejects pages after a caller page command", async (t) => {
  for (const script of ["window.handoffMarker = 1", "addEventListener('click', () => {})"]) {
    const f = await connectionFixture(t);
    const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
    await connection.command(["eval", script]);
    await assert.rejects(connection.close({ retainTarget: true }), /page command/i);
    assert.ok(f.targets.has(connection.targetId));
    assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
  }
});

test("closeTarget cannot start while handoff is in progress", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
  f.pauseTargetQuery();
  const closing = connection.close({ retainTarget: true });
  const settled = closing.then(() => null, error => error);
  try {
    await assert.rejects(connection.closeTarget(), /closing/i);
    assert.ok(!f.calls.some(c => c.method === "Target.closeTarget"));
  } finally {
    f.resumeTargetQuery();
    await settled;
  }
  assert.equal(await settled, null);
  assert.ok(f.targets.has(connection.targetId));
});

test("handoff retains ownership if closeTarget is already in flight", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
  f.pauseCloseTarget();
  const pending = assert.rejects(connection.closeTarget(), /disconnected/);
  await assert.rejects(connection.close({ retainTarget: true }), /closeTarget.*flight/i);
  await pending;
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
  assert.equal(f.calls.filter(c => c.method === "Target.closeTarget").length, 1);
});

test("handoff requires an explicit boolean opt-in", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
  await assert.rejects(connection.close({ retainTarget: "true" }), /retainTarget: true/);
  assert.ok(f.targets.has(connection.targetId));
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
});

test("handoff rejects changed URL, document, or visibility and retains the lease", async (t) => {
  for (const change of [f => f.setTargetUrl("https://example.test/"), f => f.setBlank(false)]) {
    const f = await connectionFixture(t);
    const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
    change(f);
    await assert.rejects(connection.close({ retainTarget: true }), /handoff/i);
    assert.ok(f.targets.has(connection.targetId));
    assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
    assert.ok(!f.calls.some(c => c.method === "Target.closeTarget"));
  }
});

test("handoff retains the page and lease if native shutdown fails", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
  const path = f.connectionOptions.executablePath;
  writeFileSync(path, readFileSync(path, "utf8").replace("commands.includes('fail')", "commands.includes('close')"));
  await assert.rejects(connection.close({ retainTarget: true }), /navigation failed/);
  assert.ok(f.targets.has(connection.targetId));
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
  assert.equal(readdirSync(f.connectionOptions.runtimeRoot).length, 1);
});

test("newWindow opt-in creates and closes a separate background target", async (t) => {
  const f = await connectionFixture(t, true);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, newWindow: true });
  try {
    assert.deepEqual(f.calls.find(c => c.method === "Target.createTarget").params,
      { url: "about:blank", background: true, newWindow: true });
    assert.equal((await connection.command(["snapshot"])).result, "new-tab");
  } finally { await connection.close(); }
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
  assert.deepEqual(readdirSync(f.connectionOptions.runtimeRoot), []);
});

test("newWindow cannot be combined with an existing target", async (t) => {
  const f = await connectionFixture(t);
  await assert.rejects(async () => {
    const connection = await connectLinuxBrowser({ ...f.connectionOptions, targetId: "existing-tab", newWindow: true });
    await connection.close();
  }, /newWindow.*targetId/);
  assert.deepEqual(f.calls, []);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
});

test("newWindow navigation failure closes the created target and releases ownership", async (t) => {
  const f = await connectionFixture(t, true);
  await assert.rejects(connectLinuxBrowser({ ...f.connectionOptions, newWindow: true, startUrl: "https://fail.test" }), /navigation failed/);
  assert.deepEqual(f.calls.find(c => c.method === "Target.createTarget").params,
    { url: "about:blank", background: true, newWindow: true });
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
  assert.deepEqual(readdirSync(f.connectionOptions.runtimeRoot), []);
});

test("existing targets remain open after native disconnect", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, targetId: "existing-tab" });
  assert.equal((await connection.command(["snapshot"])).result, "existing-tab");
  await connection.close();
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.ok(!f.calls.some(c => c.method === "Target.createTarget" || c.method === "Target.closeTarget"));
});

test("missing target fails before the native controller starts", async (t) => {
  const f = await connectionFixture(t);
  await assert.rejects(connectLinuxBrowser({ ...f.connectionOptions, targetId: "missing-tab" }), /not an open page/);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
  assert.deepEqual(readdirSync(f.connectionOptions.runtimeRoot), []);
});

test("navigation failure removes its new page and releases ownership", async (t) => {
  const f = await connectionFixture(t);
  await assert.rejects(connectLinuxBrowser({ ...f.connectionOptions, startUrl: "https://fail.test" }), /navigation failed/);
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
  assert.ok(f.commands().some(c => c.args.at(-1) === "close"));
});

test("failed page closure still stops native session and retains lease", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser(f.connectionOptions);
  f.failClose();
  await assert.rejects(connection.close(), /close failed/);
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
  assert.ok(f.targets.has("new-tab"));
  assert.equal(readdirSync(f.connectionOptions.runtimeRoot).length, 1);
  assert.ok(f.commands().some(c => c.args.at(-1) === "close"));
});

test("a vanished page stops later commands without selecting a sibling", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser(f.connectionOptions);
  f.closePage();
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].status, "target_gone");
  const before = f.commands().length;
  await assert.rejects(connection.command(["eval", "document.title"]), /target is gone/);
  assert.equal(f.commands().length, before);
  await connection.close();
});

test("browser disconnection invalidates the lease and refuses more input", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser(f.connectionOptions);
  f.disconnectBrowser();
  assert.throws(connection.lease.assertOwned, /target is gone/);
  await assert.rejects(connection.command(["snapshot"]), /target is gone/);
  await assert.rejects(connection.close(), /cannot confirm.*new-tab/i);
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
  assert.ok(f.targets.has("new-tab"));
  assert.equal(readdirSync(f.connectionOptions.runtimeRoot).length, 1);
});

test("command surface refuses foreground input, tab switching and connection overrides", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser(f.connectionOptions);
  try {
    for (const args of [["click", "#apply"], ["tab", "other-tab"], ["press", "Enter"], ["open"], ["--session", "other", "snapshot"], ["snapshot", "--cdp", "9999"], ["cookies"], ["snapshot", "--session-name", "capture"], ["snapshot", "--auto-connect"]]) {
      await assert.rejects(connection.command(args), /unsupported|reserved|URL/);
    }
  } finally { await connection.close(); }
});

test("released ownership stops native commands", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser(f.connectionOptions);
  connection.lease.release();
  await assert.rejects(connection.command(["snapshot"]), /released/);
  await connection.close();
});

test("retained-page cleanup closes only the explicitly leased target", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, targetId: "existing-tab" });
  try { await connection.closeTarget(); }
  finally { await connection.close(); }
  assert.deepEqual([...f.targets], ["other-tab"]);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
});

test("the native version must match before a target is allocated", async (t) => {
  const f = await connectionFixture(t);
  const path = f.connectionOptions.executablePath;
  writeFileSync(path, readFileSync(path, "utf8").replace("agent-browser 0.41.2", "agent-browser 0.0.0"));
  await assert.rejects(connectLinuxBrowser(f.connectionOptions), /0.41.2 is required/);
  assert.ok(!f.calls.some(c => c.method === "Target.createTarget"));
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
});

test("native shutdown failure is reported and its diagnostic directory remains", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser(f.connectionOptions);
  const path = f.connectionOptions.executablePath;
  writeFileSync(path, readFileSync(path, "utf8").replace("commands.includes('fail')", "commands.includes('close')"));
  await assert.rejects(connection.close(), /navigation failed/);
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.equal(listLeases(f.connectionOptions.leaseDirectory)[0].runId, connection.lease.runId);
  assert.equal(readdirSync(f.connectionOptions.runtimeRoot).length, 1);
});

test("browser-scope native work keeps all tab owners excluded", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, scope: "browser" });
  try {
    assert.throws(() => acquireLease({ endpoint: connection.profile.cdp_endpoint, instance: "design", owner: "agent-b", task: "competing-tab",
      scope: "tab", browserId: "browser-1", targetId: "other-tab", directory: f.connectionOptions.leaseDirectory }), /occupied/);
    await connection.command(["open", "chrome://settings/performance"]);
  } finally { await connection.close(); }
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
});

test("failed native bootstrap closes the allocated target and releases its lease", async (t) => {
  const f = await connectionFixture(t);
  const path = f.connectionOptions.executablePath;
  writeFileSync(path, readFileSync(path, "utf8").replace("commands.includes('fail')", "commands.includes('--cdp')"));
  await assert.rejects(connectLinuxBrowser(f.connectionOptions), /navigation failed/);
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
  assert.deepEqual(readdirSync(f.connectionOptions.runtimeRoot), []);
});

test("failed bootstrap and cleanup retain a recoverable lease", async (t) => {
  const f = await connectionFixture(t);
  const path = f.connectionOptions.executablePath;
  writeFileSync(path, readFileSync(path, "utf8").replace("commands.includes('fail')", "commands.includes('--cdp') || commands.includes('close')"));
  let failure;
  try { await connectLinuxBrowser(f.connectionOptions); } catch (error) { failure = error; }
  assert.match(failure.message, /navigation failed.*cleanup/s);
  const [record] = listLeases(f.connectionOptions.leaseDirectory);
  assert.equal(record.owner, "agent-a");
  assert.equal(record.targetId, "new-tab");
  assert.ok(failure.message.includes(record.runId));
  assert.ok(failure.message.includes(f.connectionOptions.leaseDirectory));
  assert.ok(failure.message.includes(join(f.connectionOptions.runtimeRoot, readdirSync(f.connectionOptions.runtimeRoot)[0])));
  assert.ok(failure.message.includes("new-tab"));
  assert.deepEqual([...f.targets], ["existing-tab", "other-tab"]);
  assert.equal(readdirSync(f.connectionOptions.runtimeRoot).length, 1);
});

test("an occupied target fails before starting another native controller", async (t) => {
  const f = await connectionFixture(t);
  const connection = await connectLinuxBrowser({ ...f.connectionOptions, targetId: "existing-tab" });
  try {
    const count = f.commands().length;
    await assert.rejects(connectLinuxBrowser({ ...f.connectionOptions, owner: "agent-b", targetId: "existing-tab" }), /occupied/);
    assert.equal(f.commands().length, count);
  } finally { await connection.close(); }
});

test("legacy Playwright callers fail before opening a native session", async (t) => {
  const f = await connectionFixture(t);
  await assert.rejects(connectLinuxBrowser({ ...f.connectionOptions, packagePath: "/old/package.json" }), /packagePath was removed/);
  assert.deepEqual(f.calls, []);
  assert.deepEqual(listLeases(f.connectionOptions.leaseDirectory), []);
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
