# Index Update Rules

Use this reference when deciding whether entry pages or section indexes must be
updated.

## Update Indexes When

- a new document changes what readers should discover first
- a current-state page is created or materially changed
- a proposal becomes an active or important tracked change
- a new guide, contract, or runbook becomes part of the normal workflow

## Common Targets

- root `docs/README.md`
- node `README.md` files that act as module or submodule entry points
- current-state or architecture index
- section `README.md` files only when a local docs subtree truly needs a
  secondary index

## Secondary Index Gate

Treat a local `docs/README.md` as a real secondary index only when:
- the subtree has at least 4 durable docs
- the subtree spans mixed intents such as proposals plus current-state plus
  guides
- or the reader path is non-obvious enough that the node root `README.md`
  cannot navigate it cleanly

Do not add a section `README.md` to a tiny or single-intent subtree just for
symmetry.

## Default Rule

If discoverability changed, the index should change too.
