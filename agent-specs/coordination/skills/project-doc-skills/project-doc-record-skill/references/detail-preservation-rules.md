# Detail Preservation Rules

Use this reference when deciding whether a detailed plan can safely reuse an
existing parent doc.

## Preserve In Child Docs

Prefer a child doc when the content contains:
- file change lists
- execution order or slices
- verification slices
- component or submodule risks
- local ownership boundaries
- implementation detail that would clutter a parent summary

## Parent Docs May Keep

- one short summary
- a stable link to the child doc
- a small index entry

## Rule

Preserve information and scope boundaries before optimizing for fewer files.
