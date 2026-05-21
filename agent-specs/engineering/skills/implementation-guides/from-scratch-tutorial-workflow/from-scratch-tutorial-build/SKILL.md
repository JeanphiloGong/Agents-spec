---
name: from-scratch-tutorial-build
description: v0.3.1 - Build a from-scratch tutorial from a task-first tutorial plan through Nystrom/Karpathy/Norvig standards and the tutorial increment cycle. Use when turning reader goal, real scenario, problem compression, core model, invariants, external contract, teaching example, dependency graph, and tutorial build tasks into a natural guide with verified checkpoints and final assembled code.
---

# From-Scratch Tutorial Build

## Overview

Build a from-scratch implementation tutorial one complete teaching increment
at a time. The goal is not to dump final code. The goal is to let the reader
feel a small pressure, see the naive baseline break, make one code change,
check that change, freeze the checkpoint, and then continue.

## Teaching Standard

Every built tutorial must satisfy:

- **Nystrom complete engineering chain** - the guide grows as a connected
  project, and every meaningful step leaves the reader with a working system
  piece.
- **Karpathy runnable from-zero coding** - code appears early, stays runnable,
  and every new line is justified by behavior it unlocks.
- **Norvig small complete problem compression** - the real problem is reduced
  to a small complete model that can be held in one sitting.

This is not a style preference. If a draft lacks a real scenario, a compressed
problem, an ordered task ladder, or a final assembled checkpoint, repair it
before continuing.

## The Tutorial Increment Cycle

```text
+------------------------------------------------+
|                                                |
|  Pressure -> Naive baseline -> Break -> Change |
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
   makes the current baseline's weakness visible.
2. **Naive baseline** - show what the reader currently has.
3. **Break** - name exactly what this baseline cannot do.
4. **Change** - add or replace one thing, marked as `patch` or `checkpoint`.
5. **Check** - prove this step's change works.
6. **Freeze** - make this checkpoint the baseline for the next step.

Write and self-review one numbered step before starting the next. Do not draft
the whole `From Scratch` section in one sweep unless the tutorial has only one
numbered step.

Self-review is internal. Public tutorial output uses `Checkpoint`,
`Before Moving On`, or `Try This`; it does not output `Step Self-Review` or
yes/no compliance bullets.

The build fields are internal obligations, not mandatory public headings. The
published guide should read like a teacher explaining a project, with
paragraphs, code, and reader-facing checkpoints. Only use literal field labels
such as `Question` or `Code Change Type` when the human asks for a structured
audit format or when the target audience benefits from explicit scaffolding.

## When to Use

- A `from-scratch-tutorial-plan` output is ready to draft.
- The human wants the tutorial body produced as a durable markdown guide.
- A task-first tutorial plan names build tasks, dependencies, acceptance
  criteria, verification, and checkpoint commit handoff.
- The guide must show code growing through connected checkpoints.
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
previous visible baseline.

1. Load the Plan or Scope
   - Read reader goal, real scenario, problem compression, core model,
     invariants, external contract, teaching example, tutorial dependency
     graph, tutorial build task list, helper contracts, verification matrix,
     checkpoint commit handoff, and review risks.
   - Treat the tutorial build task list as the execution source of truth. Do
     not reconstruct an old table-driven plan or draft from a hidden final-code
     outline.
   - Always read `references/tutorial-style-standards.md` before drafting a
     non-trivial tutorial.
   - If no plan exists, infer lightweight assumptions only when they do not
     change the public contract or data structure.
   - Verify: the tutorial is scoped to one method, feature, or coherent core
     slice.
2. Draft the Scenario and Compression First
   - Write the real scenario: who calls or uses this, why they need it, and
     what they observe.
   - Write the compressed problem: what smaller model the tutorial implements,
     what it includes, and what it deliberately leaves out.
   - Write the core model and invariants before code structure.
   - Verify: the reader understands why this thing exists before seeing helpers
     or internal classes.
3. Draft the Contract
   - Write supplied facts, inferred assumptions, constraints, and the teaching
     example before internal structure.
   - Verify: the behavior is clear before data structures appear.
4. Derive the First Pressure
   - Start each step with a pressure example: a concrete input, trace, call
     site, or small extension that makes the weakness visible.
   - Show the naive or previous baseline as the reader currently understands it.
   - For the first baseline, start from the external input or caller-visible
     mental model. Do not begin with an internal carrier, helper, registry,
     node, store, adapter, state machine, or final class shape unless an
     earlier visible pressure already forced it.
   - Name its concrete defect: what caller knowledge, observation, failure
     diagnosis, invariant, or extension it cannot support.
   - Verify: the defect is visible in the current baseline, not imported from
     the final design.
5. Build One Complete Step
   - Translate the defect into one new requirement.
   - Add to or replace exactly one part of the previous baseline.
   - Declare `Code Change Type: patch` or `Code Change Type: checkpoint`.
   - Declare `Code Change Target`, such as `current script`, `runner.py`,
     `models.py`, or `src/<package>/...`.
   - Explain why the change addresses the named defect.
   - Verify: the step introduces one pressure, structure, helper, or mutation
     rule.
6. Run the Step Check
   - Add a tiny assertion, trace, manual check, or compile/run check that fits
     the current checkpoint.
   - Verify: the check proves the named defect is addressed, not the final
     solution.
7. Freeze and Self-Review the Step
   - State what this checkpoint can do now.
   - State that this checkpoint is the baseline for the next step.
   - Name the next gap as a concrete defect in the frozen checkpoint.
   - Run the internal per-step quality gate before drafting the next step.
   - Expose only reader-facing checkpoints in the tutorial body.
   - If the human wants Git history for each document checkpoint, hand off to
     `single-doc-checkpoint-commit-skill` after this freeze is verified. Keep
     `Pressure / Naive / Break / Change / Check / Freeze / Still lacks / Next`
     in the commit message rather than dumping them into public tutorial prose.
   - Verify: the next step can only continue from this checkpoint, not a hidden
     rewrite.
8. Continue Step-by-Step
   - Repeat the full step loop for the next tutorial build task.
   - Before starting a task, confirm its dependencies and acceptance criteria.
   - After finishing a task, check its verification items and document target.
   - Do not outline all code checkpoints first and then fill them thinly.
   - Do not produce the full tutorial body in one pass unless the tutorial has
     only one numbered task.
   - Verify: each completed step would still teach correctly if read alone with
     the prior steps.
9. Finish Without a Detached Code Dump
   - Let the last meaningful step yield the complete assembled checkpoint when
     code is needed.
   - If the tutorial builds real code, the final step's `Code Change Type` must
     be `checkpoint`.
   - Add only practice, common mistakes, verification checklist, and next small
     step after the build.
   - Verify: no final code section introduces new logic.

## Connected Build Contract

Every tutorial build task that drafts a numbered step inside `## From Scratch`
follows the increment cycle. Use these fields internally, or publicly when the
user wants a structured guide:

- `Question`
- `Pressure Example`
- `Naive or Previous Baseline`
- `What Breaks`
- `New Requirement`
- `Add or Replace`
- `Code Change Type`
- `Code Change Target`
- `Code Change`
- `Why This Change Works`
- `Step Check`
- `Now This Checkpoint Can`
- `Freeze This Checkpoint`
- `Still Lacks`
- `What To Verify`
- `Checkpoint` or `Before Moving On`

Cycle rules:
- One step changes one pressure, structure, helper, or mutation rule.
- `Pressure Example` appears before the fix.
- `What Breaks` names a concrete defect in the current baseline, not a vague
  quality concern.
- `New Requirement` and `Why This Change Works` answer that defect directly.
- The first baseline uses caller-visible inputs and behavior. It must not
  smuggle in the future internal abstraction the step is supposed to teach.
- `Code Change Type` is `patch` for a local edit or `checkpoint` for a
  complete current runnable unit.
- `Code Change Target` names where the reader applies the change.
- The final meaningful code step is an assembled `checkpoint`, not a detached
  final code dump.
- The internal self-review checks pressure, one change, check, freeze, and next
  gap before moving on, but those compliance bullets are not public output.

Task execution rules:
- Each task must have acceptance criteria, verification, dependencies, document
  target, and estimated scope.
- Start a task only when its dependencies are satisfied.
- Do not merge two tutorial-step tasks just because they edit the same
  document.
- If a task is marked `Checkpoint commit: yes`, complete the document task,
  run review/sanity checks, then follow the plan's `Checkpoint Commit Handoff`.
  Use `single-doc-checkpoint-commit-skill` only when the human asks for Git
  history at that checkpoint.
- The task list replaces the old row-based step table. Do not ask for or
  produce a table as the build driver.

Public voice rules:
- Prefer natural paragraphs and code over long repeated field labels.
- Use reader-facing labels such as `Checkpoint`, `Try This`, or `Before Moving
  On`.
- Do not publish `Step Self-Review` or yes/no compliance bullets.
- Do not hide the required content; translate the fields into readable prose.
- If the guide starts to read like a checklist, rewrite the step before moving
  on.

## Decision Points

- If no plan exists and the tutorial has multiple possible teaching paths, use
  `from-scratch-tutorial-plan` first.
- If the supplied task plan lacks concrete previous-baseline defects,
  acceptance criteria, dependencies, or verification, repair the task plan
  before writing the tutorial body.
- If constraints are missing but the goal is clear, infer lightweight
  assumptions and label them before teaching.
- If missing constraints would change the data structure or public contract,
  ask before drafting the guide.
- If the draft fails its own step checks, repair the earliest failing checkpoint
  before continuing.
- If a step cannot explain why the previous baseline is insufficient, stop at
  that step and rewrite it; do not continue to later steps.
- If simplification is needed after the guide works, hand off to
  `from-scratch-tutorial-simplify`.
- If quality is uncertain, hand off to `from-scratch-tutorial-review`.
- If the user asks to save a verified single-document tutorial checkpoint in
  Git history, use `single-doc-checkpoint-commit-skill` and the plan's
  `Checkpoint Commit Handoff` instead of `git-commit-skill`.

## Fixed Defaults

- `build_mode=task-first-connected-checkpoint-tutorial`
- `plan_shape=task-first-tutorial-build-plan`
- `step_loop=task-scoped-pressure-naive-break-change-check-freeze`
- `teaching_standard=nystrom-chain+karpathy-coding+norvig-compression`
- `implementation_style=scenario-and-contract-first-with-explicit-helper-boundaries`
- `final_code_policy=last-step-yields-assembled-checkpoint`
- `code_change_policy=patch-or-checkpoint-with-explicit-target`
- `source_fact_policy=separate-supplied-from-inferred`
- `step_depth_policy=complete-one-step-before-next-step`
- `naive_baseline_policy=external-input-before-internal-carrier`
- `public_voice_policy=natural-tutorial-not-checklist`
- `checkpoint_commit_policy=single-doc-freeze-fields-in-commit-message`
- `checkpoint_handoff_policy=follow-plan-checkpoint-commit-handoff`

## Output Format

```markdown
# <Topic> From Scratch

## Reader and Goal
- ...

## Real Scenario
- ...

## Problem Compression
- ...

## Core Model and Invariants
- ...

## External Contract
- Supplied facts:
- Inferred assumptions:
- Constraints:

## Teaching Example
- ...

## From Scratch
### Step 1: <one concrete problem>
Explain the pressure in prose, show the naive or previous baseline, name what
breaks, make one patch or checkpoint change, check it, and freeze this
checkpoint.
Use reader-facing labels such as `Checkpoint` or `Try This` instead of dumping
the internal field list unless structured output is requested.

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
quickly from requirement to helper internals. Always read
`references/tutorial-style-standards.md` before drafting non-trivial tutorials;
use it again when the guide feels template-driven or needs general bad/good
examples.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The plan is enough; I can summarize the steps." | The build must produce the actual connected guide. |
| "The final code can be clearer if I rewrite it at the end." | A rewrite breaks the teaching chain and hides logic. |
| "Step checks are optional because this is documentation." | Checks are how the reader knows each checkpoint works. |
| "I can skip freezing the checkpoint." | Without a freeze, the next step may silently depend on hidden changes. |
| "The helper names are obvious from the final code." | Helpers should be forced by behavior and invariants, not copied from a memorized solution. |
| "The headings are present, so the step is complete." | A step is complete only when it deeply explains the previous baseline's defect and proves the new change. |
| "It is efficient to draft all steps at once and then polish." | The build loop is step-scoped; writing all steps at once tends to produce thin rationale and hidden jumps. |
| "The reader can assemble the final code from earlier snippets." | The final step must provide an assembled runnable checkpoint, or the tutorial has not delivered code. |
| "Code Change means whatever code is useful to show." | Code Change must be either a patch or checkpoint with an explicit target. |
| "Step Self-Review helps readers trust the guide." | It is an internal quality gate; public tutorials should use reader-facing checkpoints instead. |
| "The headings are required, so the output should show all of them." | The headings are obligations, not necessarily public prose; the tutorial should read naturally. |
| "The scenario is optional because the code is clear." | Without the scenario, the tutorial teaches an implementation shape without explaining why it exists. |
| "The compressed model can be inferred." | Norvig-style compression must be explicit so the reader knows what is essential and what is deferred. |
| "Git history needs the same fields, so the tutorial body should show them." | Use `single-doc-checkpoint-commit-skill` to record fields in the commit message while keeping the document readable. |
| "I can start with the final context object to keep the example short." | That steals the lesson. Start with the caller's real input, then introduce the context object only after shared run state becomes a visible need. |

## Red Flags

- A step lacks `Step Check`.
- A step lacks `Freeze This Checkpoint`.
- A step states `What Breaks` without first showing a concrete pressure
  example.
- The first baseline starts with a future internal abstraction, such as a
  run-level `context`, registry, node, store, adapter, state machine, or final
  class, before the tutorial has justified it.
- A step lacks a concrete `What Breaks`, or `What Breaks` only says the design
  is "not scalable", "not clean", or "not abstract enough".
- `Why This Change Works` describes the new code without explaining how it
  resolves the named defect.
- Several steps read like a generated outline with short bullets instead of
  complete teaching sections.
- The guide has the required fields but reads like an internal checklist rather
  than a tutorial.
- The guide lacks a real scenario, problem compression, core model, invariants,
  or verification matrix for a non-trivial engineering topic.
- A step's `Code Change` does not say whether it is a patch or checkpoint.
- A `patch` has no target or does not identify what it changes from the
  previous baseline.
- A `checkpoint` is incomplete for its target or contains logic that earlier
  steps did not explain.
- The final meaningful step is a patch or partial class, forcing the reader to
  assemble final code from previous snippets.
- A data structure appears before the external contract and hard constraints.
- A helper appears before its caller, purpose, and mutation boundary are
  explained.
- Code appears that was not added to or replacing the previous baseline.
- The final code contains logic not present in earlier connected steps.
- The guide copies a final implementation shape instead of deriving it.
- The tutorial proceeds after a step check fails or is missing.
- The public tutorial includes `Step Self-Review` or yes/no compliance bullets.

## Verification

- [ ] The guide starts with reader goal, external contract, constraints, and
      teaching example.
- [ ] The guide includes real scenario, problem compression, core model, and
      invariants before internal structure.
- [ ] The guide follows the Nystrom/Karpathy/Norvig teaching standard.
- [ ] Every numbered step satisfies the build loop obligations, whether they
      are written as natural prose or explicit fields.
- [ ] Each step was completed and self-reviewed before the next step was
      drafted.
- [ ] Every step includes a pressure example before introducing the fix.
- [ ] The first baseline starts from caller-visible input or behavior and does
      not introduce future internal abstractions early.
- [ ] The external contract and hard constraints appear before any data
      structure is proposed.
- [ ] Every step's `What Breaks` names concrete defects in the naive or
      previous baseline.
- [ ] Every step's `New Requirement` and `Why This Change Works` directly
      answer the named defect.
- [ ] Every step declares `Code Change Type` and `Code Change Target`.
- [ ] Patch steps modify exactly one visible part of the previous baseline.
- [ ] Checkpoint steps show complete runnable units and introduce no new logic.
- [ ] Every step has a concrete `Step Check`.
- [ ] Every step freezes the current checkpoint before naming the next gap.
- [ ] Helpers appear only after a step creates their need.
- [ ] Each helper has an explicit purpose and mutation or return boundary.
- [ ] The final complete code is the last connected step's assembled
      checkpoint.
- [ ] The guide ends with common mistakes, verification checklist, and next
      small step.
- [ ] Public tutorial output uses reader-facing checkpoints, not
      `Step Self-Review`.
- [ ] Public tutorial output reads as natural teaching prose, not a compliance
      checklist.
- [ ] Checkpoint commit handoff, when present, was preserved outside the
      public tutorial prose.

## Guardrails

- Do not invent source facts, constraints, examples, or behavior.
- Do not drive the build from an old row-based step table when a task-first plan is
  expected.
- Do not skip real scenario, problem compression, core model, or invariants for
  non-trivial tutorials.
- Do not continue from hidden code that was not shown in the previous baseline.
- Do not add a detached final implementation section.
- Do not leave the reader to assemble the final code from scattered snippets.
- Do not label a partial class or isolated function as a checkpoint.
- Do not recommend a helper before explaining what pressure or requirement
  created it.
- Do not proceed to the next step until the current step's pressure, break, one
  change, check, freeze, next gap, and internal self-review all pass.
- Do not output internal self-review fields in the public tutorial body.
- Do not mechanically output every internal field label unless the user asks
  for structured output.
- Do not use normal code-commit flow for a single tutorial document checkpoint;
  use `single-doc-checkpoint-commit-skill` when the user wants the freeze in
  Git history.
- Do not say "store X in a map or list" without explaining what operation must
  stay `O(1)` or what invariant it protects.
- Do not optimize prose during the first build if it risks dropping checks or
  reasoning; simplify only after the guide is complete.
