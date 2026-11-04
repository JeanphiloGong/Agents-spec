#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { assertLinux } from "./registry.mjs";
import { agentBrowserPath, agentBrowserVersion } from "./connect_browser.mjs";

assertLinux();
const assets = {
  x64: "c4351f3802ffa5254d8c69f20a52e2fcf56925c6016fcf4203db25a07d811379",
  arm64: "00d291f45e1c4d527b3aa08c70c54c7c3030fde0794f8d4575aaa3ca1680f728",
};
const digest = assets[process.arch];
if (!digest) throw new Error("agent-browser installation supports Linux x64 and arm64");
const sha256 = data => createHash("sha256").update(data).digest("hex");
if (existsSync(agentBrowserPath) && sha256(readFileSync(agentBrowserPath)) === digest) {
  console.log(agentBrowserPath);
} else {
  const response = await fetch(`https://github.com/vercel-labs/agent-browser/releases/download/v${agentBrowserVersion}/agent-browser-linux-${process.arch}`, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`agent-browser download returned HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (sha256(data) !== digest) throw new Error("agent-browser download SHA-256 does not match the pinned release");
  mkdirSync(dirname(agentBrowserPath), { recursive: true, mode: 0o700 });
  const temporary = `${agentBrowserPath}.${process.pid}.tmp`;
  try { writeFileSync(temporary, data, { mode: 0o700 }); renameSync(temporary, agentBrowserPath); }
  finally { rmSync(temporary, { force: true }); }
  console.log(agentBrowserPath);
}
