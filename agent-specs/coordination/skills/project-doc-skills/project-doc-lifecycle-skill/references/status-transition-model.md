# Status Transition Model

Use this reference when deciding how doc status changes interact with tree
rebalancing.

## Common States

- `draft`
- `review`
- `accepted`
- `implemented`
- `active`
- `deprecated`
- `superseded`
- `archived`

## Typical Progressions

- RFC or proposal:
  - `draft -> review -> accepted -> implemented`
- ADR:
  - `accepted -> active -> superseded`
- Current-state:
  - `active -> superseded`
- Guide or runbook:
  - `active -> deprecated -> superseded -> archived`

## Rule

Status change alone is not enough. Also decide:
- whether the placement node is still correct
- whether the parent should become summary-only
- whether child docs need to become the new local source of truth
