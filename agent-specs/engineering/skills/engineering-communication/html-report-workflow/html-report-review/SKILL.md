---
name: html-report-review
description: v0.3.1 - Reviews a fixed 16:9 HTML report deck against its Minto argument pyramid, reader-question chain, concept order, and appendix boundary. Use when individually plausible slides may still jump between unrelated concepts. Use when a browser-playable report must prove narrative necessity, evidence traceability, rendered readability, and presentation behavior before sharing.
---

# HTML Report Deck Review

## Overview

Review a generated HTML report deck against the v0.3 plan that authorized it.
Judge the deck on two independent logic dimensions:

- pyramid logic: every claim supports a parent and eventually supports the
  governing answer
- storyline logic: each main slide answers the reader's current question and
  creates the exact question answered next

Visual polish and individually correct slides do not earn a pass. Review
reports the first narrative break and the smallest plan-level correction. It
does not rewrite the plan or HTML unless the user explicitly asks for repair.

## When to Use

- A v0.3 HTML report deck needs acceptance before sharing.
- A deck feels jumpy because each page introduces a new service, model, method,
  or future capability.
- Main-story and appendix boundaries need verification.
- Claim-to-evidence or claim-to-claim support needs inspection.
- Fixed-canvas rendering, controls, fullscreen, or print needs browser testing.

**When NOT to use:** before the plan and HTML exist, for native `.pptx`, for
long-form documents, for general code review, or when the user has already
asked for direct repair rather than assessment.

## Required Inputs

- v0.3 report-deck plan
- generated `.html` deck
- referenced evidence available locally or in the current context
- intended reader, governing question, audience decision, and delivery mode

If the plan is missing or invalid, structural HTML checks may continue, but
the result is `blocked`; a deck cannot establish its own authorization contract.

## The Review Process

### Step 1: Establish the Contract

Record:

- report and plan paths
- governing question and governing answer Claim
- audience decision
- reasoning mode and key-line Claims
- main slide sequence and appendix map
- concept ledger and source gaps

Do not infer a missing relationship or choose a more convenient audience need.

### Step 2: Run Both Deterministic Validators

Run:

```bash
python3 ../html-report-build/scripts/validate_report_plan.py <report.plan.yaml>
python3 ../html-report-build/scripts/validate_report_deck.py <report.html>
```

All errors are blocking. These validators establish the mechanical contract:
IDs, Claim graph reachability, exact question handoffs, concept introduction
references, main/appendix order, page-count prohibition, offline structure,
and controls. They do not prove that an argument is persuasive or sufficient.

### Step 3: Review the Argument Pyramid

Start at the governing answer and inspect downward.

For each parent Claim ask:

- Does each child answer the question raised by the parent?
- Are sibling Claims mutually distinct rather than restatements?
- Are they collectively sufficient at the decision's required depth?
- If deductive, do premise and observation actually produce the implication?
- If inductive, are the statements comparable under one plural noun?
- Does every Claim belong to the governing answer rather than merely having
  evidence?

Fail on the first unsupported parent-child relationship, missing key-line
reason, mixed abstraction level, or interesting-but-irrelevant Claim.

### Step 4: Review the Reader-Question Chain

Read each main slide as:

```text
question_in -> action-title answer -> question_out
```

Check:

- Slide 1 answers the governing question immediately.
- Each answer makes its outgoing question the single natural next question.
- The next slide answers that exact question without changing subject.
- A transition is causal or evidential, not "next we discuss".
- The final main slide closes on a decision, action, owner, or acceptance
  boundary and does not leave a new central question open.

Report the first pair where the next slide is relevant but not necessary. That
distinction is the most common source of a deck that reads like a topic list.

### Step 5: Run the Storyline Tests

Run all tests on main slides:

1. **Titles-only test**: titles alone reproduce the governing answer, necessary
   reasons, and requested decision.
2. **Stranger test**: an informed outsider can summarize the argument without
   slide bodies or presenter narration.
3. **Deletion test**: remove each main slide; if the decision chain still
   works, the slide is removable and the deck fails.
4. **Concept-continuity test**: each new concept is required by the incoming
   question, introduced once, and reused consistently afterward.
5. **Appendix-separation test**: APIs, JSON, models, ownership tables, queues,
   OCR flows, and future service contracts stay out of the main story unless
   they are themselves required for the audience decision.
6. **Decision-closure test**: the last main slide makes the requested action
   operational rather than adding another design topic.

Do not reduce these tests to boolean fields from the plan. Reperform them on
the rendered titles and content.

### Step 6: Check Evidence and Claim Labels

For every slide:

- match the rendered Claim and support IDs to the plan
- match evidence IDs to the plan's inspected sources or verification gaps
- confirm the evidence supports the action title, not merely the topic
- distinguish fact, inference, recommendation, and unknown in wording
- keep unknowns and verification gaps visible

A citation label is not proof. Fail unsupported major Claims and inferences
presented as facts. Visible source notes are optional; their absence is not a
failure when the evidence metadata maps back to the plan.

### Step 7: Inspect Every Slide in a Browser

Render every slide at 1600 x 900 and at a scaled viewport such as 1366 x 768.

Check:

- no clipping, overlap, or unreadably small text
- title, evidence, implication, and page number are visible
- main slides emphasize the decision chain
- appendix slides remain readable but do not visually impersonate new main
  conclusions
- long words and dense objects stay inside their containers
- color is not the sole status indicator

One overflowing slide fails the rendered gate.

### Step 8: Exercise Presentation Behavior

Verify:

- previous and next controls
- Left, Right, Page Up, Page Down, Space, Home, and End
- overview count, current state, navigation, close, and focus return
- fullscreen enter and exit when permissions allow
- print preview includes every 16:9 slide and excludes controls
- counter, hash, active slide, and disabled boundaries remain aligned
- controls have accessible names and visible focus
- browser console contains no errors

Report a browser limitation separately from an implementation failure.

### Step 9: Decide the Result

Use exactly one result:

- `pass`: plan contract, pyramid, question chain, storyline tests, evidence,
  rendering, behavior, offline use, and safety all pass.
- `fail`: review completed and found at least one fixable acceptance failure.
- `blocked`: a required plan, source, file, or runtime capability is missing.

Structural validation is necessary but never sufficient. A deck cannot pass
when one main slide is removable or one new concept is unlicensed.

## Decision Points

- If the Claim graph is structurally valid but semantically weak, fail the
  first parent-child relationship that does not answer a real reader question.
- If two adjacent slides are merely related, fail the handoff and name the
  question that would make the next slide necessary.
- If a technical slide is useful but removable, move it to an appendix and
  link it to the main slide it supports.
- If a requested page count caused padding, fail scope discipline and derive
  the sequence again from indispensable Claims.
- If sensitive content appears, fail safety and report only its location and
  category.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Every title is a conclusion." | Unrelated conclusions still produce a jumpy deck. |
| "The next slide is relevant." | Main-story slides must be necessary, not merely relevant. |
| "The transition explains the jump." | The previous answer must create the next incoming question. |
| "The API slide proves feasibility." | Put it in the appendix unless the current decision depends on API shape. |
| "The plan says the deletion test passed." | Review must actually remove each main title and retest the chain. |
| "Twelve pages were requested." | Page count cannot authorize new Claims or concepts. |
| "The validator passed." | A structural graph can still contain weak reasoning. |

## Red Flags

- Review starts from visuals instead of the governing question.
- Claims have evidence but no necessary relationship to their parent.
- `question_out` is a disguised agenda label.
- A main slide can be deleted without changing the decision.
- New services, interfaces, data models, queues, OCR, or future capabilities
  appear before a reader question requires them.
- Appendix details are needed to understand the main argument.
- A pass is issued from plan booleans without repeating semantic tests.
- The reviewer rewrites the artifact without repair authorization.

## Verification

- [ ] The v0.3 plan and HTML were loaded.
- [ ] Both deterministic validators passed.
- [ ] Governing answer, key line, and all Claim support relationships were reviewed.
- [ ] Every main question handoff is exact and semantically necessary.
- [ ] Titles-only and stranger tests passed on rendered content.
- [ ] Every main slide proved indispensable under the deletion test.
- [ ] Every new main-story concept is licensed by an incoming question.
- [ ] Appendix slides follow and point back to the main story.
- [ ] The final main slide closes on the audience decision.
- [ ] Evidence IDs, source mapping, inference labels, and unknowns were checked.
- [ ] Every slide was rendered at native and scaled viewports.
- [ ] Navigation, overview, fullscreen, print, focus, and console were checked.
- [ ] Placeholders, remote dependencies, and sensitive data were checked.
- [ ] Result is exactly `pass`, `fail`, or `blocked`.

## Output Format

```text
## Review Result
- result: pass | fail | blocked
- report:
- plan:
- main_slides:
- appendix_slides:

## Blocking Findings
- none | <gate, first break, evidence, required correction>

## Pyramid Gate
- governing_answer:
- key_line:
- first_weak_support_relationship:

## Question-Chain Gate
- first_handoff_break:
- necessity:
- final_closure:

## Storyline Tests
- titles_only:
- stranger_test:
- deletion_test:
- concept_continuity:
- appendix_separation:

## Evidence Gate
- unsupported_or_mislabeled:
- source_mapping:

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
- none | <ordered plan-level corrections>
```

## Guardrails

- Do not rewrite the plan or HTML unless explicitly asked for repair.
- Do not invent, reinterpret, or strengthen evidence.
- Do not treat structural validity as semantic validity.
- Do not accept a main slide that is merely relevant or removable.
- Do not require visible per-slide source notes when evidence IDs remain
  traceable through the plan.
- Do not expose secrets or private data found during review.
- Do not mark `pass` when any required gate fails or is blocked.

## References

- `references/review-checklist.md`
  Gate-by-gate v0.3 Minto-pyramid and storyline acceptance checklist.
