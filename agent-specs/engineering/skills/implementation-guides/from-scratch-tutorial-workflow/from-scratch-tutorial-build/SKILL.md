---
name: from-scratch-tutorial-build
description: v0.1.1 - Build a from-scratch implementation tutorial through connected code versions. Use when turning a reader goal, external contract, teaching example, and version plan into a guide with step checks, helper contracts, freeze points, and no detached final code.
---

# From-Scratch Tutorial Build

## Overview

Build the complete from-scratch implementation tutorial. This is the single
builder for deriving one feature, method, or coherent core slice from external
behavior into connected code versions. The goal is not to dump final code. The
goal is to make the internal model, helper contracts, mutation boundaries, and
final runnable implementation grow from requirements one version at a time.

## When to Use

- A `from-scratch-tutorial-plan` output is ready to draft.
- The human wants the tutorial body produced as a durable markdown guide.
- The guide must show code growing through connected versions.
- A draft needs to be rebuilt from a plan without skipping reasoning.
- The human asks how to implement something from scratch and wants the reasoning
  preserved.

**When NOT to use:** planning a tutorial, reviewing an existing tutorial,
simplifying prose only, production code implementation, broad landing plans,
runnable mini-project extraction, or publishing metadata.

## The Build Loop

Teach one abstraction layer at a time. Do not introduce a helper, data
structure, or full implementation before the requirement pressure that makes it
necessary is visible. Once code growth starts, every step must connect to the
previous version.

Use this loop for every numbered tutorial step:

```text
Add/Replace -> Step Check -> Verify -> Freeze -> Next Gap
```

1. Load the Plan or Scope
   - Read reader goal, external contract, teaching example, version plan,
     helper contracts, and review risks.
   - If no plan exists, infer lightweight assumptions only when they do not
     change the public contract or data structure.
   - Verify: the tutorial is scoped to one method, feature, or coherent core
     slice.
2. Draft the Contract First
   - Write reader goal, supplied facts, inferred assumptions, constraints, and
     the teaching example before internal structure.
   - Verify: the reader can understand the problem before seeing code.
3. Derive the First Pressure
   - Ask why the naive shape is insufficient.
   - Use that pressure to justify the first state, structure, or boundary.
   - Verify: the structure follows from an operation or invariant, not from
     preference.
4. Build One Version
   - Add to or replace exactly one part of the previous version.
   - Show the code change and name whether it is an addition or replacement.
   - Verify: the step introduces one pressure, structure, helper, or mutation
     rule.
5. Run the Step Check
   - Add a tiny assertion, trace, manual check, or compile/run check that fits
     the current version.
   - Verify: the check proves the new capability, not the final solution.
6. Freeze the Version
   - State what this version can do now.
   - State that this version is the baseline for the next step.
   - Verify: the next step can only continue from this version, not a hidden
     rewrite.
7. Name the Next Gap
   - State what still lacks and why that missing part creates the next step.
   - Verify: the next question follows from the remaining gap.
8. Finish Without a Detached Code Dump
   - Let the last meaningful step yield the complete code when code is needed.
   - Add only practice, common mistakes, verification checklist, and next small
     step after the build.
   - Verify: no final code section introduces new logic.

## Connected Build Contract

Every numbered step inside the `From Scratch` section should answer the same
teaching questions:

- `Question`
- `Why This Matters`
- `How To Think`
- `Previous Version Can`
- `Add or Replace`
- `Code Change`
- `Step Check`
- `Now This Version Can`
- `Freeze This Version`
- `Still Lacks`
- `What To Verify`

Rules:
- Each step introduces only one new pressure, structure, helper, or mutation
  rule.
- Do not solve the whole feature in one step.
- Do not present disconnected code blocks that cannot be related to the
  previous version.
- When replacing code, show the old shape briefly and the new code explicitly.
- In `Add or Replace`, use connector wording in substance:
  `In the previous version, add ...` or `Replace this part with ...`.
- The final complete code must come from the last connected step, not from a
  separate unexplained section.

## Decision Points

- If no plan exists and the tutorial has multiple possible teaching paths, use
  `from-scratch-tutorial-plan` first.
- If constraints are missing but the goal is clear, infer lightweight
  assumptions and label them before teaching.
- If missing constraints would change the data structure or public contract,
  ask before drafting the guide.
- If the draft fails its own step checks, repair the earliest failing version
  before continuing.
- If simplification is needed after the guide works, hand off to
  `from-scratch-tutorial-simplify`.
- If quality is uncertain, hand off to `from-scratch-tutorial-review`.

## Fixed Defaults

- `build_mode=connected-version-tutorial`
- `step_loop=add-replace-check-verify-freeze-gap`
- `implementation_style=contract-first-with-explicit-helper-boundaries`
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
- How To Think:
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

## Blocking Questions (Only If Blocking)
- ...
```

## Bundled Resources

- `references/from-scratch-document-ladder.md`
- `references/worked-example-lrucache.md`

Use `references/worked-example-lrucache.md` when the user needs a concrete
example of deriving a data structure from requirements. Use
`references/from-scratch-document-ladder.md` when the guide risks jumping too
quickly from requirement to helper internals.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The plan is enough; I can summarize the steps." | The build must produce the actual connected guide. |
| "The final code can be clearer if I rewrite it at the end." | A rewrite breaks the teaching chain and hides logic. |
| "Step checks are optional because this is documentation." | Checks are how the reader knows each version works. |
| "I can skip freezing the version." | Without a freeze, the next step may silently depend on hidden changes. |
| "The helper names are obvious from the final code." | Helpers should be forced by behavior and invariants, not copied from a memorized solution. |

## Red Flags

- A step lacks `Step Check`.
- A step lacks `Freeze This Version`.
- A data structure appears before the external contract and hard constraints.
- A helper appears before its caller, purpose, and mutation boundary are
  explained.
- Code appears that was not added to or replacing the previous version.
- The final code contains logic not present in earlier connected steps.
- The guide copies a final implementation shape instead of deriving it.
- The tutorial proceeds after a step check fails or is missing.

## Verification

- [ ] The guide starts with reader goal, external contract, constraints, and
      teaching example.
- [ ] Every numbered step uses the build loop fields.
- [ ] The external contract and hard constraints appear before any data
      structure is proposed.
- [ ] Every step has a concrete `Step Check`.
- [ ] Every step freezes the current version before naming the next gap.
- [ ] Helpers appear only after a step creates their need.
- [ ] Each helper has an explicit purpose and mutation or return boundary.
- [ ] The final complete code comes from the last connected step.
- [ ] The guide ends with common mistakes, verification checklist, and next
      small step.

## Guardrails

- Do not invent source facts, constraints, examples, or behavior.
- Do not continue from hidden code that was not shown in the previous version.
- Do not add a detached final implementation section.
- Do not recommend a helper before explaining what pressure or requirement
  created it.
- Do not say "store X in a map or list" without explaining what operation must
  stay `O(1)` or what invariant it protects.
- Do not optimize prose during the first build if it risks dropping checks or
  reasoning; simplify only after the guide is complete.
