# Navigation And Companion Updates

Use this reference after choosing the primary artifact. The point is to repair
discovery and reading order without moving child detail back into parent docs.

## Add Companion Updates When

- discoverability would suffer without a parent or index update
- a local current-state page should now point to the new child doc
- a cross-node summary should acknowledge the new local source of truth
- a new child detail page changes the local reading path

## Common Companion Targets

- parent summary or parent index
- current-state page at the same node
- root or section index
- `<node>/docs/<topic>/README.md`
- related-doc or follow-up links near the end of the page

## Update An Index When

- a new document changes what readers should discover first
- a current-state page is created or materially changed
- a proposal becomes an active tracked change
- a new guide, contract, or runbook becomes part of the normal workflow

## Add A Node-Local Docs Index When

Treat `<node>/docs/README.md` as warranted only when:

- the subtree has at least 4 durable docs
- the subtree spans mixed intents such as proposals, current-state pages, and
  guides
- the reader path is non-obvious enough that the node root `README.md` cannot
  navigate it cleanly

Do not add a local docs index to a tiny or single-intent subtree just for
symmetry.

## Add A Topic-Family README When

- the topic family has 2 or more live alternative proposals
- the topic family spans mixed intents such as proposal, decision,
  implementation plan, and current-state
- readers would not know the intended order across sibling docs without a
  local entry page

## Related-Doc Footers

Prefer a light footer near the end of the page in normal cases:

```text
## Related Docs
- Parent summary:
- Current state:
- Contract:
- Guide:
```

Use a fuller lineage block only when lifecycle relationships would otherwise be
ambiguous:

```text
## Doc Lineage
- Proposed by:
- Decided by:
- Current state in:
- Contract defined in:
- Related guide:
```

## Default Rule

Add only the smallest set of companion updates that keeps the new page easy to
find and easy to place in the local reading path.
