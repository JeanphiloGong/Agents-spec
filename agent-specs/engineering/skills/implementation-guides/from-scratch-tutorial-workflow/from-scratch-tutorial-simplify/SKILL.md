---
name: from-scratch-tutorial-simplify
description: v0.1.1 - Simplify a working from-scratch implementation tutorial without changing its defect-driven teaching chain. Use when a guide is correct but too repetitive, wordy, or hard to scan, while concrete previous-version defects, connected code versions, and step checks must be preserved.
---

# From-Scratch Tutorial Simplify

## Overview

Simplify a completed from-scratch tutorial while preserving its teaching
behavior. The goal is not shorter at any cost. The goal is a guide that is
easier to follow without losing external contract, teaching pressure,
connected code versions, step checks, freeze points, helper boundaries, or
final-code traceability.

Defect-driven depth is protected content. Do not shorten away the explanation
of what breaks in the naive or previous version, why the new requirement
follows, or how the step check proves that one defect was addressed.

## When to Use

- A from-scratch tutorial has passed or mostly passed review but feels heavy.
- The guide repeats the same explanation across steps.
- Step wording is too long for readers to scan.
- The human wants clearer prose without changing the tutorial's logic.

**When NOT to use:** first-draft generation, planning, fixing broken teaching
logic, changing final code behavior, or removing required verification to make
the guide shorter.

## The Simplification Loop

1. Establish the Baseline
   - Identify reader goal, external contract, version steps, helper contracts,
     and final code.
   - Verify: the current tutorial is complete enough to simplify.
2. Protect Required Fields
   - Preserve `Question`, `Naive or Previous Version`, `What Breaks`, `New
     Requirement`, `Add or Replace`, `Code Change`, `Why This Change Works`,
     `Step Check`, `Now This Version Can`, `Freeze This Version`, `Still
     Lacks`, `What To Verify`, and `Step Self-Review` when present.
   - Verify: no step loses the connected build loop.
3. Remove Repetition
   - Delete repeated rationale that does not add new pressure.
   - Merge duplicate warnings only when the result remains explicit.
   - Verify: each remaining sentence earns its place.
4. Tighten Prose
   - Prefer concrete verbs, shorter bullets, and direct reader-facing language.
   - Keep source facts and assumptions clear.
   - Verify: no ambiguity is introduced.
5. Preserve Code Traceability
   - Do not alter code behavior unless the user explicitly asks.
   - If code snippets are shortened, keep the add/replace relation obvious.
   - Verify: final code still traces to the connected steps.
6. Report Changes
   - Summarize what was simplified and what was intentionally preserved.
   - Note any remaining teaching risk.

## Decision Points

- If a guide has broken version continuity, use `from-scratch-tutorial-review`
  or rebuild before simplifying.
- If simplification would remove a step check, keep the check and shorten
  surrounding prose instead.
- If code needs behavior changes, stop and ask whether this is now a build
  task.
- If the tutorial is already concise, report that no simplification is needed.

## Output Format

```markdown
## Simplification Summary
- ...

## Preserved Teaching Chain
- ...

## Remaining Risks
- ...
```

When editing a file directly, keep this report brief and include changed paths.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Shorter is clearer." | Removing pressure, checks, or gaps makes the guide harder to learn from. |
| "The freeze line is repetitive." | Freeze lines prevent hidden rewrites between versions. |
| "Step checks can move to the end." | End-only verification loses per-version evidence. |
| "Code can be compacted while simplifying prose." | Code behavior changes belong to build, not simplify. |
| "What Breaks is obvious after simplification." | The defect explanation is the teaching engine; preserve it explicitly. |

## Red Flags

- A step loses `Step Check` or `Still Lacks`.
- A step loses the concrete `What Breaks` explanation or the link from defect
  to new requirement.
- A helper remains but its first-needed explanation is removed.
- Final code no longer traces to prior versions.
- Source facts and assumptions are merged together.
- Simplification changes code behavior.

## Verification

- [ ] The connected build loop remains intact in every step.
- [ ] Concrete previous-version defects and defect-to-change explanations are
      preserved.
- [ ] Step checks and freeze points are preserved.
- [ ] Helper contracts still have purpose and boundaries.
- [ ] No source facts or assumptions were invented.
- [ ] Code behavior was not changed unless explicitly requested.
- [ ] Remaining risks are reported.

## Guardrails

- Do not simplify by deleting required teaching fields.
- Do not change code behavior as part of prose simplification.
- Do not remove concrete examples or traces when they are the only evidence.
- Do not compress a step so far that it no longer explains what breaks in the
  prior version.
- Do not collapse multiple version steps into one unless the user explicitly
  asks for a shorter non-teaching summary.
