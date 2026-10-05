#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  assertLinux,
  defaultRegistryPath,
  profileProcess,
  readCdpVersion,
  readRegistry,
  selectProfile,
  writeProfile,
} from "./registry.mjs";

const candidates = [
  process.env.LINUX_BROWSER,
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
].filter(Boolean);

function findBrowser() {
  for (const candidate of candidates) {
    try {
      const path = execFileSync("sh", ["-c", "command -v -- \"$1\"", "lookup", candidate], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (path) return path;
    } catch {
      // Try the next supported browser candidate.
    }
  }
  throw new Error("No supported Linux browser found; set LINUX_BROWSER or install Chrome/Chromium");
}

function unusedPort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolvePort(port));
    });
  });
}

async function waitForCdp(endpoint) {
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      return await readCdpVersion(endpoint);
    } catch (error) {
      lastError = error;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }
  }
  throw new Error(`Browser started but CDP did not become ready: ${lastError?.message || "unknown error"}`);
}

async function main() {
  const { values } = parseArgs({
    options: {
      name: { type: "string" },
      purpose: { type: "string" },
      "profile-dir": { type: "string" },
      port: { type: "string" },
      "start-url": { type: "string", default: "about:blank" },
      browser: { type: "string" },
      registry: { type: "string" },
      help: { type: "boolean" },
    },
  });
  if (values.help) {
    console.log("launch_browser.mjs --name PROFILE [--purpose TEXT] [--start-url URL]");
    return;
  }
  assertLinux();
  if (!values.name?.trim()) throw new Error("--name is required");
  const registryPath = values.registry || defaultRegistryPath;
  const registry = readRegistry(registryPath);
  const existing = registry.profiles.find((profile) => profile.name === values.name);
  if (existing) {
    const profile = selectProfile({ registryPath, name: values.name });
    if (profileProcess(profile.profile_dir).length) {
      throw new Error(`profile ${profile.name} already has a running browser process; attach to its endpoint`);
    }
    try {
      await readCdpVersion(profile.cdp_endpoint);
      throw new Error(`profile ${profile.name} already has a reachable CDP endpoint; attach to it`);
    } catch (error) {
      if (/already has a reachable/.test(error.message)) throw error;
      // The registered process is stopped; reuse its profile directory and port.
    }
  }
  const root = registry.root || join(resolve(registryPath, ".."));
  const profileDir = resolve(
    values["profile-dir"] || existing?.profile_dir || join(root, values.name),
  );
  if (profileDir === "/") throw new Error("profile directory is too broad");
  mkdirSync(profileDir, { recursive: true, mode: 0o700 });
  if (profileProcess(profileDir).length)
    throw new Error("profile directory already belongs to a running browser process");
  const port = Number(values.port || existing?.cdp_endpoint?.match(/:(\d+)\/?$/)?.[1] || await unusedPort());
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error("--port must be an integer between 1024 and 65535");
  const startUrl = values["start-url"] || "about:blank";
  let parsedUrl;
  try {
    parsedUrl = new URL(startUrl);
  } catch {
    throw new Error("--start-url must be an HTTP(S) URL or about:blank");
  }
  if (parsedUrl.protocol !== "about:" && !["http:", "https:"].includes(parsedUrl.protocol))
    throw new Error("--start-url must be an HTTP(S) URL or about:blank");
  const browser = values.browser || findBrowser();
  const endpoint = `http://127.0.0.1:${port}`;
  const child = spawn(browser, [
    `--user-data-dir=${profileDir}`,
    "--remote-debugging-address=127.0.0.1",
    `--remote-debugging-port=${port}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--new-window",
    startUrl,
  ], { detached: true, stdio: "ignore" });
  child.unref();
  const cdp = await waitForCdp(endpoint);
  const profile = {
    name: values.name,
    purpose: values.purpose || existing?.purpose || values.name,
    browser,
    profile_dir: profileDir,
    cdp_endpoint: endpoint,
    connection_mode: "local-cdp-attach",
    status: "running",
    ownership: "unclaimed",
    last_verified_utc: new Date().toISOString(),
    credentials_recorded: false,
    cookies_recorded: false,
    shared_write_policy: "one-agent-writer-per-shared-document",
  };
  writeProfile({ registryPath, profile });
  console.log(JSON.stringify({ ...profile, browser_version: cdp.Browser }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
