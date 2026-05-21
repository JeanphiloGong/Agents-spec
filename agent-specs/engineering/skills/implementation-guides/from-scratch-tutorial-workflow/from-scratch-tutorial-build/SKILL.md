---
name: from-scratch-tutorial-build
description: v0.1.5 - Build a from-scratch tutorial through the tutorial increment cycle. Use when turning a reader goal, external contract, teaching example, and version plan into a guide where each step shows pressure, naive code, what breaks, one patch/checkpoint change, a check, a freeze, and a final assembled checkpoint.
---

# From-Scratch Tutorial Build

## Overview

Build a from-scratch implementation tutorial one complete teaching increment
at a time. The goal is not to dump final code. The goal is to let the reader
feel a small pressure, see the naive version break, make one code change, check
that change, freeze the version, and then continue.

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

For each tutorial step:

1. **Pressure** - show the tiny input, trace, call site, or extension that
   makes the current version's weakness visible.
2. **Naive version** - show what the reader currently has.
3. **Break** - name exactly what this version cannot do.
4. **Change** - add or replace one thing, marked as `patch` or `checkpoint`.
5. **Check** - prove this step's change works.
6. **Freeze** - make this version the baseline for the next step.

Write and self-review one numbered step before starting the next. Do not draft
the whole `From Scratch` section in one sweep unless the tutorial has only one
numbered step.

Self-review is internal. Public tutorial output uses `Checkpoint`,
`Before Moving On`, or `Try This`; it does not output `Step Self-Review` or
yes/no compliance bullets.

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
   - Read `references/tutorial-style-standards.md` when a step risks reading
     like a filled template.
   - Start each step with a pressure example: a concrete input, trace, call
     site, or small extension that makes the weakness visible.
   - Show the naive or previous version as the reader currently understands it.
   - Name its concrete defect: what caller knowledge, observation, failure
     diagnosis, invariant, or extension it cannot support.
   - Verify: the defect is visible in the current version, not imported from
     the final design.
4. Build One Complete Step
   - Translate the defect into one new requirement.
   - Add to or replace exactly one part of the previous version.
   - Declare `Code Change Type: patch` or `Code Change Type: checkpoint`.
   - Declare `Code Change Target`, such as `current script`, `runner.py`,
     `models.py`, or `src/<package>/...`.
   - Explain why the change addresses the named defect.
   - Verify: the step introduces one pressure, structure, helper, or mutation
     rule.
5. Run the Step Check
   - Add a tiny assertion, trace, manual check, or compile/run check that fits
     the current version.
   - Verify: the check proves the named defect is addressed, not the final
     solution.
6. Freeze and Self-Review the Step
   - State what this version can do now.
   - State that this version is the baseline for the next step.
   - Name the next gap as a concrete defect in the frozen version.
   - Run the internal per-step quality gate before drafting the next step.
   - Expose only reader-facing checkpoints in the tutorial body.
   - Verify: the next step can only continue from this version, not a hidden
     rewrite.
7. Continue Step-by-Step
   - Repeat the full step loop for the next planned version.
   - Do not outline all code versions first and then fill them thinly.
   - Do not produce the full tutorial body in one pass unless the tutorial has
     only one numbered step.
   - Verify: each completed step would still teach correctly if read alone with
     the prior steps.
8. Finish Without a Detached Code Dump
   - Let the last meaningful step yield the complete assembled checkpoint when
     code is needed.
   - If the tutorial builds real code, the final step's `Code Change Type` must
     be `checkpoint`.
   - Add only practice, common mistakes, verification checklist, and next small
     step after the build.
   - Verify: no final code section introduces new logic.

## Connected Build Contract

Every numbered step inside `## From Scratch` follows the increment cycle. Use
these fields when the user wants a structured guide:

- `Question`
- `Pressure Example`
- `Naive or Previous Version`
- `What Breaks`
- `New Requirement`
- `Add or Replace`
- `Code Change Type`
- `Code Change Target`
- `Code Change`
- `Why This Change Works`
- `Step Check`
- `Now This Version Can`
- `Freeze This Version`
- `Still Lacks`
- `What To Verify`
- `Checkpoint` or `Before Moving On`

Cycle rules:
- One step changes one pressure, structure, helper, or mutation rule.
- `Pressure Example` appears before the fix.
- `What Breaks` names a concrete defect in the current version, not a vague
  quality concern.
- `New Requirement` and `Why This Change Works` answer that defect directly.
- `Code Change Type` is `patch` for a local edit or `checkpoint` for a
  complete current runnable unit.
- `Code Change Target` names where the reader applies the change.
- The final meaningful code step is an assembled `checkpoint`, not a detached
  final code dump.
- The internal self-review checks pressure, one change, check, freeze, and next
  gap before moving on, but those compliance bullets are not public output.

## Decision Points

- If no plan exists and the tutorial has multiple possible teaching paths, use
  `from-scratch-tutorial-plan` first.
- If the supplied plan lacks concrete previous-version defects, repair the plan
  or draft a defect ladder before writing the tutorial body.
- If constraints are missing but the goal is clear, infer lightweight
  assumptions and label them before teaching.
- If missing constraints would change the data structure or public contract,
  ask before drafting the guide.
- If the draft fails its own step checks, repair the earliest failing version
  before continuing.
- If a step cannot explain why the previous version is insufficient, stop at
  that step and rewrite it; do not continue to later steps.
- If simplification is needed after the guide works, hand off to
  `from-scratch-tutorial-simplify`.
- If quality is uncertain, hand off to `from-scratch-tutorial-review`.

## Fixed Defaults

- `build_mode=connected-version-tutorial`
- `step_loop=pressure-naive-break-change-check-freeze`
- `implementation_style=contract-first-with-explicit-helper-boundaries`
- `final_code_policy=last-step-yields-assembled-checkpoint`
- `code_change_policy=patch-or-checkpoint-with-explicit-target`
- `source_fact_policy=separate-supplied-from-inferred`
- `step_depth_policy=complete-one-step-before-next-step`

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
- Pressure Example:
- Naive or Previous Version:
- What Breaks:
- New Requirement:
- Add or Replace:
- Code Change Type: patch | checkpoint
- Code Change Target:
- Code Change:
- Why This Change Works:
- Step Check:
- Now This Version Can:
- Freeze This Version:
- Still Lacks:
- What To Verify:
- Checkpoint:

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
- `references/tutorial-style-standards.md`
- `references/worked-example-lrucache.md`

Use `references/worked-example-lrucache.md` when the user needs a concrete
example of deriving a data structure from requirements. Use
`references/from-scratch-document-ladder.md` when the guide risks jumping too
quickly from requirement to helper internals. Use
`references/tutorial-style-standards.md` when the guide feels template-driven
or needs general bad/good examples.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The plan is enough; I can summarize the steps." | The build must produce the actual connected guide. |
| "The final code can be clearer if I rewrite it at the end." | A rewrite breaks the teaching chain and hides logic. |
| "Step checks are optional because this is documentation." | Checks are how the reader knows each version works. |
| "I can skip freezing the version." | Without a freeze, the next step may silently depend on hidden changes. |
| "The helper names are obvious from the final code." | Helpers should be forced by behavior and invariants, not copied from a memorized solution. |
| "The headings are present, so the step is complete." | A step is complete only when it deeply explains the previous version's defect and proves the new change. |
| "It is efficient to draft all steps at once and then polish." | The build loop is step-scoped; writing all steps at once tends to produce thin rationale and hidden jumps. |
| "The reader can assemble the final code from earlier snippets." | The final step must provide an assembled runnable checkpoint, or the tutorial has not delivered code. |
| "Code Change means whatever code is useful to show." | Code Change must be either a patch or checkpoint with an explicit target. |
| "Step Self-Review helps readers trust the guide." | It is an internal quality gate; public tutorials should use reader-facing checkpoints instead. |

## Red Flags

- A step lacks `Step Check`.
- A step lacks `Freeze This Version`.
- A step states `What Breaks` without first showing a concrete pressure
  example.
- A step lacks a concrete `What Breaks`, or `What Breaks` only says the design
  is "not scalable", "not clean", or "not abstract enough".
- `Why This Change Works` describes the new code without explaining how it
  resolves the named defect.
- Several steps read like a generated outline with short bullets instead of
  complete teaching sections.
- A step's `Code Change` does not say whether it is a patch or checkpoint.
- A `patch` has no target or does not identify what it changes from the
  previous version.
- A `checkpoint` is incomplete for its target or contains logic that earlier
  steps did not explain.
- The final meaningful step is a patch or partial class, forcing the reader to
  assemble final code from previous snippets.
- A data structure appears before the external contract and hard constraints.
- A helper appears before its caller, purpose, and mutation boundary are
  explained.
- Code appears that was not added to or replacing the previous version.
- The final code contains logic not present in earlier connected steps.
- The guide copies a final implementation shape instead of deriving it.
- The tutorial proceeds after a step check fails or is missing.
- The public tutorial includes `Step Self-Review` or yes/no compliance bullets.

## Verification

- [ ] The guide starts with reader goal, external contract, constraints, and
      teaching example.
- [ ] Every numbered step uses the build loop fields.
- [ ] Each step was completed and self-reviewed before the next step was
      drafted.
- [ ] Every step includes a pressure example before introducing the fix.
- [ ] The external contract and hard constraints appear before any data
      structure is proposed.
- [ ] Every step's `What Breaks` names concrete defects in the naive or
      previous version.
- [ ] Every step's `New Requirement` and `Why This Change Works` directly
      answer the named defect.
- [ ] Every step declares `Code Change Type` and `Code Change Target`.
- [ ] Patch steps modify exactly one visible part of the previous version.
- [ ] Checkpoint steps show complete runnable units and introduce no new logic.
- [ ] Every step has a concrete `Step Check`.
- [ ] Every step freezes the current version before naming the next gap.
- [ ] Helpers appear only after a step creates their need.
- [ ] Each helper has an explicit purpose and mutation or return boundary.
- [ ] The final complete code is the last connected step's assembled
      checkpoint.
- [ ] The guide ends with common mistakes, verification checklist, and next
      small step.
- [ ] Public tutorial output uses reader-facing checkpoints, not
      `Step Self-Review`.

## Guardrails

- Do not invent source facts, constraints, examples, or behavior.
- Do not continue from hidden code that was not shown in the previous version.
- Do not add a detached final implementation section.
- Do not leave the reader to assemble the final code from scattered snippets.
- Do not label a partial class or isolated function as a checkpoint.
- Do not recommend a helper before explaining what pressure or requirement
  created it.
- Do not proceed to the next step until the current step's pressure, break, one
  change, check, freeze, next gap, and internal self-review all pass.
- Do not output internal self-review fields in the public tutorial body.
- Do not say "store X in a map or list" without explaining what operation must
  stay `O(1)` or what invariant it protects.
- Do not optimize prose during the first build if it risks dropping checks or
  reasoning; simplify only after the guide is complete.
