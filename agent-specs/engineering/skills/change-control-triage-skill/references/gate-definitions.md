# Gate Definitions

Gates are blocking checks before moving to the next phase.

## Gate Policy

- `strict`:
  - unresolved gate => `Decision=BLOCK`
  - gates block current phase only
  - gates never reorder phase order

## Security Gate

Trigger examples:
- missing auth verification
- privilege escalation path
- token/signature checks bypassed
- unsafe secret handling

## Data Gate

Trigger examples:
- irreversible migration without rollback
- destructive data operation without recovery path
- schema changes that can corrupt reads/writes

## Contract Gate

Trigger examples:
- public API/schema/event break without compatibility strategy
- interface rename/removal without migration notes
- client-facing payload shape break

## Reliability Gate

Trigger examples:
- no minimal verification path for critical flows
- no rollback/stop-the-bleeding strategy
- changes with high blast radius and no failure handling

## Gate Resolution Requirement

A triggered gate is resolved only when:
- a concrete fix step is defined
- a verification check exists
- rollback behavior is stated
