# HTML Report Deck Review Checklist

Use this checklist after loading the v0.2 plan and generated deck. One failed
required item makes the result `fail`; one untestable required gate makes it
`blocked`.

## Contract

- Plan schema is `"0.2"`.
- `one_thing`, `ask`, `through_line`, audience action, and delivery mode are
  explicit.
- Approved slide order, action titles, claim IDs, and evidence IDs are known.
- Generated file is the artifact authorized by the plan.

## Structural Gate

- `validate_report_deck.py` exits successfully with no errors.
- HTML contains one fixed 1600 x 900 deck and at least one direct-child slide.
- Slide IDs are unique.
- Every slide has one action title, primary claim ID, evidence mapping, source
  note, and page-number target.
- No unresolved placeholders or required remote dependencies remain.
- No unapproved motion, staged reveal, framework, or theme selector exists.

## Logic Gate

- Titles alone state the main conclusion early.
- Every title is a short complete conclusion, not a topic label.
- Each title supports or advances the title before it.
- Subjects, pronouns, metrics, and comparisons have enough context.
- The sequence reaches the planned ask without an unstated logical jump.
- A reader unfamiliar with the source can summarize the argument from titles.
- Appendix slides follow the main argument and are labeled as support.

## Evidence Gate

- Every `data-claim-id` matches the planned primary claim.
- Every `data-evidence-ids` value maps to inspected evidence or a declared gap.
- Visible source notes match the mapped evidence IDs.
- The visible evidence supports the action title, not merely the slide topic.
- Facts, inferences, recommendations, and unknowns remain distinguishable in
  wording and labels.
- Recommendations include rationale and a visible implication or next action.
- Unknowns and verification gaps remain visible.

## Render Gate

- Every slide was rendered at 1600 x 900.
- Every slide was rendered in a scaled viewport such as 1366 x 768.
- No title, body, footer, table, chart, diagram, or code block clips or overlaps.
- Text is readable and long content stays inside its container.
- The conclusion and its primary evidence are understandable at a glance.
- Source note and page number stay visible without competing with content.
- Visual grouping reinforces the argument and does not add decoration.
- Color is not the sole indicator of claim type or status.

## Behavior Gate

- Previous and next controls move exactly one slide and stop at boundaries.
- Arrow, Page Up, Page Down, Space, Home, and End keys work.
- Overview lists every title, identifies the current slide, and navigates.
- Overview close returns keyboard focus to a logical control.
- Fullscreen enters and exits when browser permissions allow it.
- Print preview includes every slide at 16:9 and excludes controls.
- Slide counter, URL hash, and current slide remain synchronized.
- Controls have accessible names and visible focus indicators.
- Browser console has no errors.

## Safety Gate

- File works offline with no required remote fonts, scripts, styles, images, or
  chart libraries.
- No `TODO`, `TBD`, template token, or sample content remains.
- No secrets, credentials, private data, or raw sensitive logs appear.
- No broken local asset reference remains.

## Result

- `pass`: every required gate passed.
- `fail`: review completed and at least one acceptance item failed.
- `blocked`: a required input or runtime check was unavailable.
