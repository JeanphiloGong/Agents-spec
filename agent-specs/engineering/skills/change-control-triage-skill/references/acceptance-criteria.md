# Acceptance Criteria (Lean)

## Must Pass

- Output is directly executable by an engineer.
- Output includes `Decision` and `Triggered Gates`.
- Output starts with `Start Here (Top 3)` and concrete actions.
- Output includes phase-by-phase modifications in master order.
- Output includes minimal verification and rollback.
- Output includes only blocking questions.
- If blocking gates exist, `Decision=BLOCK`.

## Mode Rules

- `fast`: no heavy evidence or long checklists.
- `deep`: adds concise risk/tradeoff notes.
- `audit`: adds full evidence/classification details.

## Quick Review Questions

- Can a developer start implementing within 30 seconds?
- Is the phase order correct?
- Are gate blockers explicit?
- Is rollback actionable?
