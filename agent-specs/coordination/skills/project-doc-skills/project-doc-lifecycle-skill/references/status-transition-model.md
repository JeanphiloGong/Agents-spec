# Status Transition Model

Use this reference when deciding how a document should change status over time.

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

- RFC:
  - `draft -> review -> accepted -> implemented`
- ADR:
  - `accepted -> active -> superseded`
- Architecture or current-state:
  - `active -> superseded`
- Guide or runbook:
  - `active -> deprecated -> superseded -> archived`

## Rule

Changing status is not enough by itself. The skill should also decide whether
lineage, current-state pages, or related docs need to change.
