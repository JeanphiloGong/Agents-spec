---
name: from-scratch-tutorial-plan
description: v0.2.0 - Plan a from-scratch tutorial through Nystrom/Karpathy/Norvig standards and the tutorial increment cycle. Use when the human wants a teaching path with real scenario, problem compression, core model, invariants, pressure examples, naive versions, concrete breaks, one patch/checkpoint change per step, step checks, freeze points, and a final assembled checkpoint before drafting.
---

# From-Scratch Tutorial Plan

## Overview

Design the teaching route for one from-scratch implementation tutorial before
writing the guide. The plan explains who the reader is, what real scenario the
topic solves, how the real problem is compressed into a small complete model,
what pressures force each structure, which code versions should exist, and how
each version will be checked.

Use this skill to prevent tutorials from jumping straight from requirements to
finished code, becoming disconnected concept notes, or producing steps whose
only explanation is a vague "why this matters" sentence.

## Teaching Standard

Every plan must satisfy three teaching pressures:

- **Nystrom complete engineering chain** - plan a connected project path where
  every version leaves a working system piece.
- **Karpathy runnable from-zero coding** - code should appear early, stay
  runnable, and grow only when behavior forces it.
- **Norvig small complete problem compression** - compress the real scenario
  into the smallest model that still teaches the core idea.

Do not treat these as stylistic inspiration. They are acceptance criteria for
the plan. If the route lacks a real scenario, a compressed model, a runnable
version ladder, or a final assembled checkpoint, the plan is incomplete.

## The Tutorial Increment Cycle

```text
+------------------------------------------------+
|                                                |
|  Pressure -> Naive version -> Break -> Change  |
|      ^                                |        |
|      +------ Freeze <- Check <--------+        |
|                 |                              |
|                 v                              |
|             Next step                          |
|                                                |
+------------------------------------------------+
```

Plan each step as one full pass through the cycle:

1. **Pressure** - what small input, trace, call site, or extension makes the
   current weakness visible?
2. **Naive version** - what does the reader have at this point?
3. **Break** - what exactly can that version not do?
4. **Change** - what one thing should be added or replaced?
5. **Check** - how will the reader prove this one change worked?
6. **Freeze** - what is the new baseline and next visible gap?

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
2. Define the Real Scenario
   - State who calls or uses the thing, why the direct or naive approach becomes
     painful, and what the outside observer sees.
   - Keep the scenario source-independent unless the human explicitly asks for
     production mapping.
   - Verify: the tutorial starts from a real use case, not from an internal
     class or helper name.
3. Compress the Problem
   - Reduce the real scenario to the smallest complete model that can be
     implemented in one tutorial.
   - State what is included, what is deferred, and why the smaller model still
     teaches the core idea.
   - Verify: the compressed problem is not a toy that loses the important
     invariant, and not a production copy full of noise.
4. Define Core Model and Invariants
   - Name the 3-5 concepts the implementation manipulates.
   - List invariants that every version or final checkpoint must protect.
   - Verify: no data structure appears before a behavior, invariant, or
     operation creates the need.
5. Capture External Contract
   - State supplied behavior, inputs, outputs, constraints, and known examples.
   - Mark inferred assumptions separately from supplied facts.
   - Verify: no internal data structure appears before the behavior contract.
6. Choose the Teaching Example
   - Pick one small example or trace that exposes the first real pressure.
   - Avoid examples that require the final solution to understand.
   - Prefer universal examples or source-independent scenarios; do not bake the
     user's current production module into the skill's reusable standards.
   - Verify: the example can be reused later as a step check.
7. Plan Tutorial Increments
   - List the smallest skeleton and each later version as cycle passes.
   - For every version, plan pressure, naive version, break, one change, check,
     and freeze.
   - Mark the change as `patch` or `checkpoint`, and name the target.
   - Make the next question arise from the frozen version's visible gap, not
     from a final-code outline.
   - Verify: each version changes one pressure, structure, helper, or mutation
     rule forced by a visible defect.
8. Plan Helper Contracts
   - Introduce helpers only after a planned step creates the need.
   - State each helper's caller, input, output, and mutation boundary.
   - Verify: no helper exists only because it appears in a known final answer.
9. Plan Verification Matrix
   - Include happy path, invalid input, failure path, boundary case, and one
     representative state or event trace when relevant.
   - Tie each verification item to a planned step or final invariant.
   - Verify: final validation is not only "run all tests".
10. Define Review Risks
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
- `Break` names what that version cannot explain, observe, protect,
  or let the caller do.
- `New Requirement` translates that break into the next requirement.
- `Add or Replace` changes exactly one thing in response to that pressure.
- `Code Change Type` is `patch` for a local change or `checkpoint` for a
  complete current runnable unit.
- `Code Change Target` names the file, module, script, or snippet the reader
  changes.
- `Step Check` proves the defect was addressed in the current version.
- `Freeze or Next Gap` states the new baseline and the next visible defect.

If `Break` could apply to any tutorial, the step is not planned well
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

## Real Scenario
- Who uses it:
- Why the naive approach hurts:
- What the outside observer sees:

## Problem Compression
- Full-world problem:
- Compressed tutorial model:
- Included:
- Deferred:
- Why this compression is still complete:

## Core Model and Invariants
- Core concepts:
- Invariants:

## External Contract
- Supplied facts:
- Inferred assumptions:
- Constraints:

## Teaching Example
- Example:
- Why this example:
- Reuse as check:

## Version Plan
| Step | Question | Pressure Example | Naive or Previous Version | Break | New Requirement | Add or Replace | Code Change Type | Code Change Target | Step Check | Freeze or Next Gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ... | ... | ... | ... | ... | ... | patch/checkpoint | ... | ... | ... |

## Helper Contracts To Introduce
| Helper | First Needed In | Purpose | Inputs | Output/Mutation |
| --- | --- | --- | --- | --- |

## Verification Matrix
| Case | What It Proves | Planned Step Or Invariant |
| --- | --- | --- |
| happy path | ... | ... |
| invalid input | ... | ... |
| failure path | ... | ... |
| boundary case | ... | ... |
| trace | ... | ... |

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
| "The real scenario can wait for the article draft." | Without the scenario, the version ladder tends to explain code shape instead of user-visible pressure. |
| "The compressed model is obvious." | Problem compression is the Norvig part of the skill; it must be explicit before code structure is planned. |

## Red Flags

- The plan names data structures before the external contract.
- The plan lacks a real scenario, compressed problem, core model, or invariants.
- The scenario is a production-code description instead of a source-independent
  reason someone would need the technique.
- The compressed problem drops the central invariant or keeps too much
  production noise.
- Version steps do not say what the previous version can do or what concrete
  defect remains.
- A version row lacks a pressure example.
- A step's `Break` is generic, motivational, or copied from the final
  architecture instead of observed in the current version.
- A version row lacks `Code Change Type` or `Code Change Target`.
- The final code step is not planned as an assembled checkpoint.
- A step adds multiple helpers or mutation rules at once.
- The plan has no small example or trace.
- The plan has no verification matrix beyond a generic test command.
- The final step is planned as a separate code dump instead of the last
  connected version.

## Verification

- [ ] Reader, goal, and prerequisites are explicit.
- [ ] Real scenario, problem compression, core model, and invariants are
      explicit.
- [ ] Supplied facts and inferred assumptions are separated.
- [ ] The version plan includes pressure example, naive or previous version,
      break, new requirement, add/replace, code change type, code change
      target, step check, and freeze or next gap.
- [ ] Each step's question follows from the previous version's visible break.
- [ ] The final code step is planned as a complete assembled checkpoint.
- [ ] Each helper has a first-needed step and mutation or return boundary.
- [ ] Verification matrix covers happy path, invalid input, failure path,
      boundary case, and representative trace when relevant.
- [ ] Review risks identify likely jumps or final-code drift.
- [ ] The build handoff names the correct builder.

## Guardrails

- Do not write the tutorial body during planning.
- Do not invent constraints, examples, or source facts.
- Do not skip real scenario, problem compression, core model, or invariants for
  non-trivial tutorials.
- Do not plan a detached final implementation section.
- Do not plan a final step that forces the reader to stitch scattered snippets
  into the final code.
- Keep the plan scoped to one tutorial, not a broad course outline.
