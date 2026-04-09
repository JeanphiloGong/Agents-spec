# Lifecycle Role Classification

Use this reference before choosing the primary doc type.

## Roles

- `proposal`
  - a planned or debated change that is not yet authoritative current state
- `decision`
  - a durable conclusion worth retaining for future why-questions
- `current-state`
  - how the system works now
- `contract`
  - a stable, depended-on boundary
- `development-guide`
  - how developers or integrators use or extend the system
- `operation`
  - how operators recover, troubleshoot, rollback, or maintain the system

## Default Mapping

- `proposal` -> `rfc`
- `decision` -> `adr`
- `current-state` -> `architecture`
- `contract` -> `spec`
- `development-guide` -> `guide`
- `operation` -> `runbook`

## Important Rule

Choose lifecycle role first. Doc type is the representation, not the core
decision.
