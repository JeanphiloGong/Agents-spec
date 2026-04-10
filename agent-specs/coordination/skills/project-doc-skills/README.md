# Project Doc Skills

This package contains three related Codex skills for project documentation
work. Together they move the package from root-docs-first thinking to an
ownership-tree-first model:

- root `docs/` keeps system-level and cross-module knowledge
- module, submodule, and component docs live near the code that owns them
- parent docs summarize and link
- child docs keep detailed local knowledge

## Package Model

The package assumes three placement rules:

1. Place docs at the lowest common ancestor of the thing they describe.
2. Let parent docs summarize and index, while child docs preserve local detail.
3. Treat only real code-owned seams as ownership nodes; docs-only grouping
   folders are containers by default, not nodes.

## Skills

### `project-doc-architecture-skill`

- Purpose: design or refactor the repository's docs ownership tree.
- Use when:
  - root docs are overloaded
  - local module detail keeps getting buried in parent docs
  - the repo needs a clear root/module/submodule/component doc layout
  - project purpose and node-local purpose are not clearly separated
- Output boundary:
  - returns the ownership node map, placement rules, target doc tree, and
    rollout plan
  - concrete file creation belongs to `project-doc-record-skill`

### `project-doc-record-skill`

- Purpose: write one concrete document at the correct ownership node.
- Use when:
  - a module, submodule, or component change needs durable docs
  - you need to decide create versus update without losing child detail
  - you need to write one purpose doc, proposal, current-state page, guide,
    contract, or operation note
- Output boundary:
  - records one node-local doc wave
  - updates parent summaries or indexes only as light companion changes

### `project-doc-lifecycle-skill`

- Purpose: evolve one doc family across the ownership tree.
- Use when:
  - a proposal was implemented and needs promotion
  - a parent doc is overloaded and should split
  - child detail is trapped in the wrong place
  - supersede, archive, and lineage repair decisions are needed
- Output boundary:
  - returns the rebalancing plan and record-skill handoffs
  - concrete file writing still belongs to `project-doc-record-skill`

## Placement Matrix

- Project purpose
  - root overview or root `docs/README.md`
- Project phase goals
  - system-level planning docs, roadmap docs, or tracked issues
- Module purpose
  - `<module>/README.md`
- Submodule detailed plan
  - the submodule's own `docs/`
- Component implementation detail
  - component-local docs only when the component has durable standalone
    knowledge
- Current state
  - the node that owns the implemented behavior
- Execution checklist
  - issues, PRs, or task tracking, not current-state docs

## Recommended Workflow

1. Use `project-doc-architecture-skill` to inspect the code tree and docs
   tree, then design the target ownership-tree layout.
2. Use `project-doc-record-skill` to place one concrete document at the
   correct node and preserve local detail.
3. Use `project-doc-lifecycle-skill` when a doc family needs promotion,
   splitting, supersede handling, or lineage repair.
4. If the docs tree is already coherent, most day-to-day work can go directly
   through `project-doc-record-skill`.

## README Rule

- Root `docs/README.md` stays as the global docs entry point.
- `<node>/README.md` is the default entry point for one module, submodule, or
  component node.
- `<node>/docs/` is the node's formal-doc container, not a second default
  homepage.
- Docs-only grouping folders such as `docs/rfcs/`, `docs/guides/`, or topic
  buckets like `docs/generation/` are not ownership nodes by default.
- Only add `<node>/docs/README.md` when that local docs subtree has at least
  4 durable docs, spans mixed intents, or has a non-obvious reader path that
  genuinely needs a second index.
- Avoid keeping both `<node>/README.md` and `<node>/docs/README.md` as
  competing summaries of the same node by default.

## Package Roles

- `project-doc-architecture-skill`
  - derives ownership nodes
  - defines placement by lowest common ancestor
  - assigns root versus node-local responsibilities
  - defines parent-summary and child-detail rules
- `project-doc-record-skill`
  - finds the owning node for one document
  - decides create versus update for that node
  - keeps detailed local knowledge in the correct child doc
  - writes the resulting doc wave
- `project-doc-lifecycle-skill`
  - detects overloaded parent docs and stale placement
  - decides promotion, split, supersede, and archive actions
  - hands concrete writes back to `project-doc-record-skill`

## Example Prompts

### Architecture

```text
Use $project-doc-architecture-skill to inspect this repository's code tree and
docs tree, identify overloaded root docs, and design a docs ownership tree with
root, module, submodule, and component responsibilities.
```

### Record

```text
Use $project-doc-record-skill to inspect the nearby docs for this submodule,
determine the ownership node and lowest common ancestor, and record this plan
without collapsing child detail into the parent doc.
```

### Lifecycle

```text
Use $project-doc-lifecycle-skill to inspect this implemented RFC family,
decide whether the parent should split into child docs, repair lineage, and
produce the concrete handoffs that $project-doc-record-skill should execute.
```

## Package Layout

```text
project-doc-skills/
  README.md
  project-doc-architecture-skill/
    SKILL.md
    agents/openai.yaml
    references/
  project-doc-record-skill/
    SKILL.md
    agents/openai.yaml
    references/
  project-doc-lifecycle-skill/
    SKILL.md
    agents/openai.yaml
    references/
```

## Notes

- Each skill is self-contained and keeps its own `references/`.
- This README is only a package-level entry point; operational details stay in
  each skill's own `SKILL.md`.
