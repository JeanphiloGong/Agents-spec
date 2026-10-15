#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import {
  mkdirSync,
  existsSync,
  readFileSync,
  realpathSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

export const defaultLeaseDirectory = join(
  process.env.XDG_STATE_HOME || join(homedir(), ".local", "state"),
  "linux-browser-control",
  "leases",
);
const lockName = (resource) => createHash("sha256").update(resource).digest("hex");

export function listLeases(directory = defaultLeaseDirectory, now = Date.now()) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const records = readdirSync(directory)
    .filter((name) => /^[a-f0-9]{64}$/.test(name))
    .map((name) => {
      try {
        const record = JSON.parse(readFileSync(join(directory, name, "lease.json"), "utf8"));
        if (
          typeof record.runId !== "string" ||
          typeof record.instance !== "string" ||
          typeof record.endpoint !== "string" ||
          !["tab", "browser"].includes(record.scope || "browser") ||
          !Array.isArray(record.resources) ||
          !Number.isFinite(Date.parse(record.lastHeartbeat)) ||
          !Number.isFinite(record.ttlMs) ||
          record.ttlMs <= 0
        ) throw new Error("invalid lease");
        const endpoint = new URL(record.endpoint);
        if (endpoint.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(endpoint.hostname))
          throw new Error("invalid endpoint");
        const state = record.state || "active";
        if (!["active", "target_gone"].includes(state)) throw new Error("invalid lease state");
        return {
          ...record,
          status: state === "target_gone"
            ? "target_gone"
            : now - Date.parse(record.lastHeartbeat) > record.ttlMs ? "unresponsive" : "active",
        };
      } catch {
        return { lock: name, status: "unknown" };
      }
    });
  return [...new Map(records.map((record) => [record.runId || record.lock, record])).values()];
}

export function acquireLease({
  endpoint,
  instance,
  owner,
  task,
  scope = "tab",
  browserId,
  targetId,
  resources = [],
  directory = defaultLeaseDirectory,
  heartbeatMs = 10000,
  ttlMs = 45000,
}) {
  if ([instance, owner, task].some(value => typeof value !== "string" || !value.trim() || /[\r\n]/.test(value)))
    throw new Error("instance, owner and task are required for browser ownership");
  if (!["tab", "browser"].includes(scope)) throw new Error("scope must be tab or browser");
  const validId = value => typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
  if (scope === "tab" && !validId(browserId)) throw new Error("tab leases require the observed browserId");
  if (targetId != null && !validId(targetId)) throw new Error("targetId must be an observed CDP target identifier");
  if (!Array.isArray(resources) || resources.some(resource =>
    typeof resource !== "string" || !/^[A-Za-z0-9][A-Za-z0-9:._/-]*$/.test(resource) ||
    resource.includes("://") || /^(endpoint|instance|tab|connection):/.test(resource)))
    throw new Error("resources must be business identifiers, without URLs or reserved ownership prefixes");
  const origin = new URL(endpoint);
  if (origin.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname) ||
    origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash)
    throw new Error("lease endpoint must be a loopback HTTP origin");
  if (!Number.isFinite(heartbeatMs) || heartbeatMs < 10 || !Number.isFinite(ttlMs) || ttlMs <= heartbeatMs)
    throw new Error("heartbeat interval must be positive and shorter than the lease TTL");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const runId = randomUUID();
  const browserClaims = [`endpoint:${origin.port || "80"}`, `instance:${instance}`];
  const tabClaim = id => `tab:${origin.port || "80"}:${browserId}:${id}`;
  const claims = [...new Set([
    ...(scope === "browser" ? browserClaims : [
      `connection:${runId}`,
      ...(targetId == null ? [] : [tabClaim(targetId)]),
    ]),
    ...resources,
  ])].sort();
  const record = {
    runId,
    instance,
    owner,
    task,
    scope,
    browserId: browserId || null,
    targetId: scope === "tab" ? targetId ?? null : null,
    endpoint: origin.origin,
    pid: process.pid,
    resources: claims,
    state: "active",
    startedAt: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString(),
    ttlMs,
  };
  const held = [];
  let timer;
  let released = false;
  let ownershipError;
  const release = () => {
    if (released) return;
    released = true;
    clearInterval(timer);
    process.off("exit", release);
    for (const path of held) {
      try {
        const current = JSON.parse(readFileSync(join(path, "lease.json"), "utf8"));
        if (current.runId !== runId) continue;
      } catch (error) {
        if (error.code === "ENOENT") {
          // The directory was created by this run before its first heartbeat.
          rmSync(path, { recursive: true, force: true });
          continue;
        }
        // An unreadable record cannot prove this controller owns it.
        continue;
      }
      rmSync(path, { recursive: true, force: true });
    }
  };
  const assertOwned = () => {
    if (ownershipError) throw ownershipError;
    if (released) throw new Error("browser lease was released; stop this controller");
    for (const path of held) {
      const current = JSON.parse(readFileSync(join(path, "lease.json"), "utf8"));
      if (current.runId !== runId) throw new Error("browser ownership changed; stop this controller");
      if (current.state === "target_gone") {
        const error = new Error("browser target is gone; stop this controller");
        error.code = "target_gone";
        throw error;
      }
    }
  };
  const heartbeat = (verifyOwner = true) => {
    if (verifyOwner) assertOwned();
    record.lastHeartbeat = new Date().toISOString();
    for (const path of held) {
      const temporary = join(path, `${runId}.tmp`);
      writeFileSync(temporary, JSON.stringify(record, null, 2) + "\n", { mode: 0o600 });
      renameSync(temporary, join(path, "lease.json"));
    }
  };
  const markTargetGone = (reason = "target disappeared") => {
    if (!ownershipError || ownershipError.code !== "target_gone") {
      const error = new Error(`browser target is gone (${reason}); stop this controller`);
      error.code = "target_gone";
      ownershipError = error;
    }
    record.state = "target_gone";
    if (released) return;
    for (const path of held) {
      try {
        const current = JSON.parse(readFileSync(join(path, "lease.json"), "utf8"));
        if (current.runId !== runId) continue;
        const temporary = join(path, `${runId}.tmp`);
        writeFileSync(temporary, JSON.stringify(record, null, 2) + "\n", { mode: 0o600 });
        renameSync(temporary, join(path, "lease.json"));
      } catch {
        // The local ownership error still fails closed when the record is unavailable.
      }
    }
  };
  const hold = resource => {
    const path = join(directory, lockName(resource));
    try {
      mkdirSync(path, { mode: 0o700 });
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      throw new Error(`browser resource is occupied: ${resource}; inspect leases before release`);
    }
    held.push(path);
  };
  const checkBrowserConflict = () => {
    if (scope === "tab") {
      for (const resource of browserClaims) {
        if (existsSync(join(directory, lockName(resource))))
          throw new Error(`browser resource is occupied: ${resource}; inspect leases before release`);
      }
    } else {
      for (const other of listLeases(directory)) {
        if (other.runId === runId) continue;
        if (other.status === "unknown" || other.instance === instance ||
          new URL(other.endpoint).port === origin.port)
          throw new Error("browser resource is occupied by another controller; inspect leases before release");
      }
    }
  };
  try {
    // Publish membership before checking exclusivity so browser and tab claims cannot both win a race.
    for (const resource of claims) hold(resource);
    heartbeat(false);
    checkBrowserConflict();
    timer = setInterval(() => {
      try { heartbeat(); }
      catch (error) { ownershipError = error; clearInterval(timer); }
    }, heartbeatMs);
    timer.unref();
    process.once("exit", release);
    const claimTab = id => {
      assertOwned();
      if (scope !== "tab" || record.targetId != null) throw new Error("this lease already has a target or is browser-wide");
      if (!validId(id)) throw new Error("targetId must be an observed CDP target identifier");
      const resource = tabClaim(id);
      hold(resource);
      record.targetId = id;
      claims.push(resource);
      heartbeat(false);
    };
    return { runId, assertOwned, claimTab, markTargetGone, release };
  } catch (error) {
    release();
    throw error;
  }
}

export function releaseLease(runId, directory = defaultLeaseDirectory) {
  if (!/^[a-f0-9-]{36}$/.test(runId)) throw new Error("supply the exact run ID after confirming its owner stopped");
  const records = listLeases(directory).filter((record) => record.runId === runId);
  if (!records.length) throw new Error("no lease matches that run ID");
  for (const record of records) {
    for (const resource of record.resources) {
      const path = join(directory, lockName(resource));
      try {
        const current = JSON.parse(readFileSync(join(path, "lease.json"), "utf8"));
        if (current.runId === runId) rmSync(path, { recursive: true, force: true });
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      status: { type: "boolean" },
      release: { type: "string" },
      "confirm-owner-stopped": { type: "boolean" },
      directory: { type: "string" },
    },
  });
  const directory = values.directory || defaultLeaseDirectory;
  if (values.status) {
    console.log(JSON.stringify(listLeases(directory), null, 2));
    return;
  }
  if (values.release) {
    if (!values["confirm-owner-stopped"]) throw new Error("confirm the exact owner stopped before release");
    releaseLease(values.release, directory);
    return;
  }
  throw new Error("use --status or --release RUN_ID --confirm-owner-stopped");
}

if (process.argv[1] && existsSync(process.argv[1]) && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
