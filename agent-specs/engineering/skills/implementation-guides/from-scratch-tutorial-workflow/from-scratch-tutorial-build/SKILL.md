---
name: from-scratch-tutorial-build
description: v0.1.4 - Build a pressure-driven from-scratch implementation tutorial one complete public step at a time with explicit patch/checkpoint code changes. Use when turning a reader goal, external contract, teaching example, and version plan into a guide with pressure examples, concrete previous-version defects, code change targets, final assembled checkpoint, reader-facing checkpoints, helper contracts, and no detached final code.
---

# From-Scratch Tutorial Build

## Overview

Build the complete from-scratch implementation tutorial. This is the single
builder for deriving one feature, method, or coherent core slice from external
behavior into connected code versions. The goal is not to dump final code. The
goal is to make the internal model, helper contracts, mutation boundaries, and
final runnable implementation grow from requirements one version at a time.

The builder must write and self-review one numbered step before starting the
next one. A step is not complete because it has the right headings; it is
complete only when it explains the current version's concrete defect, changes
one thing, proves that change, freezes the new baseline, and names the next
gap.

Self-review is an internal quality gate. Do not output `Step Self-Review` or
yes/no compliance bullets in the public tutorial body. Use reader-facing
checkpoint language such as `Checkpoint`, `Before Moving On`, or `Try This`
when the reader needs a visible pause.

`Code Change` has a precise role: it tells the reader what code exists after
this step. It must be explicitly marked as either a `patch` or a `checkpoint`.
A `patch` shows one local addition or replacement from the previous version. A
`checkpoint` shows the complete current runnable file, module, or script. The
last meaningful step of a code tutorial must be a checkpoint.

For any non-trivial tutorial, do not draft the entire `From Scratch` section in
one sweep. Materialize or present Step 1, run the step quality gate, then append
Step 2 from the frozen Step 1 baseline. Continue this way until the last step.

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

Use this loop for every numbered tutorial step, finishing the whole loop for
Step N before drafting Step N+1:

```text
Pressure Example -> Naive/Previous Version -> What Breaks -> New Requirement
-> Add/Replace -> Code Change Type/Target -> Why This Works -> Step Check
-> Freeze -> Next Gap -> Internal Self Review
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

Every numbered step inside the `From Scratch` section should answer the same
teaching questions:

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

Rules:
- Each step introduces only one new pressure, structure, helper, or mutation
  rule.
- Each step must be written as a complete section before the next step begins.
- `What Breaks` must name concrete defects in the current version. Vague
  statements such as "this does not scale", "this is not clean", or "we need a
  better abstraction" fail the step unless they name the specific caller burden,
  missing observation, broken invariant, or failing trace.
- `Pressure Example` must appear before or inside `What Breaks`. It should
  show the small concrete situation that makes the defect visible.
- `New Requirement` must be a direct response to `What Breaks`.
- `Why This Change Works` must connect the code change back to the defect, not
  merely restate what the code does.
- `Code Change Type` must be either `patch` or `checkpoint`.
- `Code Change Target` must name where the reader applies the change.
- A `patch` must say what previous code it adds to or replaces and may show
  only the local changed snippet.
- A `checkpoint` must show the full current runnable unit for its target. It
  may include earlier code, but it must not introduce unexplained logic.
- The final meaningful step of a code tutorial must be a `checkpoint`, not a
  patch. The reader should be able to copy that final checkpoint without
  stitching earlier snippets together.
- The internal step self-review must explicitly answer, but not output:
  - Does this step name a concrete defect in the previous version?
  - Does the step include a pressure example before the fix?
  - Did this step change exactly one thing?
  - Is the code change type correct, and is the target explicit?
  - Does the check prove this step's defect was addressed?
  - Is the next gap visible from the frozen version?
- Do not solve the whole feature in one step.
- Do not present disconnected code blocks that cannot be related to the
  previous version.
- When replacing code, show the old shape briefly and the new code explicitly.
- In `Add or Replace`, use connector wording in substance:
  `In the previous version, add ...` or `Replace this part with ...`.
- The final complete code must be the final connected step's checkpoint, not a
  separate unexplained section and not a pointer to earlier snippets.
- Public tutorial output must not contain `Step Self-Review` or internal
  yes/no quality-gate bullets.

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
- `step_loop=one-step-at-a-time-defect-change-check-freeze-review`
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
- Do not proceed to the next step until the current step's concrete defect,
  one change, check, freeze, next gap, and self-review all pass.
- Do not output internal self-review fields in the public tutorial body.
- Do not say "store X in a map or list" without explaining what operation must
  stay `O(1)` or what invariant it protects.
- Do not optimize prose during the first build if it risks dropping checks or
  reasoning; simplify only after the guide is complete.
