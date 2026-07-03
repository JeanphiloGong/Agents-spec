---
name: html-report-build
description: v0.1.0 - Builds a local self-contained HTML report from an approved report plan. Use when a report plan exists and the user wants a readable HTML artifact written to a target directory without adding new claims or changing the report scope.
---

# HTML Report Build

## Overview

Create a local HTML report from an approved report plan. This skill translates
the plan into a self-contained `.html` file with readable structure, restrained
styling, clear evidence labels, and explicit unknowns.

The build phase does not re-plan the report. It follows the report goal,
sections, claims, and quality bar from `html-report-plan`.
It also follows the planned page organization instead of inventing layout or
reading order during implementation.

## When to Use

- A report plan exists and the user wants the HTML file created.
- The output should be a static local report, not an app or website.
- The report should be readable offline with inline CSS.
- The user provides a target directory or asks to place the report in a local
  folder.

**When NOT to use:** before the report plan exists, when the user wants an
interactive UI, when source claims still need investigation, or when the output
belongs in released project documentation.

## The Build Process

### Step 1: Load the Report Plan

Read the report plan from the current conversation or a provided file. Confirm:

- report goal
- audience
- output directory and filename
- source context
- claims and evidence status
- section order
- page organization: reading path, layout model, evidence placement, visual
  grouping, scan aids, and mobile notes
- quality bar

If no usable plan exists, stop and ask for `html-report-plan`.

### Step 2: Confirm the Output Path

Use the user-provided target directory when available. Create the directory if
it does not exist. Choose a stable filename such as
`<topic>-report.html` when the user did not provide one.

Do not write outside the requested or inferred target directory.

### Step 3: Compose the Report

Write sections from the plan:

- executive summary or overview
- findings and evidence
- recommendations or implementation guidance
- risks and tradeoffs
- open questions or unverified assumptions
- evidence appendix when useful

Keep facts, inferences, recommendations, and unknowns visually distinct.
Follow the planned reading path, layout model, evidence placement, scan aids,
and mobile notes. If the page organization is impossible with static HTML,
stop and revise the plan instead of inventing a different report shape.

### Step 4: Build One Self-Contained HTML File

Use `assets/html-report-template.html` as the structural baseline:

- inline CSS
- semantic headings
- readable typography
- responsive width
- tables or callouts only when they improve scanning
- no remote assets unless explicitly allowed
- no decorative landing-page hero unless the user asked for a public-facing
  page

### Step 5: Verify the File

Before reporting success:

- confirm the file exists at the target path
- confirm it has valid basic HTML structure
- search for unresolved placeholders
- confirm key sections from the plan appear
- confirm the page organization from the plan is reflected
- confirm unverified items are labeled
- confirm no secrets or private data were inserted

Use a browser screenshot only when visual inspection is needed or the user asks
for rendered validation.

## Decision Points

- If the plan and source context disagree, stop and ask instead of choosing
  silently.
- If the target path is ambiguous, pick the requested directory and a
  descriptive filename; ask only when the directory itself is unclear.
- If the report needs new investigation, stop and return to planning or
  research; do not add unsupported claims during build.
- If the user asks for an app, dashboard, or interactive controls, route to
  frontend work instead of this static report skill.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The report will be better if I add a few extra conclusions." | Build follows the plan. New conclusions need evidence and plan revision. |
| "A fancy hero will make it look professional." | Engineering reports should prioritize evidence, scanning, and clarity. |
| "External fonts and CDNs are fine." | Local reports should be self-contained unless assets are explicitly allowed. |
| "Unknowns make the report look weaker." | Labeled unknowns make the report trustworthy. |
| "I can choose the layout while coding." | Page organization is part of the plan contract; build executes it. |

## Red Flags

- HTML is created without a report plan.
- The report introduces major claims not present in the plan.
- The report ignores the planned reading path, evidence placement, or scan
  aids.
- Facts, inferences, and recommendations are visually indistinguishable.
- The output depends on remote assets without approval.
- The file contains placeholders such as `TODO`, `TBD`, or `<section>`.
- The report reads like a marketing page instead of an engineering report.

## Verification

- [ ] Report plan was loaded.
- [ ] Output directory and filename were resolved.
- [ ] HTML file exists.
- [ ] Basic HTML structure is present.
- [ ] Planned sections are present.
- [ ] Planned page organization is reflected in the HTML.
- [ ] Unsupported claims and unknowns are labeled.
- [ ] No unresolved placeholders remain.
- [ ] No secrets, credentials, or private data were added.

## Output Format

```text
## Report Built
- path:
- status:

## Source Plan
- report_goal:
- audience:

## Verification
- file_exists:
- sections_present:
- page_organization_followed:
- placeholders:
- sensitive_data_check:

## Gaps
- none | <gap>
```

## Guardrails

- Do not invent evidence, inspected files, command output, or source links.
- Do not rewrite the report plan while building.
- Do not invent a different page organization when the plan already defines
  one.
- Do not auto-commit the report.
- Do not use external assets unless explicitly allowed.
- Do not put secrets, credentials, private data, or raw sensitive logs in the
  report.

## Assets

- `assets/html-report-template.html`
  Self-contained HTML report starter.
