# Doc Tree Rebalancing

Use this reference when a doc family no longer fits its current placement.

## Common Problems

- parent docs absorbing child detail
- implemented proposals still acting as the only current knowledge
- local source of truth missing at the owning node
- stale summaries after child docs were created

## Goal

Rebalance the family so:
- parent docs summarize and link
- child docs hold local detail
- current-state sits at the node that owns the implemented behavior
- target nodes remain real code-owned seams rather than docs-only grouping
  folders
