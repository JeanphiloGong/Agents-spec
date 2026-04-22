---
name: project-doc-architecture-skill
description: v0.3.6 - Design or refactor one repository's documentation information architecture as a reader-first, ownership-tree system with node-local topic-family containers and clear reading paths; concrete doc writing belongs to project-doc-record-skill.
---

# Project Documentation Architecture Skill

## Overview

Use this skill when the shape of the documentation system itself needs work.
It is for the moments when the repository no longer has a clear start-here
path, root docs are overloaded, local truth keeps drifting away from the code
that owns it, or one local topic has spilled into root `docs/rfcs` or
`docs/plans`.

The skill treats the docs tree as a reader-facing system. Root pages should
help readers start in the right place, while detailed current-state, proposal,
guide, and verification pages should stay near the code or tests that own
them. Concrete file writing still belongs to `project-doc-record-skill`.

## Purpose

This skill exists to turn a scattered docs tree into a coherent book-like
structure without flattening local detail into root pages.

In practice, it helps you:

- align docs placement with real code ownership
- separate repository landing, documentation landing, and node entry pages
- keep discovery pages distinct from authority pages
- keep test-owned verification knowledge near the tests tree
- decide when a node-local topic-family container is clearer than another
  loose file in root `docs/rfcs` or `docs/plans`

## When To Use This Skill

Reach for this skill when the tree itself is the problem rather than one
missing page. Common signals include:

- root docs are overloaded
- local module or submodule detail keeps getting buried in parent pages
- test or verification docs keep being attached to runtime modules
- the repository lacks a clear root/module/submodule/component/test-suite doc
  layout
- project purpose, node purpose, and local implementation detail are mixed
  together
- one topic's sibling proposals, decisions, plans, and current-state pages
  have become hard to navigate

Typical requests sound like:

- "the docs are too concentrated in root docs"
- "we need docs to follow the module tree"
- "what should the reader open first"
- "how should README, docs/README, and module docs work together"
- "show me where project, module, and submodule docs should live"

Do not use this skill for writing one concrete document, deciding lifecycle
progression for one existing doc family, or migrating the whole tree in one
pass. Those jobs belong to `project-doc-record-skill` or
`project-doc-lifecycle-skill`.

## How It Works

Before proposing any tree change, the skill grounds itself in three things at
once: the code ownership tree, the current docs tree, and the reader entry
surfaces. That keeps placement decisions tied to real ownership rather than
folder aesthetics.

A normal architecture pass should work in this order:

1. Inspect the code ownership tree.
   - Identify system, module, submodule, component, and test-suite boundaries
     from the actual repository layout and major ownership seams.
   - Treat docs-only grouping folders as containers unless they map to a real
     owned code seam.
2. Inspect the current docs tree and reader entrypoints.
   - Look at root `README.md`, root `docs/README.md`, node `README.md`,
     node-local `*/docs/`, existing indexes, and where plans or proposals
     currently accumulate.
3. Identify discovery, concentration, and placement problems.
   - Look for overloaded root docs, missing start pages, ambiguous authority
     pages, child detail trapped in parents, empty decorative directories, and
     root-level type buckets acting as dumping grounds for one node's local
     topic family.
4. Derive the durable documentation nodes.
   - Decide which system, module, submodule, component, or test-suite nodes
     actually deserve their own local docs.
5. Classify each surface by reader job.
   - Distinguish entrypoint, overview, authority, and detail so readers do not
     have to infer the main path from folder names alone.
6. Place docs by lowest common ancestor.
   - Put each document at the lowest node that fully owns the knowledge it
     describes.
   - When one node or subject accumulates sibling alternatives or mixed
     intents, prefer `<node>/docs/<topic>/` over another root type bucket.
7. Assign responsibilities by layer.
   - Define what belongs in root docs, node entry READMEs, node-local formal
     docs, and test-local docs.
8. Define the reading paths.
   - Show where different readers should start and how they move from
     repository landing to docs landing to local authority.
9. Produce the target tree and rollout guidance.
   - Return the node map, navigation layer map, placement rules, target doc
     tree, target navigation tree, and concrete handoffs for
     `project-doc-record-skill`.

## How To Read And Apply The Result

The result is an architecture map, not a writing wave. It should be read as
the durable placement contract for the target slice.

In practice, that means:

- `project-doc-record-skill` should use it to place or rewrite concrete
  documents
- `project-doc-lifecycle-skill` should use it when deciding how one existing
  family should rebalance
- root and node READMEs should be repaired only to the extent needed to make
  the new reading path visible
- topic-family containers should be introduced only when they make one owning
  node's local subject easier to read, not just to make the tree look tidy

## Limits And Boundaries

This skill does not write final document bodies. It does not replace a
lifecycle review for one crowded family. It also should not be used as an
excuse to redesign the whole repository when the real problem is one bounded
local slice.

If a smaller recording or lifecycle pass can solve the issue, prefer the
smaller scope. The architecture skill is for durable structure changes, not
for day-to-day note taking.

## Reference: Inputs

- Project or repository name
- Current documentation pain points or desired cleanup goal
- Major code areas or ownership seams if known
- Reader types or reading intents if known
- Whether the result should be advisory or enforced in review

## Reference: Default Assumptions

- Operating target: `project-doc-information-architecture`
- Node levels: `system`, `module`, `submodule`, `component`, `test-suite`
- Navigation layers: `entrypoint`, `overview`, `authority`, `detail`
- Placement rule: place each doc at the lowest common ancestor of the thing it
  describes
- Node definition rule: only real code-owned seams count as ownership nodes;
  docs-only grouping folders are containers by default
- Root docs role: system purpose, entry, cross-module architecture, shared
  contracts, governance, and top-level indexes
- Root entry rule: use root `README.md` as the repository landing page with a
  brief docs pointer
- Root README brevity rule: keep docs content in root `README.md` lightweight
- Docs entry rule: use `docs/README.md` as the documentation landing page for
  docs index and guided navigation
- Node entry role: use the node root `README.md` for node purpose, boundary,
  and navigation when that node needs its own entry page
- Node-local docs role: local current-state, local proposals, local guides,
  local runbooks, and detailed implementation plans
- Topic-family container rule: when one node or topic has 2 or more live
  alternative proposals, or mixes proposal, decision, implementation-plan, and
  current-state docs for the same local subject, group them under
  `<node>/docs/<topic>/`; treat that folder as a container, not as an
  ownership node
- One-off topic rule: do not create `<node>/docs/<topic>/` for one standalone
  local doc unless sibling alternatives or mixed intents are already expected
- Root bucket rule: keep root `docs/rfcs` and `docs/plans` as system-level
  entry containers or indexes by default, not as the long-term home for one
  node's local topic family
- Test-suite docs role: coverage overviews, fixture or harness notes,
  verification contracts, regression matrices, and similar docs whose primary
  subject is the test asset itself
- Runtime-vs-tests rule: when a document primarily describes test coverage,
  fixtures, harnesses, or verification gaps, place it under the owning tests
  subtree rather than under the runtime module by default
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
## Reference: Lookup Pages

- `references/ownership-tree-placement.md`
  - Use when deciding the owning node, lowest common ancestor, and what kinds
    of docs belong at each node level.
- `references/navigation-layers-and-reading-paths.md`
  - Use when deciding repository landing, docs landing, overview, authority,
    and start-here reading routes.
- `references/boundary-and-purpose-rules.md`
  - Use when deciding what parents summarize, what children keep, and where
    durable purpose versus temporary goals should live.

## Reference: Expected Output Shape

```text
## Doc System Goal
## Reader Types
## Current Discovery Problems
## Ownership Node Map
## Navigation Layer Map
## Repository Landing
## Docs Landing
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

## Reference: Constraints

- Do not design placement from folder aesthetics alone.
- Do not reduce documentation architecture to file placement alone.
- Do not centralize child detail into root docs just to keep fewer files.
- Do not create node-local docs where no durable local knowledge exists.
- Do not treat docs-only grouping folders such as `docs/rfcs`, `docs/guides`,
  or topic buckets as ownership nodes by default.
- Do not add `docs/README.md` to a tiny or single-intent subtree just for
  symmetry.
- Do not keep one node's multi-option or mixed-intent doc family in root
  `docs/rfcs` or `docs/plans` just because those buckets already exist.
- Do not turn root `README.md` into the repository's full docs index, long
  reading order, or formal-doc inventory by default.
- Do not confuse discovery pages with authority pages.
- Do not make readers infer the start page or main path from folder names
  alone.
- Do not let parent docs become the only home of child implementation detail.
- Do not silently switch into concrete file creation; hand that work to
  `project-doc-record-skill`.

## Reference: Review Checks

- Verify that the code tree, docs tree, and current entrypoints were all
  inspected.
- Verify that placement follows lowest common ancestor rather than type-first
  convenience.
- Verify that each proposed node corresponds to a real code ownership seam.
- Verify that verification docs are placed under the tests subtree when the
  tests asset, not the runtime module, is the primary owner.
- Verify that each doc-worthy node has a real durable purpose.
- Verify that entrypoint, overview, authority, and detail responsibilities are
  not being conflated.
- Verify that root `README.md` remains a repository landing page with only a
  light docs pointer when `docs/README.md` exists.
- Verify that root docs stay focused on system or cross-module knowledge.
- Verify that any proposed `docs/README.md` is justified as a real secondary
  index rather than folder decoration.
- Verify that at least one reading path is explicit for the primary reader
  intents.
