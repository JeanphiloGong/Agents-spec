---
name: project-doc-record-skill
description: v0.4.8 - Record one concrete documentation artifact at the correct code-owned node with reader-first page choices, node-local topic-family containers, README-vs-docs separation, and preserved local detail so it fits the repository's book-like documentation system.
---

# Project Documentation Record Skill

## Overview

Use this skill when one concrete piece of durable project knowledge needs to
be written into repository docs at the right ownership node and connected to
the local reading context. It is the day-to-day writing skill in this package.

The skill turns the ownership-tree model into one bounded documentation wave.
It decides where one page belongs, whether it should stay standalone or join a
node-local topic family, which page role fits best, and what light companion
updates are needed so the result remains discoverable.

## Purpose

This skill exists to write the document at the correct node without losing
ownership boundaries, detailed local knowledge, or the local reading path.

In practice, it helps you:

- place docs by ownership node rather than by root-doc convenience
- preserve child-scope detail instead of flattening it into parent docs
- keep coverage, fixture, and verification docs under the owning tests subtree
  when the tests asset itself is the primary subject
- keep README pages focused on local purpose, boundaries, and logic before
  they mention the docs system around them
- choose when one topic needs a small node-local family folder instead of
  another loose sibling file in a root type bucket

## When To Use This Skill

Reach for this skill when the problem is one concrete documentation wave rather
than a repository-wide redesign. Common cases include:

- a module, submodule, or component change needs durable docs
- a test coverage, fixture, or verification note needs durable docs
- you need to decide create versus update without losing child detail
- you need to write one purpose doc, proposal, current-state page, guide,
  contract, or operation note
- one local subject now has multiple proposals, decisions, plans, or
  current-state pages and needs a small topic-family container

Typical requests sound like:

- "write the right doc for this module change"
- "where should this submodule plan live, and write it"
- "should this be a new child doc or an update to the parent doc?"
- "record this detailed implementation plan without losing the file list"

Do not use this skill for redesigning the overall docs tree, deciding
lifecycle progression for an entire doc family, or repairing the full reading
order of a repository or module. Those jobs belong to
`project-doc-architecture-skill` or `project-doc-lifecycle-skill`.

## How It Works

Every recording wave begins by settling five practical questions: who owns the
knowledge, what the document is for, what kind of page should carry it, how
much detail it must retain, and whether it belongs in a small topic family.
Those decisions come before writing so the resulting page does not become
another misplaced summary or root-bucket orphan.

A normal recording pass should work in this order:

1. Inspect local docs around the relevant code node.
   - Look at root `README.md`, root `docs/README.md`, the nearest node
     `README.md`, nearby `*/docs/`, current local plans, and local
     current-state pages.
   - If architecture or lifecycle guidance exists for this scope, read the
     parts that constrain placement, role, or linkage.
2. Determine the ownership node.
   - Decide whether the knowledge belongs to the system, module, submodule,
     component, or test-suite.
   - Treat only real code-owned seams as nodes.
   - If the document primarily describes test coverage, fixtures, harnesses,
     regression matrices, or verification gaps, prefer the lowest common
     ancestor under `tests/` rather than the runtime module by default.
3. Determine lowest common ancestor placement.
   - Place the doc at the lowest node that fully owns the described knowledge
     or change.
4. Decide whether the wave stays standalone or becomes a topic family.
   - Keep one standalone artifact when the content is a one-off local doc and
     no sibling alternatives or mixed-intent family already exists.
   - Use a node-local topic-family container such as `<node>/docs/<topic>/`
     when the same local subject has 2 or more live alternative proposals, or
     mixes proposal, decision, implementation-plan, and current-state docs.
   - Treat the topic-family folder as a container for reader navigation, not
     as a new ownership node.
5. Determine the page role.
   - Decide whether the artifact is a repository landing README, node entry
     README, docs landing README, or formal doc.
   - If the page is a README that is not a docs landing page, treat it as an
     entry page for the layer itself first, not as a docs index.
6. Determine the document intent.
   - Choose whether the page is primarily a purpose, proposal, current-state,
     contract, guide, or operation document.
7. Decide create versus update.
   - Reuse an existing doc only when it already owns the exact same scope.
   - Create a new child doc when updating a parent would blur boundaries or
     erase detail.
8. Protect the summary/detail split.
   - Parent pages may receive a short summary, pointer, or index update.
   - Child docs retain detailed plans, file change lists, execution order,
     verification slices, ownership splits, and local risks.
9. Keep README pages reader-first.
   - For repo or node READMEs, explain the layer before the documentation
     around the layer.
   - Use docs-routing-heavy structure only when the page itself is a docs
     landing README.
10. Decide companion updates.
    - Explicitly decide whether this wave also needs a parent summary update,
      current-state update, section or root index update, topic-family
      `README.md`, footer links, or neighbor links.
11. Write the document and update only the necessary companions.
    - Match the body to the page role and intent, not only to the file
      extension.
    - Update parent docs or indexes only with concise summaries, links, or
      discovery guidance.
12. Verify fit.
    - Confirm node, page role, intent, path, scope boundary, preserved detail,
      and companion updates all match the document's job.

## How To Read And Apply The Result

The result should describe one node-local documentation wave. In the simplest
case, that means one new or updated file plus a light parent or index repair.
When the local subject has become crowded, it may also mean introducing a
topic-family container and a small local reading path.

The result should not read like a repo-wide cleanup plan. If the wave keeps
discoverability local and keeps ownership clear, it is small enough. If the
wave starts repairing lineage, canonical versus historical status, or a whole
reader path, hand the problem to `project-doc-lifecycle-skill`.

## Limits And Boundaries

This skill is for one concrete document wave. It should not redesign the
repository's overall docs tree, decide lifecycle progression for an entire doc
family, or migrate a whole docs tree in one pass.

It also should not use one parent doc as a dumping ground for unrelated local
changes. When a narrower child scope needs its own durable home, create it.

## Reference: Working Vocabulary

- Ownership node
  - Which code-owned seam actually owns this knowledge:
    - `system`
    - `module`
    - `submodule`
    - `component`
    - `test-suite`
- Document intent
  - What the page primarily does:
    - `purpose`
    - `proposal`
    - `current-state`
    - `contract`
    - `guide`
    - `operation`
- Page role
  - What kind of page carries the content:
    - `repo landing README`
    - `node entry README`
    - `docs landing README`
    - `formal doc`
- Detail level
  - How much detail the page must retain:
    - parent summary or index
    - normal node-local durable doc
    - detailed child implementation plan
- Container strategy
  - Whether the wave should stay:
    - one standalone artifact
    - one node-local topic-family container

## Reference: Inputs

- Project or repository name
- The concrete change, purpose, plan, current-state fact, contract, guide, or
  operation content to record
- Relevant code path or ownership area if known
- Any known related parent doc, child doc, issue, current-state page, or
  lifecycle guidance

## Reference: Default Assumptions

- Operating target: `one-node-local-doc-wave`
- Ownership levels: `system`, `module`, `submodule`, `component`, `test-suite`
- Placement rule: lowest common ancestor
- Page-role rule: distinguish repo landing README, node entry README, docs
  landing README, and formal docs before choosing structure
- Node definition rule: only real code-owned seams count as nodes; docs-only
  grouping folders are containers unless they map to a real owned code seam
- Root docs rule: reserve root `docs/` for system-level or cross-module
  knowledge
- Root README rule: keep root `README.md` as a repository landing page with a
  brief pointer into docs, not as the full docs index
- Root README content rule: focus on repository purpose, core capabilities,
  quick orientation, and a short pointer into docs
- Docs landing rule: prefer `docs/README.md` for docs index, reading order,
  and formal-doc navigation
- Node-local rule: keep module, submodule, and component knowledge close to the
  owning node
- Test-suite-local rule: keep coverage, fixture, harness, and verification docs
  close to the owning tests node when the tests asset is the primary owner
- Node entry rule: prefer `<node>/README.md` as the node's summary and
  navigation page
- Node README content rule: focus on node purpose, boundaries,
  responsibilities, main flow, key areas, and short related-doc pointers
- Docs README content rule: focus on reading order, document categories,
  authority routes, and formal-doc discovery rather than repeating the node's
  runtime explanation
- Local docs rule: treat `<node>/docs/` as the node's formal-doc container, not
  a second default homepage
- Local docs README rule: only add `<node>/docs/README.md` when that local docs
  subtree has at least 4 durable docs, spans mixed intents, or has a
  non-obvious reader path that truly needs a secondary index
- Topic-family rule: when one local subject has 2 or more live alternative
  proposals, or mixes proposal, decision, implementation-plan, and
  current-state docs, prefer `<node>/docs/<topic>/` over another loose file in
  root `docs/rfcs` or `docs/plans`
- One-off artifact rule: keep a single durable local doc as one file unless
  sibling alternatives or mixed intents justify a topic-family container
- Topic-family README rule: add `<node>/docs/<topic>/README.md` when the topic
  family has 2 or more live alternatives, spans mixed intents, or otherwise
  needs a local reading order
- README priority rule: README pages explain the layer first and the docs
  system second unless the page itself is a docs landing
- README structure rule: prefer `Purpose`, `Responsibilities or Boundaries`,
  `Main Flow`, `Key Areas or Child Nodes`, and optional `Related Docs`
- Parent-summary rule: parent docs summarize and link, but do not keep child
  detail by default
- Child-detail rule: file change plans, execution slices, verification slices,
  ownership boundaries, and local risks stay in the child doc
- Tests-ownership rule: docs about test suites, fixtures, harnesses, golden
  data, verification contracts, or coverage gaps belong under the owning
  `tests/` subtree by default, not under the runtime module they exercise
- Linkage maintenance rule: when discoverability or reading order would
  otherwise break, add the minimum parent, neighbor, or follow-up links needed
  to situate the new page
- Create or update rule: update only when the existing doc already owns the
  exact same scope
- Index rule: update indexes when discoverability changes
- Root bucket rule: treat root `docs/rfcs` and `docs/plans` as entry
  containers or system-level indexes by default, not as the long-term home for
  one node's local topic family
- Body structure rule: choose structure from intent, not from one generic
  formal-doc template

## Reference: Lookup Pages

- `references/ownership-node-check.md`
  - Use when the real owning code seam is still ambiguous.
- `references/path-selection-and-placement.md`
  - Use when deciding between root docs, node docs, docs landings, and
    node-local topic-family containers.
- `references/scope-boundary-and-split-rules.md`
  - Use when deciding create versus update, parent summary versus child detail,
    and whether one topic has become its own local family.
- `references/body-structure-by-intent.md`
  - Use when shaping prose for purpose, proposal, current-state, contract,
    guide, or operation pages.
- `references/navigation-and-companion-updates.md`
  - Use when deciding which parent, index, related-doc, or local README
    updates are actually needed.
- `references/example-output.md`
  - Use when the operator wants a concrete sample of the final output.

## Reference: Expected Output Shape

```text
## Recording Goal
## Ownership Node
- node:
- parent node:
- lowest common ancestor:

## Page Role
## Document Intent
## Why This Node
## Container Strategy
## Primary Artifact
## Create or Update Decision
## Scope Boundary Decision
## Immediate Companion Updates
- parent summary:
- current-state:
- indexes:
- footer links:
- neighbor links:

## Body Structure Plan
## Linkage Notes
## Index Update Plan
## Follow-up Docs
## Notes and Risks
```

## Reference: Constraints

- Do not place a doc before the ownership node is explicit.
- Do not append child module or component detail into a broader parent doc when
  that would erase scope boundaries.
- Do not sacrifice file change plans, execution slices, verification slices, or
  local risks just to reduce file count.
- Do not use root `docs/` for local module detail unless the knowledge is
  truly cross-module.
- Do not attach a test coverage or fixture overview to a runtime module docs
  tree when the tests subtree is the real lowest common ancestor.
- Do not treat `docs/guides`, `docs/rfcs`, topic buckets, or similar docs-only
  folders as ownership nodes by default.
- Do not add `docs/README.md` to a tiny or single-intent subtree just for
  symmetry.
- Do not keep one node's multi-option or mixed-intent family in root
  `docs/rfcs` or `docs/plans` by default when a node-local topic family is the
  clearer home.
- Do not create a topic-family container for a one-off local doc that has no
  sibling alternatives or mixed-intent family.
- Do not turn root `README.md` into the repository's full docs index, long
  reading order, or detailed formal-doc inventory by default.
- Do not let README-to-docs relationship explanation dominate a repo or node
  README that should primarily explain local purpose, boundaries, or logic.
- Do not leave a repo or node README as a raw file inventory when the layer has
  real responsibilities or runtime flow that readers need first.
- Do not duplicate a docs landing page inside root or node `README.md`.
- Do not let parent updates become the only durable home of child detail.
- Do not silently perform repo-wide editorial repair here; use
  `project-doc-lifecycle-skill` when the reading path itself is broken.
- Do not write one generic formal-doc shape for every intent.

## Reference: Review Checks

- Verify that nearby local docs were inspected before placement was chosen.
- Verify that relevant architecture or lifecycle guidance was consulted when it
  exists.
- Verify that the ownership node and lowest common ancestor are explicit.
- Verify that the chosen node is a real code-owned seam rather than a docs-only
  grouping folder.
- Verify that the container strategy is explicit and that any topic-family
  folder is treated as a container under the chosen node rather than as a new
  node.
- Verify that test coverage, fixture, or verification docs are owned by the
  appropriate tests subtree when that subtree is the primary subject.
- Verify that create-versus-update does not collapse a narrower child scope
  into a broader parent doc.
- Verify that detailed implementation artifacts remain preserved when they
  matter to the document's job.
- Verify that the resulting page has the minimum linkage needed to be
  discoverable in context.
- Verify that any repo or node README answers what this layer is and how it
  works before it explains where deeper docs live.
- Verify that README body sections prioritize local purpose, boundaries, and
  flow over docs-system navigation unless the page itself is a docs landing.
- Verify that root `README.md` stays lightweight and points readers to
  `docs/README.md` when a docs landing page exists.
- Verify that any proposed `docs/README.md` is justified by a real secondary
  index need.
- Verify that parent docs only summarize and link to child detail.
- Verify that the final path matches the node that owns the knowledge.
