# HTML Report Deck Review Checklist

Use after loading the v0.3 plan and generated deck. One failed required item
makes the result `fail`; one untestable required gate makes it `blocked`.

## Contract

- Plan schema and skill version are v0.3.
- Governing question, governing answer, audience decision, and reasoning mode
  are explicit.
- Claim graph, main sequence, concept ledger, and appendix map are available.
- No target, minimum, preferred, or requested page count exists.

## Structural Gate

- `validate_report_plan.py` exits successfully with no errors.
- `validate_report_deck.py` exits successfully with no errors.
- Every Claim reaches the governing answer without a cycle.
- Main-slide question IDs form one closed chain.
- Main slides precede all appendix slides.
- Every appendix slide names at least one supported main slide.
- Deck is fixed 1600 x 900, offline, placeholder-free, and structurally complete.

## Pyramid Gate

- Governing answer directly answers the governing question.
- Key-line Claims directly support the governing answer.
- Each child Claim answers the question raised by its parent.
- Sibling Claims are mutually distinct and collectively sufficient.
- Deductive groups follow premise, observation, and implication.
- Inductive groups use comparable statements under one plural noun.
- No Claim is included merely because evidence exists for it.

## Question-Chain Gate

- Slide 1 answers the governing question immediately.
- Every answer creates one natural outgoing question.
- Each outgoing question is exactly the next incoming question.
- Adjacent slides are necessary, not merely related.
- No transition relies on "next we discuss" or presenter narration.
- The final main slide closes on a decision, action, owner, or acceptance boundary.

## Storyline Tests

- Main titles alone reproduce the argument and requested decision.
- An informed outsider can summarize the deck from titles.
- Removing any main slide breaks the decision chain.
- Every new concept is required by the incoming question and introduced once.
- Main terminology remains stable after introduction.
- API, JSON, model, ownership, queue, OCR, and future-service detail stays in
  the appendix unless the current decision explicitly requires it.
- Appendix slides support but do not advance the main story.

## Evidence Gate

- Rendered Claim and support IDs match the plan.
- Evidence IDs map to inspected sources or explicit verification gaps in the plan.
- Visible evidence supports the conclusion rather than only its topic.
- Facts, inferences, recommendations, and unknowns remain distinguishable.
- Unknowns and verification gaps remain visible.
- Visible per-slide source notes are optional and are not an acceptance gate.

## Render Gate

- Every slide was rendered at 1600 x 900 and a scaled viewport.
- No title, body, footer, table, chart, diagram, or code clips or overlaps.
- Conclusion and primary evidence are understandable at a glance.
- Main and appendix hierarchy is visually clear without decorative noise.
- Text is readable and color is not the sole status indicator.

## Behavior Gate

- Previous, next, arrows, Page Up, Page Down, Space, Home, and End work.
- Overview lists every title, identifies the current slide, navigates, and
  returns focus logically.
- Fullscreen enters and exits when permissions allow.
- Print preview includes every 16:9 slide and excludes controls.
- Counter, hash, current slide, and boundary buttons stay synchronized.
- Controls have accessible names and visible focus.
- Browser console has no errors.

## Safety Gate

- No required remote dependency remains.
- No TODO, TBD, template token, sample content, or broken local reference remains.
- No secrets, credentials, private data, or raw sensitive logs appear.

## Result

- `pass`: every required gate passed.
- `fail`: review completed and at least one acceptance item failed.
- `blocked`: a required input or runtime check was unavailable.
