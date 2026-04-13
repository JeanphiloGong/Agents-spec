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

## Page Role
- `node entry README`

## Document Intent
- `purpose`

## Why This Node
- the module root owns boundary and navigation for `graph`, so the purpose page
  should live at the module entry rather than in a child docs folder

## Primary Artifact
- path: `graph/README.md`
- type: purpose overview

## Create or Update Decision
- update existing
- reason: the existing module root README already owns module-level purpose and
  navigation, so the local `docs/` subtree does not need its own competing
  summary page

## Scope Boundary Decision
- keep only module purpose, boundary, and child links here
- do not add child implementation plans
- do not create `graph/docs/README.md` just to mirror the local docs folders

## Immediate Companion Updates
- parent summary: no
- current-state: maybe
- indexes: update root docs landing or system overview if discoverability
  changed
- footer links: yes
- neighbor links: maybe to the module current-state page

## Metadata Plan
- none

## Body Structure Plan
- Purpose
- Responsibilities or Boundaries
- Main Flow
- Key Areas or Child Nodes
- Related Docs

## Linkage Notes
- link to system overview
- link to child submodule docs
- keep the repository root README limited to a short docs pointer if it needs
  any update at all
- do not open with a docs-tree explanation before the module purpose and flow

## Index Update Plan
- update the nearest parent index only if this module page becomes newly
  discoverable
- do not add a second local docs index unless the subtree later grows large or
  mixed enough to justify it

## Follow-up Docs
- maybe update or create module current-state if the purpose page reveals a
  missing authority page
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

## Page Role
- `formal doc`

## Document Intent
- `proposal`

## Why This Node
- the parser submodule owns this implementation change, so the plan belongs
  under `graph/query/parser` rather than inside the broader query RFC

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
- neighbor links: yes to the nearest parser current-state page if one exists

## Metadata Plan
- none

## Body Structure Plan
- Summary
- Scope
- Proposed Change
- File Change Plan
- Verification
- Risks

## Linkage Notes
- link to parent RFC
- link to nearest local current-state page if one exists

## Index Update Plan
- update the nearest parent or local index with one stable link

## Follow-up Docs
- create or refresh parser current-state when the proposal becomes implemented
```

## Counterexample To Avoid

- a node `README.md` that starts with `docs/` navigation before it explains the
  node's purpose
- a node `README.md` that only lists files without describing
  responsibilities, inputs and outputs, or the main flow
- a root `README.md` that duplicates the full formal-doc index from
  `docs/README.md`
