---
name: project-doc-record-skill
description: v0.4.0 - Record one concrete documentation artifact at the correct ownership node by determining lowest-common-ancestor placement, preserving child scope, using an intent-appropriate body structure, and adding metadata only when the repository actually consumes it.
---

# Project Documentation Record Skill

## Trigger and Scope

Use this skill when one concrete piece of durable project knowledge must be
written into repository docs at the right ownership node.

In scope:
- inspecting local docs near the relevant code node before writing
- determining the ownership node and lowest common ancestor placement
- determining the document intent before choosing structure or path
- deciding whether to create a child doc or update an existing parent doc
- preserving detailed implementation artifacts instead of collapsing them into
  broader docs
- deciding immediate parent summary, footer, and index updates
- adding metadata only when the repository actually consumes it
- writing the concrete document body for this one doc wave

Out of scope:
- redesigning the repository's overall docs tree
- deciding lifecycle progression for an entire doc family
- migrating a whole docs tree in one pass
- using one parent doc as a dumping ground for unrelated local changes

Use this skill when prompts sound like:
- "write the right doc for this module change"
- "where should this submodule plan live, and write it"
- "should this be a new child doc or an update to the parent doc?"
- "record this detailed implementation plan without losing the file list"

## Core Purpose

Write the document at the correct node without losing ownership boundaries or
detailed local knowledge.

This skill exists to help you:
- place docs by ownership node rather than by raw root-doc convenience
- preserve child-scope detail instead of flattening it into parent docs
- choose intent-appropriate body structure
- keep parent docs as summary and navigation layers
- keep metadata optional and lightweight unless the repository truly consumes it

## Decision Dimensions

Always decide these dimensions before writing:

- `ownership node`
  - Which node owns this knowledge:
    - `system`
    - `module`
    - `submodule`
    - `component`
- `document intent`
  - What the document primarily does:
    - `purpose`
    - `proposal`
    - `current-state`
    - `contract`
    - `guide`
    - `operation`
- `detail level`
  - Is this:
    - parent summary or index
    - normal node-local durable doc
    - detailed child implementation plan

## Workflow

1. Inspect local docs around the relevant code node.
   - Look at root `docs/`, the nearest node `README.md`, nearby `*/docs/`,
     current local plans, and local current-state pages.
2. Determine the ownership node.
   - Decide the concrete node that owns this knowledge:
     - system
     - module
     - submodule
     - component
3. Determine lowest common ancestor placement.
   - Place the doc at the lowest node that fully owns the described knowledge
     or change.
4. Determine document intent.
   - Choose the document's primary job:
     - purpose
     - proposal
     - current-state
     - contract
     - guide
     - operation
5. Decide create versus update.
   - Reuse an existing doc only when it already owns the exact same scope.
   - Create a new child doc when updating a parent would blur boundaries or
     erase detail.
6. Enforce parent-summary and child-detail boundaries.
   - Parents may receive a short summary, pointer, or index update.
   - Child docs retain detailed plans, file change lists, execution order,
     verification slices, ownership splits, and local risks.
7. Decide immediate companion updates.
   - Explicitly decide whether this recording wave also needs:
     - parent summary update
     - current-state update
     - section or root index update
     - footer or lineage links
8. Decide metadata only if consumed.
   - Reuse repository metadata only when it is actively used.
   - Otherwise prefer no front matter.
   - If metadata is needed, keep it minimal.
9. Write the document.
   - Use an intent-appropriate body structure.
   - Keep the reader-facing shell light.
10. Update parent summaries and indexes if needed.
   - Update parent docs or indexes only with concise summaries, links, or
     discovery guidance.
11. Verify fit.
   - Confirm node, intent, path, scope boundary, preserved detail, and
     companion updates all match the document's job.

## Required Inputs

- Project or repository name
- The concrete change, purpose, plan, current-state fact, contract, guide, or
  operation content to record
- Relevant code path or ownership area if known
- Any known related parent doc, child doc, issue, or current-state page

## Defaults

- Operating target: `one-node-local-doc-wave`
- Ownership levels: `system`, `module`, `submodule`, `component`
- Placement rule: lowest common ancestor
- Root docs rule: reserve root `docs/` for system-level or cross-module
  knowledge
- Node-local rule: keep module, submodule, and component knowledge close to the
  owning node
- Node entry rule: prefer `<node>/README.md` as the node's summary and
  navigation page
- Local docs rule: treat `<node>/docs/` as the node's formal-doc container, not
  a second default homepage
- Local docs README rule: only add `<node>/docs/README.md` when that local docs
  subtree truly needs a secondary index
- Parent-summary rule: parent docs summarize and link, but do not keep child
  detail by default
- Child-detail rule: file change plans, execution slices, verification slices,
  ownership boundaries, and local risks stay in the child doc
- Create or update rule: update only when the existing doc already owns the
  exact same scope
- Metadata rule: no front matter unless the repository or toolchain actually
  consumes it
- Minimal metadata fallback: `type`, `status`, `updated_at`
- Index rule: update indexes when discoverability changes
- Body structure rule: choose structure from intent, not from one generic
  formal-doc template

## Bundled Resources

- `references/ownership-node-check.md`
- `references/create-vs-update-rules.md`
- `references/detail-preservation-rules.md`
- `references/parent-update-vs-child-doc.md`
- `references/body-structure-by-intent.md`
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

## Document Intent
## Primary Artifact
## Create or Update Decision
## Scope Boundary Decision
## Immediate Companion Updates
- parent summary:
- current-state:
- indexes:
- footer links:

## Metadata Plan
## Body Structure Plan
## Footer Context Plan
## Index Update Plan
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
- Do not add front matter only because the file is formal markdown.
- Do not duplicate the H1 title in front matter unless the repo or renderer
  truly consumes it.
- Do not let parent updates become the only durable home of child detail.
- Do not write one generic formal-doc shape for every intent.

## Verification Hooks

- Verify that nearby local docs were inspected before placement was chosen.
- Verify that the ownership node and lowest common ancestor are explicit.
- Verify that create-versus-update does not collapse a narrower child scope
  into a broader parent doc.
- Verify that detailed implementation artifacts remain preserved when they
  matter to the document's job.
- Verify that metadata is absent unless the repo truly consumes it, or minimal
  when present.
- Verify that parent docs only summarize and link to child detail.
- Verify that the final path matches the node that owns the knowledge.
