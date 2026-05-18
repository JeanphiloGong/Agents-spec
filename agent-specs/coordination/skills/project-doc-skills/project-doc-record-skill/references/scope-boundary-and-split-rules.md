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
- the content carries durable child-scope knowledge, ownership splits, or local
  risks that do not belong in the parent
- the current file is already too broad to stay readable

Do not create a new local document only to archive workflow-plan outputs,
task breakdowns, issue acceptance checklists, or one-off execution sequencing.
Keep those in issues, PR/MRs, planning artifacts, or comments unless they have
become durable project knowledge.

## Keep In The Parent

- one short summary
- one stable link to the child doc
- one small index entry when discovery truly changed

## Keep In The Child

- stable child-scope knowledge
- component or submodule risks
- local ownership boundaries
- durable implementation context that would clutter a parent summary

## Prefer A Topic-Family Container When

- the same local subject now has 2 or more durable sibling pages
- the same local subject mixes accepted decisions, current-state pages, guides,
  contracts, operations notes, and long-lived direction
- readers would understand the subject more easily as one node-local family
  under `<node>/docs/<topic>/` than as loose siblings in root `docs/rfcs` or
  `docs/plans`

## Default Rule

Preserve scope clarity and local detail before optimizing for fewer files.
