---
name: from-scratch-tutorial-plan
description: v0.3.2 - Plan a from-scratch tutorial series as capability versions V0 through Vn, separate documents, and verifiable checkpoints within each version. Use when the human wants a task-first teaching plan with version boundaries, document targets, entry baselines, acceptance criteria, replay checks, and build handoff before drafting.
---

# From-Scratch Tutorial Plan

## Overview

Plan one coherent tutorial series: reader, real scenario, small complete model,
pressures that force each structure, and ordered writing tasks without hidden
jumps between capability versions or local checkpoints.

Use this skill to prevent tutorials from jumping straight from requirements to
finished code, becoming disconnected concept notes, or producing a table that
the builder fills mechanically. The output is a task plan for writing the
tutorial, not the tutorial body and not a row-based matrix.

## Version and Document Contract

- Use one structure for all plans: a navigation entry plus a separate tutorial
  document for every capability version. Do not add a `document_mode` selector.
- `V0` is the smallest runnable teaching baseline. `V1` through `Vn` add
  meaningful capabilities; versions are not arbitrary article-length splits
  or product release numbers. Do not invent extra versions to fill a pattern.
- Inside each version, use `V0.C0`, `V1.C0`, `V1.C1`, and so on for checked
  increments. Reset `C0` in each version; do not introduce a second lowercase
  version sequence. A checkpoint is a section within its version document.
- `from-scratch-tutorial.md` is navigation: reader goal, version route,
  prerequisites, and links. It contains no implementation ladder or final code.
- Use `v0-baseline.md`, `v1-<capability>.md`, and so on for tutorial bodies.
  Each document names its entry baseline, included and deferred scope,
  checkpoints, exit capability, final checkpoint, and verification commands.
- A later version starts from a named, verified final checkpoint of an earlier
  version. Record the source document, checkpoint ID, required files, and
  commands to obtain and check that state. Never start from the latest example.
- Every version ends with its own assembled runnable checkpoint as the last
  meaningful code step. Explain any last change in that step; introduce no
  unexplained logic. Name inherited files explicitly rather than silently
  borrowing them from a later version.
- Keep the series source-independent and outside production code by default.
  Any accompanying example is supporting code, not a substitute for the route.

For a small topic, the series may contain only `V0`; retain the entry/document
separation without manufacturing a `V1`.

## Teaching Standard

Every plan must satisfy three teaching pressures:

- **Nystrom complete engineering chain** - plan a connected project path where
  every checkpoint leaves a working system piece.
- **Karpathy runnable from-zero coding** - code should appear early, stay
  runnable, and grow only when behavior forces it.
- **Norvig small complete problem compression** - compress the real scenario
  into the smallest model that still teaches the core idea.

Do not treat these as stylistic inspiration. They are acceptance criteria for
the plan. If the route lacks a real scenario, a compressed model, an ordered
task ladder, or an assembled final checkpoint task for each version, the plan
is incomplete.

## The Tutorial Increment Cycle

```text
Pressure -> Naive baseline -> Break -> Change -> Check -> Freeze -> Next step
```

Plan each tutorial-writing task that drafts a from-scratch step as one full
pass through the cycle:

1. **Pressure** - what small input, trace, call site, or extension makes the
   current weakness visible?
2. **Naive baseline** - what does the reader have at this point?
3. **Break** - what exactly can the current baseline not do?
4. **Change** - what one thing should be added or replaced?
5. **Check** - how will the reader prove this one change worked?
6. **Freeze** - what is the new baseline and next visible gap?

The plan should not expose this as an old table-driven ladder. Use it inside
individual build tasks as acceptance criteria, verification, and optional
single-document checkpoint commit metadata.

## When to Use

- The human wants a plan before a from-scratch implementation tutorial is
  written.
- The tutorial target has enough complexity to need ordered teaching steps.
- The agent needs to decide examples, checkpoints, helper boundaries, or
  verification before drafting.
- A tutorial draft risks skipping why a structure, helper, or state variable is
  necessary.
- The human wants a plan that can be executed task-by-task like
  `workflow-plan`, but for a document/tutorial deliverable.

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
     implemented across a coherent series of small capability versions.
   - State what is included, what is deferred, and why the smaller model still
     teaches the core idea.
   - Verify: the compressed problem is not a toy that loses the important
     invariant, and not a production copy full of noise.
4. Define Core Model and Invariants
   - Name the 3-5 concepts the implementation manipulates.
   - List invariants that every checkpoint must protect.
   - Verify: no data structure appears before a behavior, invariant, or
     operation creates the need.
5. Capture External Contract
   - State supplied behavior, inputs, outputs, constraints, and known examples.
   - Mark inferred assumptions separately from supplied facts.
   - Verify: no internal data structure appears before the behavior contract.
6. Choose the Teaching Example
   - Pick one small example or trace that exposes the first real pressure.
   - Start the first baseline from the external input or caller mental model,
     not from an internal carrier, helper, or final abstraction that has not
     been forced yet.
   - Avoid examples that require the final solution to understand.
   - Prefer universal examples or source-independent scenarios; do not bake the
     user's current production module into the skill's reusable standards.
   - Verify: the example can be reused later as a step check.
7. Map Versions, Documents, and Dependencies
   - Define `V0` and each capability addition before planning checkpoints.
   - Map each version to one tutorial file, entry baseline, checkpoint range,
     final checkpoint, exit capability, and verification command.
   - Order the teaching dependencies across versions and within each version.
   - Show which concept or code capability must be understood before the next
     task can be written.
   - Verify: the graph starts from reader-visible pressure, names each version
     transition, and contains no dependency on future code.
8. Plan Tutorial Build Tasks
   - Write ordered tasks with description, acceptance criteria, verification,
     dependencies, version, checkpoint ID, exact document section,
     code-change role, and checkpoint commit handoff.
   - Group tasks by version/document. Reserve a separate task for navigation;
     never target the entry file for implementation steps.
   - For tasks that draft a from-scratch step, include the internal teaching
     fields: pressure, naive, break, change, check, freeze, still lacks, next.
   - Mark whether each task needs a single-document checkpoint commit after it
     is written and reviewed.
   - Add a package-level `Checkpoint Commit Handoff` table when any task should
     create document history.
   - Verify: every version has its own final assembled checkpoint task, and
     every task is small enough to draft, check, and freeze in one focused pass.
9. Plan Helper Contracts
   - Introduce helpers only after a planned step creates the need.
   - State each helper's caller, input, output, and mutation boundary.
   - Verify: no helper exists only because it appears in a known final answer.
10. Plan Verification Matrix
   - Include happy path, invalid input, failure path, boundary case, and one
     representative state or event trace when relevant.
   - Tie each verification item to a planned task or final invariant.
   - Plan an empty-directory replay from `V0`, checking every checkpoint and
     freezing each version before proceeding to the next version.
   - Verify: final validation is not only "run all tests".
11. Define Review Risks
   - List where the tutorial could jump, hide logic, or smuggle final code.
   - Add task-level checkpoints for those risks.
   - Verify: the plan can be handed to `from-scratch-tutorial-build`.

## Tutorial Task Contract

Every planned task must be a complete writing unit, not a row that merely names
the next concept. A task can draft setup material, one from-scratch tutorial
step, a final assembled checkpoint, or verification/supporting sections.

For each tutorial-step drafting task:

- `Naive or Previous Baseline` states the exact code or mental model the reader
  currently has.
- The first naive baseline starts from real external input or caller-visible
  behavior. It must not smuggle in future internal abstractions such as
  run-level context carriers, registries, nodes, stores, adapters, state
  machines, or final class shapes before the pressure that creates them.
- `Pressure Example` shows the concrete input, trace, call site, or extension
  that makes the current baseline's weakness visible before naming the defect.
- `Break` names what that baseline cannot explain, observe, protect,
  or let the caller do.
- `New Requirement` translates that break into the next requirement.
- `Add or Replace` changes exactly one thing in response to that pressure.
- `Code Change Type` is `patch` for a local change or `checkpoint` for a
  complete current runnable unit.
- `Code Change Target` names the file, module, script, or snippet the reader
  changes.
- `Step Check` proves the defect was addressed in the current checkpoint.
- `Freeze or Next Gap` states the new baseline and the next visible defect.
- `Checkpoint Commit` says whether this task should be saved by
  `single-doc-checkpoint-commit-skill` after review.

If `Break` could apply to any tutorial, the step is not planned well
enough. For example, "ordinary function calls are not scalable" is too vague;
"a list-backed cache must scan every entry to answer `get(key)`, so lookup time
depends on key position" is concrete.

If `Pressure Example` is missing, the step will read like a template. The plan
must show what the reader experiences before the tutorial names the defect.

Start a pipeline tutorial from `file_id`, not `prepare(context)` when `context`
is the carrier it needs to justify. Introduce shared run state only after a
visible step forces it; the same rule applies to other internal abstractions.

For every version, the final code task must have `Code Change Type:
checkpoint` and must name the complete target it assembles, such as `runner.py`
or `current script`. The final checkpoint task may include code introduced
earlier, but it must not add unexplained logic. In a one-checkpoint `V0`, teach
and verify the first runnable baseline in that same checkpoint; do not invent
a previous implementation or a failing test for functionality still deferred.

Every task must include `Description`, `Acceptance criteria`, `Verification`,
`Dependencies`, `Version`, `Checkpoint ID`, `Document target`, `Estimated scope`,
and `Checkpoint commit`. Use `n/a` checkpoint IDs for prose-only tasks.

Use `Checkpoint commit: yes` only for tasks that freeze a meaningful tutorial
step or final assembled checkpoint. Do not create a checkpoint commit for
planning-only, preface-only, or cleanup-only tasks unless the human explicitly
wants that document history.

When any task has `Checkpoint commit: yes`, add a `Checkpoint Commit Handoff`
section after the task list. This mirrors `workflow-plan` issue handoff, but
for single-document learning checkpoints:

- use `single-doc-checkpoint-commit-skill`, not the normal code commit flow
- keep `Pressure / Naive / Break / Change / Check / Freeze / Still lacks /
  Next` in the commit message
- keep the public tutorial body reader-facing and free of commit metadata
- identify the version document and checkpoint ID for each commit; this skill
  saves one document at a time and does not merge the series into one file

## Decision Points

- If requirements are too vague to choose data structures or examples, ask for
  the smallest missing behavior or constraint.
- If the human already supplied a clear teaching route, keep the plan short but
  still output executable writing tasks.
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
State the example, why it exposes the pressure, and how it will be checked.

## Version and Document Map
- Tutorial root: external tutorial directory
- Entry: `from-scratch-tutorial.md` (navigation only)

| Version | Capability / Deferred Scope | Tutorial File | Entry Baseline | Checkpoints | Final Checkpoint | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| V0 | smallest runnable baseline / ... | `v0-baseline.md` | empty directory | V0.C0 | V0.C0 | ... |
| V1 | one meaningful capability / ... | `v1-<capability>.md` | V0.C0, source file and setup commands | V1.C0 through V1.Cn | V1.Cn | ... |

Include only versions justified by the topic; expand each entry baseline into
exact required files and setup/check commands in the corresponding task.

## Tutorial Dependency Graph
~~~text
real scenario
-> compressed model
-> teaching example
-> V0.C0: runnable baseline and V0 freeze
-> V1.C0 -> ... -> V1.Cn: capability and V1 freeze
-> next planned version, if any
~~~

## Tutorial Build Task List

### Entry: Reader Contract and Navigation

#### Task 1: Establish reader goal and version navigation

- Description: introduce the reader goal, prerequisites, and version route.
- Acceptance criteria: link each version; keep implementation in version files.
- Verification: check links and compare the route with the version map.
- Dependencies: none
- Version: series
- Checkpoint ID: n/a
- Document target: `from-scratch-tutorial.md` (navigation only)
- Code change role / target: prose-only / n/a
- Estimated scope: S
- Checkpoint commit: no, unless document history was explicitly requested

### V0: Runnable Baseline — `v0-baseline.md`

#### Task 2: Draft V0.C0

**Description:** Introduce the shared scenario, compressed model, contract, and
first runnable baseline, then teach and verify one complete increment.

**Acceptance criteria:**
- [ ] Pressure appears before the fix.
- [ ] Naive or previous baseline is visible.
- [ ] Break is concrete and source-independent.
- [ ] One change is introduced.
- [ ] Step check proves this task's break was addressed.
- [ ] Reader-facing checkpoint freezes the new baseline.
- [ ] This version's final code step is an assembled runnable checkpoint.

**Verification:**
- [ ] ...

**Dependencies:** Task 1

**Version:** V0

**Checkpoint ID:** V0.C0

**Document target:** `v0-baseline.md` / `### V0.C0: ...`

**Code change role:** checkpoint (the only/final code step in this V0 example)

**Code change target:** complete file/module

**Estimated scope:** S

**Checkpoint commit handoff:**
- checkpoint_commit: yes | no
- single_doc_commit_skill: yes | no
- freeze_fields_for_commit_message: Pressure / Naive / Break / Change / Check /
  Freeze / Still lacks / Next (when history is requested)

### V1: <Capability> — `v1-<capability>.md` (when justified)

Repeat the task contract for V1.C0 onward. Start from the verified V0 final
checkpoint and finish V1 with its own assembled checkpoint and version check.

## Checkpoint Commit Handoff
- document_checkpoint_policy: per_meaningful_freeze | per_version_final_checkpoint | none
- commit_skill: single-doc-checkpoint-commit-skill

| Task | Document | Checkpoint ID | checkpoint_commit | freeze_summary | commit_rationale |
| --- | --- | --- | --- | --- | --- |
| Task 2 | `v0-baseline.md` | V0.C0 | yes | ... | ... |

## Helper Contracts To Introduce
| Helper | First Needed In | Purpose | Inputs | Output/Mutation |
| --- | --- | --- | --- | --- |

## Verification Matrix
| Version / Checkpoint | Case | What It Proves | Command / Expected Result |
| --- | --- | --- | --- |
| V0.C0 | baseline | ... | ... |
| V1.C0 | capability pressure | ... | ... |
| each version final | version freeze | inherited behavior plus new capability | ... |
| V0 through final version | empty-directory replay | no hidden or future dependencies | ... |

Add happy path, invalid input, failure path, boundary case, and trace where
relevant to the version's scope; do not test future capabilities early.

## Review Risks
- ...

## Build Handoff
- recommended_builder: from-scratch-tutorial-build
- tutorial_root:
- tutorial_entry: from-scratch-tutorial.md
- version_documents: ordered version/file pairs from the map above
- version_entry_baselines: exact prior checkpoint, files, setup/check commands
- version_final_checkpoints:
- task_execution_order:
- replay_order: V0.C0 through each planned version's final checkpoint
- notes:
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The tutorial can discover the path while writing." | Planning prevents hidden jumps and repeated rewrites. |
| "Version headings inside one article are enough." | Capability versions need separate files, entry baselines, and final checkpoints. |
| "Every checkpoint needs a new document." | Checkpoints are increments within a version; file boundaries follow capabilities. |
| "The helper names are obvious from the final code." | Helpers must be forced by behavior and invariants, not copied from a memorized solution. |
| "A plan should stay high level." | Tutorial plans need concrete writing tasks or the build will drift. |
| "The step question already implies the defect." | The defect must be stated explicitly so the builder can teach why the next change is necessary. |
| "The builder can decide code shape later." | Patch/checkpoint boundaries are part of the teaching plan; they determine whether readers patch a baseline or copy a complete checkpoint. |
| "The defect statement is enough." | The plan needs a pressure example so the reader can feel why the defect matters before seeing the fix. |
| "The real scenario can wait for the article draft." | Without the scenario, the task ladder tends to explain code shape instead of user-visible pressure. |
| "The compressed model is obvious." | Problem compression is the Norvig part of the skill; it must be explicit before code structure is planned. |
| "A table of steps is enough." | The builder needs task acceptance criteria, dependencies, verification, and checkpoint handoff to write reliably. |
| "The naive baseline can use the final internal carrier because it keeps examples short." | That hides the reason the carrier exists; the baseline should start from caller-visible input and let pressure force the carrier later. |

## Red Flags

- The plan adds a document-mode selector or retains two document workflows.
- The entry file contains implementation steps, or several versions share one
  tutorial body.
- Versions exist only to split length, or checkpoint IDs are ambiguous.
- A version lacks a verified entry baseline or its own final checkpoint.
- The plan names data structures before the external contract.
- The plan lacks a real scenario, compressed problem, core model, or invariants.
- The scenario is a production-code description instead of a source-independent
  reason someone would need the technique.
- The compressed problem drops the central invariant or keeps too much
  production noise.
- The plan uses an old row-based step table as the main build handoff.
- Tutorial tasks do not say what the previous reader baseline is or what
  concrete defect remains.
- The first baseline uses an internal carrier, helper, registry, node, store,
  adapter, state machine, or final class before any pressure has created it.
- A tutorial-step task lacks a pressure example.
- A step's `Break` is generic, motivational, or copied from the final
  architecture instead of observed in the current baseline.
- A tutorial-step task lacks `Code Change Type` or `Code Change Target`.
- A task lacks acceptance criteria, verification, dependencies, or document
  target.
- A version's final code task is not planned as an assembled checkpoint.
- A task adds multiple helpers or mutation rules at once.
- The plan has no small example or trace.
- The plan has no verification matrix beyond a generic test command.
- A version freeze is planned as a detached code dump rather than a connected task.
- Checkpoint commit metadata is missing when the human asked for document
  history.
- A task says `Checkpoint commit: yes`, but the plan has no `Checkpoint Commit
  Handoff` section.

## Verification

- [ ] V0 through Vn map to distinct tutorial files and meaningful capabilities.
- [ ] The entry file is navigation only; checkpoints remain within versions.
- [ ] Every code task has a version, checkpoint ID, and exact document target.
- [ ] Later versions name verified entry checkpoints with files and commands.
- [ ] Every version has an assembled final checkpoint and version check.
- [ ] Empty-directory replay covers all checkpoints and version transitions.
- [ ] Reader, goal, and prerequisites are explicit.
- [ ] Real scenario, problem compression, core model, and invariants are
      explicit.
- [ ] Supplied facts and inferred assumptions are separated.
- [ ] The tutorial dependency graph is explicit and ordered.
- [ ] The tutorial build task list includes acceptance criteria, verification,
      dependencies, document target, estimated scope, and checkpoint commit
      policy for every task.
- [ ] If any task needs document history, `Checkpoint Commit Handoff` routes it
      to `single-doc-checkpoint-commit-skill`.
- [ ] Tutorial-step tasks include pressure example, naive or previous baseline,
      break, new requirement, add/replace, code change type, code change
      target, step check, and freeze or next gap.
- [ ] The first naive baseline starts from external input or caller-visible
      behavior and does not smuggle in future internal abstractions.
- [ ] Each task follows from its dependencies and previous visible break.
- [ ] Every version's final code task is a complete assembled checkpoint.
- [ ] Each helper has a first-needed task and mutation or return boundary.
- [ ] Verification matrix covers happy path, invalid input, failure path,
      boundary case, and representative trace when relevant.
- [ ] Review risks identify likely jumps or final-code drift.
- [ ] The build handoff names the correct builder.

## Guardrails

- Do not write the tutorial body during planning.
- Do not invent constraints, examples, or source facts.
- Do not skip real scenario, problem compression, core model, or invariants for
  non-trivial tutorials.
- Do not output an old row-based step table as the main plan.
- Do not plan a detached final implementation section.
- Do not plan a final task that forces the reader to stitch scattered snippets
  into the final code.
- Keep the plan scoped to one coherent tutorial series, not a broad course.
- Do not make the entry file a combined V0-through-Vn tutorial body.
