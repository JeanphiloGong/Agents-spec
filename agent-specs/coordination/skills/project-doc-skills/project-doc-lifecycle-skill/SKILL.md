---
name: project-doc-lifecycle-skill
description: v0.3.3 - Maintain one repository, module, test-suite, or doc-family slice as a book-like documentation system by repairing canonical vs historical relationships, README-vs-docs roles, reading order, bridge docs, and node-local topic families across real code-owned nodes; concrete doc writing belongs to project-doc-record-skill.
---

# Project Documentation Lifecycle Skill

## Trigger and Scope

Use this skill when an existing repository, module, or doc-family slice needs
editorial maintenance so distributed docs remain readable as one coherent
system rather than as disconnected pages.

In scope:
- inspecting one operating scope:
  - one doc family
  - one module or submodule
  - one test-suite slice
  - one repository slice
- comparing docs with implemented code reality
- mapping canonical versus historical pages
- detecting overloaded parent docs, stale summaries, hidden child detail, and
  overlapping current-state pages
- detecting README pages whose docs navigation overwhelms local purpose,
  boundary, or flow explanation
- detecting broken reading order, missing bridge docs, missing overviews, and
  missing entry cues
- deciding whether implemented proposals should promote into current-state,
  contracts, guides, or runbooks
- deciding whether a broad parent doc should split into child docs
- deciding when crowded root `rfcs/plans` buckets or parent docs should extract
  a node-local topic-family container
- deciding supersede, archive, relink, and neighbor-link actions
- defining lineage repair across parent, child, and neighboring docs
- assessing whether the scope is ready to be exported or assembled like a
  project book
- producing an ordered handoff that `project-doc-record-skill` can execute

Out of scope:
- designing the repository's initial documentation information architecture
- drafting full final bodies for every resulting target doc
- replacing day-to-day record placement for one normal doc-writing request
- migrating the entire repository docs tree in one pass without an explicitly
  bounded scope

Use this skill when prompts sound like:
- "this implemented RFC is too big now; what should be split or promoted?"
- "which current-state docs should exist after this change?"
- "the parent doc is overloaded; how should the family evolve?"
- "which docs should be superseded, archived, or relinked?"
- "these docs feel scattered; how do we make them read like one book?"
- "what is the canonical reading order here?"
- "which overview or bridge docs are missing?"

## Core Purpose

Keep distributed docs readable as one coherent project book even when the pages
live near different code-owned nodes.

This skill exists to help you:
- detect when proposal history has outgrown its current placement
- split overloaded parent docs before they absorb more child detail
- decide promotion into current-state and related durable docs
- preserve history while making the current source of truth easier to find
- extract one node's option set or mixed-intent family out of root buckets
  before it becomes untraceable
- keep repo and node READMEs logic-first while docs landing pages stay
  navigation-first
- keep verification docs under the tests subtree when runtime modules are only
  related readers, not the primary owners
- repair reading order and navigation continuity
- identify missing overview or bridge docs
- assess book-readiness and exportability
- hand concrete writing work to `project-doc-record-skill` in a clear order

## Workflow

1. Define the operating scope.
   - Choose the smallest scope that can solve the problem:
     - one doc family
     - one node
     - one repository slice
   - Escalate to a wider scope only when a narrower scope cannot repair the
     reading or authority problem.
2. Inspect code and current implementation reality.
   - Compare the docs with current behavior, ownership boundaries, and existing
     node-local docs.
   - Read current entrypoints, overviews, and authority pages inside the chosen
     scope.
   - Treat docs-only grouping folders as containers unless they map to a real
     owned code seam.
   - Record unknowns explicitly.
3. Detect editorial, lifecycle, and placement problems.
   - Check for:
     - implemented but not promoted
     - stale parent summary
     - overloaded parent doc
     - hidden child detail
     - docs-first README
     - file-inventory README with no layer logic
     - parent README swallowing child runtime detail
     - overlapping current-state docs
     - broken reading order
     - missing bridge or overview docs
     - ambiguous canonical source
     - missing lineage links
     - root `docs/rfcs` or `docs/plans` hiding one node's local topic family
4. Build the current canonical-versus-historical map.
   - Mark which pages are:
     - canonical current truth
     - summary or discovery only
     - historical but still useful
     - stale or replacement-needed
5. Determine current lifecycle and placement state.
   - Decide whether the scope is:
     - proposal-only
     - accepted but not implemented
     - implemented but not promoted
     - promoted but badly placed
     - current but stale-linked
     - superseded or archival-ready
6. Define the target reading structure and target tree shape.
   - Decide what the scope should look like after this wave:
     - parent summary plus child docs
     - local current-state replacing proposal detail
     - extracted ADR
     - local contract, guide, or runbook
     - node-local topic-family container
     - bridge or overview pages
     - superseded or archived history
7. Decide promotion, split, supersede, and archive actions.
   - Explicitly decide whether this wave requires:
     - current-state updates
     - child-doc creation
     - ADR extraction
     - contract or spec docs
     - guide or runbook docs
     - topic-family extraction
     - bridge or overview docs
     - supersede or archive actions
8. Decide parent, child, and neighbor repairs.
   - State what the parent should keep:
     - short summary
     - local purpose or main-flow cue when the parent is a README entry page
     - replacement links
     - index guidance
   - State which child or neighboring nodes need:
     - new docs
     - updated links
     - new related-reading guidance
   - State whether any root or node README must be rewritten so docs pointers
     become secondary to the layer's purpose, boundary, or flow.
9. Decide lineage and navigation repairs.
   - Define forward and backward links after the wave:
     - proposal to current-state
     - parent to child
     - sibling to sibling when reading order depends on it
     - superseded doc to replacement
10. Assess book readiness and export readiness.
   - State whether the scope can currently be assembled into a readable
     project-book slice and what is still missing.
11. Produce the lifecycle handoff plan.
   - Order the actions.
   - Specify which actions `project-doc-record-skill` should execute.

## Required Inputs

- Source doc family, node, or repository slice to evaluate
- Current implementation or rollout state
- Related current-state, guide, contract, or local node docs if known
- Reader confusion or navigation symptoms if known

## Defaults

- Operating target: `editorial-maintenance-for-book-like-doc-systems`
- Scope rule: start from the smallest useful scope and widen only when the
  reading or authority problem crosses that boundary
- Promotion baseline: implemented proposals require an explicit
  current-state decision
- Split baseline: overloaded parent docs should split before more child detail
  is added
- Child-source rule: child docs may become the canonical local source of truth
  while the parent becomes summary or index
- Tests-owner rule: when the page primarily describes coverage, fixtures,
  harnesses, or verification gaps, the tests subtree may be the canonical
  owner even if the runtime module stays a related entrypoint
- README repair baseline: repo and node READMEs should explain local purpose,
  boundaries, and flow before they explain documentation structure; docs
  landing pages own deeper navigation
- Canonical rule: every maintained scope should have inspectable current
  authority rather than only historical proposal text
- Reading-order rule: if readers would not know what to read first or next, the
  scope needs editorial repair even when file placement is technically correct
- Bridge-doc rule: add a bridge or overview page only when it resolves a real
  navigation gap or authority confusion
- Topic-family extraction baseline: when one node or topic has 2 or more live
  alternative proposals, or mixes proposal, decision, implementation-plan, and
  current-state docs for the same local subject, extract a node-local
  topic-family container instead of leaving the family in root `docs/rfcs` or
  `docs/plans`
- ADR baseline: extract only when the decision is durable and likely to be
  revisited
- Contract baseline: add only when the boundary is stable and depended on
- Runbook baseline: add only when operator recovery or intervention matters
- Archive baseline: prefer `superseded` or `deprecated` before archival
- Execution model: decide lifecycle and placement here, then hand concrete doc
  writing to `project-doc-record-skill`
- Node definition rule: target nodes must correspond to real code-owned seams,
  not docs-only grouping folders

## Bundled Resources

- `references/doc-tree-rebalancing.md`
- `references/split-parent-doc-rules.md`
- `references/promote-child-summary-rules.md`
- `references/parent-child-lineage-repair.md`
- `references/canonical-vs-historical-map.md`
- `references/reading-order-repair.md`
- `references/book-manifest-and-export-readiness.md`
- `references/status-transition-model.md`
- `references/example-output.md`

## Output Format

```text
## Lifecycle Goal
## Operating Scope
## Current System State
## Canonical vs Historical Map
## Reading Order
## Broken Navigation Paths
## Missing Entry / Overview / Bridge Docs
## Current Placement Problems
## Target Tree Shape
## Promotion / Supersede / Archive Decisions
## Parent / Child / Neighbor Repairs
## Status Transitions
## Lineage Repairs
## Record-Skill Handoffs
## Book Readiness
## Export Manifest Plan
## Maintenance Actions
## Open Questions
```

## Guardrails

- Do not redesign the repository's whole docs tree here; use
  `project-doc-architecture-skill` for that.
- Do not silently widen a small doc-family problem into a full-repository
  rewrite.
- Do not treat every accepted RFC as an ADR candidate.
- Do not keep adding child detail into an overloaded parent doc.
- Do not promote everything upward to root docs when the real source of truth
  belongs lower in the tree.
- Do not leave test coverage or fixture docs trapped in runtime-module docs
  when the tests subtree is the clearer owner.
- Do not stop at folder-placement repair when the README body still behaves
  like a docs index or child-detail dump.
- Do not propose docs-only grouping folders as target ownership nodes by
  default.
- Do not leave one node's multi-option or mixed-intent family stranded in root
  `docs/rfcs` or `docs/plans` once a node-local topic family is warranted.
- Do not delete history blindly; prefer supersede, archive, and repair links.
- Do not leave the canonical current page ambiguous after a maintenance wave.
- Do not treat a correct folder location as sufficient when reading order is
  still broken.
- Do not write full final bodies for every target doc here; hand concrete
  writing to `project-doc-record-skill`.

## Verification Hooks

- Verify that the chosen operating scope is explicit and justified.
- Verify that current implementation reality and current docs were both
  inspected.
- Verify that lifecycle, placement, and navigation problems are all explicit.
- Verify that the canonical-versus-historical map is explicit.
- Verify that the target tree shape and reading order are clearer than the
  current state.
- Verify that promotion, split, and bridge-doc decisions are justified rather
  than automatic.
- Verify that parent, child, and neighbor boundaries after rebalancing are
  explicit.
- Verify that any repaired repo or node README now explains local purpose or
  flow before docs navigation.
- Verify that docs landing pages remain navigation-first instead of duplicating
  repo or node runtime explanation.
- Verify that test coverage or verification docs move under the tests subtree
  when the tests asset is the canonical owner.
- Verify that record-skill handoffs target real code-owned nodes rather than
  docs-only grouping folders.
- Verify that any topic-family extraction is tied to a real owning node and a
  concrete local subject.
- Verify that record-skill handoffs are node-specific and executable.
