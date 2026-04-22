# Create Vs Update Rules

Use this reference when deciding whether to create a new doc or update an
existing one.

## Update Existing When

- the existing doc already owns the exact same node and intent
- the new content extends the same source-of-truth surface
- ownership and lifecycle remain coherent
- no child-scope detail would be flattened into the parent

## Create New When

- reuse would mix different ownership nodes
- reuse would mix parent summary and child detail
- the new content needs its own local source of truth
- the content carries file change plans, execution slices, or verification
  detail that does not belong in the parent
- the current file is already too broad
- the same node or topic now has multiple live alternatives or mixed intents
  and needs a local topic-family container rather than one more loose sibling
  file

## Decision Rule

Favor scope clarity and preserved detail over file-count reduction.
Favor a node-local topic-family container over a root type bucket when one
local subject accumulates sibling proposals, decisions, plans, or current-state
pages.
