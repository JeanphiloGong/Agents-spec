---
name: vm-browser-control
description: Create and control an independent Edge browser running inside a QEMU Windows VM. Use desktop input for startup and direct CDP with Playwright for page work and parallel isolated pages, without MCP.
---

# VM Browser Control

The browser process, profile, and page rendering must stay in the Windows VM.
A host-side Node script may send CDP commands. Use an existing Playwright
installation; do not launch a host browser or use MCP as a substitute.

## Choose the Instance

Distinguish a new tab, an isolated context, and a new browser process. A request
for a new independent browser means a unique persistent `--user-data-dir`
and an unused guest debug port. A context isolates cookies/page state inside
one process; it is not a new persistent browser or a copy of the user's login.

Record the VM QMP socket, instance name, Windows profile path, debug port,
guest relay port, host loopback endpoint, and page/context ownership. Read the
existing VM launcher and verify allocated ports rather than guessing.

## Start Through the Desktop

Use [vm-desktop-control](../vm-desktop-control/SKILL.md) to inspect the VM and
open PowerShell or the Windows Run dialog. Deliver `scripts/start_browser.ps1`
to a guest-readable location using the environment's existing file-transfer
mechanism. A temporary HTTP server reachable as `10.0.2.2` can serve a staging
directory containing only the required scripts; inspect and save the script
before execution, then stop the server after transfer. Do not serve a whole
repository, profiles, or secrets.

Run the saved script via desktop input, with a unique name and an unused port:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:TEMP\start_browser.ps1" -Instance agent-design-02 -DebugPort 9223 -StartUrl about:blank
```

The script starts Windows Edge as the current guest user and creates a desktop
shortcut for the same persistent profile. It rejects a port already in use
and an already-running instance. Keep the browser non-elevated; any network
setup elevation is a separate step. Inspect a desktop screenshot to verify
startup, and handle any native dialogs through desktop control.

## Reach the Guest CDP

Use an existing verified forwarding route when it belongs to this instance.
For a new debug port, read [references/networking.md](references/networking.md)
and configure only its forwarding entries when covered by the task's authority.
The host listener must remain loopback-only. Do not disable the Windows
firewall or expose CDP publicly. Report an unconfigured route as a concrete
prerequisite if it cannot be established within the authorized scope.

The existing Windows setup has used debug `9222`, guest relay `19222`, and
host `http://127.0.0.1:19222`. These are examples to inspect, not ports to reuse
for a second simultaneous browser. The profile `%LOCALAPPDATA%\LensAgentBrowser\Profile`
may contain the user's Figma session; leave it intact.

Discover using exactly `/json/version`. Some Edge builds reject the trailing
slash requested by Playwright's HTTP endpoint discovery. The bundled
`scripts/connect_browser.mjs` fetches that path, rewrites the returned WebSocket
host to the local forwarded endpoint, and connects to the WebSocket directly.

```bash
node "$browser_skill/scripts/connect_browser.mjs" \
  --endpoint http://127.0.0.1:19223 \
  --package /absolute/path/to/existing/project/package.json \
  --screenshot /tmp/vm-browser-check.png
```

The package path locates an installed `playwright` package, without changing
that project's dependencies. If omitted, the current directory's package is
used. The check creates an owned temporary context, verifies a Windows browser
and an interactive page, captures a screenshot, and closes only that context.

## Work in the Browser

Import `connectVmBrowser` from the helper in a task script:

```js
const browser = await connectVmBrowser({
  endpoint: 'http://127.0.0.1:19223',
  packagePath: '/absolute/path/to/existing/project/package.json',
});
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('http://10.0.2.2:18082/index.html');
// Use locators, fill(), page.mouse, and screenshots in this Windows page.
```

Verify Windows runtime identity, inspect the target page, and test an actual
interaction. For host development servers, guest `localhost` is Windows;
QEMU user networking normally reaches the host at `10.0.2.2`. Confirm the
server binding and access route without changing unrelated services.

Assign separate contexts/pages to parallel agents. CDP page input does not use
the shared Windows pointer. Agents still need separate ownership for mutable
remote documents: two Figma pages editing one file can conflict. Use one writer
per shared document or agreed independent regions.

For user sign-in, provide the visible VM browser and let the human authenticate.
Use the instance's existing default context for that signed-in session; creating
a fresh isolated context will not inherit its cookies. Do not read credentials
or copy another profile's authentication state.

Native file pickers and system dialogs require serial desktop control. For
small host-side assets, pass file contents rather than a raw host path:

```js
import { readFile } from 'node:fs/promises';
await page.locator('input[type=file]').setInputFiles({
  name: 'design.png', mimeType: 'image/png',
  buffer: await readFile('/host/path/design.png'),
});
```

With direct CDP, raw paths can be interpreted in Windows rather than transferred
from the host. For large files or directories, use a supported transfer or
stage them in the guest and use its file picker. Verify the upload in the page.
Browser download paths belong to the guest unless the tool explicitly
transfers them; screenshots taken by Playwright are written by the host script.

Close only pages/contexts created for temporary checks. For this CDP connection,
`browser.close()` disconnects the client; do not send `Browser.close` or terminate
Edge to finish a task that should leave the VM browser open. Report the instance,
endpoint, owned pages, visible result, and any remaining human step.
