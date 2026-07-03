---
name: html-report-plan
description: v0.1.0 - Plans an evidence-backed HTML report before writing HTML. Use when analysis, investigation, design rationale, comparison, or implementation guidance should become a local HTML report with clear audience, claims, evidence, page organization, structure, and quality bar.
---

# HTML Report Plan

## Overview

Plan a local HTML report before generating the file. This skill turns a loose
request such as "make an HTML report" into a writing contract: purpose,
audience, source context, claims, page organization, report structure, evidence
requirements, and quality bar.

The output is a report plan, not HTML. Use `html-report-build` after the plan is
accepted or clear enough to execute.

## When to Use

- The user asks for an HTML report, visual report, investigation report, or
  shareable analysis artifact.
- The report needs to organize code findings, architecture decisions, product
  tradeoffs, technical recommendations, or operational guidance.
- The evidence, claims, and audience need to be separated before writing.
- A previous report looked polished but mixed facts, assumptions, and advice.

**When NOT to use:** tiny one-paragraph summaries, released project docs,
marketing pages, dashboards, or UI applications. Use project documentation
skills for durable docs and frontend skills for interactive apps.

## The Planning Process

### Step 1: Define the Report Job

Identify:

- report topic
- target reader
- decision or action the report should support
- target output directory or filename when supplied
- language and tone

If the user only gives a directory, infer a filename from the topic and ask only
when the report subject itself is unclear.

### Step 2: Gather Source Context

List the evidence inputs the report may use:

- local files and code paths
- command outputs
- previous chat analysis
- diagrams, screenshots, traces, or logs
- external sources only when browsing was explicitly requested or required

Separate facts already inspected from context that still needs verification.
Do not invent facts to make the report feel complete.

### Step 3: Classify Claims

Organize report content into:

- `facts`: directly supported by inspected evidence
- `inferences`: reasoned conclusions based on facts
- `recommendations`: proposed actions or designs
- `unknowns`: unresolved questions or unverified assumptions

Every major recommendation should trace back to facts or be clearly labeled as
an inference.

### Step 4: Design the Report Structure

Choose sections for the reader and purpose. Common sections:

- executive summary
- current state
- key findings
- recommended approach
- implementation plan
- risks and tradeoffs
- evidence appendix
- open questions

Avoid landing-page structure unless the user asked for a public-facing page.
Engineering reports should prioritize dense, readable evidence over decorative
composition.

### Step 5: Design the Page Organization

Define how the HTML page should explain the report, not only which sections it
contains:

- top-level reading path: what the reader sees first, second, and last
- layout model: single-column report, sidebar/table-of-contents, section cards,
  comparison table, timeline, appendix-heavy report, or another explicit shape
- evidence placement: inline references, source table, appendix, or callouts
- visual grouping: how facts, inferences, recommendations, and unknowns are
  separated
- scan aids: summary block, key finding list, status badges, risk table, or
  decision matrix when useful
- mobile behavior: how wide tables, code blocks, and dense evidence remain
  readable

The page organization should make the argument understandable before any CSS is
written. Do not leave layout decisions for `html-report-build` to invent.

### Step 6: Define the Quality Bar

Write acceptance criteria for the final HTML:

- can be opened locally
- uses a single self-contained HTML file unless assets are explicitly allowed
- separates facts, inferences, recommendations, and unknowns
- follows the planned page organization and reading path
- marks unverified items clearly
- includes evidence references for key claims
- uses restrained styling that supports scanning
- avoids secrets, credentials, private data, and unsupported claims

### Step 7: Produce or Persist the Plan

Write the plan using `references/report-plan-template.yaml` or the same fields
in readable Markdown. If the user gave a target directory, write the plan there
as `<report-name>.plan.yaml` so `html-report-build` can load the exact
contract. If no target directory is known, output the complete plan in the
conversation. Do not create the HTML file in this skill.

## Decision Points

- If the report goal is unclear, ask for the report topic before planning.
- If evidence is insufficient, include a source gap instead of fabricating
  findings.
- If the user asks for released documentation, route to project documentation
  skills instead of HTML report workflow.
- If the user asks for an interactive app or dashboard, route to frontend work
  instead of a static report.
- If sensitive material appears in source context, exclude it or redact it in
  the plan.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I can just write the HTML and make it look good." | Visual polish cannot repair weak claims or missing evidence. |
| "The chat history is enough evidence." | Chat history must still be separated into facts, inferences, recommendations, and unknowns. |
| "A report plan is overkill." | Reports are high-freedom writing; planning prevents polished but unreliable output. |
| "I'll decide sections while building." | Structure is the contract that keeps the report focused. |
| "The layout is just CSS." | Page organization determines how the reader understands the argument before styling exists. |

## Red Flags

- The plan has sections but no report goal or reader.
- Claims are listed without evidence or source status.
- The plan treats unverified assumptions as facts.
- The plan asks for a marketing-style landing page for an engineering report.
- The plan lists sections but does not define a reading path or page
  organization.
- The plan does not define how the final HTML will be checked.

## Verification

- [ ] Report goal and audience are explicit.
- [ ] Source context is listed and classified by evidence status.
- [ ] Facts, inferences, recommendations, and unknowns are separated.
- [ ] Report sections match the reader and decision.
- [ ] Page organization explains the reading path, layout model, evidence
      placement, and scan aids.
- [ ] Final HTML quality bar is concrete and checkable.
- [ ] Plan was written to `<report-name>.plan.yaml` when a target directory was
      known, or fully output in the conversation when no path was known.
- [ ] No HTML file was created.

## Output Format

```text
## Report Goal
## Audience
## Source Context
## Claims and Evidence
## Report Structure
## Page Organization
## Quality Bar
## Open Questions
## Build Handoff
```

## Guardrails

- Do not create or edit the HTML report in this skill.
- Do not invent evidence, command output, files, screenshots, or external
  sources.
- Do not leave page organization, evidence placement, or reading path for build
  time when the report is non-trivial.
- Do not store secrets, credentials, private data, or raw sensitive logs in the
  plan.
- Do not convert the plan into released project documentation.
- Do not optimize for decoration before the evidence model is clear.

## References

- `references/report-plan-template.yaml`
  Structured report plan template for handoff to `html-report-build`.
