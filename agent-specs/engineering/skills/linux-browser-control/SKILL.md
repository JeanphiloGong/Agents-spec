---
name: linux-browser-control
description: "v0.1.0 - Discover, launch, and control isolated Linux browser profiles through local CDP. Use when a user needs a separate Linux browser login. Use when an agent must attach to a recorded Chrome or Chromium profile without copying credentials or opening a second writer."
---

# Linux Browser Control

## Overview

This skill manages browser processes that run directly on the Linux host. It is
the Linux counterpart to `vm-browser-control`; it does not use QEMU, QMP,
Windows profiles, or the VM registry.

The persistent browser registry is:

```text
${XDG_DATA_HOME:-$HOME/.local/share}/codex-browser-profiles/registry.json
```

On this host the default is
`/home/jeanphilo/.local/share/codex-browser-profiles/registry.json`. A profile
record contains only a name, purpose, browser, profile directory, loopback CDP
endpoint, lifecycle status, and ownership metadata. It must never contain a
password, cookie, token, proxy subscription, or page contents.

## When to Use

- The user asks for a separate Chrome/Chromium profile on Linux.
- A browser profile already exists in the Linux registry and an agent needs to
  attach to its local CDP endpoint.
- Multiple agents need coordinated access to different pages or shared design
  files in one authenticated browser.

**When NOT to use:** a browser that must run inside a Windows VM, native
Windows desktop input, a remote browser endpoint, or a request to extract or
copy authentication state.

## Fixed Defaults

- Registry: `${XDG_DATA_HOME:-$HOME/.local/share}/codex-browser-profiles/registry.json`.
- Profile root: the registry's `root` field, or the registry directory's parent.
- Lease directory: `${XDG_STATE_HOME:-$HOME/.local/state}/linux-browser-control/leases`.
- CDP: HTTP loopback only (`127.0.0.1`, `localhost`, or `[::1]`).
- Browser candidates: `$LINUX_BROWSER`, `google-chrome`,
  `google-chrome-stable`, `chromium`, `chromium-browser`.
- Default ownership: one agent per profile endpoint and one writer per shared
  document, expressed with `resources` such as `figma:FILE_KEY`.

## Operating Loop

1. Confirm `uname -s` is `Linux`. If the target is a QEMU Windows browser,
   stop and use `vm-browser-control` instead.
2. Read the Linux registry with `scripts/registry.mjs`. Select an explicit
   `--name` when possible; use `--purpose` only when it resolves to exactly one
   profile. Reject malformed records and non-loopback endpoints.
3. Inspect the profile directory, process command line, and the exact
   `<endpoint>/json/version` endpoint. If the registered browser is running,
   attach to it. Do not launch a second process with the same profile.
4. If the user explicitly requested creation or the selected profile is
   stopped, run `scripts/launch_browser.mjs`. Reuse the registered profile and
   port when present; create a new persistent directory and unused port only
   for a genuinely new profile.
5. Before CDP work, acquire a lease with a stable `instance`, short `task`, and
   any shared resources. Inspect `scripts/lease.mjs --status` when access is
   denied. Never reclaim an active, unresponsive, or unknown lease without
   confirming the exact owner stopped.
6. Connect through `scripts/connect_browser.mjs` or `connectLinuxBrowser`.
   Use the existing default context for a user's signed-in session; do not
   create a fresh context expecting it to inherit cookies.
7. Keep one writer for a mutable Figma or design document. Separate read-only
   pages may use separate contexts or pages under the same owner.
8. In `finally`, close only pages/contexts created by the task and disconnect
   the CDP client. Do not terminate the browser process or delete its profile.
   Release the lease on normal disconnect; leave an unresponsive lease for
   explicit owner confirmation.

## Decision Points

- If the registry is missing, report the exact path and ask before creating a
  new persistent profile unless the user explicitly requested creation.
- If a record exists but its process is stopped, reuse its profile and endpoint
  after validating both; do not silently create a replacement.
- If `/json/version` fails while the process appears alive, inspect the exact
  endpoint and process before retrying. Do not guess another port.
- If a resource lease conflicts, coordinate with its owner. A heartbeat timeout
  proves liveness failure, not that it is safe to take over.
- If a task requires credentials, let the user authenticate visibly. Never
  read passwords, cookies, local storage, tokens, or browser databases.

## CLI Examples

Inspect the registry and current process/CDP status:

```bash
node "$linux_browser_skill/scripts/registry.mjs" \
  --name figma-design --inspect
```

Create a new profile only after the user requested it:

```bash
node "$linux_browser_skill/scripts/launch_browser.mjs" \
  --name design-review --purpose "Design review" \
  --start-url https://www.figma.com/login
```

Attach to an existing profile with ownership:

```bash
node "$linux_browser_skill/scripts/connect_browser.mjs" \
  --name figma-design --task design-read \
  --package /absolute/path/to/project/package.json \
  --resource figma:FILE_KEY
```

The package path locates an already-installed Playwright package. This skill
does not install dependencies.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The VM registry is the universal browser registry." | VM and Linux browsers have different runtimes and registries. Detect the host first. |
| "A new tab is a new independent browser." | A tab shares the profile and authentication state. Use a new profile only when isolation is required. |
| "The port is free, so launch another process." | The profile may already be running or locked. Inspect registry, profile, and process together. |
| "The lease timed out, so take it." | Timeout is evidence for investigation, not proof that the owner stopped. |
| "Reading cookies is the easiest login check." | Login state is sensitive. Verify only visible page behavior or the user's own interaction. |

## Red Flags

- The agent searches `%LOCALAPPDATA%`, QMP sockets, or Windows paths on Linux.
- A second process is started with the same `--user-data-dir`.
- A registry or lease contains credentials, cookies, tokens, full page content,
  or a non-loopback endpoint.
- Two agents claim the same `figma:FILE_KEY` writer resource.
- The task deletes a profile or kills Chrome to release a lock.

## Verification

- [ ] `SKILL.md` and `agents/openai.yaml` report matching version `v0.1.0` scope.
- [ ] `scripts/registry.mjs --name figma-design --inspect` reads the actual
      Linux registry and validates the loopback endpoint.
- [ ] `scripts/lease.mjs` rejects duplicate endpoint/profile/document claims,
      renews heartbeats, and requires explicit release confirmation.
- [ ] `scripts/connect_browser.mjs` discovers exactly `/json/version`, rewrites
      only the WebSocket host to the loopback endpoint, and disconnects safely.
- [ ] `scripts/launch_browser.mjs` rejects non-Linux use, existing profile
      processes, invalid ports, and non-HTTP start URLs.
- [ ] No password, cookie, token, page body, or local-storage value is written
      to the registry, lease records, or command output.

## Output Format

Report the selected profile name, purpose, profile directory, loopback endpoint,
status, owned resources, visible page result, and any remaining user action.
Do not report credentials, cookies, tokens, or page contents.

## Guardrails

- Keep browser rendering and profile data on the Linux host; use only local CDP.
- Never expose CDP beyond loopback or disable host firewall protections.
- Never copy another profile's authentication state or inspect browser secrets.
- Do not delete profiles, kill unrelated browser processes, or modify remote
  design documents without the user's requested scope.
- Preserve the registry and lease records as non-secret operational metadata.
