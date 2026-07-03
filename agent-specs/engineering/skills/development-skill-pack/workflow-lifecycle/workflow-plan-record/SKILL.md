---
name: workflow-plan-record
description: v0.1.2 - Records an already completed implementation plan into a compact task-run plan.yaml artifact. Use when a full human-readable implementation plan exists, when workflow-sketch or workflow-build needs a .agent-runs handoff, or when an approved plan revision with success targets must update an existing run.
---

# Workflow Plan Record

## Overview

Record an already completed human-readable implementation plan into a compact
`.agent-runs/<run-id>/plan.yaml` artifact. This skill is a persistence and
handoff step, not a planning step.

Use it to preserve the final plan after `workflow-plan` has produced the
reader-facing plan with architecture decisions, tasks, risks, checkpoints, and
issue handoff. Do not let YAML formatting drive the planning work.

The artifact exists so later `workflow-sketch`, `workflow-build`, or another
session can recover the approved goal, slice order, verification expectations,
success targets, quality gates, and issue references without replaying the
whole conversation.

## When to Use

- `workflow-plan` has already produced a complete implementation plan.
- The next step is `workflow-sketch`, `workflow-build`, a future session, or
  another agent that needs a compact plan artifact.
- The human asks to record, persist, save, or create a task-run plan artifact.
- A previous `.agent-runs/<run-id>/plan.yaml` should be updated to match an
  approved plan revision.

**When NOT to use:** before the full human-readable plan exists, while still
deciding architecture or task order, or as a substitute for `workflow-plan`.

## The Recording Process

### Step 1: Confirm the Source Plan

Before touching `.agent-runs/`, identify the final source plan to record:

- Use the completed `workflow-plan` output from the current conversation or a
  provided plan document.
- Confirm the source plan includes goal, scope, ordered tasks or slices,
  success targets or quality gates, verification, checkpoints or dependencies,
  risks or open questions when relevant, and issue handoff.
- If there is no complete source plan, stop and ask for `workflow-plan` first.

**Do NOT infer a plan from code diffs or rough conversation fragments.** This
skill records an approved plan; it does not create one.

### Step 2: Resolve the Run Boundary

Choose whether this is a new task run or an update to an existing one:

- Create a new `run_id` for a new implementation goal.
- Reuse the existing `run_id` when recording a refinement of the same goal,
  adding slices, correcting verification, or updating an approved plan.
- Use a stable `run_id` format such as `<yyyymmdd-hhmmss-topic>`.
- If multiple candidate runs could apply, inspect their `plan.yaml` files and
  choose the one matching the same goal; ask if the boundary is still unclear.

Run boundaries are part of the workbench lifecycle. Do not create a fresh run
only to avoid editing an existing plan for the same goal.

### Step 3: Prepare the Local Workbench

Create or reuse:

```text
.agent-runs/<run-id>/
```

Keep `.agent-runs/` out of commits:

- Prefer local `.git/info/exclude` unless the repository explicitly tracks the
  ignore rule.
- Verify `.agent-runs/` is ignored before finishing.
- Never stage `.agent-runs/` artifacts.

### Step 4: Translate the Plan Into a Compact Record

Write:

```text
.agent-runs/<run-id>/plan.yaml
```

Use `references/plan-record-template.yaml` and keep only durable handoff data:

- `schema_version`
- `run_id`
- `goal`
- `scope.in`
- `scope.out`
- `success_targets`
- `slices[].id`
- `slices[].outcome`
- `slices[].rationale`
- `slices[].quality_target`
- `slices[].target_areas`
- `slices[].depends_on`
- `slices[].verify`
- `issue_refs`

The record should compress the plan without changing it. It should preserve
slice order and verification, but it should not become a second implementation
plan.

### Step 5: Keep Details in the Right Layer

Put only plan-level handoff in `plan.yaml`.

Belongs in `plan.yaml`:

- task goal and scope boundaries
- final success targets and quality gates
- slice order and dependency summary
- slice-level quality targets
- target areas, not exhaustive file diffs
- verification commands or checks
- issue refs

Belongs in later `workflow-sketch` artifacts:

- feature model
- architecture ownership
- invariants
- data flow details
- allowed and forbidden code changes
- helper budget
- implementation contract

Belongs in released project documentation:

- stable decisions, current-state docs, public contracts, or durable guides

### Step 6: Verify the Record

Before reporting success:

- Confirm `plan.yaml` reflects the final source plan, not an earlier draft.
- Confirm every slice maps to a source task, phase, or checkpoint.
- Confirm success targets and slice-level quality targets were preserved.
- Confirm each slice has a rationale, target areas, dependencies,
  verification, and quality target.
- Confirm `.agent-runs/` is ignored and not staged.
- Confirm no business code was modified.

## Plan Record Template

```yaml
schema_version: 0.1
run_id: 20260629-153012-task-topic
goal: "<one sentence task outcome>"
scope:
  in:
    - "<included area>"
  out:
    - "<excluded area>"
success_targets:
  - id: "<target-id>"
    outcome: "<final user or system outcome>"
    quality_bar:
      - "<observable quality standard>"
    evidence_required:
      - "<test, log, trace, screenshot, metric, or manual check>"
    failure_policy: "block | warn | follow-up"
slices:
  - id: "<slice-id>"
    outcome: "<verifiable outcome>"
    rationale: "<why this slice is ordered here>"
    quality_target: "<quality outcome this slice must reach>"
    target_areas:
      - "<module or subsystem>"
    depends_on: []
    verify:
      - "<test, build, static check, or manual check>"
issue_refs:
  - "<issue, ticket, or n/a>"
```

Keep the YAML concise. If a field needs paragraphs of explanation, the content
probably belongs in the human-readable plan or the slice sketch instead.

## Decision Points

- If the requested record changes task order or scope, stop and update the
  human-readable plan first.
- If the source plan is incomplete, ask for `workflow-plan` instead of
  backfilling missing decisions in YAML.
- If there is an existing run for the same implementation goal, update it
  instead of creating a new `run_id`.
- If `.agent-runs/` is not ignored, prefer local `.git/info/exclude` unless the
  repository explicitly wants to track the ignore rule.
- If later `workflow-sketch` needs more design detail, add that to a sketch
  artifact, not to `plan.yaml`.
- If issue references are absent from the source plan, use `n/a` only when the
  plan explicitly says issue handoff is unnecessary.
- If success targets are absent from the source plan, mark the source plan as
  incomplete instead of inventing quality gates during recording.
- If a slice is too broad to record with a specific outcome and verification,
  mark the source plan as needing refinement instead of recording a vague
  slice.
- If a slice has no quality target, preserve the gap in blockers instead of
  silently recording verification commands as the quality target.

## Recording Examples

Good source sequence:

```text
$workflow-plan
  -> human-readable plan with ordered tasks and issue handoff

$workflow-plan-record
  -> .agent-runs/<run-id>/plan.yaml

$workflow-sketch <slice-id>
  -> .agent-runs/<run-id>/sketches/<slice-id>.yaml
```

Bad source sequence:

```text
$workflow-plan-record
  -> create plan.yaml from a rough idea
  -> summarize it as if planning was done
```

The bad sequence lets artifact formatting replace actual planning. The record
must follow the completed plan.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll create plan.yaml first and fill in the plan later." | This skill records a completed plan. Use `workflow-plan` first. |
| "The YAML can be the plan." | `plan.yaml` is a compact handoff record; it must not replace the human-readable plan. |
| "I should put architecture and invariants here so build has everything." | Detailed implementation contracts belong in `workflow-sketch`. |
| "A new run_id is cleaner for every update." | Reuse the same run for the same implementation goal to avoid fragmented task history. |
| "The plan is obvious from the branch name." | Branch names are context hints, not approved plan sources. |
| "This is only temporary, so staging .agent-runs is fine." | Task-run artifacts are local workbench state and should stay out of commits. |
| "Verification commands are enough quality data." | Commands are evidence; record the outcome and quality bar they are meant to prove. |

## Red Flags

- `plan.yaml` is created before a complete human-readable plan exists.
- The artifact includes implementation details that belong in `workflow-sketch`.
- The artifact changes scope or task order without updating the source plan.
- The artifact drops success targets or quality gates from the source plan.
- A new run is created for a refinement of the same goal.
- `.agent-runs/` appears in staged files.
- Slices are named by file edits instead of verifiable outcomes.
- A slice has verification commands but no quality target.
- `verify` is missing or says only "manual check" without a concrete action.
- `issue_refs` invents an issue or drops issue handoff from the source plan.
- The output report presents the YAML record as the implementation plan.

## Verification

- [ ] Source human-readable plan exists.
- [ ] `.agent-runs/<run-id>/plan.yaml` exists.
- [ ] The artifact reflects the final plan, including task order and
      verification.
- [ ] Success targets and quality gates were recorded from the source plan.
- [ ] Each slice has a rationale.
- [ ] Each slice has a quality target.
- [ ] `.agent-runs/` is ignored by git.
- [ ] No business code was modified.
- [ ] `git status --short` does not show `.agent-runs/` as staged or
      untracked repository work.

## Output Format

```text
## Source Plan
- source:
- completeness:

## Task-Run Artifact
- path:
- status: created | updated

## Run Boundary
- run_id:
- boundary_decision:

## Recorded Slices
- <slice-id>: <outcome>

## Success Targets
- <target-id>: <outcome>

## Verification
- source_plan_checked:
- yaml_checked:
- git_ignore_checked:
- business_code_modified:

## Blockers
- none | <blocker>
```

## Guardrails

- Do not perform planning in this skill.
- Do not edit business code.
- Do not use `plan.yaml` as released documentation.
- Do not store secrets, credentials, or private data in task-run artifacts.
- Do not create compatibility wrappers or route through `workflow-plan`.

## References

- `references/plan-record-template.yaml`
  Compact task-run plan artifact template.
