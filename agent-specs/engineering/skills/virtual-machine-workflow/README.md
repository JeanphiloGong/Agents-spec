# Virtual Machine Workflow

These skills let an agent work with an isolated browser in the correct runtime.
The VM skills operate an existing QEMU Windows desktop; the sibling Linux skill
operates Chrome/Chromium directly on the Linux host. Local scripts send QMP or
CDP commands, and MCP is not required.

| Skill | Use when |
| --- | --- |
| [`vm-desktop-control`](vm-desktop-control/SKILL.md) | Inspect screenshots and operate Windows applications, keyboard, mouse, and native dialogs through QMP. |
| [`vm-browser-control`](vm-browser-control/SKILL.md) | Launch a separate Edge process through the desktop, then control its pages through CDP. |
| [`linux-browser-control`](../linux-browser-control/SKILL.md) | Discover, launch, or attach to an isolated Linux Chrome/Chromium profile through loopback CDP. |

```text
$vm-desktop-control Inspect the Windows VM desktop and open an application.
$vm-browser-control Create a new browser inside the Windows VM and work there.
$linux-browser-control Attach to the recorded Linux browser profile through local CDP.
```

Choose the runtime before starting a browser:

- On Linux, read `${XDG_DATA_HOME:-$HOME/.local/share}/codex-browser-profiles/registry.json` and use `linux-browser-control`.
- For an existing QEMU Windows desktop, read `%LOCALAPPDATA%\\AgentVMBrowsers\\registry.json` inside the VM and use `vm-browser-control`.

These registries are separate. A Linux profile is not a Windows VM instance,
and a Windows VM profile is not a Linux host profile.

For a new browser, use desktop control during startup, then CDP for page work.
Return to desktop control for native dialogs. An independent process requires
its own persistent profile and debug port. An isolated browser context has
separate page state but shares its parent browser process.

Desktop input uses the VM's single system pointer and keyboard focus. Assign
one desktop operator at a time. Independent CDP pages can run concurrently
without using the system pointer, provided agents own separate pages and avoid
editing the same shared document at the same time.

Keep these directories as the source of truth. Expose the individual skill
directories through the consuming tool's skill discovery path when needed;
use links rather than maintaining duplicate copies. These skills do not
install Windows, change VM resources, or grant additional execution authority.
