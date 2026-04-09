# Current-State Manual Pattern

Use this reference when choosing the path that owns the repository's
current-state or system-manual entry role.

## Purpose

The current-state layer should answer:
- how does the system work now?
- what are the current boundaries and flows?
- where do I go for the authoritative lower-level details?

## What It Is

- a reader-facing entry layer
- a map into current architecture, key flows, and stable interfaces
- a bridge from proposals and decisions into implemented reality

## What It Is Not

- not a duplicate of every RFC, ADR, spec, guide, or runbook
- not a second competing source of truth for every lower-level detail
- not a dumping ground for design discussion

## Good Patterns

- `architecture/README.md` as the current-state landing page
- one page per major subsystem or flow when the system is large enough
- explicit links back to proposal, decision, contract, and guide documents

## Required Properties

- discoverable from the root docs entry
- updated when implemented changes alter system understanding
- narrow enough that maintainers will actually keep it current
