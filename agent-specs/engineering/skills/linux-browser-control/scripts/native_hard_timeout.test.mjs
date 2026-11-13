import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";
import { listLeases } from "./lease.mjs";

// Shorten only controller watchdog deadlines, leaving subprocess behavior real.
const originalSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = (callback, milliseconds, ...args) =>
  originalSetTimeout(callback, milliseconds === 45000 || milliseconds === 5000 ? 300 : milliseconds, ...args);
const { connectLinuxBrowser } = await import("./connect_browser.mjs");

async function fixture(t, stalledStage, mode = "ignore") {
  const directory = mkdtempSync(join(tmpdir(), "native-hard-timeout-"));
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
  class CdpSocket extends EventTarget {
    constructor() { super(); queueMicrotask(() => this.dispatchEvent(new Event("open"))); }
    send(raw) {
      const { id, method, params } = JSON.parse(raw);
      calls.push(method);
      let result = {};
      if (method === "Target.getTargets") result = { targetInfos: [...targets].map(targetId => ({ targetId, type: "page", url: "about:blank" })) };
      if (method === "Target.createTarget") { targets.add("new-tab"); result = { targetId: "new-tab" }; }
      if (method === "Target.closeTarget") { targets.delete(params.targetId); result = { success: true }; }
      queueMicrotask(() => this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify({ id, result }) })));
    }
    close() { this.dispatchEvent(new Event("close")); }
  }
  const originalSocket = globalThis.WebSocket;
  globalThis.WebSocket = CdpSocket;
  t.after(() => { globalThis.WebSocket = originalSocket; });
  const executablePath = join(directory, "native");
  const log = join(directory, "native.log");
  writeFileSync(log, "");
  writeFileSync(executablePath, `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
const command = args.slice(args.indexOf('--json') + 1);
const stage = args[0] === '--version' ? 'version' : command[0] === '--cdp' ? 'bootstrap' : command[0] === 'close' ? 'shutdown' : 'page';
fs.appendFileSync(${JSON.stringify(log)}, stage + '\\n');
const output = stage === 'version' ? 'agent-browser 0.41.2' : JSON.stringify({success:true,data:{result:'ok'}});
if (stage === ${JSON.stringify(stalledStage)}) {
  if (${JSON.stringify(mode)} !== 'partial') process.on('SIGTERM', () => {});
  if (${JSON.stringify(mode)} !== 'ignore') require('node:child_process').spawn(process.execPath, ['-e', 'setTimeout(() => {}, 1500)'],
    { stdio: ['ignore', process.stdout, process.stderr] }).unref();
  if (${JSON.stringify(mode)} === 'partial') { process.stdout.write(stage === 'version' ? 'agent-browser ' : '{"success":'); process.exit(0); }
  else setTimeout(() => { console.log(output); process.exit(0); }, 2000);
} else console.log(output);
`, { mode: 0o700 });
  if (mode !== "ignore") t.after(() => delay(1700));
  return { log, calls, targets, options: { name: "design", owner: "agent-a", task: "test", registryPath, executablePath,
    runtimeRoot: join(directory, "sessions"), leaseDirectory: join(directory, "leases") } };
}

test("close settles when an in-flight page command ignores SIGTERM", { timeout: 6000 }, async t => {
  const f = await fixture(t, "page");
  const connection = await connectLinuxBrowser(f.options);
  const page = connection.command(["eval", "1"]);
  const pageSettled = page.then(value => ({ value }), error => ({ error }));
  const startDeadline = Date.now() + 1000;
  while (!readFileSync(f.log, "utf8").split("\n").includes("page")) {
    if (Date.now() > startDeadline) throw new Error("page command did not start");
    await delay(5);
  }
  const closeSettled = connection.close().then(value => ({ value }), error => ({ error }));
  try {
    const [pageOutcome, closeOutcome] = await withinDeadline(Promise.all([pageSettled, closeSettled]), "page and close");
    assert.ok(pageOutcome.error, "page command should report a timeout");
    assert.ok(closeOutcome.error, "close should report retained ownership");
    const [record] = listLeases(f.options.leaseDirectory);
    assert.ok(record, "uncertain native outcome must retain ownership");
    assert.equal(f.calls.filter(method => method === "Target.closeTarget").length, 0);
  } finally {
    await Promise.all([pageSettled, closeSettled]);
  }
});

async function withinDeadline(promise, label) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} did not settle within 1200ms`)), 1200);
    })]);
  } finally { clearTimeout(timer); }
}

for (const stage of ["version", "bootstrap", "page", "shutdown"]) {
  for (const mode of ["ignore", "inherited", "partial"]) {
  test(`${stage} timeout settles for ${mode} subprocess behavior`, { timeout: 6000 }, async t => {
    const f = await fixture(t, stage, mode);
    let connection;
    let operation;
    if (stage === "version" || stage === "bootstrap") {
      operation = connectLinuxBrowser(f.options);
    } else {
      connection = await connectLinuxBrowser(f.options);
      operation = stage === "page" ? connection.command(["eval", "1"]) : connection.close();
    }
    // Handle a later rejection even when the deadline wins the race.
    const settled = operation.then(value => ({ value }), error => ({ error }));
    try {
      const outcome = await withinDeadline(settled, stage);
      assert.match(readFileSync(f.log, "utf8"), new RegExp(`^${stage}$`, "m"));
      assert.ok(outcome.error, `${stage} should report a timeout`);
      assert.match(outcome.error.message, /timeout|timed out/);
      if (stage !== "version") {
        const [record] = listLeases(f.options.leaseDirectory);
        assert.ok(record, "uncertain native outcome must retain ownership");
        assert.equal(f.calls.filter(method => method === "Target.closeTarget").length, 0);
      }
    } finally {
      // The fake always exits naturally; do not leave a subprocess or timer behind.
      const outcome = await settled;
      if (!connection && outcome.value) connection = outcome.value;
      if (connection && stage !== "shutdown") await connection.close().catch(() => {});
    }
  });
  }
}
