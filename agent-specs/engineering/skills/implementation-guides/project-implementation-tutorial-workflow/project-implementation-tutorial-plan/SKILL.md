---
name: project-implementation-tutorial-plan
description: v0.1.1 - Plan versioned feature implementation tutorials grounded in an existing project. Use when agreed requirements need prerequisite checks, incremental versions, real-file targets, and verifiable checkpoints before tutorial writing. Use when a growing tutorial needs its current and future scope separated.
---

# Project Implementation Tutorial Plan

## Overview

Turn a feature discussion into a learning and implementation path through the
actual project. The zero point is the current code without the requested
capability, not a new standalone application. Plan versions by observable
behavior and invariants, then select the next version for tutorial writing.

Preserve reference-core's useful version lineage and checkpoint discipline
without requiring extraction. Preserve from-scratch's connected teaching steps
without replacing the real project with a toy model. Neither package is a
prerequisite or a runtime dependency.

Read [the planning record guide](references/planning-record.md)
before writing local records. Keep version decisions in `planning.yaml`, not
execution bookkeeping in the public plan. No extra record skill is needed.

## When to Use

- The user asks how to divide a real feature into tutorial versions.
- A discussed solution needs a concrete path from current code to completion.
- A tutorial has grown too broad, or later capabilities need explicit placement.

**When NOT to use:** standalone experiments, production implementation, or
writing a tutorial body when the version and solution are already agreed. In
the last case, use `project-implementation-tutorial-build` directly.

## The Operating Loop

1. Recover the agreed outcome.
   Read the latest decisions, API examples, and requested tutorial destination.
   Separate confirmed rules, observed code, assumptions, and missing choices.
   Ask only about gaps that change behavior, contracts, or scope. Do not restart
   an already completed design discussion.
2. Inspect the real baseline.
   Read applicable project rules and the relevant entrypoints, models,
   services, repositories, callers, migrations, and tests. Record repository
   path, revision, relevant uncommitted changes, runtime, and database dialect.
   Trace input -> decisions -> state changes -> output. Cite file paths and
   symbols for existing behavior; label proposed files as new.
3. Identify the capability gap and invariants.
   Start from a concrete user action or worker event. Explain what currently
   happens and what must change. Name contracts to preserve and rules that
   tests can falsify, such as user isolation or atomic state-and-event writes.
   Reuse current infrastructure; do not design another app to explain it.
4. Plan the version line.
   For each version name its prerequisite baseline, observable addition,
   included integration, explicit exclusions, and acceptance evidence. Inspect
   prerequisite code instead of trusting an earlier claim that it is complete.
   Choose the smallest useful capability before expanding its integration.
   For each implementation checkpoint state the before/after behavior, an
   immediate executable check, and what the next checkpoint reuses. Prefer
   behavioral names over file-layer names. A core-model foundation can verify
   a business rule without HTTP or persistence; do not invent a domain layer
   solely to fill V0. Contract alignment and environment setup are preparation,
   not implementation checkpoints unless documentation/setup is the requested
   deliverable. Do not assign V0 to preparation by default.
5. Select the current version and order its teaching steps.
   Map each step to exact real files and symbols, the previous step's gap, the
   change, and a check. Include migrations, callers, configuration, and test
   guidance needed for this version's promise. The plan names test scenarios,
   expected outcomes, and boundaries. Specify how the reader can check the
   checkpoint without first authoring missing tests; full test source remains
   optional. Put dependency installation and configuration in brief prerequisites
   or at first use, not ahead of every business change.
   Multiple files may implement one coherent behavior. Future versions remain
   a roadmap, not hidden current tasks.
6. Define the freeze and handoff.
   Name the baseline needed to reproduce the tutorial, executable checks with
   expected results, regression scope, and a `commit_when` condition. Separate
   tutorial verification from production completion. Pass this compact plan to
   `project-implementation-tutorial-build`; do not require a second plan format.
   After the plan is settled, update this planning task's `planning.yaml`
   with version dependencies, acceptance conditions, decisions and open questions.
   Preserve the source plan's meaning; YAML is a handoff record, not a second
   planning exercise. Verify parsing, references, and local Git exclusion.

## Decision Points

- If the solution and current version are already complete in conversation,
  confirm only baseline drift and hand off directly to build.
- If the source is unavailable, request access or the relevant files. An
  explicitly requested provisional outline is not a verified implementation plan.
- If a prerequisite is unfinished, show the smallest prerequisite checkpoint
  and ask when changing the selected version would change agreed scope.
- If a new requirement expands the current version, make the tradeoff explicit;
  do not silently add it or silently defer required integration.
- If the user wants a standalone learning asset, use reference-core instead.

## Output Format

Use the user's language. Prefer a short scenario, a version table when useful,
and ordered current-version tasks, not a large mandatory schema.

Include:

- Baseline: repository, revision and relevant dirty files, observed capability.
- Goal and contracts: confirmed rules, invariants, unresolved blockers.
- Versions: name, starts from, before/after capability, includes, excludes,
  immediate reader check with expected result, and next-step reuse or completion.
- Current version: selected scope and why it is independently verifiable.
- Steps: real file/symbol, reason, change, dependency, check and expected result.
- Freeze: how the reader executes the check, broader regression scope,
  `commit_when`, verification limits, and next version.

Keep record IDs and bookkeeping out of the public plan. Briefly report the
record path and unresolved decisions separately in the handoff.

## Example: Plan One Executable Foundation

Illustrative fixture, not a prescribed project layout. Input: "Our existing
`messages.py:Message` has `user_id` and optional `read_at`. Teach first-read
behavior before persistence; the Python environment already works."

A suitable compact plan:

- Baseline: `Message` holds a timestamp but has no read transition.
- Current version: V0 adds `Message.mark_read(now)`; reading twice preserves
  the first timestamp. Includes the transition; excludes persistence and HTTP.
- Step: patch that class in `messages.py`, preserve unrelated fields, and update
  any affected callers; no new architectural layer is needed.
- Freeze: the builder supplies a runnable invocation with fixed UTC times
  `t1 < t2`; mark read at each time and assert `read_at == t1`. It must pass
  before V0 is verified. Broader test guidance can remain prose.
- Next reuse: V1 loads and saves this same message state.

Reject: "V0 confirms contracts; V1 installs dependencies; write some tests."
That output has no implementation capability or direct check for the reader.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "A separate demo will be easier." | The requested outcome is implementation in this project; explain a smaller slice of its real behavior. |
| "V1 is done because the models exist." | A feature promise includes its callers and persistence path unless a foundation-only scope was agreed. |
| "The builder can work out the missing rules." | Rules that change schemas, authorization, timing, or API semantics must be settled first. |
| "Every version needs a tag and commit now." | Plan a verifiable freeze; Git operations require a separate user request. |

## Red Flags

- Versions are merely file layers with no observable acceptance condition.
- A later version is required for the current version's advertised behavior.
- Targets are invented or copied from an old tutorial without checking source.
- A complete discussion is turned into another mandatory planning ceremony.
- A version has no executable capability delta, or requires unrelated concepts
  to be completed before its first useful check.
- Unrequested compatibility layers, configuration, or deployment work appear.

## Verification

- [ ] Each observed source fact has a real path/symbol and a known baseline.
- [ ] Every version has prerequisites, additions, exclusions, and acceptance.
- [ ] The selected version includes all integration required by its promise.
- [ ] Current tasks have concrete checks, including a boundary or failure case.
- [ ] Test expectations are described as scenarios and outcomes; test source
      examples are not required by the plan.
- [ ] Existing decisions are reused; blocking choices are explicit.
- [ ] Tutorial writing and production implementation are separate permissions.
- [ ] The planning record matches the plan; no build/review record is required.

## Guardrails

- Default writes are limited to requested documents, local task records, and
  their necessary local Git exclusion entry. Never stage task records.
- Do not edit production, install services, change shared databases, or commit.
- Preserve relevant uncommitted work; never reset the source to fit the plan.
- Do not force use of reference-core or from-scratch before this package.
- Do not claim planned tests have run or that an unverified prerequisite is done.
