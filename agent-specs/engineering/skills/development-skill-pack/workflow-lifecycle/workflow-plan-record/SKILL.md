---
name: workflow-plan-record
description: v0.1.0 - Records an already completed workflow-plan into a task-run plan.yaml artifact. Use after workflow-plan when a full human-readable plan exists and later workflow-sketch or workflow-build needs a compact .agent-runs handoff.
---

# Workflow Plan Record

## Overview

Record an already completed human-readable implementation plan into
`.agent-runs/<run-id>/plan.yaml`. This skill is a persistence and handoff step,
not a planning step.

Use it to preserve the final plan after `workflow-plan` has produced the
reader-facing plan with architecture decisions, tasks, risks, checkpoints, and
issue handoff. Do not let YAML formatting drive the planning work.

## When to Use

- `workflow-plan` has already produced a complete implementation plan.
- The next step is `workflow-sketch`, `workflow-build`, a future session, or
  another agent that needs a compact plan artifact.
- The human asks to record, persist, save, or create a task-run plan artifact.
- A previous `.agent-runs/<run-id>/plan.yaml` should be updated to match an
  approved plan revision.

**When NOT to use:** before the full human-readable plan exists, while still
deciding architecture or task order, or as a substitute for `workflow-plan`.

## The Operating Loop

1. Confirm the source plan exists.
   - Use the final human-readable plan from the current conversation or a
     provided plan document.
   - If there is no complete source plan, stop and ask for `workflow-plan`
     first.
2. Resolve the run boundary.
   - Create a new `run_id` for a new implementation goal.
   - Reuse the existing `run_id` when recording a refinement of the same goal,
     adding slices, or updating an approved plan.
3. Prepare the local workbench.
   - Ensure `.agent-runs/<run-id>/` exists.
   - Keep `.agent-runs/` out of commits through `.gitignore` or local
     `.git/info/exclude`.
4. Write `plan.yaml`.
   - Use `.agent-runs/<run-id>/plan.yaml`.
   - Follow `references/plan-record-template.yaml`.
   - Keep it compact: goal, scope, slices, rationale, verification, and issue
     refs.
   - Do not add detailed model, architecture, invariants, helper budget, or
     implementation contract; those belong to `workflow-sketch`.
5. Verify the record.
   - Confirm the YAML reflects the final source plan, not an earlier draft.
   - Confirm each slice maps to a task or checkpoint in the source plan.
   - Confirm the artifact path is ignored by git.

## Decision Points

- If the requested record changes task order or scope, stop and update the
  human-readable plan first.
- If there is an existing run for the same implementation goal, update it
  instead of creating a new `run_id`.
- If `.agent-runs/` is not ignored, prefer local `.git/info/exclude` unless the
  repository explicitly wants to track the ignore rule.
- If later `workflow-sketch` needs more design detail, add that to a sketch
  artifact, not to `plan.yaml`.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll create plan.yaml first and fill in the plan later." | This skill records a completed plan. Use `workflow-plan` first. |
| "The YAML can be the plan." | `plan.yaml` is a compact handoff record; it must not replace the human-readable plan. |
| "I should put architecture and invariants here so build has everything." | Detailed implementation contracts belong in `workflow-sketch`. |
| "A new run_id is cleaner for every update." | Reuse the same run for the same implementation goal to avoid fragmented task history. |

## Red Flags

- `plan.yaml` is created before a complete human-readable plan exists.
- The artifact includes implementation details that belong in `workflow-sketch`.
- The artifact changes scope or task order without updating the source plan.
- A new run is created for a refinement of the same goal.
- `.agent-runs/` appears in staged files.

## Verification

- [ ] Source human-readable plan exists.
- [ ] `.agent-runs/<run-id>/plan.yaml` exists.
- [ ] The artifact reflects the final plan, including task order and
      verification.
- [ ] Each slice has a rationale.
- [ ] `.agent-runs/` is ignored by git.
- [ ] No business code was modified.

## Output Format

```text
## Source Plan
## Task-Run Artifact
## Run Boundary
## Verification
## Blockers
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
