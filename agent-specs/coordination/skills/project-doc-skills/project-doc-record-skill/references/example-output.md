# Example Output

Use this reference when the operator wants an example of how one node-local doc
wave should be recorded.

These examples show operator planning output, not final document headings. Do
not copy labels such as `Recording Goal` or `Page Role` into the finished page.

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
- do not add transient child task plans
- do not create `graph/docs/README.md` just to mirror the local docs folders

## Immediate Companion Updates
- parent summary: no
- current-state: maybe
- indexes: update root docs landing or system overview if discoverability
  changed
- footer links: yes
- neighbor links: maybe to the module current-state page

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

## Example: Child Current-State Doc Must Stay Separate

```text
## Recording Goal
- Record the parser submodule's durable batch-normalization behavior without
  losing parser-local constraints.

## Ownership Node
- node: `submodule`
- parent node: `module`
- lowest common ancestor: `graph/query/parser`

## Page Role
- `formal doc`

## Document Intent
- `current-state`

## Why This Node
- the parser submodule owns this behavior, so the current-state explanation
  belongs under `graph/query/parser` rather than inside the broader query
  overview

## Primary Artifact
- path: `graph/query/parser/docs/batch-normalization.md`
- type: current-state explanation

## Create or Update Decision
- create new
- reason: appending this content to the parent query overview would blur scope
  and erase parser-local detail

## Scope Boundary Decision
- parent doc keeps: one short summary and link
- child doc keeps: parser-local behavior, constraints, verification signals,
  and durable risks

## Immediate Companion Updates
- parent summary: yes
- current-state: no
- indexes: maybe the nearest module or submodule index
- footer links: yes
- neighbor links: yes to the nearest parser current-state page if one exists

## Body Structure Plan
- Summary
- Scope
- Current Behavior
- Constraints
- Verification Signals
- Risks

## Linkage Notes
- link to parent query overview
- link to nearest local current-state page if one exists

## Index Update Plan
- update the nearest parent or local index with one stable link

## Follow-up Docs
- create or refresh a contract doc only if downstream callers depend on this
  behavior
```

## Counterexample To Avoid

- a node `README.md` that starts with `docs/` navigation before it explains the
  node's purpose
- a node `README.md` that only lists files without describing
  responsibilities, inputs and outputs, or the main flow
- a root `README.md` that duplicates the full formal-doc index from
  `docs/README.md`
- a test coverage overview stored under a runtime module docs tree when the
  covered files span multiple tests under `tests/`

## Example: Test Coverage Overview

```text
## Recording Goal
- Record one durable overview of `document_ingest` unit-test coverage.

## Ownership Node
- node: `test-suite`
- parent node: `system`
- lowest common ancestor: `tests/unit`

## Page Role
- `formal doc`

## Document Intent
- `current-state`

## Why This Node
- the document primarily describes test assets spread across `tests/unit`
  rather than the runtime module itself, so the tests subtree is the real owner

## Primary Artifact
- path: `tests/unit/document-ingest-tests-overview.md`
- type: test coverage overview

## Create or Update Decision
- create new
- reason: attaching this page to the runtime module would blur runtime docs and
  verification docs into one tree

## Scope Boundary Decision
- the runtime module README may keep one short link
- the tests overview keeps file coverage, verification boundaries, and known
  gaps

## Immediate Companion Updates
- parent summary: maybe a short note in `tests/README.md`
- current-state: no
- indexes: yes at the nearest tests entrypoint
- footer links: yes
- neighbor links: maybe to the runtime module README
```
