---
name: project-implementation-tutorial-review
description: v0.1.0 - Review existing-project implementation tutorials for source accuracy, version completeness, teaching continuity, and executable evidence. Use when a guide may omit real callers, migrations, tests, or complete code. Use before accepting a tutorial checkpoint as ready for a reader to implement.
---

# Project Implementation Tutorial Review

## Overview

Determine whether a reader can complete the agreed feature version by following
the tutorial against its stated real-project baseline. Review both engineering
correctness and teaching continuity. Valid snippets alone are not enough.
Review does not authorize changes to the tutorial or production code.
Read [the review record guide](references/review-record.md).
Local review records are allowed; they do not grant permission to repair source.

## When to Use

- A real-project tutorial is ready for acceptance or a checkpoint review.
- The user asks whether steps, code, integration, or tests are missing.
- A tutorial appears correct but readers keep asking where to put its code.

**When NOT to use:** writing the first draft, production code review, or
standalone learning-asset review. For requested tutorial repairs, use the
sibling build skill after identifying the defects.

## The Operating Loop

1. Recover the acceptance boundary.
   Read the latest agreed plan or discussion and the entire selected tutorial
   version. Identify promised behavior, prerequisites, exclusions, baseline,
   and claimed verification. Do not expand a foundation-only checkpoint into a
   complete feature, or allow a complete feature to shrink into schemas only.
   Read a previous review record only when resuming this review. Plan/build
   records are optional explicitly supplied evidence, not prerequisites. Create
   only the review's own record; do not invent a plan or authoring progress.
2. Inspect the source independently.
   Read applicable rules and relevant current source, tests, and migrations.
   Compare paths, symbols, signatures, callers, field semantics, runtime, and
   dialect. Separate actual baseline drift from tutorial errors. When source
   cannot be obtained, mark source verification blocked instead of inventing it.
3. Trace the implementation promise.
   Follow every claimed entrypoint through dependencies to observable output.
   Check authorization/user scope, serializers, transaction ownership, state
   transitions, schema deployment, and worker wiring where relevant. Classify
   each helper as existing and verified, newly implemented, or unresolved.
   An unresolved dependency required for the promise is a finding.
4. Trace the teaching chain.
   For each step check the real motivating gap, previous baseline, exact edit,
   explanation, test, and next baseline. Check imports and full method context.
   Reject hidden rewrites, unexplained abstractions, and disconnected code
   dumps even when their final behavior could be correct.
   Check that removing local records would not hide instructions or essential
   scope from the reader, and that audit fields stay out of the lesson.
5. Verify the evidence safely.
   Replay documented edits in an isolated copy of the stated baseline when
   feasible. Use isolated databases and fake transports, not production services.
   Verify happy paths and relevant failure/boundary cases; inspect whether mocks
   bypass the very integration being claimed. A SQLite check cannot establish
   PostgreSQL lock/concurrency behavior. Report checks not run explicitly.
6. Report findings and readiness.
   Lead with severity-ordered findings and tutorial/source path plus line or
   symbol, the concrete consequence, and minimal correction. Give the scope
   verdict and evidence limits. Delete only disposable artifacts from this
   review. Do not edit or commit unless separately requested.
   Write `review.yaml` with reviewed input identities, findings, actual checks,
   and limitations. Verify fixes before resolving findings; invalidate stale
   readiness after changes. Retain the record, validate its references, and
   confirm it is ignored and unstaged.

## Decision Points

- If the source changed since the tutorial's pinned baseline, distinguish
  "valid on stated baseline" from "applicable to current worktree".
- If a boundary was agreed before writing, respect it; missing future features
  are not defects. Missing work required by the current promise is a defect.
- If a temporary mock is explicit, check its isolation and handoff. Do not call
  mocked extraction, scoring, delivery, or authentication production-complete.
- If a failing step blocks later replay, report the earliest cause and mark
  dependent checks blocked; do not silently patch the sandbox and count a pass.

## Output Format

- Findings first: severity, evidence, reader impact, minimal requested correction.
- Open questions only where they affect behavior or acceptance.
- Verdict: `ready`, `needs-revision`, or `verification-blocked`, scoped to the
  stated version. If defects and blocked checks coexist, report both.
- Verification: actual commands/results, skipped checks, baseline provenance.
- State explicitly when no findings were identified; absence of findings does
  not prove checks that were not run.
- Report the record path separately; keep detailed review history out of the
  tutorial. Important findings and limitations still belong in the user report.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "All snippets compile." | They may never be called by the real route or worker. |
| "The tutorial has all the headings." | Headings do not supply missing code, explanations, or evidence. |
| "A mock-only test proves rollback." | Rollback needs the relevant actual persistence path and transaction test. |
| "The current branch passes its tests." | Those tests may not exercise the tutorial's replayed implementation. |
| "Delivery is deferred, so missing notification creation is fine." | Deferral of an external channel does not remove promised local enqueue behavior. |

## Red Flags

- Undefined variables, invented repository APIs, or ambiguous code placement.
- Commit/freeze claims with no reproducible baseline or acceptance evidence.
- A renamed ORM without the required physical schema or caller changes.
- Unstated behavior changes introduced as teaching simplifications.
- Source-only fixes during review or real outbound sends during verification.

## Verification

- [ ] Reviewed scope matches the agreed version, not a newly invented goal.
- [ ] The guide is applicable to the stated baseline; current drift is reported.
- [ ] Full promised paths, not only snippets, were traced.
- [ ] Each checkpoint is teachable and reproducible from previous edits.
- [ ] Findings cite concrete evidence and distinguish blockers from preferences.
- [ ] Verification claims match the checks actually executed.
- [ ] Review made no unauthorized source or tutorial edits.
- [ ] Local review evidence identifies current inputs and is ignored/unstaged.
- [ ] Essential teaching content is not hidden in local records.

## Regression Scenarios

Read `references/acceptance-scenarios.md` when validating or changing this
package. It contains representative routing and negative acceptance cases;
they are evaluation prompts, not proof that an agent or tutorial passed them.

## Guardrails

- Do not modify tutorials, production code, shared databases, or external state
  during review without explicit authorization.
- Do not demand standalone extraction or prior use of sibling packages.
- Do not accept "implement this later" for required current-version behavior.
- Do not equate verified tutorial artifacts with completed production work.
