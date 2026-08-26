---
name: html-report-plan
description: v0.2.0 - Plans evidence-backed, self-reading HTML report decks before slide authoring. Use when analysis, investigation, comparison, or implementation guidance should become a fixed 16:9 browser presentation. Use when a professional report needs an action-title narrative, claim-to-evidence traceability, and a build-ready slide contract.
---

# HTML Report Deck Plan

## Overview

Plan a professional HTML report deck before generating slides. The default
artifact is a fixed 16:9, self-reading presentation: a reader should understand
the argument by scanning the slide titles, then inspect evidence on the slides
that support each conclusion.

The output is a report-deck plan, not HTML. Use `html-report-build` only after
the logic spine, evidence mapping, and page-by-page sequence are clear enough to
execute without inventing content during build.

## When to Use

- The user wants a report, briefing, review, diagnosis, comparison, proposal,
  or technical recommendation in browser-playable PPT form.
- The source material contains multiple findings that must become a concise,
  decision-oriented slide sequence.
- A previous report was factually correct but read like a long web document or
  a collection of topic labels.
- The final artifact must work for live presentation and independent reading.

**When NOT to use:** long-form reading documents, released project docs,
marketing pages, dashboards, interactive applications, or native `.pptx`
files. Route those to documentation, frontend, or PowerPoint-specific skills.

## Fixed Defaults

- Artifact: one self-contained HTML report deck.
- Canvas: fixed 1600 x 900, scaled to fit the browser without content reflow.
- Reading mode: self-reading first; live presentation is supported.
- Motion: none by default; all evidence on the current slide is visible at
  once.
- Narrative: answer first, then evidence, implications, risks, and action.
- Slide contract: one primary conclusion per slide.

## The Planning Process

### Step 1: Define the Report Job

Identify:

- report topic and target reader
- decision, understanding, or action the deck should support
- delivery mode: self-read, live, or both
- target output directory and filename when supplied
- language, tone, and any brand constraints

If the user only gives a directory, infer a filename from the topic. Ask only
when the report subject or intended decision is unclear.

### Step 2: Gather Source Context

List evidence inputs with stable IDs such as `E1`, `E2`, and `E3`:

- local files and exact locations
- command outputs
- inspected screenshots, diagrams, traces, or logs
- previous analysis that can be verified
- external sources only when browsing was requested or required

Separate inspected evidence from sources that still need verification. Do not
invent a source or promote an unverified statement to fact.

### Step 3: Set the Logic Spine

Write three binding fields:

- `one_thing`: the single conclusion the reader should remember
- `ask`: the decision or action requested from the reader
- `through_line`: the reasoning path that connects evidence to the conclusion

Choose the simplest narrative pattern that fits:

- `answer-support-action`: executive briefings and recommendations
- `situation-diagnosis-resolution`: diagnoses, incidents, and change proposals
- `finding-evidence-implication`: research, analytics, and technical reports

Use chronological order only when sequence itself explains the conclusion.
Do not force a named framework when a direct argument is clearer.

### Step 4: Define Claims and Evidence

Give every major claim a stable ID such as `C1` and classify it as:

- `fact`: directly supported by inspected evidence
- `inference`: reasoned conclusion based on facts
- `recommendation`: proposed action with rationale
- `unknown`: unresolved assumption or source gap

Map claims to evidence IDs. A recommendation may be supported by facts and
inferences, but its rationale must still be explicit. Unknowns remain visible;
they are not filler to remove for polish.

### Step 5: Build the Slide Sequence

For every slide define:

- `id` and `role` in the argument
- `question` the slide answers
- `action_title`: one short complete sentence that states the conclusion
- `primary_claim_id` and supporting `evidence_ids`
- `content_points`: only the information needed to support the title
- `visual_role`: chart, table, comparison, diagram, or text summary
- `so_what`: why the conclusion matters to this reader
- `transition`: how this conclusion creates the need for the next slide
- `source_note`: visible source wording for the slide

Do not use label titles such as "Current State", "Analysis", or "Results".
The title must tell the reader what the slide means.

### Step 6: Run the Titles-Only Test

Read every action title in order without the slide bodies.

The sequence passes only when:

- it states the report conclusion early
- each title advances or supports the previous title
- new subjects and pronouns have clear antecedents
- the sequence reaches the requested action without a logical jump
- a smart reader unfamiliar with the source can understand the argument

If the titles read like a table of contents, rewrite the slide sequence before
build.

### Step 7: Define Deck Organization

Specify:

- fixed canvas and scale-to-fit behavior
- opening slide: subject, context, and main conclusion
- reading path and section rhythm
- evidence placement and source-note format
- navigation: previous, next, overview, fullscreen, and print
- density rules for tables, code, diagrams, and appendices
- which detailed evidence belongs in appendix slides

The plan owns the argument and page order. Build owns HTML implementation, not
content strategy.

### Step 8: Define the Quality Bar

Acceptance criteria for the final HTML must include:

- opens locally as a self-contained file with no required remote assets
- fixed 1600 x 900 slides scale without content reflow
- one primary conclusion and one action title per slide
- titles-only sequence forms a coherent argument
- every major claim maps to inspected evidence or is labeled
- facts, inferences, recommendations, and unknowns are distinguishable
- keyboard navigation, overview, fullscreen, and print work
- every slide is rendered and visually inspected before acceptance
- no secrets, credentials, private data, placeholders, or unsupported claims

### Step 9: Produce or Persist the Plan

Write the plan using `references/report-plan-template.yaml` or the same fields
in readable Markdown. If the user gave a target directory, write
`<report-name>.plan.yaml` there. If no target directory is known, output the
complete plan in the conversation. Do not create HTML in this skill.

## Decision Points

- If the report decision is unclear, ask for the intended reader action.
- If evidence is insufficient, record a source gap instead of fabricating a
  conclusion.
- If source material supports fewer slides than requested, reduce the slide
  count rather than padding the deck.
- If detailed material cannot fit one conclusion, split it or move it to an
  appendix slide.
- If the user needs a long document, dashboard, or native PowerPoint file,
  route away from this workflow.
- If sensitive material appears, exclude or redact it in the plan.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The section names are clear enough." | Labels organize files; action titles communicate conclusions. |
| "The reader can connect the slides." | The title sequence must carry the argument without hidden inference. |
| "More slides will make it look complete." | Unsupported slides dilute the conclusion and reduce trust. |
| "Layout can solve a dense page." | A slide with two conclusions is a planning failure, not a CSS problem. |
| "Sources can be added at the end." | Claim-to-evidence mapping is part of the plan contract. |

## Red Flags

- No `one_thing`, `ask`, or `through_line` is defined.
- Slide titles are topics rather than conclusions.
- Slides have no stable claim and evidence IDs.
- A slide answers more than one primary question.
- Titles cannot be read as a coherent paragraph.
- Page count comes from a requested number rather than supported content.
- The plan leaves argument order or evidence placement for build time.

## Verification

- [ ] Report topic, reader, decision, and delivery mode are explicit.
- [ ] Evidence sources have stable IDs and inspection status.
- [ ] `one_thing`, `ask`, `through_line`, and narrative pattern are explicit.
- [ ] Claims have stable IDs, types, and evidence mappings.
- [ ] Every slide has one question, action title, primary claim, `so_what`, and
      transition.
- [ ] The titles-only test passes.
- [ ] Deck organization covers canvas, navigation, evidence, and density.
- [ ] Final HTML quality criteria are concrete and checkable.
- [ ] The plan was persisted when a target directory was known.
- [ ] No HTML file was created.

## Output Format

```text
## Report Job
## Audience and Action
## Source Context
## Logic Spine
## Claims and Evidence
## Slide Sequence
## Titles-Only Check
## Deck Organization
## Quality Bar
## Open Questions
## Build Handoff
```

## Guardrails

- Do not create or edit the HTML report deck in this skill.
- Do not invent evidence, command output, files, screenshots, or sources.
- Do not hide unknowns or present inference as fact.
- Do not use topic labels where the plan requires action titles.
- Do not add slides solely to meet a page-count expectation.
- Do not plan animation, narration, or decoration unless explicitly requested.
- Do not store secrets, credentials, private data, or raw sensitive logs.

## References

- `references/report-plan-template.yaml`
  Structured v0.2 report-deck plan for `html-report-build`.
