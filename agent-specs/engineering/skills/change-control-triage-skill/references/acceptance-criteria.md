# Acceptance Criteria (Lean, One-Wave)

## Must Pass

- Input can be resolved from exactly two branches: `base_branch` and `head_branch`.
- Output is tutorial-first and limited to current wave only.
- Output includes `Decision` and `Triggered Gates`.
- Output includes `Control Map` (`Human-Owned`, `AI-Assist`, `AI-Auto`).
- Output includes `Current Wave Plan (1->7)` in fixed order.
- Each phase includes `action`, `human_control`, `ai_accelerate`, `forbidden_for_ai`, `commit_when`, `done_when`.
- Output includes `Per-Step Gate` and gate blockers are explicit.
- Output includes `Wave Commit Plan` with small, reviewable change slices.
- Multi-agent review is default; single mode is fallback for trivial waves only.
- Output includes minimal verification and rollback for high-risk changes.
- Output includes only blocking questions.
- Output includes only one-line next wave entry condition (no future-wave expansion).
- If blocking gates exist, `Decision=BLOCK`.
- Phase 2 does not execute DDL/migration/backfill.

## Mode Rule

- Only `fast-one-wave` mode is allowed.
- No evidence map and no heavy checklist sections.

## Quick Review Questions

- Can a developer start current wave implementation within 30 seconds?
- Is ownership clear between human control and AI acceleration?
- Is every commit trigger tied to a concrete `done_when` state?
- Are blockers explicit and actionable?
- Does current wave form one verifiable loop?
