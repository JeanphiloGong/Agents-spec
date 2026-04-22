---
name: project-doc-lifecycle-skill
description: v0.3.6 - Maintain one repository, module, test-suite, or doc-family slice as a readable documentation family by repairing canonical vs historical relationships, reading order, node-local topic trees, and README roles across real code-owned nodes; concrete doc writing belongs to project-doc-record-skill.
---

# Project Documentation Lifecycle Skill

## Overview

Use this skill when an existing repository, module, test-suite, or doc-family
slice needs editorial maintenance so distributed docs still read as one
coherent system rather than as disconnected pages.

The lifecycle skill is for the messy middle: implemented proposals that were
never promoted, parent pages that have absorbed too much child detail, stale
or competing current-state pages, broken reading order, and local topic trees
or subtopic families that are still stranded in root `docs/rfcs` or
`docs/plans`.

## Purpose

This skill exists to keep distributed docs readable as one project book even
when the pages live near different code-owned nodes.

In practice, it helps you:

- detect when proposal history has outgrown its current placement
- split overloaded parent docs before they absorb more child detail
- decide promotion into current-state and related durable docs
- preserve history while making the current source of truth easier to find
- extract one node's topic tree or mixed-intent subtopic family out of root
  type buckets before it becomes untraceable
- repair reading order, bridge docs, and lineage links
- hand concrete writing work to `project-doc-record-skill` in a clear order

## When To Use This Skill

Reach for this skill when the family has drifted even though the broader docs
architecture may still be sound. Common signals include:

- a proposal was implemented and now needs promotion
- a parent doc is overloaded and should split
- child detail is trapped in the wrong place
- supersede, archive, and lineage repair decisions are needed
- readers can no longer tell which page is current
- one node's local topic tree is still spread across root `docs/rfcs` or
  `docs/plans`
- one broad parent topic now contains narrower subtopic families, but the docs
  still treat the whole directory as one flat family

Typical requests sound like:

- "this implemented RFC is too big now; what should be split or promoted?"
- "which current-state docs should exist after this change?"
- "the parent doc is overloaded; how should the family evolve?"
- "which docs should be superseded, archived, or relinked?"
- "these docs feel scattered; how do we make them read like one book?"
- "what is the canonical reading order here?"
- "which overview or bridge docs are missing?"

Do not use this skill for the repository's initial documentation information
architecture or for drafting full final bodies for every resulting page. Those
jobs belong to `project-doc-architecture-skill` and
`project-doc-record-skill`.

## How It Works

The lifecycle skill starts from one bounded operating scope and asks a simple
question: after the current wave of implementation and history, what should
this family look like so readers can still move from broad context to local
truth without guessing?

A normal lifecycle pass should work in this order:

1. Define the operating scope.
   - Choose the smallest scope that can solve the problem: one doc family, one
     node, or one repository slice.
   - Escalate to a wider scope only when a narrower scope cannot repair the
     reading or authority problem.
2. Inspect code and current implementation reality.
   - Compare the docs with current behavior, ownership boundaries, and
     existing node-local docs.
   - Read current entrypoints, overviews, and authority pages inside the
     chosen scope.
   - Treat docs-only grouping folders as containers unless they map to a real
     owned code seam.
3. Identify the topic tree inside the chosen scope.
   - Distinguish whether the scope is one broad parent topic, one narrower
     subtopic family, or a mixed pile spanning both.
   - Note when the current directory groups pages by type bucket or phase
     rather than by subject.
4. Detect editorial, lifecycle, and placement problems.
   - Look for implemented-but-not-promoted proposals, stale parent summaries,
     overloaded parent docs, hidden child detail, docs-first READMEs,
     overlapping current-state pages, broken reading order, missing bridge
     docs, ambiguous canonical sources, and root buckets hiding one node's
     topic tree.
5. Build the current canonical-versus-historical map.
   - Mark which pages are current authority, summary-only, historical but
     useful, or stale and replacement-needed.
6. Determine lifecycle state.
   - Decide whether the family is still proposal-only, accepted but not
     implemented, implemented but not promoted, promoted but badly placed,
     current but stale-linked, or superseded and archival-ready.
7. Define the target reading structure.
   - Decide whether the family should end up as parent summary plus child docs,
     parent topic plus subtopic families, local current-state replacing
     proposal detail, extracted ADR, local contract or runbook, node-local
     topic container, bridge or overview pages, or superseded history with
     clear replacements.
8. Decide promotion, split, supersede, archive, and extraction actions.
   - Make the explicit call on which current-state updates, child docs, ADRs,
     guides, runbooks, bridge docs, topic-family extractions, or archive steps
     are needed.
9. Repair parent, child, and neighbor responsibilities.
   - Keep parent pages short, linked, and clear about what moved.
   - Decide which child or neighboring nodes need new docs, updated links, or
     new related-reading guidance.
   - Repair any README whose docs navigation has overwhelmed its explanation of
     local purpose or flow.
10. Repair lineage and navigation.
   - Define forward and backward links across proposals, current-state pages,
     sibling docs, and superseded history.
11. Assess book readiness and export readiness.
   - State whether the scope can currently be assembled into a readable slice
     and what is still missing.
12. Produce the lifecycle handoff plan.
   - Order the actions and specify which ones `project-doc-record-skill`
     should execute concretely.

## How To Read And Apply The Result

The result is an ordered maintenance plan. It should clarify what the current
source of truth is, what stays as history, what needs to split, and how the
reader path changes after the wave.

Use the result to guide concrete writing and relinking work in
`project-doc-record-skill`. If the family problem turns out to be a symptom of
the repository's larger documentation structure, hand the broader question back
to `project-doc-architecture-skill`.

## Limits And Boundaries

This skill does not redesign the whole docs tree and does not write final
bodies for every resulting artifact. It also should not silently widen a
small doc-family problem into a full-repository rewrite.

Use it to rebalance one living family. If the issue is truly structural across
the whole repository, move up to the architecture skill instead of stretching
the lifecycle skill past its scope.

## Reference: Inputs

- Source doc family, node, or repository slice to evaluate
- Current implementation or rollout state
- Related current-state, guide, contract, or local node docs if known
- Reader confusion or navigation symptoms if known

## Reference: Default Assumptions

- Operating target: `editorial-maintenance-for-book-like-doc-systems`
- Scope rule: start from the smallest useful scope and widen only when the
  reading or authority problem crosses that boundary
- Promotion baseline: implemented proposals require an explicit current-state
  decision
- Split baseline: overloaded parent docs should split before more child detail
  is added
- Child-source rule: child docs may become the canonical local source of truth
  while the parent becomes summary or index
- Tests-owner rule: when the page primarily describes coverage, fixtures,
  harnesses, or verification gaps, the tests subtree may be the canonical
  owner even if the runtime module stays a related entrypoint
- Topic-tree rule: a scope may contain a broad parent topic and narrower
  subtopic families; distinguish that tree before deciding promotion,
  extraction, or archive shape
- Type-bucket rule: root `docs/plans`, `docs/rfcs`, `docs/guides`, and similar
  paths are type buckets or indexes by default, not proof that the bucket is
  the right long-term subject container
- README repair baseline: repo and node READMEs should explain local purpose,
  boundaries, and flow before they explain documentation structure; docs
  landing pages own deeper navigation
- Canonical rule: every maintained scope should have inspectable current
  authority rather than only historical proposal text
- Current-authority promotion rule: once a stable current authority page exists
  for a subtopic, it should not stay buried as one file inside a broad plan
  bucket
- Reading-order rule: if readers would not know what to read first or next, the
  scope needs editorial repair even when file placement is technically correct
- Bridge-doc rule: add a bridge or overview page only when it resolves a real
  navigation gap or authority confusion
- Topic-family extraction baseline: when one node or local topic path has 2 or
  more live alternative proposals, or mixes proposal, decision,
  implementation-plan, and current-state docs for the same local subject,
  extract a node-local topic container instead of leaving the family in root
  `docs/rfcs` or `docs/plans`
- Same-directory rule: documents sharing one broad folder do not automatically
  form a healthy lifecycle family; parent topics, subtopics, canonical pages,
  and historical pages may still need separation
- ADR baseline: extract only when the decision is durable and likely to be
  revisited
- Contract baseline: add only when the boundary is stable and depended on
- Runbook baseline: add only when operator recovery or intervention matters
- Archive baseline: prefer `superseded` or `deprecated` before archival
- Execution model: decide lifecycle and placement here, then hand concrete doc
  writing to `project-doc-record-skill`
- Node definition rule: target nodes must correspond to real code-owned seams,
  not docs-only grouping folders

## Reference: Lookup Pages

- `references/rebalancing-and-lineage-rules.md`
  - Use when deciding split, promotion, parent-summary repair, child-detail
    preservation, and node-local topic-family extraction.
- `references/canonical-status-and-history.md`
  - Use when deciding what page is current, what stays historical, and how
    lifecycle status changes affect placement and authority.
- `references/reading-order-and-book-slice-readiness.md`
  - Use when placement is roughly correct but reading order, bridge pages, or
    coherent book-like export readiness are still weak.
- `references/example-output.md`
  - Use when the operator wants a concrete sample of the final output.

## Reference: Operator Planning Shape

Use this shape only for operator planning output. Do not reuse these labels as
reader-facing section titles in concrete repository docs.

```text
planning note
- lifecycle_goal:
- operating_scope:
- topic_tree_assessment:
- current_system_state:
- canonical_vs_historical_map:
- reading_order:
- broken_navigation_paths:
- missing_entry_overview_bridge_docs:
- current_placement_problems:
- target_tree_shape:
- promotion_supersede_archive_decisions:
- parent_child_neighbor_repairs:
- status_transitions:
- lineage_repairs:
- record_skill_handoffs:
- book_readiness:
- export_manifest_plan:
- maintenance_actions:
- open_questions:
```

## Reference: Constraints

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
- Do not confuse a broad parent topic with a narrower subtopic family just
  because both are currently stored in the same directory.
- Do not treat same-directory grouping as sufficient when canonical current
  authority, historical pages, and subtopics are still mixed together.
- Do not stop at folder-placement repair when the README body still behaves
  like a docs index or child-detail dump.
- Do not propose docs-only grouping folders as target ownership nodes by
  default.
- Do not leave a stable current authority page buried inside a broad plan or
  RFC bucket once the topic has a clear owning node and subject container.
- Do not leave one node's multi-option or mixed-intent family stranded in root
  `docs/rfcs` or `docs/plans` once a node-local topic container is warranted.
- Do not delete history blindly; prefer supersede, archive, and repair links.
- Do not leave the canonical current page ambiguous after a maintenance wave.
- Do not treat a correct folder location as sufficient when reading order is
  still broken.
- Do not write full final bodies for every target doc here; hand concrete
  writing to `project-doc-record-skill`.

## Reference: Review Checks

- Verify that the chosen operating scope is explicit and justified.
- Verify that current implementation reality and current docs were both
  inspected.
- Verify that the result distinguishes a broad parent topic from any narrower
  subtopic family inside the chosen scope.
- Verify that lifecycle, placement, and navigation problems are all explicit.
- Verify that the canonical-versus-historical map is explicit.
- Verify that same-directory grouping is not mistaken for a healthy lifecycle
  state.
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
  concrete local topic path rather than a generic bucket name.
- Verify that record-skill handoffs are node-specific and executable.
