# Operator Playbook (One-Wave)

## Default Usage

Use `fast-one-wave` mode only.
Use this skill to compare two branches and plan current wave execution.

## Inputs

- `base_branch`
- `head_branch`

## Execute in this order

1. Compare `base_branch..head_branch` and extract change units.
2. Build `Control Map` first (human vs AI responsibilities).
3. Select current wave scope (max 1-2 loops).
4. Build `Current Wave Plan (1->7)` with `commit_when` and `done_when`.
5. Add `Per-Step Gate` and blocking questions.
6. Run minimal verification and rollback readiness check.
7. Stop after current wave output; only provide one-line next-wave entry condition.

## Output Focus

- Tutorial-first and implementation-ready.
- Keep content concise.
- Keep blocking questions only.
- Multi-agent is default; use single mode only for trivial fallback.

## File Policy

- Existing files first.
- Do not add new files by default.
- If a new file is unavoidable, include explicit justification and rollback notes.

## Gate Rule

If a gate is triggered, block progression at the current phase.
Do not reorder the 1->7 phase sequence.
