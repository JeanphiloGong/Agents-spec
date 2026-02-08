# Operator Playbook (Lean)

## Default Usage

Use `fast` mode only.
Use this skill primarily to transplant AI-branch changes into `main`.

## Execute in this order

1. Build `Main Mapping Plan (1->7)` from AI diff to main targets.
2. Define `Per-Step Gate` for all seven phases.
3. Build `Minimal Landing Batch (Top 3)` as one closed loop.
4. Execute changes in fixed 1->7 phase order.
5. Run minimal verification.
6. If failure occurs, run rollback first, then patch and retry.

## Output Focus

- Default output is implementation-first.
- Do not output Evidence Map or long checklist sections in `mode=fast`.
- Keep blocking questions only.
- Include multi-agent plan only when mode resolves to `multi`.

## File Policy

- Existing files first.
- Do not add new files by default.
- If a new file is unavoidable, include explicit justification and rollback notes.

## Gate Rule

If a gate is triggered, block progression at the current phase.
Do not reorder the 1->7 phase sequence.
