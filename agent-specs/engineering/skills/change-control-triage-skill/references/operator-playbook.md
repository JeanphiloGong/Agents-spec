# Operator Playbook (Lean)

## Default Usage

Use `mode=fast` for day-to-day execution.

## Execute in this order

1. Run `Start Here (Top 3)`.
2. Execute phase-by-phase modifications in order.
3. Run minimal verification.
4. If failure occurs, run rollback first, then patch and retry.

## Gate Rule

If a gate is triggered, fix it before normal phase progression.

## Mode Switching

- Use `deep` when you need concise tradeoff explanation.
- Use `audit` only for formal review or handoff.
