# Acceptance Criteria (Lean)

## Must Pass

- Output is directly executable by an engineer.
- Output includes `Decision` and `Triggered Gates`.
- Output includes `Migration Strategy` and `New File Policy`.
- Output includes `Main Mapping Plan (1->7)`.
- Output includes `Per-Step Gate`.
- Output includes `Minimal Landing Batch (Top 3)`.
- Output includes `Multi-Agent Plan` when mode resolves to multi.
- Main mapping entries include `ai_diff`, `main_target`, `change`, and `done_when`.
- Output includes minimal verification and rollback for high-risk changes.
- Output includes only blocking questions.
- Phase order is fixed at 1->7 (gates may block but must not reorder phases).
- If blocking gates exist, `Decision=BLOCK`.
- New files are denied by default or explicitly justified with rollback notes.

## Mode Rule

- Only `fast` mode is allowed.
- No evidence map and no heavy checklist sections.

## Quick Review Questions

- Can a developer start implementing within 30 seconds?
- Is the phase order correct?
- Are gate blockers explicit?
- Does each phase include a clear gate (`must_pass` / `block_when`)?
- Does `Minimal Landing Batch (Top 3)` form one verifiable closed loop?
- If `multi`, are reviewer scopes and focus explicit?
- Is rollback actionable?
- Is every meaningful AI diff item mapped to a main-branch action in phase order?
