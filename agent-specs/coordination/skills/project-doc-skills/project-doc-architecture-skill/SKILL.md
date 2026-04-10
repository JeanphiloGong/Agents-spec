---
name: project-doc-architecture-skill
description: v0.2.1 - Design or refactor one repository's documentation ownership tree by aligning root, module, submodule, and component docs with real code ownership seams, placing docs by lowest common ancestor, and defining parent-summary/child-detail rules; concrete file creation belongs to project-doc-record-skill.
---

# Project Documentation Architecture Skill

## Trigger and Scope

Use this skill when you must inspect, design, or refactor the durable
documentation structure for one concrete repository.

In scope:
- inspecting the code ownership tree and existing docs tree together
- identifying where root docs are overloaded or local docs are missing
- deriving durable documentation nodes at the system, module, submodule, and
  component levels
- distinguishing real ownership nodes from docs-only grouping directories
- deciding which nodes deserve their own local docs
- placing docs by lowest common ancestor rather than by raw type-first
  taxonomy
- assigning responsibilities to root docs versus node-local docs
- defining parent-summary and child-detail rules
- defining where project purpose, module purpose, phase goals, current-state,
  proposals, guides, and operations should live
- bootstrapping a system overview when the system node lacks one
- defining rollout guidance for the target doc tree

Out of scope:
- writing one concrete doc body from scratch
- deciding lifecycle progression for one doc family
- reconciling stale or superseded docs across one existing family
- migrating the whole docs tree in one pass

Use this skill when prompts sound like:
- "the docs are too concentrated in root docs"
- "we need docs to follow the module tree"
- "show me where project, module, and submodule docs should live"
- "the root docs are overloaded and local detail keeps getting lost"

## Core Purpose

Design a documentation tree that follows code ownership and preserves detail at
the right level.

This skill exists to help you:
- align docs placement with code ownership
- keep root docs focused on system and cross-module knowledge
- keep detailed local knowledge near the owning module or component
- prevent parent docs from swallowing child implementation detail
- produce a target doc tree and migration order that
  `project-doc-record-skill` can execute concretely

## Workflow

1. Inspect the code ownership tree.
   - Identify system, module, submodule, and component boundaries from the
     actual repository layout and major ownership seams.
   - Do not treat docs-only grouping folders as ownership nodes unless they
     map to a real owned code seam.
2. Inspect the current docs tree.
   - Look for root `docs/`, node-local `*/docs/`, existing indexes, and where
     detailed plans currently accumulate.
   - Note where docs-only grouping folders are being mistaken for real nodes.
3. Identify concentration and placement problems.
   - Check for:
     - overloaded root docs
     - parent docs holding child implementation detail
     - missing node-local current-state or plan docs
     - empty decorative docs directories
     - purpose or goal docs at the wrong level
4. Derive durable documentation nodes.
   - Map the nodes that merit durable docs:
     - `system`
     - `module`
     - `submodule`
     - `component`
5. Decide which nodes are doc-worthy.
   - Create local docs only for nodes with durable knowledge, repeated change,
     or local onboarding value.
6. Define placement by lowest common ancestor.
   - Place each doc at the lowest node that fully owns the described object or
     change.
7. Assign responsibilities by node level.
   - Define what root docs own versus module, submodule, and component docs.
8. Define parent-summary and child-detail rules.
   - Parents summarize, link, and index.
   - Children retain detailed plans, file change lists, verification slices,
     and local risks.
9. Define purpose and goal placement.
   - Decide where project purpose, module purpose, phase goals, and detailed
     implementation plans belong.
10. Produce the target doc tree and rollout plan.
   - Return the node map, placement rules, target tree, and the concrete
     handoff list for `project-doc-record-skill`.

## Required Inputs

- Project or repository name
- Current documentation pain points or desired cleanup goal
- Major code areas or ownership seams if known
- Whether the result should be advisory or enforced in review

## Defaults

- Operating target: `project-doc-ownership-tree`
- Node levels: `system`, `module`, `submodule`, `component`
- Placement rule: place each doc at the lowest common ancestor of the thing it
  describes
- Node definition rule: only real code-owned seams count as `system`, `module`,
  `submodule`, or `component`; docs-only grouping folders are containers by
  default
- Root docs role: system-level purpose, cross-module architecture, shared
  contracts, governance, and top-level indexes
- Node entry role: use the node root `README.md` for node purpose, boundary,
  and navigation when that node needs its own entry page
- Node-local docs role: local current-state, local proposals, local guides,
  local runbooks, and detailed implementation plans
- Secondary index rule: add `<node>/docs/README.md` only when a local docs
  subtree has at least 4 durable docs, spans mixed intents, or has a
  non-obvious reader path that needs a second index
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
- `references/purpose-and-goal-placement.md`
- `references/parent-summary-child-detail.md`
- `references/bootstrap-system-overview.md`

## Output Format

```text
## Doc Tree Goal
## Current Concentration Problems
## Ownership Node Map
## Doc-Worthy Nodes
## Placement Rules
## Root vs Node Responsibilities
## Parent Summary / Child Detail Rules
## Purpose / Goal Placement Rules
## Target Doc Tree
## Suggested Record-Skill Handoffs
## Rollout Plan
## Open Questions
```

## Guardrails

- Do not design placement from folder aesthetics alone.
- Do not centralize child detail into root docs just to keep fewer files.
- Do not create node-local docs where no durable local knowledge exists.
- Do not treat docs-only grouping folders such as `docs/rfcs`, `docs/guides`,
  or topic buckets as ownership nodes by default.
- Do not add `docs/README.md` to a tiny or single-intent subtree just for
  symmetry.
- Do not let parent docs become the only home of child implementation detail.
- Do not silently switch into concrete file creation; hand that work to
  `project-doc-record-skill`.

## Verification Hooks

- Verify that both the code tree and docs tree were inspected.
- Verify that placement follows lowest common ancestor rather than type-first
  convenience.
- Verify that each proposed node corresponds to a real code ownership seam.
- Verify that each doc-worthy node has a real durable purpose.
- Verify that root docs stay focused on system or cross-module knowledge.
- Verify that any proposed `docs/README.md` is justified as a real secondary
  index rather than folder decoration.
- Verify that parent docs only summarize and link to child detail.
