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
- an accepted decision or long-lived direction becomes the current authority
- a new guide, contract, or runbook becomes part of the normal workflow

## Add A Node-Local Docs Index When

Treat `<node>/docs/README.md` as warranted only when:

- the subtree has at least 4 durable docs
- the subtree spans mixed intents such as decisions, current-state pages,
  guides, contracts, operations notes, and long-lived direction
- the reader path is non-obvious enough that the node root `README.md` cannot
  navigate it cleanly

Do not add a local docs index to a tiny or single-intent subtree just for
symmetry.

## Add A Topic-Family README When

- the same node and topic now need a second durable page
- the topic family has 2 or more durable sibling pages
- the topic family spans mixed intents such as decision, current-state, guide,
  contract, operations, and long-lived direction
- readers would not know the intended order across sibling docs without a
  local entry page

## Topic-Family Reading Priority

Within one topic family, use this default reading priority unless local context
clearly needs another order:

1. `README.md` for entry and reading order
2. `decision.md` when the reader needs the accepted conclusion or boundary
3. `current-state.md` when the reader needs the current implemented truth
4. `guide.md` when the reader needs to perform a normal workflow
5. `operations.md` when the reader needs diagnosis, recovery, or intervention
6. `direction.md` when the reader needs long-lived evolution direction

Keep workflow-plan outputs, task lists, issue acceptance checklists, and
one-off execution sequencing out of topic-family docs by default. Use issues,
PR/MRs, planning artifacts, or comments unless the material has become durable
project knowledge.

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
- Decision source:
- Current state in:
- Contract defined in:
- Related guide:
```

## Default Rule

Add only the smallest set of companion updates that keeps the new page easy to
find and easy to place in the local reading path.
