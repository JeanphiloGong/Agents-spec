# Create vs Update Rules

Use this reference when deciding whether to create a new document or update an
existing one.

## Update Existing When

- the existing file is already authoritative for the same scope
- the new content extends the same design or contract surface
- ownership and lifecycle remain coherent

## Create New When

- reusing the old file would mix different scopes
- the old file is already too broad or stale
- the new content needs a different lifecycle or owner
- the new content is a new proposal rather than an update to current reality

## Decision Rule

Favor source-of-truth clarity over file count reduction.
