---
name: from-scratch-tutorial-plan
description: v0.1.0 - Plan a from-scratch implementation tutorial before writing it. Use when the human wants a teaching path, reader goal, examples, code-version checkpoints, and verification plan before drafting a from-scratch guide.
---

# From-Scratch Tutorial Plan

## Overview

Design the teaching route for one from-scratch implementation tutorial before
writing the guide. The plan explains who the reader is, what they should be
able to build, what pressures force each structure, which code versions should
exist, and how each version will be checked.

Use this skill to prevent tutorials from jumping straight from requirements to
finished code or from becoming disconnected concept notes.

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
   - Verify: the example can be reused later as a step check.
4. Plan Connected Code Versions
   - List the smallest skeleton and each later version.
   - For every version, state `previous version can`, `add or replace`, `now
     this version can`, `still lacks`, and `step check`.
   - Verify: each version changes one pressure, structure, helper, or mutation
     rule.
5. Plan Helper Contracts
   - Introduce helpers only after a planned step creates the need.
   - State each helper's caller, input, output, and mutation boundary.
   - Verify: no helper exists only because it appears in a known final answer.
6. Define Review Risks
   - List where the tutorial could jump, hide logic, or smuggle final code.
   - Add checkpoints for those risks.
   - Verify: the plan can be handed to `from-scratch-tutorial-build`.

## Decision Points

- If requirements are too vague to choose data structures or examples, ask for
  the smallest missing behavior or constraint.
- If the human already supplied a clear teaching route, keep the plan short and
  focus on version checkpoints.
- If the output should be a runnable mini-project, use `reference-core-impl-skill`
  instead.
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
| Step | Question | Previous Version Can | Add or Replace | Now This Version Can | Still Lacks | Step Check |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | ... | ... | ... | ... | ... | ... |

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

## Red Flags

- The plan names data structures before the external contract.
- Version steps do not say what the previous version can do.
- A step adds multiple helpers or mutation rules at once.
- The plan has no small example or trace.
- The final step is planned as a separate code dump instead of the last
  connected version.

## Verification

- [ ] Reader, goal, and prerequisites are explicit.
- [ ] Supplied facts and inferred assumptions are separated.
- [ ] The version plan includes previous capability, add/replace, new
      capability, remaining gap, and step check.
- [ ] Each helper has a first-needed step and mutation or return boundary.
- [ ] Review risks identify likely jumps or final-code drift.
- [ ] The build handoff names the correct builder.

## Guardrails

- Do not write the tutorial body during planning.
- Do not invent constraints, examples, or source facts.
- Do not plan a detached final implementation section.
- Keep the plan scoped to one tutorial, not a broad course outline.
