---
name: project-doc-lifecycle-skill
description: v0.2.0 - Manage one doc family's evolution across the ownership tree by deciding promotion, split, supersede, archive, and lineage-repair actions, then handing concrete doc writes to project-doc-record-skill.
---

# Project Documentation Lifecycle Skill

## Trigger and Scope

Use this skill when one proposal, current-state page, ADR, or related doc
cluster needs evolution planning across the ownership tree rather than one-off
doc writing.

In scope:
- inspecting one doc family and its current ownership-node placement
- comparing docs with implemented code reality
- detecting overloaded parent docs, stale summaries, hidden child detail, and
  overlapping current-state pages
- deciding whether implemented proposals should promote into current-state,
  contracts, guides, or runbooks
- deciding whether a broad parent doc should split into child docs
- deciding supersede, archive, and relink actions
- defining lineage repair across parent and child docs
- producing an ordered handoff that `project-doc-record-skill` can execute

Out of scope:
- redesigning the repository's overall docs tree
- drafting full final bodies for every resulting target doc
- replacing day-to-day record placement for one normal doc-writing request
- migrating the entire repository docs tree in one pass

Use this skill when prompts sound like:
- "this implemented RFC is too big now; what should be split or promoted?"
- "which current-state docs should exist after this change?"
- "the parent doc is overloaded; how should the family evolve?"
- "which docs should be superseded, archived, or relinked?"

## Core Purpose

Keep one document family evolving toward accurate, well-placed system
knowledge.

This skill exists to help you:
- detect when proposal history has outgrown its current placement
- split overloaded parent docs before they absorb more child detail
- decide promotion into current-state and related durable docs
- preserve history while making the new source of truth easier to find
- hand concrete writing work to `project-doc-record-skill` in a clear order

## Workflow

1. Inspect the source doc family.
   - Read the triggering RFC, ADR, architecture page, or related cluster.
   - Note current status, placement node, parent links, child links, and
     obvious overlap.
2. Inspect code and current implementation reality.
   - Compare the docs with current behavior, ownership boundaries, and existing
     node-local docs.
   - Record unknowns explicitly.
3. Detect lifecycle and placement problems.
   - Check for:
     - implemented but not promoted
     - stale parent summary
     - overloaded parent doc
     - hidden child detail
     - overlapping current-state docs
     - missing lineage links
4. Determine current lifecycle and placement state.
   - Decide whether the family is:
     - proposal-only
     - accepted but not implemented
     - implemented but not promoted
     - promoted but badly placed
     - current but stale-linked
     - superseded or archival-ready
5. Define the target tree shape.
   - Decide what the family should look like after this wave:
     - parent summary plus child docs
     - local current-state replacing proposal detail
     - extracted ADR
     - local contract, guide, or runbook
     - superseded or archived history
6. Decide promotion, split, and supersede actions.
   - Explicitly decide whether this wave requires:
     - current-state updates
     - child-doc creation
     - ADR extraction
     - contract or spec docs
     - guide or runbook docs
     - supersede or archive actions
7. Decide parent summary changes.
   - State what the parent should keep:
     - short summary
     - replacement links
     - index guidance
8. Decide child doc creates or updates.
   - State which child nodes now need their own docs and why.
9. Decide lineage repairs.
   - Define forward and backward links after the wave:
     - proposal to current-state
     - parent to child
     - superseded doc to replacement
10. Produce the lifecycle handoff plan.
   - Order the actions.
   - Specify which actions `project-doc-record-skill` should execute.

## Required Inputs

- Source doc or doc family to evaluate
- Current implementation or rollout state
- Related current-state, guide, contract, or local node docs if known

## Defaults

- Operating target: `one-doc-family-tree-rebalance`
- Promotion baseline: implemented proposals require an explicit
  current-state decision
- Split baseline: overloaded parent docs should split before more child detail
  is added
- Child-source rule: child docs may become the canonical local source of truth
  while the parent becomes summary or index
- ADR baseline: extract only when the decision is durable and likely to be
  revisited
- Contract baseline: add only when the boundary is stable and depended on
- Runbook baseline: add only when operator recovery or intervention matters
- Archive baseline: prefer `superseded` or `deprecated` before archival
- Execution model: decide lifecycle and placement here, then hand concrete doc
  writing to `project-doc-record-skill`

## Bundled Resources

- `references/doc-tree-rebalancing.md`
- `references/split-parent-doc-rules.md`
- `references/promote-child-summary-rules.md`
- `references/parent-child-lineage-repair.md`
- `references/status-transition-model.md`
- `references/example-output.md`

## Output Format

```text
## Lifecycle Goal
## Source Node
## Current Lifecycle State
## Current Placement Problems
## Target Tree Shape
## Promotion Decisions
- current-state/manual:
- adr:
- contract/spec:
- guide:
- runbook:

## Split Decisions
## Parent Summary Changes
## Child Doc Creates/Updates
## Status Transitions
## Lineage Repairs
## Record-Skill Handoffs
## Execution Order
## Open Questions
```

## Guardrails

- Do not redesign the repository's whole docs tree here; use
  `project-doc-architecture-skill` for that.
- Do not treat every accepted RFC as an ADR candidate.
- Do not keep adding child detail into an overloaded parent doc.
- Do not promote everything upward to root docs when the real source of truth
  belongs lower in the tree.
- Do not delete history blindly; prefer supersede, archive, and repair links.
- Do not write full final bodies for every target doc here; hand concrete
  writing to `project-doc-record-skill`.

## Verification Hooks

- Verify that the source doc family and current implementation state were both
  inspected.
- Verify that lifecycle problems and placement problems are both explicit.
- Verify that the target tree shape is clearer than the current state.
- Verify that promotion and split decisions are justified rather than
  automatic.
- Verify that parent and child boundaries after rebalancing are explicit.
- Verify that record-skill handoffs are node-specific and executable.
