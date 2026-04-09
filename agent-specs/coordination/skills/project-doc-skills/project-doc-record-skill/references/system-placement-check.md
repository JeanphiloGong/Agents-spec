# System Placement Check

Run this check before selecting the primary artifact.

## Required Questions

- Which module or service owns the change?
- Which higher-level capability or user-visible function does it serve?
- Which core flow or subsystem does it affect?
- Does it change proposal, decision, current-state, contract, development
  flow, or operation?
- Which current-state or manual page must be created or updated, if any?

## Why This Exists

This check prevents local implementation notes from becoming isolated documents
with no path back to the system view.

## Outcome

The result of this check determines:
- whether a single document is enough
- whether companion updates are required
- which readers need to be able to find the result later
