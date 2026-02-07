# RED Mastery Checklist Template

Fill this for every RED item. If any section is unknown, write `UNKNOWN` and treat it as blocking.

## Item

- Name:
- Files / modules:
- Why it is RED:

## Invariants (>= 3)

1.
2.
3.

## Preconditions / State Boundaries

- Allowed when:
- Forbidden when:

## State Transitions (What changes)

- Before:
- After:
- “Done” means:

## Policy Gates / Forbidden Combinations (if any)

- Gate:
- Forbidden:
- Enforced by:

## Failure Modes (>= 3) + Handling

1) Failure:
   - Signal:
   - Handling:
2) Failure:
   - Signal:
   - Handling:
3) Failure:
   - Signal:
   - Handling:

## Verification (Tests)

- Positive tests:
- Negative tests (must include forbidden cases):
- Boundary tests:

## Rollback / Stop-the-Bleeding

- Rollback approach:
- Emergency switch / safe mode:
- Data repair (if needed):

## Notes / Assumptions

- Assumptions:
- Open questions:
