# Canonical Status And History

Use this reference when multiple pages talk about the same subject and readers
cannot tell which page currently governs behavior.

## Canonical

A canonical page is where the repository expects readers to rely on the
current truth for a boundary.

Examples:

- current-state page
- stable contract or spec
- maintained local technical summary

## Historical

Historical pages preserve why the system evolved but should not force readers
to treat old proposal text as the current source of truth.

Examples:

- implemented RFCs
- superseded ADRs
- archived migration plans

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

- RFC or proposal: `draft -> review -> accepted -> implemented`
- ADR: `accepted -> active -> superseded`
- current-state: `active -> superseded`
- guide or runbook: `active -> deprecated -> superseded -> archived`

## Default Rule

Status change alone is not enough. Also decide:

- whether the placement node is still correct
- whether the parent should become summary-only
- whether a child doc should become the new local source of truth
- whether historical pages clearly point forward to their current replacements
