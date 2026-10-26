---
name: from-scratch-tutorial-review
description: v0.3.3 - Review a from-scratch tutorial series or plan for separate capability-version documents, checkpoint continuity, complete data flow, and runnable version freezes. Use when checking navigation, V0 through Vn boundaries, verified entry baselines, per-version assembled code, replay evidence, teaching depth, or final-code drift before acceptance.
---

# From-Scratch Tutorial Review

## Overview

Review a from-scratch implementation tutorial series as a teaching artifact. The
primary question is whether a reader can follow the guide from external
behavior to final code without trusting a hidden answer. Findings lead the
response, ordered by severity, with file or section references when available.

Use the bundled quality standards reference when headings are present but the
tutorial may still hide state, skip semantic choices, miss pressure examples,
or read like an internal generation artifact.

## Version and Document Contract

- The sole structure is a navigation entry plus one tutorial document per
  capability version. Reject a document-mode selector or parallel old/new paths.
- `V0` is the smallest runnable baseline; later `V1` through `Vn` add meaningful
  capabilities. A small topic may end at V0; do not require artificial versions.
- Checkpoints use `V0.C0`, `V1.C0`, `V1.C1`, and so on as sections within version
  documents. They are not product release numbers or separate version files.
- `from-scratch-tutorial.md` contains the goal, prerequisites, version route,
  and links. Bodies live in `v0-baseline.md`, `v1-<capability>.md`, and so on.
- Every version declares scope, exact entry baseline, required files,
  setup/check commands, exit capability, and final checkpoint. Later versions
  start from a named verified earlier final checkpoint, never a latest example.
- Every version's last meaningful code step is an assembled runnable
  checkpoint with no unexplained logic. Inherited files must be explicit.
- Evidence must cover empty-directory replay through each checkpoint and
  version transition. Passing only the latest example proves too little.

A review may target one version; report that scope and check its entry/exit
links without claiming the unread rest of the series passed.

## Teaching Standard

Review every draft against:

- **Nystrom complete engineering chain** - connected working checkpoints, not
  scattered concept notes.
- **Karpathy runnable from-zero coding** - code appears early, remains runnable,
  and grows because behavior forces it.
- **Norvig small complete problem compression** - the real scenario is reduced
  to a small complete model without production noise.

These are acceptance criteria. A guide can have all increment-cycle headings
and still fail if it lacks a real scenario, a compressed model, connected
runnable code, or natural reader-facing teaching prose.

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

Review every numbered step against that cycle. A step passes only when the
reader can see the pressure, understand the current baseline, name what breaks,
apply one change, check that change, and continue from the frozen checkpoint.

## When to Use

- A from-scratch tutorial draft or task-first plan needs acceptance review.
- A guide may have skipped reasoning, hidden helper contracts, or disconnected
  code checkpoints.
- The final code must be checked against the incremental steps.
- A simplification pass needs a quality baseline before editing.

**When NOT to use:** writing the first draft, planning the teaching path,
general code review, production merge review, or publishing metadata review.

## Reference Map

- `references/quality-standards.md`
  Read when reviewing a complete or near-complete tutorial. It defines checks
  for executable continuity, defect-driven depth, semantic choice visibility,
  evidence quality, and reader-facing publishability.

## The Review Loop

1. Identify the Tutorial Contract
   - Read reader goal, real scenario, problem compression, core model,
     invariants, external contract, constraints, and teaching example.
   - Read the navigation entry and version/document map. Identify which
     versions are in review and their entry/final checkpoints.
   - Check that capability versions occupy separate files and checkpoints
     remain inside those files. Verify all relevant navigation links.
   - Verify: supplied facts and inferred assumptions are separated.
2. Check Scenario and Problem Compression
   - Confirm the guide says who uses the thing, why it is needed, and what the
     outside observer sees.
   - Confirm the tutorial compresses the full problem into a small complete
     model and names what is included or deferred.
   - Verify: the guide teaches the core idea, not production mapping or a
     shapeless toy.
3. Check Increment Continuity
   - If a task-first plan is present, compare each tutorial build task's
     dependencies, acceptance criteria, verification, document target, code
     change type, version/checkpoint ID, checkpoint commit policy, and
     resulting section.
   - At each version boundary, compare the declared entry baseline with the
     earlier version's frozen files and behavior. Confirm setup commands
     reproduce that state without copying later code.
   - If any task requests checkpoint history, confirm the plan has a
     `Checkpoint Commit Handoff` section and routes the task to
     `single-doc-checkpoint-commit-skill`.
   - For each numbered tutorial step, compare the previous reader baseline,
     add/replace action, code change type, code change target, current
     capability, freeze statement, and remaining gap.
   - Read `references/quality-standards.md` and check executable continuity.
   - Verify: every task can only depend on satisfied dependencies and every
     step check would run from visible state.
4. Check Defect-Driven Teaching Depth
   - Inspect pressure examples, `What Breaks`, `New Requirement`, and
     `Why This Change Works`.
   - Check whether the first naive baseline starts from caller-visible input or
     behavior instead of a future internal carrier, helper, registry, state
     machine, or final class shape.
   - Verify: every step names a concrete defect in the naive or previous
     baseline before introducing the next structure, and the reader sees a
     pressure example before the fix.
5. Check Step Evidence
   - Inspect `Step Check` and `What To Verify`.
   - Verify: checks prove the current checkpoint's named defect was addressed,
     not the final solution.
   - Check replay evidence for every checkpoint and each version freeze. When
     reviewing a plan, check that replay is planned rather than claiming it ran.
6. Check Semantic Choice Visibility
   - Look for behavior choices that appear silently: copying vs mutating,
     raising vs returning, stopping vs continuing, rejecting before side
     effects, or private helper boundaries.
   - Verify: every meaningful behavior change is explained where it first
     appears and has a small check when needed.
7. Check Helper Necessity
   - Ensure every helper appears only after a requirement pressure creates it.
   - Verify: helper purpose, inputs, output or mutation boundary are explicit.
8. Check Final-Code Drift
   - For every reviewed version, compare its final code to its connected steps
     and explicitly inherited files.
   - Confirm that version's final meaningful step is an assembled checkpoint,
     not a patch or partial snippet; its complete run/check commands must work.
   - Verify: no state, branch, helper, or mutation rule appears only at the
     end.
9. Check Engineering Completeness
   - Check core model, invariants, verification matrix, and deferred scope.
   - Verify: the guide is not only a code ladder; it teaches the small system
     model around the code.
10. Check Data Flow and Model Boundaries When Applicable
   - If the tutorial crosses interface, application, domain, or persistence
     boundaries, trace one real operation from external input through parsing,
     loading, domain decisions, reads/writes, and response mapping.
   - Name the model or parameters at each handoff. Check that the first
     baseline and each later checkpoint do not introduce interface models into
     domain logic, storage records into public responses, or model copies with
     no distinct contract.
   - Check failure stops and side effects, including whether a read-only flow
     saves anything and whether a rejected write changed state.
   - Verify: the data flow is visible at the checkpoint where it is introduced;
     executed checks and static inspection are reported separately. Skip this
     gate only when the asset genuinely has no cross-boundary operation.
11. Check Reader-Facing Publishability
   - Identify internal scaffolding, excessive compliance language, or missing
     reader recap after correctness issues are handled.
   - Treat public `Step Self-Review` sections or yes/no compliance bullets as
     revision issues.
   - Treat a public guide that merely lists internal fields as a revision issue,
     even if the fields are technically filled.
   - If the author wants structured freeze metadata preserved in Git, confirm
     that it belongs in a `single-doc-checkpoint-commit-skill` commit message
     rather than in the public tutorial body.
   - Verify: publishability feedback is not used to hide blocking correctness
     findings.
12. Produce Verdict
   - Use `pass`, `revise`, or `block`.
   - Include required fixes before summaries.

## Severity

- `block`: the tutorial cannot be accepted because the teaching chain is broken
  or final code contains unexplained logic.
- `revise`: the tutorial is directionally correct but needs concrete fixes.
- `suggestion`: optional improvement that does not block acceptance.

Specific severity calibration:

- `block`: a version depends on hidden future code, its final checkpoint cannot
  run from its declared files, or a version transition fails on replay.
- `revise`: capability versions share one tutorial body, the entry contains an
  implementation ladder, checkpoint IDs are ambiguous, or a version lacks
  scope, baseline documentation, navigation, or replay evidence.
- `block`: final runnable code must be stitched from scattered snippets, an
  unexplained helper or semantic rule appears in the final checkpoint, or a core step
  introduces a structure without a visible previous-baseline break.
- `revise`: a non-trivial tutorial lacks a real scenario, problem compression,
  core model, invariants, verification matrix, or natural reader-facing prose.
- `revise`: the first baseline smuggles in a future internal abstraction, such
  as a run-level context, before showing the pressure that requires it.
- `revise`: the draft has all field labels but reads like a compliance
  checklist instead of a tutorial.
- `revise`: the plan still uses an old row-based step table as the main build
  handoff instead of task-level acceptance criteria, verification, and
  dependencies.

## Output Format

```markdown
## Findings
- [severity] [section/file reference]: [issue]
  Evidence: ...
  Required change: ...

## Open Questions
- ...

## Verdict
- pass | revise | block

## Verification Notes
- Reviewed versions/documents:
- Entry and final checkpoint checks:
- Data-flow trace when applicable: operation, boundary values, failure stops,
  side effects, and static/runtime evidence.
- Replay performed / evidence inspected / checks not run:
- ...
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The final code is correct, so the tutorial is fine." | A from-scratch tutorial can fail even when the code works. |
| "Different version headings count as separate documents." | Each capability version needs its own file and entry/exit contract. |
| "The latest example passes, so the earlier versions pass." | Only replay of the earlier checkpoints establishes their behavior. |
| "A missing step check is only a documentation issue." | Step checks prove the task ladder is real. |
| "The reader can infer why the helper exists." | The tutorial must make helper pressure explicit. |
| "Review should summarize first." | Findings come first so required fixes are visible. |
| "The step has a `Why This Matters` line, so the rationale is covered." | The rationale must name concrete defects in the current baseline and show why the next change follows. |
| "The final tests pass, so intermediate snippets are fine." | Tutorial steps must be executable from visible state; final tests do not prove connected continuity. |
| "Copying context is a small implementation detail." | Silent semantic choices can change the behavior the tutorial taught earlier. |
| "The reader can stitch together the final code." | The final step must provide an assembled checkpoint so the delivered code is copyable and reviewable. |
| "Step Self-Review is useful transparency." | It is internal scaffolding; public tutorials need reader-facing checkpoints, not compliance notes. |
| "All required headings are present, so the guide passes." | Headings are not enough; the guide must read like a real lesson with scenario, compression, pressure, code, checks, and freeze points. |
| "The scenario is not needed because this is an implementation tutorial." | The scenario is what makes the implementation pressure real. |
| "Problem compression is obvious from the code." | The compressed model must be explicit so the reader can separate core logic from deferred noise. |
| "The freeze fields must appear in the tutorial so Git history can preserve them." | The freeze fields can live in a single-document checkpoint commit message; the tutorial body should remain reader-facing. |
| "The old step table already lists every step." | Build planning needs task dependencies, acceptance criteria, verification, document targets, and checkpoint handoff. |
| "The first snippet can use the final context object because it runs." | Running is not enough; the baseline must reveal why that context object is needed. |

## Red Flags

- The entry mixes navigation with implementation or several versions share a body.
- A version has no named entry baseline, required files, or final checkpoint.
- The series has only latest-example evidence or unresolved version links.
- A step lacks `Naive or Previous Baseline`, `What Breaks`, `New Requirement`,
  `Add or Replace`, `Step Check`, `Freeze This Checkpoint`, or `Still Lacks`.
- A non-trivial engineering tutorial lacks real scenario, problem compression,
  core model, invariants, or verification matrix.
- The scenario only describes a production module instead of who needs the
  technique and what pressure they experience.
- The compressed model is either too toy-like to preserve the core invariant or
  too production-shaped to teach in one sitting.
- The plan uses an old row-based step table as the main structure instead of a
  Tutorial Build Task List.
- Tutorial build tasks lack acceptance criteria, dependencies, verification,
  document targets, or checkpoint commit policy.
- A task requests checkpoint history, but there is no `Checkpoint Commit
  Handoff` table or it routes to the normal code commit flow.
- A step's rationale is generic and does not explain what breaks in the naive
  or previous baseline.
- The first baseline uses future internal abstractions such as `context`,
  registries, nodes, stores, adapters, state machines, or final classes before
  the tutorial has justified them.
- A step names a defect without showing a concrete pressure example first.
- The guide advances to the next step without a reader-facing checkpoint or
  equivalent visible learning pause.
- A code block cannot be explained as an addition to or replacement of the
  previous baseline.
- A step check depends on stale state, hidden setup, or a registry that was not
  updated after a function or helper changed.
- A `Code Change` block does not say whether it is a patch or checkpoint.
- A `Code Change` block lacks a target file, module, or script.
- The final meaningful step is not a complete assembled checkpoint.
- A meaningful behavior choice appears without explanation or a targeted check.
- The final code has helper logic not introduced in steps.
- The guide starts with internal structure before external behavior.
- A helper lacks a caller, input, output, or mutation boundary.
- The tutorial has no concrete trace or check.
- A layered tutorial shows directories or classes but never traces one complete
  operation and the state or response it produces.
- A later version silently changes the owner of parsing, business rules,
  persistence, or response mapping.
- The tutorial reads like an internal compliance checklist rather than a
  reader-facing guide.
- The tutorial publicly dumps internal field labels when natural teaching prose
  would be clearer.
- The tutorial uses public template fields as a substitute for a
  single-document checkpoint commit message.
- The public tutorial contains `Step Self-Review` or yes/no self-audit bullets.

## Verification

- [ ] Review scope identifies the versions/documents actually inspected.
- [ ] The entry is navigation only and version files/links match the plan.
- [ ] Capability versions and checkpoint sections use distinct, stable IDs.
- [ ] Each later version starts from a verified earlier final checkpoint.
- [ ] Each version has an assembled runnable final checkpoint and explicit files.
- [ ] Replay evidence covers checkpoints and version transitions, or missing
      evidence is reported; a plan is not presented as an executed tutorial.
- [ ] Findings are ordered by severity.
- [ ] Nystrom/Karpathy/Norvig standards were checked.
- [ ] Real scenario, problem compression, core model, invariants, and
      verification matrix were checked.
- [ ] Task continuity and checkpoint continuity were checked step by step.
- [ ] Executable continuity was checked against the quality standards
      reference.
- [ ] Code change type and target were checked for every step.
- [ ] Pressure examples were checked before defect statements and fixes.
- [ ] Teaching depth was checked for concrete previous-baseline defects.
- [ ] First-baseline inputs were checked for premature final abstractions.
- [ ] Meaningful semantic choices were checked for explanation and evidence.
- [ ] Step checks were reviewed for relevance to the current checkpoint.
- [ ] Helper necessity and mutation boundaries were checked.
- [ ] Applicable data-flow and model-boundary ownership was checked across the
      version transition and the final checkpoint.
- [ ] Failure stops and side effects were checked, with static and executed
      evidence distinguished.
- [ ] Final-code drift was checked.
- [ ] Every reviewed version's final step was checked as an assembled checkpoint.
- [ ] Public prose was checked for tutorial voice rather than checklist voice.
- [ ] Single-document checkpoint metadata, when requested, was routed to
      `single-doc-checkpoint-commit-skill` rather than public tutorial prose.
- [ ] Checkpoint Commit Handoff was checked when any task requested document
      history.
- [ ] Verdict is `pass`, `revise`, or `block`.

## Guardrails

- Do not rewrite the tutorial during review unless the user asks for fixes.
- Do not approve a guide only because the final code is correct.
- Do not approve a combined version body as the new document structure.
- Do not report whole-series acceptance after reviewing only one version.
- Do not invent source facts to make a teaching gap look acceptable.
- Do not bury blocking findings under summaries.
