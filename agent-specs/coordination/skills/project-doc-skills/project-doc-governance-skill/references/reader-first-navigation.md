# Reader-First Navigation

Use this reference when designing how a reader should enter and traverse a
repository's documentation.

## Goal

The root documentation experience should answer:
- where should I start?
- how does the system work now?
- what is still changing?
- why was it designed this way?
- what boundaries are stable?
- how do I develop, debug, or operate it?

## Default Entry Model

Prefer a top-down reading path:

1. `Start Here`
2. `Current State`
3. `Active Changes`
4. `Key Decisions`
5. `Stable Contracts`
6. `Development and Operations`
7. `Governance`

## Design Rules

- Optimize for reader flow, not folder symmetry.
- A root entry page should be a reading map, not a raw directory listing.
- Current-state pages should sit near the top of the reading path.
- Active changes should point readers toward current-state and decision docs
  when those exist.
- Governance should be reachable, but should not be the first thing normal
  readers have to parse.

## Failure Modes

- The root page is only a folder map.
- Readers must understand taxonomy before they can find the system's current
  behavior.
- The only rich documents are RFCs.
- Current-state knowledge exists but has no obvious entrypoint.
