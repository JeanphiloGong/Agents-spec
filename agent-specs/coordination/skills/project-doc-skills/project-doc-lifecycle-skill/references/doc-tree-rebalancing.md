# Doc Tree Rebalancing

Use this reference when a maintained documentation scope no longer fits its
current placement or reading structure.

## Common Problems

- parent docs absorbing child detail
- implemented proposals still acting as the only current knowledge
- local source of truth missing at the owning node
- stale summaries after child docs were created
- reading order breaking across parent, child, or sibling docs

## Goal

Rebalance the family so:
- parent docs summarize and link
- child docs hold local detail
- current-state sits at the node that owns the implemented behavior
- the canonical page is easier to identify than the historical one
- the reader can move through the scope without guessing the next page
- target nodes remain real code-owned seams rather than docs-only grouping
  folders
