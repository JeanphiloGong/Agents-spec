#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

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
          !Array.isArray(record.resources) ||
          !Number.isFinite(Date.parse(record.lastHeartbeat)) ||
          !Number.isFinite(record.ttlMs) ||
          record.ttlMs <= 0
        ) throw new Error("invalid lease");
        return {
          ...record,
          status: now - Date.parse(record.lastHeartbeat) > record.ttlMs ? "unresponsive" : "active",
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
  task,
  resources = [],
  directory = defaultLeaseDirectory,
  heartbeatMs = 10000,
  ttlMs = 45000,
}) {
  if (!instance?.trim() || !task?.trim()) throw new Error("instance and task are required for browser ownership");
  if (!Array.isArray(resources) || resources.some((resource) => typeof resource !== "string" || !resource.trim()))
    throw new Error("resources must contain non-empty identifiers without credentials or full URLs");
  const origin = new URL(endpoint);
  if (origin.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname))
    throw new Error("lease endpoint must be a loopback HTTP origin");
  if (!Number.isFinite(heartbeatMs) || heartbeatMs < 10 || !Number.isFinite(ttlMs) || ttlMs <= heartbeatMs)
    throw new Error("heartbeat interval must be positive and shorter than the lease TTL");
  const claims = [...new Set([
    `endpoint:${origin.port || "80"}`,
    `instance:${instance}`,
    ...resources,
  ])].sort();
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const runId = randomUUID();
  const record = {
    runId,
    instance,
    task,
    endpoint: origin.origin,
    pid: process.pid,
    resources: claims,
    startedAt: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString(),
    ttlMs,
  };
  const held = [];
  let timer;
  let released = false;
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
        if (error.code !== "ENOENT") throw error;
      }
      rmSync(path, { recursive: true, force: true });
    }
  };
  const heartbeat = (verifyOwner = true) => {
    record.lastHeartbeat = new Date().toISOString();
    for (const path of held) {
      if (verifyOwner) {
        const current = JSON.parse(readFileSync(join(path, "lease.json"), "utf8"));
        if (current.runId !== runId) throw new Error("browser ownership changed; stop this controller");
      }
      const temporary = join(path, `${runId}.tmp`);
      writeFileSync(temporary, JSON.stringify(record, null, 2) + "\n", { mode: 0o600 });
      renameSync(temporary, join(path, "lease.json"));
    }
  };
  try {
    for (const resource of claims) {
      const path = join(directory, lockName(resource));
      try {
        mkdirSync(path, { mode: 0o700 });
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
        throw new Error(`browser resource is occupied: ${resource}; inspect leases before release`);
      }
      held.push(path);
    }
    heartbeat(false);
    timer = setInterval(() => heartbeat(), heartbeatMs);
    timer.unref();
    process.once("exit", release);
    return { runId, release };
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

if (process.argv[1] && import.meta.url === `file://${resolve(process.argv[1])}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
