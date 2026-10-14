# Focus-Preserving Interaction

- [Evidence and Limits](#evidence-and-limits)
- [Interaction Recipes](#interaction-recipes)
- [Desktop Verification](#desktop-verification)

## Evidence and Limits

Verified on 2026-10-14 with Ubuntu GNOME on X11, Chrome 154.0.8037.97,
Playwright 1.64.0, and a visible Figma document attached through this skill:

- Connect, inspect, screenshot, and disconnect left desktop focus unchanged.
- `page.mouse.click()` activated Chrome without a `Page.bringToFront` command.
  An open GNOME file chooser was activated instead while it was modal; closing
  the chooser did not prevent an ordinary canvas click from activating Chrome.
- DOM click/input events and an SVG `ClipboardEvent` paste changed visible
  Figma state without changing the X11 active window or stacking order.

Chromium's [input handler](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/content/browser/devtools/protocol/input_handler.cc)
calls `widget_host_->Focus()` in mouse, keyboard, wheel, and touch injection.
Playwright routes its normal mouse and keyboard actions through those CDP
methods. Avoiding an explicit `bringToFront()` is therefore insufficient.
`Emulation.setFocusEmulationEnabled` and `document.hasFocus()` describe emulated
page focus, not ownership of desktop input focus; disabling defaults is not a
verified fix for input-driven activation.

Synthetic events have `isTrusted === false`. Some controls, canvas tools,
clipboard APIs, and native dialogs require trusted input or user activation.
The observations above do not guarantee that every page or browser version
accepts these methods. Verify each method on the current target.

## Interaction Recipes

Acquire the normal profile/document lease and reuse the visible page. Inspect
the target control first. Use direct page operations, not a new wrapper or
changes to application handlers. Confirm the resulting UI state after each
action, using a locator assertion or screenshot as appropriate.

For an inspected DOM control, dispatch its event instead of `locator.click()`:

```javascript
await page.locator('[data-testid="filename"]').dispatchEvent('click');
await page.locator('#filename').waitFor({ state: 'visible' });
```

For a text input, use the native value setter and notify the page's handlers
instead of `fill()`, `type()`, or keyboard input. This pattern was accepted by
Figma's font search. Check both the value and the application response:

```javascript
await page.locator('input[placeholder="Search fonts"]:visible').evaluate(input => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
    .set.call(input, 'Noto Sans SC');
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.getByRole('option', { name: 'Noto Sans SC', exact: true })
  .waitFor({ state: 'visible' });
```

Figma accepted SVG pasted through a page-local clipboard event. Use only the
task's own SVG content and a freshly inspected canvas target; this does not
read or modify the system clipboard and avoids opening a native file chooser:

```javascript
// These coordinates must come from the current page inspection.
await page.evaluate(({ x, y, svgString }) => {
  const target = document.elementFromPoint(x, y);
  const data = new DataTransfer();
  data.setData('text/plain', svgString);
  target.dispatchEvent(new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    clipboardData: data,
  }));
}, { x: 1000, y: 500, svgString });
```

Verify imported layers and rendering. Do not assume dispatching paste means
import succeeded. Synthetic keyboard/pointer events also need target-specific
verification; do not assume canvas dragging or shortcuts work this way.

## Desktop Verification

On X11, record these properties before and after an action. Monitor transitions
as well: a final snapshot can miss a brief activation followed by restoration.
Record only IDs and window classes, not unrelated window titles or contents.

```bash
xprop -root _NET_ACTIVE_WINDOW _NET_CLIENT_LIST_STACKING
xprop -spy -root _NET_ACTIVE_WINDOW _NET_CLIENT_LIST_STACKING
# Substitute an observed ID when identifying a suspected modal window.
xprop -id 0xWINDOW WM_CLASS WM_TRANSIENT_FOR _NET_WM_WINDOW_TYPE
```

Run the observer only for the verification interval and stop it afterward.
Page screenshots exclude native file dialogs; inspect window relationships
when a dialog may be involved. For Wayland, use a supported desktop observer
if available; report unverified desktop focus rather than using X11 results
or page focus as proof.

If an action steals focus or the page rejects a synthetic event, stop that
input method. Use a user-performed gesture or an already-agreed foreground
step for the specific unsupported action. Do not silently use trusted CDP
input, switch to headless work, alter desktop focus policy, or repeatedly
restore focus after raising Chrome. Close only dialogs created by this task;
preserve the user's browser and profile.
