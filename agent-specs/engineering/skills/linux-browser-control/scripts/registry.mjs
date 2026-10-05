#!/usr/bin/env node
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

export const defaultRegistryPath = join(
  process.env.XDG_DATA_HOME || join(homedir(), ".local", "share"),
  "codex-browser-profiles",
  "registry.json",
);

export function assertLinux() {
  if (process.platform !== "linux") {
    throw new Error(
      `linux-browser-control requires Linux; detected ${process.platform}`,
    );
  }
}

function loopbackOrigin(endpoint) {
  let origin;
  try {
    origin = new URL(endpoint);
  } catch {
    throw new Error("registry cdp_endpoint must be a valid HTTP URL");
  }
  if (
    origin.protocol !== "http:" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname) ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  ) {
    throw new Error("registry cdp_endpoint must be a loopback HTTP origin");
  }
  return origin;
}

export function readRegistry(registryPath = defaultRegistryPath) {
  if (!existsSync(registryPath)) {
    throw new Error(`Linux browser registry not found: ${registryPath}`);
  }
  let registry;
  try {
    registry = JSON.parse(readFileSync(registryPath, "utf8"));
  } catch (error) {
    throw new Error(`Linux browser registry is not valid JSON: ${error.message}`);
  }
  if (registry.platform !== "linux" || !Array.isArray(registry.profiles)) {
    throw new Error("Linux browser registry must have platform=linux and profiles[]");
  }
  return registry;
}

export function validateProfile(profile, registryPath = defaultRegistryPath) {
  if (!profile || typeof profile !== "object")
    throw new Error("Linux browser registry profile is invalid");
  for (const field of ["name", "purpose", "browser", "profile_dir", "cdp_endpoint"]) {
    if (typeof profile[field] !== "string" || !profile[field].trim())
      throw new Error(`Linux browser profile is missing ${field}`);
  }
  const origin = loopbackOrigin(profile.cdp_endpoint);
  const profileDir = resolve(profile.profile_dir);
  if (profileDir === "/" || profileDir === resolve(registryPath))
    throw new Error("Linux browser profile_dir is too broad");
  return { ...profile, profile_dir: profileDir, cdp_origin: origin.origin };
}

export function selectProfile({
  registryPath = defaultRegistryPath,
  name,
  purpose,
} = {}) {
  const registry = readRegistry(registryPath);
  let profiles = registry.profiles.map((profile) =>
    validateProfile(profile, registryPath),
  );
  if (name) profiles = profiles.filter((profile) => profile.name === name);
  if (purpose) profiles = profiles.filter((profile) => profile.purpose === purpose);
  if (profiles.length !== 1) {
    const requested = name ? `name=${name}` : purpose ? `purpose=${purpose}` : "selection";
    throw new Error(
      `${requested} must resolve to exactly one Linux browser profile; found ${profiles.length}`,
    );
  }
  return profiles[0];
}

export function profileProcess(profileDir) {
  try {
    const output = execFileSync("ps", ["-eo", "args="], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const needle = `--user-data-dir=${profileDir}`;
    return output
      .split("\n")
      .filter((line) => line.includes(needle) && !line.includes("registry.mjs"));
  } catch {
    return [];
  }
}

export async function readCdpVersion(endpoint) {
  const response = await fetch(new URL("/json/version", endpoint), {
    signal: AbortSignal.timeout(5000),
    redirect: "error",
  });
  if (!response.ok) throw new Error(`CDP discovery returned HTTP ${response.status}`);
  const version = await response.json();
  if (typeof version.webSocketDebuggerUrl !== "string")
    throw new Error("CDP discovery has no WebSocket endpoint");
  return { Browser: version.Browser, ProtocolVersion: version["Protocol-Version"] };
}

export function writeProfile({ registryPath = defaultRegistryPath, profile }) {
  const registry = readRegistry(registryPath);
  const next = registry.profiles.map((item) =>
    item.name === profile.name ? { ...item, ...profile } : item,
  );
  if (!next.some((item) => item.name === profile.name)) next.push(profile);
  const temporary = `${registryPath}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify({ ...registry, profiles: next }, null, 2) + "\n", {
    mode: 0o600,
  });
  renameSync(temporary, registryPath);
}

function inspect(profile) {
  const processes = profileProcess(profile.profile_dir);
  return readCdpVersion(profile.cdp_endpoint)
    .then((cdp) => ({
      name: profile.name,
      purpose: profile.purpose,
      profile_dir: profile.profile_dir,
      cdp_endpoint: profile.cdp_endpoint,
      status: "running",
      process_matches: processes.length,
      browser: cdp.Browser,
      protocol_version: cdp.ProtocolVersion,
    }))
    .catch((error) => ({
      name: profile.name,
      purpose: profile.purpose,
      profile_dir: profile.profile_dir,
      cdp_endpoint: profile.cdp_endpoint,
      status: processes.length ? "process-without-cdp" : "stopped",
      process_matches: processes.length,
      error: error.message,
    }));
}

async function main() {
  const { values } = parseArgs({
    options: {
      name: { type: "string" },
      purpose: { type: "string" },
      registry: { type: "string" },
      inspect: { type: "boolean" },
      help: { type: "boolean" },
    },
  });
  if (values.help) {
    console.log("registry.mjs --name PROFILE [--registry PATH] [--inspect]");
    return;
  }
  assertLinux();
  const profile = selectProfile({
    registryPath: values.registry || defaultRegistryPath,
    name: values.name,
    purpose: values.purpose,
  });
  console.log(
    JSON.stringify(
      values.inspect ? await inspect(profile) : profile,
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url === `file://${resolve(process.argv[1])}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
