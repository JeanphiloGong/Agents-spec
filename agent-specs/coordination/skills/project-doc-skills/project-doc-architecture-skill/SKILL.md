---
name: project-doc-architecture-skill
description: v0.3.0 - Design or refactor one repository's documentation information architecture by defining entrypoints, overview layers, authority layers, ownership-aware placement, and reading paths so distributed docs can behave like one coherent book; concrete doc writing belongs to project-doc-record-skill.
---

# Project Documentation Architecture Skill

## Trigger and Scope

Use this skill when you must inspect, design, or refactor the durable
documentation information architecture for one concrete repository.

In scope:
- inspecting the code ownership tree, current docs tree, and reader entry
  surfaces together
- identifying missing or overloaded entrypoints such as `README.md`,
  `docs/README.md`, module `README.md`, and local docs indexes
- deriving durable documentation nodes at the system, module, submodule, and
  component levels
- distinguishing real ownership nodes from docs-only grouping directories
- classifying documentation layers such as `entrypoint`, `overview`,
  `authority`, and `detail`
- deciding which nodes deserve their own local docs
- placing docs by lowest common ancestor rather than by raw type-first
  taxonomy
- assigning responsibilities to root docs versus node-local docs
- defining parent-summary and child-detail rules
- defining where project purpose, module purpose, phase goals, current-state,
  proposals, guides, and operations should live
- defining reader entrypoints and reading paths by intent
- bootstrapping a system overview when the system node lacks one
- defining rollout guidance for the target doc tree and target navigation tree

Out of scope:
- writing one concrete doc body from scratch
- deciding lifecycle progression for one existing doc family
- reconciling stale, superseded, or misordered docs across one existing family
- migrating the whole docs tree in one pass

Use this skill when prompts sound like:
- "the docs are too concentrated in root docs"
- "we need docs to follow the module tree"
- "what should the reader open first"
- "how should README, docs/README, and module docs work together"
- "this repo needs a clear docs entrypoint and reading path"
- "show me where project, module, and submodule docs should live"
- "the root docs are overloaded and local detail keeps getting lost"

## Core Purpose

Design a documentation information architecture that follows code ownership,
preserves detail at the right level, and lets distributed docs be read like one
coherent book.

This skill exists to help you:
- align docs placement with code ownership
- define root and node entrypoints that help readers start in the right place
- separate discovery layers from authority layers
- keep root docs focused on system and cross-module knowledge
- keep detailed local knowledge near the owning module or component
- prevent parent docs from swallowing child implementation detail
- produce a target doc tree and target navigation tree that
  `project-doc-record-skill` can execute concretely

## Workflow

1. Inspect the code ownership tree.
   - Identify system, module, submodule, and component boundaries from the
     actual repository layout and major ownership seams.
   - Do not treat docs-only grouping folders as ownership nodes unless they
     map to a real owned code seam.
2. Inspect the current docs tree and current reader entrypoints.
   - Look for root `README.md`, root `docs/`, node-local `README.md`,
     `*/docs/`, existing indexes, and where detailed plans currently
     accumulate.
   - Note where docs-only grouping folders are being mistaken for real nodes.
3. Identify discovery, concentration, and placement problems.
   - Check for:
     - overloaded root docs
     - missing or ambiguous start-here pages
     - missing overview pages
     - unclear authority pages
     - parent docs holding child implementation detail
     - missing node-local current-state or plan docs
     - empty decorative docs directories
     - purpose or goal docs at the wrong level
     - broken or non-obvious reading routes
4. Derive durable documentation nodes.
   - Map the nodes that merit durable docs:
     - `system`
     - `module`
     - `submodule`
     - `component`
5. Classify documentation layers.
   - For each doc-worthy surface, decide whether it is primarily:
     - `entrypoint`
     - `overview`
     - `authority`
     - `detail`
6. Decide which nodes are doc-worthy.
   - Create local docs only for nodes with durable knowledge, repeated change,
     or local onboarding value.
7. Define placement by lowest common ancestor.
   - Place each doc at the lowest node that fully owns the described object or
     change.
8. Assign responsibilities by node level and doc layer.
   - Define what root docs own versus module, submodule, and component docs.
9. Define parent-summary and child-detail rules.
   - Parents summarize, link, and index.
   - Children retain detailed plans, file change lists, verification slices,
     and local risks.
10. Define purpose and goal placement.
   - Decide where project purpose, module purpose, phase goals, and detailed
     implementation plans belong.
11. Define reader entrypoints and reading paths by intent.
   - Decide where different readers should start and how they move from
     entrypoint to overview to authority to local detail.
12. Produce the target doc tree and rollout plan.
   - Return the node map, navigation layer map, placement rules, target doc
     tree, target navigation tree, and the concrete handoff list for
     `project-doc-record-skill`.

## Required Inputs

- Project or repository name
- Current documentation pain points or desired cleanup goal
- Major code areas or ownership seams if known
- Reader types or reading intents if known
- Whether the result should be advisory or enforced in review

## Defaults

- Operating target: `project-doc-information-architecture`
- Node levels: `system`, `module`, `submodule`, `component`
- Navigation layers: `entrypoint`, `overview`, `authority`, `detail`
- Placement rule: place each doc at the lowest common ancestor of the thing it
  describes
- Node definition rule: only real code-owned seams count as `system`, `module`,
  `submodule`, or `component`; docs-only grouping folders are containers by
  default
- Root docs role: system-level purpose, entry, cross-module architecture,
  shared contracts, governance, and top-level indexes
- Root entry rule: evaluate root `README.md` first as the primary repo
  entrypoint before inventing additional landing pages
- Docs entry rule: use `docs/README.md` as a secondary entrypoint only when the
  root docs area is large enough to justify a separate guided entry
- Node entry role: use the node root `README.md` for node purpose, boundary,
  and navigation when that node needs its own entry page
- Node-local docs role: local current-state, local proposals, local guides,
  local runbooks, and detailed implementation plans
- Secondary index rule: add `<node>/docs/README.md` only when a local docs
  subtree has at least 4 durable docs, spans mixed intents, or has a
  non-obvious reader path that needs a second index
- Discovery rule: entrypoint and overview pages optimize for reader routing
  rather than owning the deepest technical truth
- Authority rule: current-state, stable contracts, and local technical sources
  should remain inspectable as the canonical pages for the boundaries they own
- Parent-summary rule: parents summarize and link, but do not retain child
  implementation detail
- Child-detail rule: detailed plans, file change lists, verification slices,
  and local risks stay with the owning child node
- Directory creation rule: do not create empty docs trees for symmetry alone
- Overview bootstrap rule: if the system node has no usable overview, propose
  one
- Metadata baseline: keep metadata optional and minimal unless the repo clearly
  consumes it

## Bundled Resources

- `references/ownership-tree-placement.md`
- `references/lowest-common-ancestor-rule.md`
- `references/node-responsibility-matrix.md`
- `references/entrypoint-and-overview-rules.md`
- `references/reading-order-and-navigation-map.md`
- `references/authority-and-discovery-layers.md`
- `references/purpose-and-goal-placement.md`
- `references/parent-summary-child-detail.md`
- `references/bootstrap-system-overview.md`

## Output Format

```text
## Doc System Goal
## Reader Types
## Current Discovery Problems
## Ownership Node Map
## Navigation Layer Map
## Doc-Worthy Nodes
## Entry Points
## Overview Nodes
## Authority Nodes
## Placement Rules
## Root vs Node Responsibilities
## Parent Summary / Child Detail Rules
## Purpose / Goal Placement Rules
## Reading Paths by Intent
## Target Doc Tree
## Target Navigation Tree
## Suggested Record-Skill Handoffs
## Rollout Plan
## Open Questions
```

## Guardrails

- Do not design placement from folder aesthetics alone.
- Do not reduce documentation architecture to file placement alone.
- Do not centralize child detail into root docs just to keep fewer files.
- Do not create node-local docs where no durable local knowledge exists.
- Do not treat docs-only grouping folders such as `docs/rfcs`, `docs/guides`,
  or topic buckets as ownership nodes by default.
- Do not add `docs/README.md` to a tiny or single-intent subtree just for
  symmetry.
- Do not confuse discovery pages with authority pages.
- Do not make readers infer the start page or main path from folder names
  alone.
- Do not let parent docs become the only home of child implementation detail.
- Do not silently switch into concrete file creation; hand that work to
  `project-doc-record-skill`.

## Verification Hooks

- Verify that the code tree, docs tree, and current entrypoints were all
  inspected.
- Verify that placement follows lowest common ancestor rather than type-first
  convenience.
- Verify that each proposed node corresponds to a real code ownership seam.
- Verify that each doc-worthy node has a real durable purpose.
- Verify that entrypoint, overview, authority, and detail responsibilities are
  not being conflated.
- Verify that root docs stay focused on system or cross-module knowledge.
- Verify that any proposed `docs/README.md` is justified as a real secondary
  index rather than folder decoration.
- Verify that at least one reading path is explicit for the primary reader
  intents.
- Verify that parent docs only summarize and link to child detail.
