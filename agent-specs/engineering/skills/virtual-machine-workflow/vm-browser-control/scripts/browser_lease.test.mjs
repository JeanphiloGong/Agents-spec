import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import {
  acquireBrowserLease,
  listBrowserLeases,
  releaseBrowserLease,
} from "./browser_lease.mjs";
import { connectVmBrowser } from "./connect_browser.mjs";

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "browser-leases-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return {
    directory,
    endpoint: "http://127.0.0.1:19222",
    instance: "design",
    task: "test",
    heartbeatMs: 20,
    ttlMs: 100,
  };
}

test("heartbeat updates ownership and normal release makes the instance available", async (t) => {
  const options = fixture(t);
  const lease = acquireBrowserLease(options);
  t.after(lease.release);
  const first = listBrowserLeases(options.directory)[0];
  await delay(65);
  const current = listBrowserLeases(options.directory)[0];
  assert.equal(current.status, "active");
  assert.ok(
    Date.parse(current.lastHeartbeat) > Date.parse(first.lastHeartbeat),
  );
  assert.equal(listBrowserLeases(options.directory).length, 1);
  lease.release();
  lease.release();
  assert.deepEqual(listBrowserLeases(options.directory), []);
  acquireBrowserLease(options).release();
});

test("conflicts include endpoint aliases and shared files across instances", (t) => {
  const options = fixture(t);
  const lease = acquireBrowserLease({
    ...options,
    resources: ["figma:file-1"],
  });
  t.after(lease.release);
  assert.throws(
    () =>
      acquireBrowserLease({
        ...options,
        endpoint: "http://localhost:19222",
        instance: "renamed",
      }),
    /occupied/,
  );
  assert.throws(
    () =>
      acquireBrowserLease({
        ...options,
        endpoint: "http://127.0.0.1:19223",
        instance: "second",
        resources: ["figma:file-1"],
      }),
    /occupied/,
  );
  assert.equal(listBrowserLeases(options.directory).length, 1);
  acquireBrowserLease({
    ...options,
    endpoint: "http://127.0.0.1:19223",
    instance: "second",
    resources: ["figma:file-2"],
  }).release();
});

test("another process is denied and an abruptly killed owner remains blocked", async (t) => {
  const options = fixture(t);
  const moduleUrl = new URL("./browser_lease.mjs", import.meta.url).href;
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import {acquireBrowserLease} from ${JSON.stringify(moduleUrl)}; acquireBrowserLease(${JSON.stringify(options)}); console.log('ready'); setInterval(()=>{},1000);`,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  t.after(() => child.kill("SIGKILL"));
  await once(child.stdout, "data");
  assert.throws(() => acquireBrowserLease(options), /occupied/);
  const exited = once(child, "exit");
  child.kill("SIGKILL");
  await exited;
  await delay(120);
  const record = listBrowserLeases(options.directory)[0];
  assert.equal(record.status, "unresponsive");
  assert.throws(() => acquireBrowserLease(options), /occupied/);
  releaseBrowserLease(record.runId, options.directory);
  acquireBrowserLease(options).release();
});

test("a previous owner cannot release replacement ownership", (t) => {
  const options = fixture(t);
  const first = acquireBrowserLease(options);
  releaseBrowserLease(first.runId, options.directory);
  const second = acquireBrowserLease(options);
  t.after(second.release);
  first.release();
  assert.equal(listBrowserLeases(options.directory)[0].runId, second.runId);
});

test("connection setup failures release ownership and missing metadata is rejected", async (t) => {
  const options = fixture(t);
  await assert.rejects(
    connectVmBrowser({
      ...options,
      leaseDirectory: options.directory,
      packagePath: join(options.directory, "missing", "package.json"),
    }),
    /Cannot find module/,
  );
  assert.deepEqual(listBrowserLeases(options.directory), []);
  assert.throws(
    () => acquireBrowserLease({ ...options, task: "" }),
    /required/,
  );
});

test("connection ownership persists after failed close and releases on disconnect", async (t) => {
  const options = fixture(t);
  const packageDirectory = join(
    options.directory,
    "node_modules",
    "playwright",
  );
  mkdirSync(packageDirectory, { recursive: true });
  writeFileSync(
    join(packageDirectory, "index.js"),
    `
    const {EventEmitter} = require('node:events');
    exports.chromium = {connectOverCDP: async () => {
      const browser = new EventEmitter();
      browser.failClose = true;
      browser.close = async () => {
        if (browser.failClose) throw new Error('disconnect failed');
        browser.emit('disconnected');
      };
      return browser;
    }};
  `,
  );
  const server = createServer((request, response) => {
    assert.equal(request.url, "/json/version");
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        webSocketDebuggerUrl: "ws://127.0.0.1:9222/devtools/browser/test",
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());
  const connection = {
    ...options,
    endpoint: `http://127.0.0.1:${server.address().port}`,
    leaseDirectory: options.directory,
    packagePath: join(options.directory, "package.json"),
  };
  const browser = await connectVmBrowser(connection);
  assert.equal(listBrowserLeases(options.directory)[0].status, "active");
  await assert.rejects(connectVmBrowser(connection), /occupied/);
  await assert.rejects(browser.close(), /disconnect failed/);
  assert.equal(listBrowserLeases(options.directory)[0].status, "active");
  browser.emit("disconnected");
  assert.deepEqual(listBrowserLeases(options.directory), []);
  const another = await connectVmBrowser(connection);
  another.failClose = false;
  await another.close();
  assert.deepEqual(listBrowserLeases(options.directory), []);
});
