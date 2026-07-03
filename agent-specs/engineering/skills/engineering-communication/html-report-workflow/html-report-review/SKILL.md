---
name: html-report-review
description: v0.1.0 - Reviews a generated HTML report against its current scenario, report plan, evidence, and local-readability requirements. Use when an HTML report should be checked for scenario fit, intuitive communication, factual grounding, claim labeling, structure, offline usability, placeholders, and sensitive data before sharing.
---

# HTML Report Review

## Overview

Review a generated HTML report against the plan that authorized it. This skill
checks whether the report is appropriate for the current scenario, intuitive
for its intended reader, accurate, evidence-backed, locally readable, and clear
about facts, inferences, recommendations, and unknowns.

The review phase does not rewrite the report by default. It reports findings
and concrete next actions.

## When to Use

- An HTML report has been generated and needs acceptance review.
- The report will be shared with a human decision-maker.
- The report contains technical findings, recommendations, or implementation
  guidance that must be evidence-backed.
- A report looks polished but may contain unsupported claims or missing
  caveats.
- A report needs a judgment on whether HTML is the right artifact for the
  situation, or whether a doc, table, PR note, diagram, or task plan would serve
  the reader better.

**When NOT to use:** before the HTML file exists, for general code review, for
marketing copy review, or for project documentation lifecycle review.

## The Review Process

### Step 1: Load Inputs

Read:

- the report plan
- the generated HTML file
- any source context or evidence references available
- the current scenario, audience, and intended use from the user request or
  plan

If the plan is missing, review the HTML as `plan_missing` and state the reduced
confidence.

### Step 2: Check Scenario Fit

Judge whether this HTML report is the right artifact for the current situation:

- the report answers the user's actual question or decision need
- the audience, depth, and tone match the intended reader
- the report format is appropriate compared with alternatives such as a project
  doc, summary, table, PR/MR description, flowchart, task plan, or dashboard
- the scope is neither too broad to act on nor too narrow to explain the issue
- the report's first screen makes the purpose and conclusion discoverable

If HTML is not the right artifact, mark the result `fail` unless the user
explicitly asked for HTML as the deliverable and the report is otherwise useful.

### Step 3: Check Plan Adherence

Verify:

- report goal is addressed
- intended audience is respected
- planned sections are present or deviations are explained
- planned page organization is followed, including reading path, layout model,
  evidence placement, visual grouping, scan aids, and mobile notes
- quality bar is met
- unknowns and gaps from the plan remain visible

### Step 4: Check Reader Intuition

Judge whether the report is easy to understand in one pass:

- the first screen or opening block states the useful conclusion, not just the
  topic
- headings form a clear scan path
- the most important findings are visually prioritized
- facts, inferences, recommendations, and unknowns are easy to distinguish
- tables, callouts, and appendices reduce cognitive load instead of adding
  decoration
- the reader can tell what to do next without reading every detail

Flag reports that are accurate but hard to use.

### Step 5: Check Evidence and Claim Labeling

Classify major statements:

- facts with evidence
- inferences with rationale
- recommendations with rationale
- unknowns or assumptions

Flag any major claim that lacks support or presents inference as fact.

### Step 6: Check HTML Usability

Verify:

- file exists and opens as static HTML
- basic structure has `doctype`, `html`, `head`, `title`, and `body`
- content is readable without external assets unless allowed
- tables or code blocks do not destroy mobile readability
- headings form a useful scan path
- opening summary, evidence placement, and scan aids match the plan when the
  plan defines them

### Step 7: Check Safety and Completeness

Scan for:

- placeholders such as `TODO`, `TBD`, `{{...}}`
- broken local references
- secrets, credentials, private data, or raw sensitive logs
- missing evidence appendix when evidence is central
- over-decorated layout that hides substance

### Step 8: Decide the Result

Use:

- `pass`: report fits the scenario, is intuitive for the reader, matches the
  plan, claims are grounded, HTML is locally usable, and no blocking safety
  issue exists.
- `fail`: report has unsupported major claims, missing required sections,
  scenario mismatch, weak reader intuition, unsafe content, or serious
  usability problems.
- `blocked`: required files or evidence are missing, preventing a meaningful
  review.

## Decision Points

- If unsupported claims are minor, recommend edits and mark the result `fail`
  until fixed.
- If the plan is missing but the user still wants review, proceed with reduced
  confidence and mark plan adherence as `blocked`.
- If sensitive content appears, fail the review and identify the area without
  repeating the sensitive value.
- If the report needs new research, recommend returning to `html-report-plan`
  or an investigation step.
- If the report is well formed but the wrong artifact for the task, fail with a
  replacement recommendation instead of only listing HTML issues.
- If the report is accurate but not intuitive, fail with concrete reading-path
  fixes.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It opens in the browser, so it passes." | A report can render while still being unsupported or misleading. |
| "The design looks polished." | Visual polish is secondary to evidence, claim labeling, and readability. |
| "The reader can infer what is uncertain." | Unknowns and assumptions must be explicit. |
| "I can fix it while reviewing." | Review reports findings; rewriting is a separate build pass unless requested. |
| "The page organization is subjective." | The plan's reading path and evidence placement are reviewable acceptance criteria. |
| "The user asked for HTML, so scenario fit is already solved." | Review still checks whether this HTML report actually serves the user's current decision or communication need. |
| "Accurate means good enough." | A report can be accurate and still fail if the reader cannot quickly understand the point. |

## Red Flags

- The report does not answer the user's actual decision or communication need.
- HTML is the wrong artifact for the situation, but the review ignores that.
- The first screen does not expose the purpose, conclusion, or next action.
- Major recommendations have no cited fact or rationale.
- Inferences are written as facts.
- The report contains unresolved placeholders.
- The report uses remote assets without approval.
- The report ignores the planned reading path or evidence placement.
- The report hides unknowns or omits risks from the plan.
- The review rewrites the report instead of producing findings.

## Verification

- [ ] Report plan was read or missing-plan status was declared.
- [ ] HTML file was read.
- [ ] Current scenario, audience, and intended use were checked.
- [ ] Planned sections were checked.
- [ ] Planned page organization was checked.
- [ ] Reader intuition and first-screen clarity were checked.
- [ ] Major claims were checked for evidence or rationale.
- [ ] Static HTML usability was checked.
- [ ] Placeholders and sensitive data were scanned.
- [ ] Result is `pass`, `fail`, or `blocked`.

## Output Format

```text
## Review Result
- result:
- report:
- plan:
- scenario_fit:
- reader_intuition:

## Scenario Fit
- findings:
- better_artifact_if_any:

## Plan Adherence
- findings:
- page_organization:

## Reader Intuition
- first_screen:
- scan_path:
- next_action_clarity:

## Evidence and Claims
- unsupported_claims:
- mislabeled_inferences:

## HTML Usability
- findings:

## Safety and Completeness
- placeholders:
- sensitive_data:
- missing_sections:

## Next Actions
- none | <actions>
```

## Guardrails

- Do not rewrite the HTML unless the user explicitly asks for repair.
- Do not expose secrets or private data found during review.
- Do not invent evidence to make a claim pass.
- Do not treat visual polish as a substitute for evidence.
- Do not treat factual correctness as enough when the report fails the current
  scenario or reader comprehension need.
- Do not mark `pass` when plan adherence is blocked or major claims are
  unsupported.

## References

- `references/review-checklist.md`
  Checklist for HTML report acceptance review.
