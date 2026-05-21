---
name: from-scratch-tutorial-plan
description: v0.1.3 - Plan a pressure-driven from-scratch implementation tutorial before writing it, including universal examples and patch/checkpoint code-change boundaries. Use when the human wants a teaching path, reader goal, pressure examples, code-version checkpoints, concrete previous-version defects, final assembled checkpoint, and verification plan before drafting a from-scratch guide.
---

# From-Scratch Tutorial Plan

## Overview

Design the teaching route for one from-scratch implementation tutorial before
writing the guide. The plan explains who the reader is, what they should be
able to build, what pressures force each structure, which code versions should
exist, and how each version will be checked.

Use this skill to prevent tutorials from jumping straight from requirements to
finished code, becoming disconnected concept notes, or producing steps whose
only explanation is a vague "why this matters" sentence.

## When to Use

- The human wants a plan before a from-scratch implementation tutorial is
  written.
- The tutorial target has enough complexity to need ordered teaching steps.
- The agent needs to decide examples, checkpoints, helper boundaries, or
  verification before drafting.
- A tutorial draft risks skipping why a structure, helper, or state variable is
  necessary.

**When NOT to use:** production implementation plans, runnable reference sample
planning, landing plans, final-code-only answers, or formatting/publishing
work.

## The Planning Loop

1. Define Reader and Goal
   - Name the target reader, prerequisite knowledge, and the concrete thing the
     reader should be able to implement after the tutorial.
   - Verify: the goal is teachable as one method, feature, or coherent core
     slice.
2. Capture External Contract
   - State supplied behavior, inputs, outputs, constraints, and known examples.
   - Mark inferred assumptions separately from supplied facts.
   - Verify: no internal data structure appears before the behavior contract.
3. Choose the Teaching Example
   - Pick one small example or trace that exposes the first real pressure.
   - Avoid examples that require the final solution to understand.
   - Prefer universal examples or source-independent scenarios; do not bake the
     user's current production module into the skill's reusable standards.
   - Verify: the example can be reused later as a step check.
4. Plan Connected Code Versions
   - List the smallest skeleton and each later version.
   - For every version, state `pressure example`, `naive or previous version`,
     `concrete defect`, `new pressure`, `add or replace`, `code change type`,
     `code change target`, `step check`, and `freeze or next gap`.
   - Make the next question arise from the previous version's named defect,
     not from a final-code outline.
   - Verify: each version changes one pressure, structure, helper, or mutation
     rule forced by a visible defect.
5. Plan Helper Contracts
   - Introduce helpers only after a planned step creates the need.
   - State each helper's caller, input, output, and mutation boundary.
   - Verify: no helper exists only because it appears in a known final answer.
6. Define Review Risks
   - List where the tutorial could jump, hide logic, or smuggle final code.
   - Add checkpoints for those risks.
   - Verify: the plan can be handed to `from-scratch-tutorial-build`.

## Step Planning Contract

Every planned step must be a complete teaching unit, not a row that merely
names the next code edit.

For each step:

- `Naive or Previous Version` states the exact code or mental model the reader
  currently has.
- `Pressure Example` shows the concrete input, trace, call site, or extension
  that makes the current version's weakness visible before naming the defect.
- `Concrete Defect` names what that version cannot explain, observe, protect,
  or let the caller do.
- `New Pressure` translates that defect into the next requirement.
- `Add or Replace` changes exactly one thing in response to that pressure.
- `Code Change Type` is `patch` for a local change or `checkpoint` for a
  complete current runnable unit.
- `Code Change Target` names the file, module, script, or snippet the reader
  changes.
- `Step Check` proves the defect was addressed in the current version.
- `Freeze or Next Gap` states the new baseline and the next visible defect.

If `Concrete Defect` could apply to any tutorial, the step is not planned well
enough. For example, "ordinary function calls are not scalable" is too vague;
"a list-backed cache must scan every entry to answer `get(key)`, so lookup time
depends on key position" is concrete.

If `Pressure Example` is missing, the step will read like a template. The plan
must show what the reader experiences before the tutorial names the defect.

For code tutorials, the final planned step must be `Code Change Type:
checkpoint` and must name the complete target it assembles, such as `runner.py`
or `current script`. The final checkpoint may include code introduced earlier,
but it must not add unexplained logic.

## Decision Points

- If requirements are too vague to choose data structures or examples, ask for
  the smallest missing behavior or constraint.
- If the human already supplied a clear teaching route, keep the plan short and
  focus on version checkpoints.
- If the output should be a runnable mini-project, use `reference-core-plan` and
  `reference-core-build` instead.
- If the user asks for the full guide immediately, use
  `from-scratch-tutorial-build`.

## Output Format

```markdown
# From-Scratch Tutorial Plan: <Topic>

## Reader and Goal
- Reader:
- Goal:
- Prerequisites:

## External Contract
- Supplied facts:
- Inferred assumptions:
- Constraints:

## Teaching Example
- Example:
- Why this example:
- Reuse as check:

## Version Plan
| Step | Question | Pressure Example | Naive or Previous Version | Concrete Defect | New Pressure | Add or Replace | Code Change Type | Code Change Target | Step Check | Freeze or Next Gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ... | ... | ... | ... | ... | ... | patch/checkpoint | ... | ... | ... |

## Helper Contracts To Introduce
| Helper | First Needed In | Purpose | Inputs | Output/Mutation |
| --- | --- | --- | --- | --- |

## Review Risks
- ...

## Build Handoff
- recommended_builder: from-scratch-tutorial-build
- notes:
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The tutorial can discover the path while writing." | Planning prevents hidden jumps and repeated rewrites. |
| "The helper names are obvious from the final code." | Helpers must be forced by behavior and invariants, not copied from a memorized solution. |
| "A plan should stay high level." | Tutorial plans need concrete version checkpoints or the build will drift. |
| "The step question already implies the defect." | The defect must be stated explicitly so the builder can teach why the next change is necessary. |
| "The builder can decide code shape later." | Patch/checkpoint boundaries are part of the teaching plan; they determine whether readers patch or copy a complete version. |
| "The defect statement is enough." | The plan needs a pressure example so the reader can feel why the defect matters before seeing the fix. |

## Red Flags

- The plan names data structures before the external contract.
- Version steps do not say what the previous version can do or what concrete
  defect remains.
- A version row lacks a pressure example.
- A step's `Concrete Defect` is generic, motivational, or copied from the final
  architecture instead of observed in the current version.
- A version row lacks `Code Change Type` or `Code Change Target`.
- The final code step is not planned as an assembled checkpoint.
- A step adds multiple helpers or mutation rules at once.
- The plan has no small example or trace.
- The final step is planned as a separate code dump instead of the last
  connected version.

## Verification

- [ ] Reader, goal, and prerequisites are explicit.
- [ ] Supplied facts and inferred assumptions are separated.
- [ ] The version plan includes pressure example, naive or previous version,
      concrete defect, new pressure, add/replace, code change type, code
      change target, step check, and freeze or next gap.
- [ ] Each step's question follows from the previous version's concrete defect.
- [ ] The final code step is planned as a complete assembled checkpoint.
- [ ] Each helper has a first-needed step and mutation or return boundary.
- [ ] Review risks identify likely jumps or final-code drift.
- [ ] The build handoff names the correct builder.

## Guardrails

- Do not write the tutorial body during planning.
- Do not invent constraints, examples, or source facts.
- Do not plan a detached final implementation section.
- Do not plan a final step that forces the reader to stitch scattered snippets
  into the final code.
- Keep the plan scoped to one tutorial, not a broad course outline.
