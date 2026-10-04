import { createHash, randomUUID } from "node:crypto";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const defaultLeaseDirectory = join(
  homedir(),
  ".local",
  "state",
  "vm-browser-control",
  "leases",
);
const lockName = (resource) =>
  createHash("sha256").update(resource).digest("hex");

export function listBrowserLeases(
  directory = defaultLeaseDirectory,
  now = Date.now(),
) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const records = readdirSync(directory)
    .filter((name) => /^[a-f0-9]{64}$/.test(name))
    .map((name) => {
      try {
        const record = JSON.parse(
          readFileSync(join(directory, name, "lease.json"), "utf8"),
        );
        if (
          typeof record.runId !== "string" ||
          !Array.isArray(record.resources) ||
          !Number.isFinite(Date.parse(record.lastHeartbeat)) ||
          !Number.isFinite(record.ttlMs) ||
          record.ttlMs <= 0
        )
          throw new Error("Invalid lease record");
        return {
          ...record,
          status:
            now - Date.parse(record.lastHeartbeat) > record.ttlMs
              ? "unresponsive"
              : "active",
        };
      } catch {
        return { lock: name, status: "unknown" };
      }
    });
  return [
    ...new Map(
      records.map((record) => [record.runId || record.lock, record]),
    ).values(),
  ];
}

export function acquireBrowserLease({
  endpoint,
  instance,
  task,
  resources = [],
  directory = defaultLeaseDirectory,
  heartbeatMs = 10000,
  ttlMs = 45000,
}) {
  if (!instance?.trim() || !task?.trim())
    throw new Error("instance and task are required for browser ownership");
  if (
    !Number.isFinite(heartbeatMs) ||
    heartbeatMs < 10 ||
    !Number.isFinite(ttlMs) ||
    ttlMs <= heartbeatMs
  ) {
    throw new Error(
      "Heartbeat interval must be positive and shorter than the lease TTL",
    );
  }
  if (
    !Array.isArray(resources) ||
    resources.some((value) => typeof value !== "string" || !value.trim())
  ) {
    throw new Error(
      "resources must contain non-empty identifiers, without credentials or full URLs",
    );
  }
  const claims = [
    ...new Set([
      `endpoint:${new URL(endpoint).port || "80"}`,
      `instance:${instance}`,
      ...resources,
    ]),
  ].sort();
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const runId = randomUUID();
  const record = {
    runId,
    instance,
    task,
    endpoint,
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
      // A manually released owner must never remove a later owner's record.
      try {
        const current = JSON.parse(
          readFileSync(join(path, "lease.json"), "utf8"),
        );
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
        const current = JSON.parse(
          readFileSync(join(path, "lease.json"), "utf8"),
        );
        if (current.runId !== runId)
          throw new Error("Browser ownership changed; stop this controller");
      }
      const temporary = join(path, `${runId}.tmp`);
      writeFileSync(temporary, JSON.stringify(record, null, 2) + "\n", {
        mode: 0o600,
      });
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
        throw new Error(
          `Browser resource is occupied: ${resource}. Inspect leases; stale or unknown records also require confirmation before release.`,
        );
      }
      held.push(path);
    }
    heartbeat(false);
    // An unwritable heartbeat must stop the owner rather than continue untracked.
    timer = setInterval(() => heartbeat(), heartbeatMs);
    timer.unref();
    process.once("exit", release);
    return { runId, release };
  } catch (error) {
    release();
    throw error;
  }
}

export function releaseBrowserLease(runId, directory = defaultLeaseDirectory) {
  if (!/^[a-f0-9-]{36}$/.test(runId))
    throw new Error(
      "Supply the exact run ID after confirming its owner stopped",
    );
  const records = listBrowserLeases(directory).filter(
    (record) => record.runId === runId,
  );
  if (!records.length) throw new Error("No lease matches that run ID");
  for (const record of records) {
    for (const resource of record.resources) {
      const path = join(directory, lockName(resource));
      try {
        const current = JSON.parse(
          readFileSync(join(path, "lease.json"), "utf8"),
        );
        if (current.runId === runId)
          rmSync(path, { recursive: true, force: true });
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
}
