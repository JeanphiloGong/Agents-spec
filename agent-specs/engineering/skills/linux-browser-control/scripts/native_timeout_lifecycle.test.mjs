import assert from "node:assert/strict";
import childProcess from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { syncBuiltinESMExports } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { setTimeout } from "node:timers/promises";
import { test } from "node:test";
import { acquireLease, listLeases, releaseLease } from "./lease.mjs";

// Keep actual subprocesses and timeout behavior while avoiding a 45-second test.
const originalExecFile = childProcess.execFile;
childProcess.execFile = function (file, args, options, callback) {
  return originalExecFile(file, args, { ...options, timeout: 500 }, callback);
};
childProcess.execFile[promisify.custom] = (file, args, options) => new Promise((resolve, reject) => {
  childProcess.execFile(file, args, options, (error, stdout, stderr) => {
    if (error) { error.stdout = stdout; error.stderr = stderr; reject(error); }
    else resolve({ stdout, stderr });
  });
});
syncBuiltinESMExports();
const { connectLinuxBrowser } = await import("./connect_browser.mjs");

async function fixture(t, delayed) {
  const directory = mkdtempSync(join(tmpdir(), "native-timeout-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const targets = new Set(["existing-tab"]);
  const calls = [];
  const server = createServer((request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ Browser: "Chrome/test", "Protocol-Version": "1.3",
      webSocketDebuggerUrl: `ws://localhost:${server.address().port}/devtools/browser/browser-1` }));
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => { server.close(); server.closeAllConnections(); });
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  const registryPath = join(directory, "registry.json");
  writeFileSync(registryPath, JSON.stringify({ schema_version: 1, platform: "linux", root: directory,
    profiles: [{ name: "design", purpose: "Design", browser: "google-chrome",
      profile_dir: join(directory, "design"), cdp_endpoint: endpoint }] }));
  let pauseQuery = false;
  let resumeQuery;
  let pauseClose = false;
  let resumeClose;
  class CdpSocket extends EventTarget {
    constructor() { super(); queueMicrotask(() => this.dispatchEvent(new Event("open"))); }
    send(raw) {
      const { id, method, params } = JSON.parse(raw);
      calls.push({ method, params });
      let result = {};
      if (method === "Target.getTargets") result = { targetInfos: [...targets].map(targetId => ({ targetId, type: "page", url: "about:blank" })) };
      if (method === "Target.createTarget") { targets.add("new-tab"); result = { targetId: "new-tab" }; }
      if (method === "Target.closeTarget") { targets.delete(params.targetId); result = { success: true }; }
      const respond = () => this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify({ id, result }) }));
      if (method === "Target.getTargets" && pauseQuery) { pauseQuery = false; resumeQuery = respond; }
      else if (method === "Target.closeTarget" && pauseClose) { pauseClose = false; resumeClose = respond; }
      else queueMicrotask(respond);
    }
    close() { this.dispatchEvent(new Event("close")); }
  }
  const originalSocket = globalThis.WebSocket;
  globalThis.WebSocket = CdpSocket;
  t.after(() => { globalThis.WebSocket = originalSocket; });
  const executablePath = join(directory, "native");
  const marker = join(directory, "late-effect");
  const log = join(directory, "native.log");
  writeFileSync(executablePath, `#!/usr/bin/env node
const fs = require('node:fs');
const {spawn} = require('node:child_process');
const args = process.argv.slice(2);
if (args[0] === '--version') { console.log('agent-browser 0.41.2'); process.exit(0); }
const command = args.slice(args.indexOf('--json') + 1);
const stage = command[0] === '--cdp' ? 'bootstrap' : command[0] === 'close' ? 'shutdown' : 'page';
fs.appendFileSync(${JSON.stringify(log)}, stage + '\\n');
if (stage === ${JSON.stringify(delayed)}) {
  const code = ${JSON.stringify(`setTimeout(() => require('fs').writeFileSync(${JSON.stringify(marker)}, 'late'), 800)`)};
  spawn(process.execPath, ['-e', code], {detached:true, stdio:'ignore'}).unref();
  process.stdout.write(JSON.stringify({success:true,data:{result:'partial'}}));
  setTimeout(() => process.exit(0), 1600);
} else console.log(JSON.stringify({success:true,data:{result:'ok'}}));
`, { mode: 0o700 });
  return { directory, marker, log, calls, targets, endpoint,
    pauseQuery: () => { pauseQuery = true; }, resumeQuery: () => resumeQuery(),
    pauseClose: () => { pauseClose = true; }, resumeClose: () => resumeClose(),
    options: { name: "design", owner: "agent-a", task: "test", registryPath, executablePath,
      runtimeRoot: join(directory, "sessions"), leaseDirectory: join(directory, "leases") } };
}

for (const stage of ["bootstrap", "page", "shutdown"]) {
  test(`native ${stage} timeout retains ownership despite a late daemon effect`, async (t) => {
    const f = await fixture(t, stage);
    let connection;
    if (stage === "bootstrap") {
      await assert.rejects(connectLinuxBrowser(f.options), /lease retained/);
    } else {
      connection = await connectLinuxBrowser({ ...f.options, targetId: "existing-tab" });
      if (stage === "page") {
        await assert.rejects(connection.command(["eval", "1"]), /timeout/);
        await assert.rejects(connection.command(["snapshot"]), /uncertain/);
      }
      await assert.rejects(connection.close(), /lease retained/);
      if (stage === "page") await assert.rejects(connection.command(["snapshot"]), /uncertain|closing|retained/);
    }
    const [record] = listLeases(f.options.leaseDirectory);
    assert.equal(record.status, "uncertain");
    assert.ok(record.pendingNative > 0);
    assert.equal(record.owner, "agent-a");
    assert.ok(record.sessionDirectory.startsWith(f.options.runtimeRoot));
    assert.equal(f.calls.filter(call => call.method === "Target.closeTarget").length, 0);
    if (stage !== "shutdown") assert.ok(!readFileSync(f.log, "utf8").split("\n").includes("shutdown"));
    assert.throws(() => acquireLease({ endpoint: f.endpoint, instance: "design", owner: "other", task: "claim",
      browserId: "browser-1", targetId: record.targetId, directory: f.options.leaseDirectory }), /occupied/);
    await setTimeout(500);
    assert.equal(readFileSync(f.marker, "utf8"), "late");
    releaseLease(record.runId, f.options.leaseDirectory);
  });
}

test("close waits for a native command and retains ownership if it times out", async (t) => {
  const f = await fixture(t, "page");
  const connection = await connectLinuxBrowser(f.options);
  const pageCommand = connection.command(["eval", "1"]);
  while (!readFileSync(f.log, "utf8").includes("page")) await setTimeout(5);
  const closing = connection.close();
  await assert.rejects(pageCommand, /timeout/);
  await assert.rejects(closing, /lease retained/);
  const [record] = listLeases(f.options.leaseDirectory);
  assert.equal(record.status, "uncertain");
  assert.ok(record.pendingNative > 0);
  assert.ok(f.targets.has("new-tab"));
  assert.equal(f.calls.filter(call => call.method === "Target.closeTarget").length, 0);
  assert.ok(!readFileSync(f.log, "utf8").split("\n").includes("shutdown"));
  await setTimeout(500);
  assert.equal(readFileSync(f.marker, "utf8"), "late");
  releaseLease(record.runId, f.options.leaseDirectory);
});

test("normal process exit during a native page operation preserves its pending lease", async (t) => {
  const f = await fixture(t, "page");
  const code = `
    import fs from 'node:fs';
    import {setTimeout} from 'node:timers/promises';
    import {connectLinuxBrowser} from ${JSON.stringify(new URL("./connect_browser.mjs", import.meta.url).href)};
    const options = JSON.parse(process.argv[1]);
    const log = process.argv[2];
    globalThis.WebSocket = class extends EventTarget {
      constructor() { super(); queueMicrotask(() => this.dispatchEvent(new Event('open'))); }
      send(raw) {
        const {id, method} = JSON.parse(raw);
        const result = method === 'Target.getTargets' ? {targetInfos:[{targetId:'existing-tab',type:'page'}]} : {};
        queueMicrotask(() => this.dispatchEvent(new MessageEvent('message', {data:JSON.stringify({id,result})})));
      }
      close() { this.dispatchEvent(new Event('close')); }
    };
    const connection = await connectLinuxBrowser({...options,targetId:'existing-tab'});
    connection.command(['eval','1']);
    while (!fs.readFileSync(log, 'utf8').includes('page')) await setTimeout(5);
    process.exit(0);
  `;
  const child = childProcess.spawn(process.execPath, ["--input-type=module", "-e", code, JSON.stringify(f.options), f.log]);
  let stderr = "";
  child.stderr.on("data", value => { stderr += value; });
  assert.equal(await new Promise(resolve => child.on("exit", resolve)), 0, stderr);
  const [record] = listLeases(f.options.leaseDirectory);
  assert.equal(record.status, "uncertain");
  assert.ok(record.pendingNative > 0);
  assert.equal(record.targetId, "existing-tab");
  await setTimeout(1900);
  assert.equal(readFileSync(f.marker, "utf8"), "late");
  releaseLease(record.runId, f.options.leaseDirectory);
});

test("a page command waiting on target inventory stops if closeTarget begins", async (t) => {
  const f = await fixture(t, "none");
  const connection = await connectLinuxBrowser({ ...f.options, targetId: "existing-tab" });
  f.pauseQuery();
  f.pauseClose();
  const pageCommand = connection.command(["eval", "1"]);
  while (!f.calls.some(call => call.method === "Target.getTargets" && f.calls.filter(entry => entry.method === "Target.getTargets").length >= 2)) await setTimeout(5);
  const closeTarget = connection.closeTarget();
  while (!f.calls.some(call => call.method === "Target.closeTarget")) await setTimeout(5);
  f.resumeQuery();
  const error = await pageCommand.then(() => null, value => value);
  f.resumeClose();
  await closeTarget;
  assert.match(error?.message ?? "", /uncertain/);
  assert.equal(readFileSync(f.log, "utf8").split("\n").filter(line => line === "page").length, 0);
  await connection.close();
});
