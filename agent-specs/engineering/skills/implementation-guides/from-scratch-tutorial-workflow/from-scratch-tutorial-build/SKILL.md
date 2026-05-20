---
name: from-scratch-tutorial-build
description: v0.1.0 - Build a from-scratch implementation tutorial from an approved teaching plan. Use when turning a reader goal, external contract, teaching example, and version plan into a connected guide with step checks and no detached final code.
---

# From-Scratch Tutorial Build

## Overview

Turn a from-scratch tutorial plan into a complete teaching guide. This skill is
the orchestration layer for tutorial drafting: it keeps the guide moving one
connected version at a time, requires a check for each version, freezes the
current version before moving on, and uses `from-scratch-implementation-skill`
as the core builder when the guide is about implementation logic.

## When to Use

- A `from-scratch-tutorial-plan` output is ready to draft.
- The human wants the tutorial body produced as a durable markdown guide.
- The guide must show code growing through connected versions.
- A draft needs to be rebuilt from a plan without skipping reasoning.

**When NOT to use:** planning a tutorial, reviewing an existing tutorial,
simplifying prose only, production code implementation, or publishing metadata.

## The Build Loop

Use this loop for every numbered tutorial step:

```text
Add/Replace -> Step Check -> Verify -> Freeze -> Next Gap
```

1. Load the Plan
   - Read reader goal, external contract, teaching example, version plan,
     helper contracts, and review risks.
   - Verify: every planned version has a concrete `add or replace` and
     `step check`.
2. Draft the Contract First
   - Write reader goal, supplied facts, inferred assumptions, constraints, and
     the teaching example before internal structure.
   - Verify: the reader can understand the problem before seeing code.
3. Build One Version
   - Add to or replace exactly one part of the previous version.
   - Show the code change and name whether it is an addition or replacement.
   - Verify: the step introduces one pressure, structure, helper, or mutation
     rule.
4. Run the Step Check
   - Add a tiny assertion, trace, manual check, or compile/run check that fits
     the current version.
   - Verify: the check proves the new capability, not the final solution.
5. Freeze the Version
   - State what this version can do now.
   - State that this version is the baseline for the next step.
   - Verify: the next step can only continue from this version, not a hidden
     rewrite.
6. Name the Next Gap
   - State what still lacks and why that missing part creates the next step.
   - Verify: the next question follows from the remaining gap.
7. Finish Without a Detached Code Dump
   - Let the last meaningful step yield the complete code when code is needed.
   - Add only practice, common mistakes, verification checklist, and next small
     step after the build.
   - Verify: no final code section introduces new logic.

## Decision Points

- If no plan exists but the task is small and clear, use
  `from-scratch-implementation-skill` directly.
- If no plan exists and the tutorial has multiple possible teaching paths, use
  `from-scratch-tutorial-plan` first.
- If the draft fails its own step checks, repair the earliest failing version
  before continuing.
- If simplification is needed after the guide works, hand off to
  `from-scratch-tutorial-simplify`.
- If quality is uncertain, hand off to `from-scratch-tutorial-review`.

## Fixed Defaults

- `build_mode=connected-version-tutorial`
- `step_loop=add-replace-check-verify-freeze-gap`
- `core_builder=from-scratch-implementation-skill`
- `final_code_policy=last-step-yields-complete-code`
- `source_fact_policy=separate-supplied-from-inferred`

## Output Format

```markdown
# <Topic> From Scratch

## Reader and Goal
- ...

## External Contract
- Supplied facts:
- Inferred assumptions:
- Constraints:

## Teaching Example
- ...

## From Scratch
### Step 1: <one concrete problem>
- Question:
- Why This Matters:
- Previous Version Can:
- Add or Replace:
- Code Change:
- Step Check:
- Now This Version Can:
- Freeze This Version:
- Still Lacks:
- What To Verify:

## Helper Contracts
- ...

## Common Mistakes
- ...

## Verification Checklist
- ...

## Next Small Step
- ...
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The plan is enough; I can summarize the steps." | The build must produce the actual connected guide. |
| "The final code can be clearer if I rewrite it at the end." | A rewrite breaks the teaching chain and hides logic. |
| "Step checks are optional because this is documentation." | Checks are how the reader knows each version works. |
| "I can skip freezing the version." | Without a freeze, the next step may silently depend on hidden changes. |

## Red Flags

- A step lacks `Step Check`.
- A step lacks `Freeze This Version`.
- Code appears that was not added to or replacing the previous version.
- The final code contains logic not present in earlier connected steps.
- The guide copies a final implementation shape instead of deriving it.
- The tutorial proceeds after a step check fails or is missing.

## Verification

- [ ] The guide starts with reader goal, external contract, constraints, and
      teaching example.
- [ ] Every numbered step uses the build loop fields.
- [ ] Every step has a concrete `Step Check`.
- [ ] Every step freezes the current version before naming the next gap.
- [ ] Helpers appear only after a step creates their need.
- [ ] The final complete code comes from the last connected step.
- [ ] The guide ends with common mistakes, verification checklist, and next
      small step.

## Guardrails

- Do not invent source facts, constraints, examples, or behavior.
- Do not continue from hidden code that was not shown in the previous version.
- Do not add a detached final implementation section.
- Do not optimize prose during the first build if it risks dropping checks or
  reasoning; simplify only after the guide is complete.
