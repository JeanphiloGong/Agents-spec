# Skill Maintenance Notes

Use this file when maintaining `project-memory-skill` itself. It is not part of
the default end-user execution path.

## Acceptance Review

- Run the checks in `references/acceptance-criteria.md` after material skill
  updates.
- Record pass or fail evidence for the highest-risk gap first.
- Keep the next iteration scoped to the smallest change that closes the most
  important failure mode.

## Reinforcement Mode

- Reinforcement is off by default and must be explicitly enabled.
- Each round should be localized, auditable, and reversible.
- Each round should produce plan, change, verify, and reflect notes.

## Audit Baseline

Each reinforcement round should produce:

- a Git commit containing only that round's skill changes
- an audit record in `references/reinforcement-audit.jsonl`
- validation via `scripts/validate_reinforcement_audit.py`

## Suggested Verification Loop

1. Plan the usability or fragmentation problem being targeted.
2. Change one workflow, template, or validation rule at a time when feasible.
3. Verify with reproducible checks, including a negative test for accidental
   repo-local writes.
4. Reflect on what improved, what remained brittle, and the next refinement.
