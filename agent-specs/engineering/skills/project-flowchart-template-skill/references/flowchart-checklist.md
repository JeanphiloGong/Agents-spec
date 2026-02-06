# Fast Flowchart QA Checklist

## Structure

- [ ] Title and scope are explicit.
- [ ] Entry node is concrete (endpoint/function/event).
- [ ] Layer transitions are visible.
- [ ] Success and failure branches both exist.

## Evidence

- [ ] Node labels map to real files/functions.
- [ ] No fabricated dependencies.
- [ ] Unknowns are tagged with `TODO(verify)`.

## Maintainability

- [ ] Stable node IDs for future diffs.
- [ ] Diagram is readable without zoom hacks.
- [ ] Comments explain optional branches when needed.
