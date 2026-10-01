# Virtual Machine Workflow

These skills let an agent work in an existing QEMU Windows desktop and create
its own browser inside that VM. Local scripts send QMP or CDP commands; the
applications, page rendering, and browser profiles remain in Windows. MCP is
not required.

| Skill | Use when |
| --- | --- |
| [`vm-desktop-control`](vm-desktop-control/SKILL.md) | Inspect screenshots and operate Windows applications, keyboard, mouse, and native dialogs through QMP. |
| [`vm-browser-control`](vm-browser-control/SKILL.md) | Launch a separate Edge process through the desktop, then control its pages through CDP. |

```text
$vm-desktop-control Inspect the Windows VM desktop and open an application.
$vm-browser-control Create a new browser inside the Windows VM and work there.
```

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
