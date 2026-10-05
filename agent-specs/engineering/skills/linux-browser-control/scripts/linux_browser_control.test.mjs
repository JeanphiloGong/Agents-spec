import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  profileProcess,
  readRegistry,
  selectProfile,
  validateProfile,
} from "./registry.mjs";
import { acquireLease, listLeases, releaseLease } from "./lease.mjs";

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

test("leases block duplicate endpoints and shared design resources", (t) => {
  const options = fixture(t);
  const leaseDirectory = join(options.directory, "leases");
  const first = acquireLease({
    endpoint: options.endpoint,
    instance: "design",
    task: "read-design",
    resources: ["figma:file-1"],
    directory: leaseDirectory,
    heartbeatMs: 20,
    ttlMs: 100,
  });
  t.after(first.release);
  assert.equal(listLeases(leaseDirectory).length, 1);
  assert.throws(
    () => acquireLease({
      endpoint: options.endpoint,
      instance: "second",
      task: "write-design",
      directory: leaseDirectory,
      heartbeatMs: 20,
      ttlMs: 100,
    }),
    /occupied/,
  );
  assert.throws(
    () => acquireLease({
      endpoint: "http://127.0.0.1:19225",
      instance: "second",
      task: "write-design",
      resources: ["figma:file-1"],
      directory: leaseDirectory,
      heartbeatMs: 20,
      ttlMs: 100,
    }),
    /occupied/,
  );
  const runId = first.runId;
  first.release();
  assert.deepEqual(listLeases(leaseDirectory), []);
  assert.throws(() => releaseLease(runId, leaseDirectory), /no lease matches/);
});
