# Promotion Decision Rules

Use this reference when deciding what should happen after a proposal advances.

## Promotion Targets

- `current-state/manual`
  - when implemented behavior changes system understanding
- `adr`
  - when a durable decision should be remembered and revisited later
- `contract/spec`
  - when the change creates or alters a stable, depended-on boundary
- `guide`
  - when development or integration workflow changes
- `runbook`
  - when operations, recovery, rollback, or troubleshooting changes

## Rule

Implemented proposals should trigger an explicit current-state decision, even
if the answer is "no current-state page is needed."
