---
name: html-report-review
description: v0.2.0 - Reviews a fixed 16:9 HTML report deck for argument clarity, evidence traceability, rendered readability, and presentation controls. Use when a browser-playable report deck must be accepted before sharing. Use when a polished deck may still have topic-label titles, logical gaps, unsupported claims, overflow, or broken offline and keyboard behavior.
---

# HTML Report Deck Review

## Overview

Review a generated HTML report deck against the v0.2 plan that authorized it.
Acceptance is based on whether a decision-maker can understand the argument,
inspect its evidence, and use the artifact reliably. Visual polish alone does
not earn a pass.

Review reports findings and next actions. It does not rewrite the plan or HTML
unless the user explicitly asks for repair.

## When to Use

- A report deck has been built and needs acceptance before sharing.
- A self-reading briefing must remain understandable without a presenter.
- Claim-to-evidence traceability or source labeling needs verification.
- The fixed canvas, keyboard controls, overview, fullscreen, or print behavior
  needs browser validation.
- A deck looks professional but may still contain logical jumps, overflow, or
  unsupported conclusions.

**When NOT to use:** before the HTML deck exists, for long-form web documents,
for native `.pptx` review, for general code review, or when the user has asked
to repair the artifact rather than assess it.

## Required Inputs

- the v0.2 report-deck plan
- the generated `.html` file
- referenced evidence that is available locally or in the current context
- the intended reader, decision, and delivery mode

If the plan is missing, structural and rendered checks may continue, but the
result is `blocked` because argument and evidence adherence cannot be accepted.

## The Review Process

### Step 1: Establish the Review Contract

Read the plan and HTML. Record:

- report path and plan path or conversation source
- `one_thing`, `ask`, `through_line`, and audience action
- approved slide order and action titles
- claim IDs, evidence IDs, source gaps, and explicit unknowns
- delivery mode and quality bar

Do not infer a missing claim or silently substitute a different audience need.

### Step 2: Run Deterministic Validation

Run the builder's validator:

```bash
python3 ../html-report-build/scripts/validate_report_deck.py <report.html>
```

All structural errors are blocking. Review warnings against the plan instead
of dismissing them. Also scan for secrets, credentials, private data, and raw
sensitive logs without repeating any discovered value.

### Step 3: Test the Argument Without Layout

Extract action titles in slide order and read only those titles.

Fail the logic gate when:

- the main conclusion is delayed or absent
- a title is a topic label rather than a complete conclusion
- two adjacent titles require an unstated inference
- a pronoun, metric, or comparison lacks context
- the sequence does not reach the requested decision or action
- appendix slides interrupt the main argument

Then apply the stranger test: a smart reader unfamiliar with the source should
be able to summarize the argument from the titles alone.

### Step 4: Check Claim and Evidence Traceability

For every slide:

- match `data-claim-id` to the planned primary claim
- match `data-evidence-ids` and the visible source note to the plan
- confirm the evidence object actually supports the action title
- confirm facts, inferences, recommendations, and unknowns are labeled or
  phrased distinctly
- confirm `so_what` is visible as an implication, decision, or next action

Fail when a major claim lacks inspected evidence, an inference is presented as
fact, or a source note names evidence that is not represented on the slide.

### Step 5: Inspect Every Slide in a Browser

Render every slide at the native 1600 x 900 canvas and at a common scaled
viewport such as 1366 x 768. Inspect screenshots or the live browser, not only
the source.

For each slide check:

- action title, evidence, implication, source note, and page number are visible
- no text, table, chart, code, or diagram is clipped or overlaps another item
- the primary conclusion and supporting evidence can be understood at a glance
- typography remains readable and long words stay inside their containers
- visual grouping expresses the argument rather than creating decoration
- facts, inferences, recommendations, and unknowns are not distinguished by
  color alone

Fail if any main slide has overflow, overlap, unreadably small text, or an
unclear evidence hierarchy. Detailed support may be dense only when it is in a
clearly labeled appendix and remains readable.

### Step 6: Exercise Presentation Behavior

Verify in a real browser:

- previous and next buttons
- Left, Right, Page Up, Page Down, Space, Home, and End keys
- overview opens, lists every slide, navigates correctly, and returns focus
- fullscreen enters and exits when the browser permits it
- print preview includes every slide at 16:9 without controls
- current slide, counter, hash, and disabled boundary buttons stay aligned
- all controls have accessible names and visible keyboard focus
- browser console contains no errors

Report a browser permission limitation separately from an implementation
failure. Do not claim a behavior passed when it could not be exercised.

### Step 7: Decide the Result

Use exactly one result:

- `pass`: plan, argument, evidence, structure, rendering, controls, safety, and
  offline behavior all pass.
- `fail`: the review ran and found at least one fixable acceptance failure.
- `blocked`: a required plan, evidence source, file, or browser capability is
  unavailable, so acceptance cannot be determined.

A structural validator pass is necessary but never sufficient. A deck cannot
pass without every slide being rendered and inspected.

## Decision Points

- If the plan and deck disagree, fail plan adherence; do not choose the better
  wording during review.
- If the titles-only sequence fails, report the first logical break and the
  smallest content-contract revision needed.
- If evidence is unavailable, mark the affected gate `blocked`; do not treat a
  citation label as proof.
- If one slide overflows, fail the rendered gate even when other slides pass.
- If sensitive content appears, fail safety and identify only its location and
  category.
- If the deck is sound but HTML PPT is the wrong requested artifact, state the
  mismatch without rewriting it into another format.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The validator passed." | Structural checks cannot see logical jumps, overlap, or reading hierarchy. |
| "The slides look consistent." | Consistency cannot replace evidence or a coherent argument. |
| "The presenter can explain the gap." | The default deck must support independent reading. |
| "A source note proves the claim." | Review must verify that the cited evidence supports the conclusion. |
| "Only one slide clips slightly." | Every slide is part of the deliverable and must remain readable. |
| "I can fix the wording while reviewing." | Review identifies failures; plan or build owns the repair. |

## Red Flags

- Review begins without identifying `one_thing`, `ask`, and audience action.
- Titles are checked individually but never read as one sequence.
- Evidence IDs are present but their support relationship is not inspected.
- Only the first slide or current viewport is rendered.
- Screenshots are accepted without testing navigation and print behavior.
- Design polish is discussed before blocking logic or evidence failures.
- A pass is issued despite a missing plan, missing evidence, or unavailable
  rendered inspection.
- The reviewer edits the artifact without explicit repair authorization.

## Verification

- [ ] The v0.2 plan and generated HTML were loaded.
- [ ] `one_thing`, `ask`, audience action, and approved titles were recorded.
- [ ] Deterministic validation completed with no errors.
- [ ] Titles-only and stranger tests passed.
- [ ] Every slide's primary claim, evidence IDs, source note, and `so_what`
      match the plan.
- [ ] Every slide was rendered at 1600 x 900 and a scaled viewport.
- [ ] No clipping, overlap, unreadable text, or unclear evidence hierarchy was
      found.
- [ ] Navigation, overview, fullscreen, print, focus, and console were checked.
- [ ] Offline dependencies, placeholders, and sensitive data were checked.
- [ ] Result is exactly `pass`, `fail`, or `blocked` and follows gate status.

## Output Format

```text
## Review Result
- result: pass | fail | blocked
- report:
- plan:
- slide_count:

## Blocking Findings
- none | <severity, slide, evidence, required correction>

## Logic Gate
- titles_only:
- stranger_test:
- first_break:

## Evidence Gate
- claim_mapping:
- unsupported_or_mislabeled:

## Render Gate
- viewports:
- slides_inspected:
- overflow_or_overlap:

## Behavior Gate
- navigation:
- overview:
- fullscreen:
- print:
- accessibility:
- console:

## Safety Gate
- external_dependencies:
- placeholders:
- sensitive_data:

## Next Actions
- none | <ordered corrections>
```

## Guardrails

- Do not rewrite the plan or HTML unless the user explicitly asks for repair.
- Do not invent, reinterpret, or strengthen evidence to make a claim pass.
- Do not expose secrets or private data found during review.
- Do not accept a deck from source inspection alone.
- Do not lower the quality bar for an appendix unless readability is preserved.
- Do not mark `pass` when any required gate is failed or blocked.

## References

- `references/review-checklist.md`
  Gate-by-gate acceptance checklist for v0.2 HTML report decks.
