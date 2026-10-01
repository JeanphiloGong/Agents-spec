---
name: vm-desktop-control
description: Inspect and operate an existing QEMU Windows VM desktop through screenshots and QMP keyboard/mouse input, without MCP. Use for Windows applications, browser startup, and native dialogs.
---

# VM Desktop Control

Use the existing VM's private QMP Unix socket. The bundled
`scripts/qmp_desktop.py` talks directly to QEMU using Python's standard library.
It does not require a guest agent, SSH, or a browser connection.

## Locate and Inspect

Read the VM launcher or its local documentation to confirm the target socket.
For the existing `windows11` setup, it is normally
`${XDG_RUNTIME_DIR:-/run/user/$(id -u)}/windows11/qmp.sock`.
Pass another path with `--socket` or `QMP_SOCKET`. Missing sockets mean the VM
must be located or started through its existing launcher; do not provision a
replacement or reset Windows as a recovery step.

Set `desktop` to this skill's `scripts/qmp_desktop.py`:

```bash
python3 "$desktop" status
python3 "$desktop" screenshot /tmp/vm-before.png
```

Open the resulting image with the available local image viewer. The screenshot
command reports its actual pixel dimensions. Use those dimensions for input,
even when the viewer scales the image or a browser viewport is a different size.

## Observe, Act, Verify

Assign one desktop operator for the whole interaction, including confirmation
screens. All QMP clients and human VNC viewers share one pointer and keyboard
focus. Sending atomic commands from two agents does not isolate their workflows.

1. Inspect a fresh screenshot and identify the active window, input focus, and
   target. Choose a small action whose result can be checked.
2. Send the action using the commands below. Coordinates must be measured on
   the current screenshot; QMP absolute positions are scaled to `0..32767`.
3. Capture and inspect another screenshot before deciding the next action.
   If focus or layout differs, reassess instead of repeating a blind sequence.

```bash
python3 "$desktop" key meta_l+r
printf '%s' 'notepad' | python3 "$desktop" type
python3 "$desktop" key ret
python3 "$desktop" click 538 535 1280 800
python3 "$desktop" click 538 535 1280 800 --button right
python3 "$desktop" move 640 400 1280 800
python3 "$desktop" drag 300 300 500 400 1280 800
python3 "$desktop" scroll down 3
python3 "$desktop" key ctrl+c
```

The numbers above are syntax examples, not coordinates to reuse. Key names are
QEMU qcodes: `meta_l`, `ctrl`, `shift`, `alt`, `ret`, `esc`, `tab`, `spc`,
`backspace`, and `f1` through `f12`, for example.

## Text Input and Windows IME

`type` sends US-layout ASCII keystrokes, not clipboard text. It validates the
entire input before sending keys. A newline sends Enter and can execute a
command: use `printf '%s'` or a file without a trailing newline when typing a
command for inspection. `--text-file` avoids shell quoting for longer text.

Before a long command, inspect the input language and test a short harmless
string containing a space and digits in the intended field, such as `echo 123`
in PowerShell. A bare word is insufficient. Recheck after focusing a new
application because input modes can differ between windows.
A Chinese IME can turn ASCII into candidates or
consume spaces. In the existing Windows setup, tapping `shift` switched the
Chinese IME to English mode; use the visible indicator to confirm. `meta_l+spc`
can select a different keyboard layout. Do not toggle blindly when already in
English mode. Clear the test, type the command, inspect it, then send `ret`.

For Unicode webpage text, use CDP `fill()` through the sibling
[vm-browser-control](../vm-browser-control/SKILL.md). For native application
Unicode input, use an available guest-side paste/file mechanism appropriate to
the task; do not transliterate or pretend the ASCII helper supports Unicode.

## Handoff and Limits

Use desktop control for application startup and native file pickers or system
dialogs. Once a browser is ready, use the sibling browser skill for isolated
page work. Human sign-in stays in the VM; do not extract credentials or copy
another profile's cookies.

Stop retrying input when fresh screenshots show no progress or an unexpected
dialog. Identify focus, IME, permissions, or disconnected display state first.
VM shutdown, reinstall, VNC reconfiguration, and resource changes are outside
this skill's ordinary desktop workflow.

Report the visible result and relevant screenshot, any blocked interaction,
and whether desktop control has been released. Keep screenshots outside
business repositories unless the user requests tracked artifacts.
