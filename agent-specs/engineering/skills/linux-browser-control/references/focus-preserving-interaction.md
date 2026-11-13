# Focus-Preserving Interaction

## Evidence and Limits

The 2026-11-04 comparison on Linux X11, Chrome 154.0.8037.97 and native
agent-browser 0.41.2 verified background target creation, target prebinding,
snapshot, navigation, eval with DOM input/events, waiting and disconnect
without X11 active-window or stacking changes. X research screenshot succeeded;
a local fixture's default screenshot timed out. This is scoped evidence, not a
guarantee for every page or action. The replacement controller must be tested
with its Node coordination cost included.

Use a background tab in an existing window by default and reuse the task page
for sequential work. The optional `newWindow: true` requests a separate window
for a newly created temporary page when a concrete task requires it, still with
CDP `background: true`. The comparison above did not establish focus or stacking
behavior for this option: the window may cover other windows or change focus.
Record both transitions during creation and each action, and report unverified
behavior.
The option does not guarantee that a particular page renders or enable trusted
input, tab switching, or native dialogs through the command surface.

Historical Playwright/Figma observations showed that injected mouse input can
activate Chrome or a modal file chooser. Chromium's
[input handler](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/content/browser/devtools/protocol/input_handler.cc)
focuses the native widget for injected mouse, keyboard, wheel and touch input.
Native agent-browser also uses those CDP methods for its normal click/key
commands. A Rust implementation does not remove that behavior.

Native tab switching calls `Page.bringToFront`; stalled-renderer recovery can
call `Target.activateTarget`. The connection exposes no tab-switch/input API,
but internal recovery remains a limitation. Stop on stalls or identified
unintended automation activation and investigate. Arrange an agreed foreground
step if recovery needs one; do not repeatedly retry or bypass the connection
using bare native commands.

Synthetic DOM events have `isTrusted === false`. Pages can reject them;
clipboard, native dialogs and canvas gestures require target-specific checks.
Neither `document.hasFocus()` nor emulated focus proves desktop focus ownership.

## Interaction Recipes

Inspect the current target before writing JavaScript. Use only controller-
authored selectors and values, and verify application state after each action.
The connection's `command()` returns native `data`; eval values are in `result`.

```javascript
const { result: control } = await connection.command(["eval", `({
  exists: !!document.querySelector('[data-testid="filename"]'),
  label: document.querySelector('[data-testid="filename"]')?.textContent
})`]);
// Continue only after checking this is the intended control.
await connection.command(["eval", `
  document.querySelector('[data-testid="filename"]')
    .dispatchEvent(new MouseEvent('click', { bubbles: true }));
`]);
await connection.command(["wait", "#filename"]);
```

For a previously inspected input, use the native setter and notify handlers:

```javascript
const value = "Noto Sans SC";
await connection.command(["eval", `(() => {
  const input = document.querySelector('input[placeholder="Search fonts"]');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
    .set.call(input, ${JSON.stringify(value)});
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return input.value;
})()`]);
// Wait for the actual application's expected option/result, then inspect it.
```

Figma historically accepted an SVG through a page-local paste event. Reverify
on the current document and native runtime before relying on it:

```javascript
const payload = { x: 1000, y: 500, svgString: taskSvg };
await connection.command(["eval", `(() => {
  const { x, y, svgString } = ${JSON.stringify(payload)};
  const target = document.elementFromPoint(x, y);
  const data = new DataTransfer();
  data.setData('text/plain', svgString);
  target.dispatchEvent(new ClipboardEvent('paste', {
    bubbles: true, cancelable: true, clipboardData: data
  }));
})()`]);
```

Coordinates must come from the current owned-page inspection. This operation
does not read/write the system clipboard. Verify the imported layers and
rendering; do not assume dispatch means success. No native click/press fallback
or headless substitution is authorized by these recipes.

## Desktop Verification

Observe X11 active-window and stacking transitions before and throughout a new
method, not only the final state:

```bash
xprop -root _NET_ACTIVE_WINDOW _NET_CLIENT_LIST_STACKING
xprop -spy -root _NET_ACTIVE_WINDOW _NET_CLIENT_LIST_STACKING
# Use an observed ID to identify a suspected modal window.
xprop -id 0xWINDOW WM_CLASS WM_TRANSIENT_FOR _NET_WM_WINDOW_TYPE
```

Record IDs/classes, not unrelated window contents. Stop the observer after the
verification interval. A page screenshot excludes native dialogs; inspect
window relationships when necessary. On Wayland, use a supported desktop
observer or report unverified focus. X11 transitions alone do not identify their
cause: record what changed without attributing it to automation or the user.
Normal user window switching does not interrupt background work. If evidence
shows automation unexpectedly activated a window, stop input and investigate
the action and modal state. Stop as well if the page is unresponsive or a
trusted foreground operation is needed; arrange an agreed step before that
operation. Do not automatically activate a window or force focus back.
