#!/usr/bin/env node
import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { assertLinux, defaultRegistryPath, readCdpVersion, selectProfile } from "./registry.mjs";
import { acquireLease, defaultLeaseDirectory } from "./lease.mjs";

export const agentBrowserVersion = "0.41.2";
export const agentBrowserPath = join(homedir(), ".local", "share", "linux-browser-control", "bin", `agent-browser-${agentBrowserVersion}`);
const execute = (file, args, options) => new Promise((resolve, reject) => {
  const child = execFile(file, args, { ...options, timeout: 0, killSignal: "SIGKILL" }, (error, stdout, stderr) => {
    clearTimeout(timer);
    if (error) { error.stdout = stdout; error.stderr = stderr; reject(error); }
    else resolve({ stdout, stderr });
  });
  const timer = setTimeout(() => {
    let killError;
    try { child.kill("SIGKILL"); } catch (error) { killError = error; }
    child.stdin?.destroy();
    child.stdout?.destroy();
    child.stderr?.destroy();
    child.unref();
    const error = new Error("native process timed out", { cause: killError });
    error.killed = true;
    reject(error);
  }, options.timeout);
});

async function openCdp(url, onEvent, onDisconnect) {
  const socket = new WebSocket(url);
  let nextId = 0;
  let disconnected = false;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (!request) { onEvent(message); return; }
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });
  socket.addEventListener("close", () => {
    disconnected = true;
    onDisconnect();
    for (const request of pending.values()) {
      clearTimeout(request.timer);
      request.reject(new Error("browser disconnected"));
    }
    pending.clear();
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.close(); reject(new Error("CDP connection timed out")); }, 15000);
    socket.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once: true });
    socket.addEventListener("error", () => { clearTimeout(timer); reject(new Error("CDP connection failed")); }, { once: true });
  });
  return {
    send(method, params = {}) {
      if (disconnected) return Promise.reject(new Error("browser disconnected"));
      return new Promise((resolve, reject) => {
        const id = ++nextId;
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP ${method} timed out`)); }, 15000);
        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close: () => socket.close(),
  };
}

export async function connectLinuxBrowser(options) {
  if (Object.hasOwn(options, "packagePath"))
    throw new Error("packagePath was removed; use connection.command(args) instead of Playwright page/browser objects");
  const {
    name, purpose, owner, task, scope = "tab", targetId, startUrl, newWindow = false, resources = [],
    registryPath = defaultRegistryPath, leaseDirectory = defaultLeaseDirectory,
    executablePath = agentBrowserPath,
    runtimeRoot = join(process.env.XDG_STATE_HOME || join(homedir(), ".local", "state"), "linux-browser-control", "sessions"),
  } = options;
  assertLinux();
  if (scope === "browser" && targetId != null) throw new Error("browser leases cannot select a target");
  if (newWindow === true && targetId != null) throw new Error("newWindow cannot be combined with targetId");
  const profile = selectProfile({ registryPath, name, purpose });
  const version = await readCdpVersion(profile.cdp_endpoint);
  const lease = acquireLease({ endpoint: profile.cdp_endpoint, instance: profile.name, owner, task, scope,
    browserId: version.browserId, targetId, resources, directory: leaseDirectory });
  // A process exit does not cancel CDP requests or dispose of the native session.
  lease.persistOnExit();
  let cdp;
  let disconnected = false;
  let boundTargetId = targetId;
  let createdTarget = false;
  let sessionDirectory;
  let nativeStarted = false;
  let closing;
  // The unique directory provides isolation; keep the Unix socket filename short.
  const session = "page";
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("AGENT_BROWSER_")));
  let nativeUncertain = false;
  const invoke = async args => {
    let stdout;
    let result;
    try {
      lease.beginNative();
      try {
        ({ stdout } = await execute(executablePath, ["--config", join(sessionDirectory, "config.json"), "--session", session, "--json", ...args],
          { env, cwd: sessionDirectory, timeout: 45000, maxBuffer: 8 * 1024 * 1024 }));
      } catch (error) {
        if (error.killed || error.signal || !error.stdout)
          throw new Error(`agent-browser command failed (${error.killed ? "timeout" : error.code}); outcome is uncertain`, { cause: error });
        stdout = error.stdout;
      }
      result = JSON.parse(stdout);
      if (typeof result.success !== "boolean") throw new Error("agent-browser returned an incomplete response");
      lease.finishNative();
    } catch (error) {
      nativeUncertain = true;
      throw error;
    }
    if (!result.success) {
      if (result.code === "tab_gone") lease.markTargetGone("native controller lost its bound target");
      const error = new Error(result.error);
      error.code = result.code;
      throw error;
    }
    return result.data;
  };
  let commandsInFlight = 0;
  let commandsDrained;
  let targetCloseInFlight = false;
  let pageCommandUsed = false;
  const handoffCheck = Symbol("handoff check");
  const close = ({ retainTarget = false } = {}) => {
    if (closing) return closing;
    const retainRequested = retainTarget !== false;
    const targetClosing = targetCloseInFlight;
    closing = (async () => {
      const errors = [];
      try {
        if (nativeStarted && lease.isReleased()) errors.push(new Error("lease already released; cannot confirm native session cleanup"));
        if (lease.pendingOperation()) errors.push(new Error(`${lease.pendingOperation()} outcome is uncertain`));
        if (targetClosing) errors.push(new Error("closeTarget is in flight; cannot confirm target state"));
        if (!retainRequested && commandsInFlight) await new Promise(resolve => { commandsDrained = resolve; });
        if (lease.nativePending() && !commandsInFlight) errors.push(new Error("native command outcome is uncertain"));
        if (retainRequested && !errors.length) {
          try {
            if (retainTarget !== true) throw new Error("handoff requires retainTarget: true");
            if (commandsInFlight) throw new Error("handoff requires all page commands to finish");
            if (pageCommandUsed) throw new Error("handoff requires no prior page command");
            if (!createdTarget || scope !== "browser") throw new Error("handoff requires a self-created page and browser scope");
            const { result } = await command(["eval", `location.href === "about:blank" && document.visibilityState === "visible" && document.doctype === null && document.documentElement.outerHTML === "<html><head></head><body></body></html>"`], handoffCheck);
            if (result !== true) throw new Error("handoff requires a visible unchanged blank document");
            const { targetInfos } = await cdp.send("Target.getTargets");
            if (!targetInfos.some(target => target.targetId === boundTargetId && target.type === "page" && target.url === "about:blank"))
              throw new Error("handoff requires the exact about:blank target");
          } catch (error) { errors.push(error); }
        }
        if (nativeStarted && !lease.nativePending() && !lease.pendingOperation() && !commandsInFlight && !lease.isReleased()) {
          try {
            await invoke(["close"]);
            const deadline = Date.now() + 5000;
            while (existsSync(join(sessionDirectory, `${session}.pid`))) {
              if (Date.now() > deadline) throw new Error(`native session did not exit: ${sessionDirectory}`);
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          } catch (error) { errors.push(error); }
        }
        if (retainRequested && !errors.length) {
          try {
            lease.assertOwned();
            const { targetInfos } = await cdp.send("Target.getTargets");
            if (!targetInfos.some(target => target.targetId === boundTargetId && target.type === "page" && target.url === "about:blank"))
              throw new Error("handoff target changed during native shutdown");
          } catch (error) { errors.push(error); }
        }
        if (createdTarget && !retainRequested && !errors.length && !targetClosing && !lease.pendingOperation() && !lease.nativePending() && !lease.isReleased()) {
          try {
            if (disconnected) throw new Error(`cannot confirm temporary target closed: ${boundTargetId} (browser disconnected)`);
            const { targetInfos } = await cdp.send("Target.getTargets");
            if (targetInfos.some(target => target.targetId === boundTargetId)) {
              lease.beginClose();
              const result = await cdp.send("Target.closeTarget", { targetId: boundTargetId });
              if (result.success !== true) throw new Error(`temporary target close was not confirmed: ${boundTargetId}`);
              const deadline = Date.now() + 5000;
              while (true) {
                const { targetInfos: remaining } = await cdp.send("Target.getTargets");
                if (!remaining.some(target => target.targetId === boundTargetId)) break;
                if (Date.now() > deadline) throw new Error(`temporary target still open: ${boundTargetId}`);
                await new Promise(resolve => setTimeout(resolve, 50));
              }
              lease.finishClose();
            }
          } catch (error) { errors.push(error); }
        }
      } finally {
        try { cdp?.close(); } catch (error) { errors.push(error); }
        if (errors.length) lease.retain();
        else lease.release();
        // Preserve native runtime diagnostics when shutdown could not be confirmed.
        if (sessionDirectory && !errors.length) rmSync(sessionDirectory, { recursive: true, force: true });
      }
      if (errors.length) throw new AggregateError(errors, `${errors.map(error => error.message).join("; ")}; lease ${lease.isReleased() ? "already released" : "retained"}: ${lease.runId}; target: ${boundTargetId ?? "none"}; session: ${sessionDirectory ?? "none"}; lease directory: ${leaseDirectory}`);
    })();
    return closing;
  };
  const command = async (args, internal) => {
    lease.assertOwned();
    if (lease.pendingOperation()) throw new Error(`${lease.pendingOperation()} outcome is uncertain; stop this controller`);
    if (nativeUncertain) throw new Error("native command outcome is uncertain; stop this controller");
    if (closing) throw new Error("browser connection is closing");
    // These operations stay on the bound target; global flags could replace that binding.
    if (!["open", "snapshot", "eval", "get", "wait", "screenshot"].includes(args[0]))
      throw new Error("unsupported command; use open, snapshot, eval, get, wait or screenshot");
    const localFlags = {
      open: [], eval: [], get: [],
      snapshot: ["-i", "-u", "-c", "-d", "-s", "--interactive", "--urls", "--compact", "--depth", "--selector", "--delta", "--full"],
      wait: ["--url", "--load", "--fn", "--text", "--timeout"],
      screenshot: ["-f", "--full", "--annotate", "--if-changed", "--threshold"],
    };
    if (args.some(arg => arg.startsWith("-") && !localFlags[args[0]].includes(arg.split("=")[0])))
      throw new Error("reserved connection option in command");
    if (args[0] === "open" && (!args[1] || !(/^(https?:\/\/|about:blank$)/.test(args[1]) ||
      (scope === "browser" && /^chrome:\/\/settings(?:\/|$)/.test(args[1])))))
      throw new Error("open requires an explicit HTTP(S) URL or about:blank");
    if (internal !== handoffCheck) pageCommandUsed = true;
    commandsInFlight++;
    try {
      const { targetInfos } = await cdp.send("Target.getTargets");
      if (!targetInfos.some(target => target.targetId === boundTargetId && target.type === "page")) {
        lease.markTargetGone(); lease.assertOwned();
      }
      lease.assertOwned();
      if (lease.pendingOperation()) throw new Error(`${lease.pendingOperation()} outcome is uncertain; stop this controller`);
      if (nativeUncertain) throw new Error("native command outcome is uncertain; stop this controller");
      if (closing && internal !== handoffCheck) throw new Error("browser connection is closing");
      const result = await invoke(args);
      lease.assertOwned();
      if (nativeUncertain) throw new Error("native command outcome is uncertain; stop this controller");
      return result;
    } finally {
      commandsInFlight--;
      if (!commandsInFlight) commandsDrained?.();
    }
  };
  try {
    if (!existsSync(executablePath)) throw new Error("native browser executable missing; run scripts/install_agent_browser.mjs");
    const { stdout } = await execute(executablePath, ["--version"], { timeout: 5000 });
    if (stdout.trim() !== `agent-browser ${agentBrowserVersion}`)
      throw new Error(`agent-browser ${agentBrowserVersion} is required; run scripts/install_agent_browser.mjs`);
    mkdirSync(runtimeRoot, { recursive: true, mode: 0o700 });
    sessionDirectory = mkdtempSync(join(runtimeRoot, "session-"));
    lease.setSessionDirectory(sessionDirectory);
    env.AGENT_BROWSER_SOCKET_DIR = sessionDirectory;
    env.AGENT_BROWSER_AUTOSAVE_INTERVAL_MS = "0";
    writeFileSync(join(sessionDirectory, "config.json"), "{}\n", { mode: 0o600 });
    cdp = await openCdp(version.webSocketDebuggerUrl, message => {
      if (message.method === "Target.targetDestroyed" && message.params.targetId === boundTargetId)
        lease.markTargetGone("page closed");
    }, () => { disconnected = true; if (!closing) lease.markTargetGone("browser disconnected"); });
    await cdp.send("Target.setDiscoverTargets", { discover: true });
    const { targetInfos } = await cdp.send("Target.getTargets");
    if (boundTargetId != null) {
      if (!targetInfos.some(target => target.targetId === boundTargetId && target.type === "page"))
        throw new Error(`target is not an open page: ${boundTargetId}`);
    } else {
      lease.beginCreate();
      ({ targetId: boundTargetId } = await cdp.send("Target.createTarget", { url: "about:blank", background: true, newWindow: newWindow === true }));
      createdTarget = true;
      if (scope === "tab") lease.claimTab(boundTargetId);
      else lease.setTarget(boundTargetId);
      lease.finishCreate();
    }
    // Version-pinned native contract: restore this observed target without foreground tab switching.
    writeFileSync(join(sessionDirectory, `${session}.target`), JSON.stringify({ targetId: boundTargetId, url: "about:blank", pinned: true }), { mode: 0o600 });
    nativeStarted = true;
    await invoke(["--cdp", version.webSocketDebuggerUrl, "--pin-tab", "get", "url"]);
    lease.assertOwned();
    if (startUrl != null) await command(["open", startUrl]);
    return { command, targetId: boundTargetId, profile, version, lease, session, sessionDirectory, close,
      async closeTarget() {
        lease.assertOwned();
        if (closing) throw new Error("browser connection is closing");
        if (lease.pendingOperation()) throw new Error(`${lease.pendingOperation()} outcome is uncertain; stop this controller`);
        if (lease.nativePending()) throw new Error("native command is in flight or its outcome is uncertain; stop this controller");
        if (targetCloseInFlight) throw new Error("closeTarget is already in flight");
        targetCloseInFlight = true;
        try {
          lease.beginClose();
          const result = await cdp.send("Target.closeTarget", { targetId: boundTargetId });
          if (result.success !== true) throw new Error(`target close was not confirmed: ${boundTargetId}`);
          const { targetInfos } = await cdp.send("Target.getTargets");
          if (targetInfos.some(target => target.targetId === boundTargetId)) throw new Error(`target still open: ${boundTargetId}`);
          lease.finishClose();
          lease.markTargetGone("page explicitly closed");
        } finally { targetCloseInFlight = false; }
      },
    };
  } catch (error) {
    try { await close(); }
    catch (cleanupError) { throw new AggregateError([error, cleanupError], `${error.message}; cleanup: ${cleanupError.message}`); }
    throw error;
  }
}

async function main() {
  const { values } = parseArgs({ options: {
    name: { type: "string" }, purpose: { type: "string" }, registry: { type: "string" },
    owner: { type: "string" }, task: { type: "string" }, scope: { type: "string", default: "tab" },
    target: { type: "string" }, "start-url": { type: "string" }, resource: { type: "string", multiple: true },
    "lease-directory": { type: "string" }, help: { type: "boolean" },
  } });
  if (values.help) { console.log("connect_browser.mjs --name PROFILE --owner AGENT --task TASK [--scope tab|browser] [--target TARGET_ID] [--start-url URL]"); return; }
  const connection = await connectLinuxBrowser({ name: values.name, purpose: values.purpose, registryPath: values.registry,
    owner: values.owner, task: values.task, scope: values.scope, targetId: values.target,
    startUrl: values["start-url"], resources: values.resource, leaseDirectory: values["lease-directory"] });
  try {
    console.log(JSON.stringify({ profile: connection.profile.name, purpose: connection.profile.purpose,
      cdp_endpoint: connection.profile.cdp_endpoint, browser: connection.version.Browser,
      browser_id: connection.version.browserId, target_id: connection.targetId, scope: values.scope,
      owner: values.owner, task: values.task, controller: `agent-browser ${agentBrowserVersion}`, lease_run_id: connection.lease.runId }, null, 2));
  } finally { await connection.close(); }
}

if (process.argv[1] && existsSync(process.argv[1]) && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href)
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
