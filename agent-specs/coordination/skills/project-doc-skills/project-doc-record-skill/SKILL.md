---
name: project-doc-record-skill
description: v0.4.6 - Record one concrete documentation artifact at the correct code-owned node with clear page-role selection, runtime-vs-tests ownership, node-local topic-family containers, README-vs-docs separation, and preserved local detail so it fits the repository's book-like documentation system.
---

# Project Documentation Record Skill

## Trigger and Scope

Use this skill when one concrete piece of durable project knowledge must be
written into repository docs at the right ownership node and connected to the
local reading context.

In scope:
- inspecting local docs near the relevant code node before writing
- inspecting any relevant architecture or lifecycle guidance when available
- determining the ownership node and lowest common ancestor placement
- distinguishing real code-owned nodes from docs-only grouping folders
- distinguishing repo landing README, node README, docs landing README, and
  formal docs before writing
- distinguishing runtime-owned docs from test-suite-owned docs before choosing
  path
- determining the document intent before choosing structure or path
- deciding whether to create a child doc or update an existing parent doc
- deciding whether a doc should stand alone or join a node-local topic-family
  container
- preserving detailed implementation artifacts instead of collapsing them into
  broader docs
- deciding immediate parent summary, footer, index, and neighbor-link updates
- adding metadata only when the repository actually consumes it
- writing the concrete document body for this one doc wave

Out of scope:
- redesigning the repository's overall docs tree
- deciding lifecycle progression for an entire doc family
- repairing the full reading order of a repository or module
- migrating a whole docs tree in one pass
- using one parent doc as a dumping ground for unrelated local changes

Use this skill when prompts sound like:
- "write the right doc for this module change"
- "where should this submodule plan live, and write it"
- "should this be a new child doc or an update to the parent doc?"
- "record this detailed implementation plan without losing the file list"

## Core Purpose

Write the document at the correct node without losing ownership boundaries,
detailed local knowledge, or the local reading path.

This skill exists to help you:
- place docs by ownership node rather than by raw root-doc convenience
- preserve child-scope detail instead of flattening it into parent docs
- keep coverage, fixture, and verification docs under the owning tests subtree
  when the tests asset itself is the primary subject
- keep README pages focused on local purpose, boundaries, and logic before
  they mention the docs system around them
- choose intent-appropriate body structure
- keep parent docs as summary and navigation layers
- keep repo landing pages lightweight while docs landing pages own deeper docs
  routing
- maintain the minimum links needed so the new page is discoverable and
  situationally readable
- choose when one topic needs a small local family folder instead of another
  loose sibling file in a root type bucket
- keep metadata optional and lightweight unless the repository truly consumes it

## Decision Dimensions

Always decide these dimensions before writing:

- `ownership node`
  - Which node owns this knowledge:
    - `system`
    - `module`
    - `submodule`
    - `component`
    - `test-suite`
- `document intent`
  - What the document primarily does:
    - `purpose`
    - `proposal`
    - `current-state`
    - `contract`
    - `guide`
    - `operation`
- `page role`
  - What kind of page this is:
    - `repo landing README`
    - `node entry README`
    - `docs landing README`
    - `formal doc`
- `detail level`
  - Is this:
    - parent summary or index
    - normal node-local durable doc
    - detailed child implementation plan
- `container strategy`
  - Does this wave need:
    - one standalone artifact
    - one node-local topic-family container

## Workflow

1. Inspect local docs around the relevant code node.
   - Look at root `README.md`, root `docs/README.md`, the nearest node
     `README.md`, nearby `*/docs/`, current local plans, and local
     current-state pages.
   - If architecture or lifecycle guidance exists for this scope, read the
     parts that constrain placement, role, or linkage.
2. Determine the ownership node.
   - Decide the concrete node that owns this knowledge:
     - system
     - module
     - submodule
     - component
     - test-suite
   - Treat only real code-owned seams as nodes.
   - Do not treat docs-only grouping folders under `*/docs/` as nodes by
     default.
   - If the document primarily describes test coverage, fixtures, harnesses,
     regression matrices, or verification gaps, prefer the lowest common
     ancestor under `tests/` rather than the runtime module by default.
3. Determine lowest common ancestor placement.
   - Place the doc at the lowest node that fully owns the described knowledge
     or change.
4. Decide container strategy.
   - Keep one standalone artifact when the content is a one-off local doc and
     no sibling alternatives or mixed-intent family already exists.
   - Use a node-local topic-family container such as `<node>/docs/<topic>/`
     when the same local subject has 2 or more live alternative proposals, or
     mixes proposal, decision, implementation-plan, and current-state docs.
   - Treat the topic-family folder as a container for reader navigation, not as
     an ownership node.
5. Determine page role.
   - Decide whether the artifact is:
     - repo landing README
     - node entry README
     - docs landing README
     - formal doc
   - If the page is a README that is not a docs landing page, treat it as an
     entry page for the layer itself first, not as a docs index.
6. Determine document intent.
   - Choose the document's primary job:
     - purpose
     - proposal
     - current-state
     - contract
     - guide
     - operation
7. Decide create versus update.
   - Reuse an existing doc only when it already owns the exact same scope.
   - Create a new child doc when updating a parent would blur boundaries or
     erase detail.
8. Enforce parent-summary and child-detail boundaries.
   - Parents may receive a short summary, pointer, or index update.
   - Child docs retain detailed plans, file change lists, execution order,
     verification slices, ownership splits, and local risks.
9. Enforce README body priority.
   - For repo or node READMEs, explain the layer before the documentation
     around the layer.
   - Prefer:
     - purpose
     - responsibilities or boundaries
     - main flow
     - key areas or child nodes
     - short related-doc pointers near the end
   - Use docs-routing-heavy structure only when the page itself is a docs
     landing README.
10. Decide immediate companion updates.
   - Explicitly decide whether this recording wave also needs:
     - parent summary update
     - current-state update
     - section or root index update
     - topic-family `README.md`
     - footer or lineage links
     - neighbor or follow-up links
11. Decide metadata only if consumed.
   - Reuse repository metadata only when it is actively used.
   - Otherwise prefer no front matter.
   - If metadata is needed, keep it minimal.
12. Write the document.
   - Use an intent-appropriate body structure.
   - Match the body to the page role, not only to the file extension.
   - If the page is a README, avoid turning it into a file inventory when the
     layer has meaningful runtime or design logic to explain.
   - Keep the reader-facing shell light.
13. Update parent summaries and indexes if needed.
   - Update parent docs or indexes only with concise summaries, links, or
     discovery guidance.
14. Verify fit.
   - Confirm node, page role, intent, path, scope boundary, preserved detail,
     and companion updates all match the document's job.

## Required Inputs

- Project or repository name
- The concrete change, purpose, plan, current-state fact, contract, guide, or
  operation content to record
- Relevant code path or ownership area if known
- Any known related parent doc, child doc, issue, current-state page, or
  lifecycle guidance

## Defaults

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
- Metadata rule: no front matter unless the repository or toolchain actually
  consumes it
- Minimal metadata fallback: `type`, `status`, `updated_at`
- Index rule: update indexes when discoverability changes
- Root bucket rule: treat root `docs/rfcs` and `docs/plans` as entry
  containers or system-level indexes by default, not as the long-term home for
  one node's local topic family
- Body structure rule: choose structure from intent, not from one generic
  formal-doc template

## Bundled Resources

- `references/ownership-node-check.md`
- `references/create-vs-update-rules.md`
- `references/detail-preservation-rules.md`
- `references/parent-update-vs-child-doc.md`
- `references/body-structure-by-intent.md`
- `references/readme-body-priority-rules.md`
- `references/metadata-consumption-rules.md`
- `references/path-selection-and-placement.md`
- `references/companion-update-rules.md`
- `references/doc-lineage-block-template.md`
- `references/index-update-rules.md`
- `references/purpose-doc-template.md`
- `references/delivery-goal-doc-template.md`
- `references/example-output.md`

## Output Format

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

## Metadata Plan
## Body Structure Plan
## Linkage Notes
## Index Update Plan
## Follow-up Docs
## Notes and Risks
```

## Guardrails

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
- Do not add front matter only because the file is formal markdown.
- Do not duplicate the H1 title in front matter unless the repo or renderer
  truly consumes it.
- Do not let parent updates become the only durable home of child detail.
- Do not silently perform repo-wide editorial repair here; use
  `project-doc-lifecycle-skill` when the reading path itself is broken.
- Do not write one generic formal-doc shape for every intent.

## Verification Hooks

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
- Verify that metadata is absent unless the repo truly consumes it, or minimal
  when present.
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
