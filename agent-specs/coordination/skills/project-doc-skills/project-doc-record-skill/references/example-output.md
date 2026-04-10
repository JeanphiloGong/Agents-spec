# Example Output

Use this reference when the operator wants an example of how one node-local doc
wave should be recorded.

## Example: Module Purpose Doc

```text
## Recording Goal
- Record the `graph` module's durable purpose and boundary.

## Ownership Node
- node: `module`
- parent node: `system`
- lowest common ancestor: `graph`

## Document Intent
- `purpose`

## Primary Artifact
- path: `graph/docs/README.md`
- type: purpose overview

## Create or Update Decision
- update existing
- reason: the existing module README already owns module-level purpose and
  navigation

## Scope Boundary Decision
- keep only module purpose, boundary, and child links here
- do not add child implementation plans

## Immediate Companion Updates
- parent summary: no
- current-state: maybe
- indexes: update root system overview if discoverability changed
- footer links: yes

## Metadata Plan
- none

## Body Structure Plan
- Purpose
- Scope
- Responsibilities
- Child Areas
- Related Docs

## Footer Context Plan
- link to system overview
- link to child submodule docs

## Index Update Plan
- update the nearest parent index only if this module page becomes newly
  discoverable
```

## Example: Child Plan Must Stay Separate

```text
## Recording Goal
- Record a detailed parser submodule implementation plan without losing the file
  change list.

## Ownership Node
- node: `submodule`
- parent node: `module`
- lowest common ancestor: `graph/query/parser`

## Document Intent
- `proposal`

## Primary Artifact
- path: `graph/query/parser/docs/batch-normalization-plan.md`
- type: proposal plan

## Create or Update Decision
- create new
- reason: appending this content to the parent query RFC would blur scope and
  erase parser-local detail

## Scope Boundary Decision
- parent doc keeps: one short summary and link
- child doc keeps: file change plan, execution slices, verification, and local
  risks

## Immediate Companion Updates
- parent summary: yes
- current-state: no
- indexes: maybe the nearest module or submodule index
- footer links: yes

## Metadata Plan
- none

## Body Structure Plan
- Summary
- Scope
- Proposed Change
- File Change Plan
- Verification
- Risks

## Footer Context Plan
- link to parent RFC
- link to nearest local current-state page if one exists

## Index Update Plan
- update the nearest parent or local index with one stable link
```
