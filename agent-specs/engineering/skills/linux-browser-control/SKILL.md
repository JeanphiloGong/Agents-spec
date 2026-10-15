---
name: linux-browser-control
description: "v0.1.2 - Discover, launch, and control visible Linux browsers with per-tab CDP leases while preserving desktop focus. Use when a user needs a separate browser login or agents need separate tabs in one signed-in browser. Use when a task must inspect tab ownership or reserve browser-wide operations without copying credentials."
---

# Linux Browser Control

## Overview

This skill manages browser processes that run directly on the Linux host. It is
the Linux counterpart to `vm-browser-control`; it does not use QEMU, QMP,
Windows profiles, or the VM registry.

Multiple agents may attach to one browser, but each normal agent connection
owns one CDP page target. A browser-wide lease remains available for operations
that affect every tab. Leases coordinate cooperating agents; they do not
isolate tabs from the shared profile or restrict raw CDP access.

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
- Agents need to list visible browser profiles, tabs, owners, and heartbeat
  state before choosing a page.

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
- Default ownership: one agent per CDP page target; one browser-wide owner for
  operations affecting every tab; one writer per shared document, expressed
  with `resources` such as `figma:FILE_KEY`.
- Keep the browser visible and preserve the user's desktop focus by default.
  Visible page updates do not require activating or raising the browser window.

## Operating Loop

1. Confirm `uname -s` is `Linux`. If the target is a QEMU Windows browser,
   stop and use `vm-browser-control` instead.
2. Read the Linux registry with `scripts/registry.mjs`. Select an explicit
   `--name` when possible; use `--purpose` only when it resolves to exactly one
   profile. To see all profiles and pages, run
   `scripts/registry.mjs --list --tabs`; this reports only profile metadata,
   target IDs, sanitized URL paths, titles, availability, owner, task, scope,
   and heartbeat. Reject malformed records and non-loopback endpoints.
3. Inspect the profile directory, process command line, and the exact
   `<endpoint>/json/version` endpoint. If the registered browser is running,
   attach to it. Do not launch a second process with the same profile.
4. If the user explicitly requested creation or the selected profile is
   stopped, run `scripts/launch_browser.mjs`. Reuse the registered profile and
   port when present; create a new persistent directory and unused port only
   for a genuinely new profile.
5. Before CDP work, list current tabs and acquire a lease with a stable
   `owner`, `instance`, short `task`, the observed `browserId`, and any shared
   resources. A normal tab lease may select an observed `targetId`; when no
   target is supplied, `connectLinuxBrowser` creates one page in the existing
   default context and binds it before returning. Inspect
   `scripts/lease.mjs --status` when access is denied. Never reclaim an active,
   unresponsive, or unknown lease without confirming the exact owner stopped.
6. Connect through `scripts/connect_browser.mjs` or `connectLinuxBrowser`.
   Use the existing default context for a user's signed-in session; do not
   create a fresh context expecting it to inherit cookies. Use the returned
   `page` and `targetId`; do not inspect or mutate another agent's page through
   the shared `browser` object.
7. Before interacting, read [Focus-Preserving Interaction](references/focus-preserving-interaction.md).
   Prefer inspected DOM controls and page-local events. Verify both the visible
   result and unchanged desktop focus for each new kind of action; do not
   silently switch to native/CDP input when a page rejects synthetic events.
8. Keep one writer for a mutable Figma or design document. Separate read-only
   pages may use separate tabs with separate leases. Use `scope: "browser"`
   for login/logout, profile settings, browser dialogs, or other tasks affecting
   all tabs; it conflicts with every tab lease on that endpoint. Serialize
   publishing to one social account with a shared resource such as
   `social:x:ACCOUNT_ID`, even when writers use different tabs.
9. In `finally`, call the returned `close` function. It closes only a page
   created by the task, disconnects CDP, and releases the lease. A page selected
   by `targetId` remains open. Do not terminate the browser process or delete
   its profile; leave an unresponsive lease for explicit owner confirmation.

## Decision Points

- If the registry is missing, report the exact path and ask before creating a
  new persistent profile unless the user explicitly requested creation.
- If a record exists but its process is stopped, reuse its profile and endpoint
  after validating both; do not silently create a replacement.
- If `/json/version` fails while the process appears alive, inspect the exact
  endpoint and process before retrying. Do not guess another port.
- If a resource lease conflicts, coordinate with its owner. A heartbeat timeout
  proves liveness failure, not that it is safe to take over.
- If a tab is occupied, choose another unclaimed target or wait for the owner;
  do not attach to a shared CDP connection and switch pages. If a browser-wide
  operation is needed, wait until all tab leases are released and acquire the
  browser scope explicitly.
- If the task opens a popup or new tab, its target is not covered by the
  original page lease. Discover and lease that target before interacting.
- If a task requires credentials, let the user authenticate visibly. Never
  read passwords, cookies, local storage, tokens, or browser databases.
- If a control requires trusted input, a native dialog, or a canvas gesture
  that has not been verified to preserve focus, explain the specific step and
  use a user-performed gesture or an already-agreed foreground operation.
  A request for visible operation alone does not authorize stealing focus.
- If focus changes unexpectedly, stop input, identify the triggering action
  and any modal window, and verify the next method before continuing. Keep
  rendering visible; do not substitute headless operation or repeatedly force
  focus back to another window.

## CLI Examples

Inspect the registry and current process/CDP status:

```bash
# List profiles and visible tabs with current ownership.
node "$linux_browser_skill/scripts/registry.mjs" --list --tabs

# Inspect one profile without acquiring a lease.
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
  --name figma-design --owner research-agent --task design-read \
  --scope tab --target TARGET_ID \
  --package /absolute/path/to/project/package.json \
  --resource figma:FILE_KEY

# Allocate a new tab in the signed-in default context.
node "$linux_browser_skill/scripts/connect_browser.mjs" \
  --name social-media --owner publish-agent --task x-reply \
  --start-url https://x.com/home \
  --package /absolute/path/to/project/package.json

# Reserve the entire browser for an operation affecting all tabs.
node "$linux_browser_skill/scripts/connect_browser.mjs" \
  --name social-media --owner browser-admin --task browser-maintenance \
  --scope browser --package /absolute/path/to/project/package.json
```

The package path locates an already-installed Playwright package. This skill
does not install dependencies.

The connection CLI is a smoke check: it releases ownership before exiting.
For actual work, keep the imported connection alive for the whole task:

```javascript
const { connectLinuxBrowser } = await import(
  `${process.env.HOME}/.codex/skills/linux-browser-control/scripts/connect_browser.mjs`
);
const connection = await connectLinuxBrowser({
  name: "social-media",
  owner: "research-agent",
  task: "source-research",
  targetId: "OBSERVED_TARGET_ID",
  packagePath: "/absolute/path/to/project/package.json",
});
try {
  connection.lease.assertOwned();
  // Inspect and act only through connection.page, using verified focus-preserving methods.
} finally {
  await connection.close();
}
```

Call `lease.assertOwned()` before each action or bounded batch. If it fails,
stop the task; heartbeat loss must not allow the controller to continue writing.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The VM registry is the universal browser registry." | VM and Linux browsers have different runtimes and registries. Detect the host first. |
| "A new tab is a new independent browser." | A tab shares the profile and authentication state. Use a new profile only when isolation is required. |
| "Different tabs mean no coordination is needed." | Tabs share login state, browser dialogs, and business resources. Claim the target and resource separately. |
| "The connection CLI succeeded, so the tab is still reserved." | The CLI releases before exit. Keep the imported connection alive throughout the work. |
| "I can attach first and inspect the tab list later." | Inspect first, claim the observed target atomically, then use only the returned page. |
| "The port is free, so launch another process." | The profile may already be running or locked. Inspect registry, profile, and process together. |
| "The lease timed out, so take it." | Timeout is evidence for investigation, not proof that the owner stopped. |
| "Reading cookies is the easiest login check." | Login state is sensitive. Verify only visible page behavior or the user's own interaction. |
| "I did not call `bringToFront`, so clicks cannot steal focus." | Chromium's CDP input path can focus the native window internally. Measure desktop focus. |
| "The user wants to watch, so I should activate Chrome on every action." | Page visibility and desktop input focus are separate. Preserve the current active window. |
| "A synthetic event was dispatched, so the action succeeded." | Pages may reject untrusted events. Verify the resulting visible state before proceeding. |

## Red Flags

- The agent searches `%LOCALAPPDATA%`, QMP sockets, or Windows paths on Linux.
- A second process is started with the same `--user-data-dir`.
- A registry or lease contains credentials, cookies, tokens, full page content,
  or a non-loopback endpoint.
- Two agents claim the same target ID, browser scope, or `figma:FILE_KEY`
  writer resource.
- A caller gets the shared `browser` object and navigates an unowned page.
- The task deletes a profile or kills Chrome to release a lock.
- Ordinary interaction calls `bringToFront`, activates a desktop window, or
  silently falls back to `click`, `press`, mouse, or keyboard CDP input.
- A page screenshot is treated as proof that no native modal dialog is open,
  or `document.hasFocus()` is treated as proof of desktop focus ownership.

## Verification

- [ ] `SKILL.md` and `agents/openai.yaml` report matching version `v0.1.2` scope.
- [ ] `scripts/registry.mjs --name figma-design --inspect` reads the actual
      Linux registry and validates the loopback endpoint.
- [ ] `scripts/lease.mjs` allows distinct target IDs, rejects duplicate target,
      browser, and business-resource claims, renews heartbeats, and requires
      explicit release confirmation.
- [ ] `scripts/registry.mjs --list --tabs` joins live CDP page targets with
      owners and marks leased targets that disappeared as `missing`.
- [ ] `scripts/connect_browser.mjs` discovers exactly `/json/version`, rewrites
      only the WebSocket host to the loopback endpoint, binds the returned page
      target, and disconnects safely.
- [ ] `scripts/launch_browser.mjs` rejects non-Linux use, existing profile
      processes, invalid ports, and non-HTTP start URLs.
- [ ] No password, cookie, token, page body, or local-storage value is written
      to the registry, lease records, or command output.
- [ ] Tab inventory strips query and fragment data from displayed URLs and
      never reports page body text.
- [ ] New interaction methods produce the intended visible page state without
      changing the desktop active window or raising the browser. On X11, inspect
      `_NET_ACTIVE_WINDOW` and `_NET_CLIENT_LIST_STACKING`, including transitions.
- [ ] Unsupported synthetic actions are reported; no trusted-input fallback,
      headless substitution, or forced focus restoration happens silently.
- [ ] Separate-process tests prove two owners cannot acquire one target while
      two different targets can coexist.
- [ ] Navigation failure closes the newly created page, and page-close failure
      still disconnects and releases the lease; selected existing pages stay open.

## Output Format

Report the selected profile name, purpose, profile directory, loopback endpoint,
browser ID, selected target ID, scope, owner, status, owned resources, visible
page result, and any remaining user action. For discovery, report profile and
tab inventory with ownership status, not page body text.
State whether desktop focus preservation was verified and identify any
remaining step that requires foreground input.
Do not report credentials, cookies, tokens, or page contents.

## Guardrails

- Keep browser rendering and profile data on the Linux host; use only local CDP.
- Never expose CDP beyond loopback or disable host firewall protections.
- Never copy another profile's authentication state or inspect browser secrets.
- Do not delete profiles, kill unrelated browser processes, or modify remote
  design documents without the user's requested scope.
- Preserve the registry and lease records as non-secret operational metadata.
- Treat `targetId` as an observed CDP identifier, not a user-provided path or
  arbitrary lock name. Keep browser-wide and per-tab scopes distinct.
- Never use a shared `browser` binding to navigate or act on a page outside the
  returned target; reconnect with the target's lease when work changes pages.
- Avoid `Page.bringToFront`, `Target.activateTarget`, window activation commands,
  and native/CDP mouse or keyboard input unless that focus-changing operation
  is already within the user's agreed scope. Browser startup and native dialogs
  may also activate windows; announce those steps before they occur.
