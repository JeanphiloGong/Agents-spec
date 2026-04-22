# Choose A Body Shape By Document Intent

Once ownership and path are settled, choose a body shape that matches what the
reader needs from the document. Do not force every artifact into the same
outline.

README pages that are not docs landings should explain the layer first and the
documentation system second. Formal docs should be shaped by their job, not by
their filename alone.

One document should do one job. If a page includes `File Change Plan`,
`Execution Order`, `Verification`, or similar delivery detail, treat it as a
proposal or delivery-plan document rather than as a pure direction note or
high-level summary.

Use reader-facing headings in the final page. Avoid control-language or
schema-like section titles such as `Role`, `Document Role`, `Target Shape`,
`Output Contract`, `Trigger and Scope`, or `Recommended Next Step`.

## Purpose Documents

Use this shape when the reader needs to understand what a layer exists for,
what it owns, and where to go next.

Prefer:

- Purpose
- Scope
- Responsibilities
- Child Nodes or Related Areas
- Related Docs

## Repository Landing `README.md`

Use this shape when the reader needs a quick understanding of the repository
before diving into the docs tree.

Prefer:

- Project Purpose
- Main Capabilities
- Repository Orientation
- Getting Started or Entry Cues
- Short Docs Pointer

## Node Entry `README.md`

Use this shape when the reader needs to understand one module, submodule,
component, or test node before following child links.

Prefer:

- Purpose
- Responsibilities or Boundaries
- Main Flow
- Key Areas or Child Nodes
- Related Docs

## Docs Landing `README.md`

Use this shape when the page exists to route readers through a docs subtree.

Prefer:

- Scope
- Start Here or Reading Order
- Current Authority Routes
- Doc Categories
- Related Nodes

## Proposal Or Delivery-Plan Documents

Use this shape when the reader needs to understand a proposed or planned
change and what must happen to implement it.

If the page includes file changes, execution order, or verification work, do
not present it as only a direction note. Its structure should make the
implementation character obvious.

Prefer:

- Summary
- Context
- Scope
- Proposed Change
- File Change Plan
- Execution Order
- Verification
- Risks

## Current-State Documents

Use this shape when the page explains the implemented behavior that now serves
as the local source of truth.

Prefer:

- Scope or Boundary
- Responsibilities
- Data or Control Flow
- External Interfaces
- Related Docs

## Contract Documents

Use this shape when the page defines a stable boundary that other code or
operators depend on.

Prefer:

- Scope
- Contract
- Semantics
- Compatibility Notes
- Examples

## Guides

Use this shape when the reader needs to accomplish a task rather than learn the
whole system.

Prefer:

- Goal
- Preconditions
- Steps
- Verification
- Troubleshooting

## Operation Documents

Use this shape when the page is meant for diagnosis, recovery, or intervention.

Prefer:

- Trigger or Symptoms
- Preconditions
- Steps
- Verification
- Rollback
- Escalation

## Default Rule

Choose the structure that best serves the reader's task. For README pages that
are not docs landings, keep docs pointers brief and late. The final page
should read like a document for readers, not like an exposed operator
checklist.
