# Scope Boundary And Split Rules

Use this reference after the ownership node and likely path are known, but
before deciding whether to reuse a parent page or create a new local artifact.

## Reuse An Existing Document When

- the existing file already owns the same node and the same job
- the new content extends the same source-of-truth surface
- ownership and lifecycle remain coherent
- no child-scope detail would be flattened into the parent

## Create A New Local Document When

- reuse would mix different ownership nodes
- reuse would mix parent summary and child detail
- the narrower scope needs its own local source of truth
- the content carries file change plans, execution slices, verification detail,
  ownership splits, or local risks that do not belong in the parent
- the current file is already too broad to stay readable

## Keep In The Parent

- one short summary
- one stable link to the child doc
- one small index entry when discovery truly changed

## Keep In The Child

- file change plans
- execution order or slices
- verification slices
- component or submodule risks
- local ownership boundaries
- implementation detail that would clutter a parent summary

## Prefer A Topic-Family Container When

- the same local subject now has 2 or more live alternative proposals
- the same local subject mixes proposal, decision, implementation-plan, and
  current-state pages
- readers would understand the subject more easily as one node-local family
  under `<node>/docs/<topic>/` than as loose siblings in root `docs/rfcs` or
  `docs/plans`

## Default Rule

Preserve scope clarity and local detail before optimizing for fewer files.
