---
name: html-report-build
description: v0.2.0 - Builds a self-contained fixed 16:9 HTML report deck from an approved report plan. Use when a v0.2 report-deck plan has an action-title slide sequence and the user wants a browser-playable briefing. Use when the output must remain evidence-backed, offline-readable, keyboard-operable, and printable without adding new claims.
---

# HTML Report Deck Build

## Overview

Create a professional, self-reading HTML report deck from an approved
`html-report-plan` contract. Build translates the planned logic spine and slide
sequence into one fixed 1600 x 900 HTML presentation that scales to the browser,
supports keyboard navigation, and prints cleanly.

Build does not re-plan the argument. It preserves action titles, claim IDs,
evidence IDs, source notes, slide order, and the requested reader action.

## When to Use

- A v0.2 report-deck plan exists and its titles-only check passes.
- The user wants a static browser presentation rather than a long web document.
- The output must open locally, work offline, and support live or self-guided
  reading.
- The report needs stable evidence references and repeatable acceptance checks.

**When NOT to use:** before the logic spine and slide sequence exist, when new
investigation is still required, for dashboards or applications, or when the
user needs a native editable `.pptx` file.

## Fixed Defaults

- One self-contained `.html` file.
- Fixed 1600 x 900 slide canvas, scaled to fit without reflow.
- All planned evidence on the current slide is visible immediately.
- No transitions, staged reveals, narration, or decorative motion by default.
- No remote fonts, scripts, stylesheets, images, or chart libraries.
- Previous, next, overview, fullscreen, print, page counter, and keyboard
  navigation are included.

## The Build Process

### Step 1: Load the Plan

Read the conversation plan or `<report-name>.plan.yaml`. Confirm:

- `schema_version` is `"0.2"`
- report job, audience, and requested action
- `one_thing`, `ask`, `through_line`, and narrative pattern
- inspected evidence and unresolved verification gaps
- claims with stable IDs and evidence mappings
- ordered slides with questions, action titles, `so_what`, and transitions
- titles-only check passed
- output path and quality bar

If these fields are missing or inconsistent, stop and return to
`html-report-plan`. Do not repair the content contract while writing HTML.

### Step 2: Resolve the Output Path

Use the requested directory and filename. Create the directory when needed.
If only a directory is known, choose `<topic>-report-deck.html`.

Do not write outside the requested or clearly inferred directory. Do not
overwrite an unrelated file.

### Step 3: Compose One Slide at a Time

Use one direct child `<section class="slide">` per planned slide. Preserve the
planned order and use this minimum contract:

```html
<section
  class="slide"
  id="S1"
  data-claim-id="C1"
  data-evidence-ids="E1 E2"
>
  <header class="slide-header">
    <p class="slide-label">Executive summary</p>
    <h1>The evidence supports one immediate decision.</h1>
  </header>
  <div class="slide-body">
    <!-- One evidence object that supports the action title. -->
  </div>
  <footer class="slide-footer">
    <p class="source-note">Source: E1, E2</p>
    <p class="page-number" aria-hidden="true"></p>
  </footer>
</section>
```

For each slide:

- copy the approved action title; do not replace it with a topic label
- include one primary claim and only the support needed for it
- keep `data-claim-id` and `data-evidence-ids` aligned with the plan
- show the source note or a clear `Unverified` label
- make the planned `so_what` visible in the conclusion or recommendation
- prefer a direct table, comparison, chart, or diagram over decorative media
- move detailed support to appendix slides when the plan says to do so

Do not shrink text to rescue a slide that contains too much. Split or revise
the plan instead.

### Step 4: Use the Bundled Template

Use `assets/html-report-template.html` as the structural baseline. Replace:

- `{{REPORT_LANG}}` with the correct BCP 47 language tag
- `{{REPORT_TITLE}}` with the report title
- `{{REPORT_SLIDES}}` with the completed slide sections

Keep the template's fixed stage, scale-to-fit behavior, print CSS, semantic
buttons, overview dialog, keyboard navigation, and source/page footer.

Use the bundled layout classes when they fit the evidence:

- `layout-columns` or `layout-comparison`
- `layout-main-aside`
- `metric-row` and `metric`
- `evidence-panel`, `recommendation-panel`, and `unknown-panel`
- `claim-type fact|inference|recommendation|unknown`

Add report-specific CSS only when the planned evidence requires it. Do not add
a framework, theme system, component library, or remote dependency.

### Step 5: Preserve Report Semantics

- Use heading levels in order; each slide has one `h1` or `h2` action title.
- Keep facts, inferences, recommendations, and unknowns distinguishable by text
  labels, not color alone.
- Add `alt` text for informative images; use empty `alt` for decoration.
- Keep tables as semantic tables with headers.
- Keep code in `pre > code` and let it scroll inside its evidence region.
- Do not hide evidence behind hover, click, or staged reveal.
- Do not add visible instructions or keyboard-shortcut copy to the deck.

### Step 6: Run Deterministic Validation

Run:

```bash
python3 scripts/validate_report_deck.py <output.html>
```

Fix all errors. Review warnings individually. The validator checks the file
contract, unresolved placeholders, external dependencies, slide IDs, action
titles, claim/evidence mappings, source notes, and required deck controls.

### Step 7: Verify the Argument

Extract the rendered action titles in slide order and read them without bodies.
Confirm they still match the approved sequence and form the same argument.

Fail the build if HTML authoring changed the conclusion, introduced a logical
jump, or detached a slide from its planned claim.

### Step 8: Render and Inspect Every Slide

Open the generated file in a real browser and inspect every slide at the fixed
canvas and at a common scaled viewport such as 1366 x 768.

Check:

- no clipped, overlapping, or unreadably small text
- action title and primary evidence are visible in one glance
- source notes and page numbers do not collide with content
- tables, charts, diagrams, and code remain inside the safe area
- previous, next, overview, fullscreen, print, Home, End, and arrow keys work
- focus indicators are visible and controls have accessible names
- the browser console has no errors

Save screenshots when visual inspection is required by the environment or the
user. A source-only inspection is not enough for a `pass` handoff.

## Decision Points

- If the plan and source evidence disagree, stop and return to planning.
- If the action-title sequence fails after composition, revise the content
  contract before continuing.
- If a slide overflows, reduce or split content; do not reduce typography below
  the report's readable scale.
- If the report requires a complex interactive exploration, route to frontend
  work instead of expanding this static deck.
- If an asset cannot be embedded, ask before allowing a remote dependency.
- If browser rendering is unavailable, report visual verification as blocked;
  deterministic validation alone cannot produce a complete pass.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I can improve the title while building." | Action titles are approved content; changes belong in the plan. |
| "A smaller font will make it fit." | Overflow usually means the slide carries too much information. |
| "A CDN is harmless." | The default deliverable must remain usable offline. |
| "The evidence can appear after a click." | A self-reading report shows the support immediately. |
| "The HTML validator passed, so the deck is done." | Structural checks cannot see wrapping, overlap, or reading hierarchy. |

## Red Flags

- HTML is created without a v0.2 plan or a passing titles-only check.
- Slides use labels such as "Results" instead of conclusion sentences.
- `data-claim-id`, `data-evidence-ids`, or source notes are missing.
- A slide contains multiple unrelated conclusions.
- Remote assets or libraries are added without approval.
- Motion hides evidence or changes the meaning of a static slide.
- Build passes without rendering every slide.
- Generated HTML is edited instead of rebuilding from the approved plan.

## Verification

- [ ] A v0.2 report-deck plan was loaded.
- [ ] Output directory and filename were resolved.
- [ ] Fixed canvas, offline behavior, and navigation come from the template.
- [ ] Every slide preserves its action title, primary claim, evidence IDs,
      source note, and `so_what`.
- [ ] Titles-only sequence still forms the approved argument.
- [ ] `validate_report_deck.py` passes with no errors.
- [ ] Every slide was rendered and visually inspected.
- [ ] Controls and keyboard navigation work with visible focus.
- [ ] No unresolved placeholders, remote dependencies, secrets, or unsupported
      claims remain.

## Output Format

```text
## Report Deck Built
- path:
- slide_count:
- status:

## Source Plan
- one_thing:
- audience_action:
- titles_only_check:

## Verification
- structural_validator:
- rendered_viewports:
- slides_inspected:
- controls_checked:
- console_errors:
- sensitive_data_check:

## Gaps
- none | <gap>
```

## Guardrails

- Do not invent claims, evidence, command output, or source links.
- Do not rewrite the plan while building.
- Do not add compatibility output for the old long-document format.
- Do not add external assets, frameworks, or animation by default.
- Do not auto-commit the report.
- Do not put secrets, credentials, private data, or raw sensitive logs in the
  output.

## Assets and Scripts

- `assets/html-report-template.html`
  Fixed 1600 x 900 self-contained report-deck shell.
- `scripts/validate_report_deck.py`
  Deterministic structural and contract validator shared with review.
