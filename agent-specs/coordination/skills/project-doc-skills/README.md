# Project Doc Skills

## Overview

This package helps a repository move from root-docs-first documentation toward
an ownership-tree-first system. The aim is to keep the project readable like a
small book while keeping the most specific knowledge close to the code and
tests that own it.

In practice, that means:

- root docs keep system-level and cross-module knowledge
- module, submodule, component, and test-suite docs live near their owning
  nodes
- parent pages summarize and route
- child pages keep detailed local knowledge
- one node's topic tree can stay together near the owning node instead of
  piling up in root `docs/rfcs` or `docs/plans`

## Core Model

All three skills share the same documentation model.

1. Place each document at the lowest common ancestor of the thing it
   describes.
2. Treat only real code-owned seams as ownership nodes; docs-only grouping
   folders are containers by default, not nodes.
3. Keep repository landing and documentation landing separate: root
   `README.md` briefly points readers toward docs, while `docs/README.md` owns
   the docs index and reading map.
4. Let parent pages summarize and route, while child pages preserve detailed
   local knowledge.
5. Let a local `topic_path` be either one segment such as `parser` or a small
   tree such as `core/comparable-result` when the local subject naturally has
   parent topics and subtopics.
6. Distinguish type buckets from subject containers: root `docs/plans`,
   `docs/rfcs`, and `docs/guides` are type buckets or indexes by default,
   while `<node>/docs/<topic_path>/` is a subject container for one owning
   node's topic family.

## When To Use Each Skill

### `project-doc-architecture-skill`

Use this skill when the shape of the docs tree itself needs work. It is the
right entry point when root docs are overloaded, local detail keeps getting
buried in parent pages, test docs are attached to the wrong subtree, or the
repository lacks a clear start-here path.

It produces the ownership node map, placement rules, target doc tree, and
rollout guidance. Concrete file creation still belongs to
`project-doc-record-skill`.

### `project-doc-record-skill`

Use this skill for one concrete documentation wave. It decides where one page
belongs, whether it should stay standalone or join a node-local topic tree,
which page role fits best, and what light companion updates are needed so the
new page stays discoverable.

It is the day-to-day writing skill for this package.

### `project-doc-lifecycle-skill`

Use this skill when an existing document family has drifted. It is for
promotion, splitting, supersede handling, lineage repair, or extracting one
owning node's crowded topic tree or subtopic family out of root type buckets.

It returns the rebalancing decisions and the ordered handoffs that
`project-doc-record-skill` should execute.

## How The Skills Fit Together

Most teams should think about the package in this order:

1. Use `project-doc-architecture-skill` when the repository needs a clearer
   documentation layout or reading path.
2. Use `project-doc-record-skill` for normal day-to-day writing once the
   placement model is clear.
3. Use `project-doc-lifecycle-skill` when one family becomes historically
   confusing, overloaded, or poorly linked.
4. If the docs tree is already coherent, most work can go directly through
   `project-doc-record-skill`.

## Placement Principles

- Root `README.md` is the repository landing page, not the full docs index.
- Root `docs/README.md` is the documentation landing page and owns the reading
  map.
- `<node>/README.md` is the default entry page for one module, submodule,
  component, or test-suite node.
- `<node>/docs/` is the node's formal-doc container, not a second default
  homepage.
- `<node>/docs/<topic_path>/` is a local subject container for one node's
  topic tree when that subject has multiple live alternatives, mixed intents,
  or a useful parent-topic and subtopic split.
- Root `docs/rfcs/`, `docs/guides/`, `docs/plans/`, and similar paths are type
  buckets or indexes by default, not ownership nodes or substitute topic
  containers.
- Add `<node>/docs/README.md` only when the local docs subtree has at least 4
  durable docs, spans mixed intents, or has a genuinely non-obvious reader
  path.
- Keep coverage, fixture, and verification docs under the tests subtree when
  the tests asset is the primary owner.

## Example Prompts

### Architecture

```text
Use $project-doc-architecture-skill to inspect this repository's code tree and
docs tree, identify overloaded root docs, misplaced test docs, and design a
docs ownership tree with root, module, submodule, component, and test-suite
responsibilities.
```

### Record

```text
Use $project-doc-record-skill to inspect the nearby docs for this submodule,
determine the ownership node and lowest common ancestor, and record this plan
without collapsing child detail into the parent doc.
```

```text
Use $project-doc-record-skill to inspect this repository's tests tree, runtime
module docs, and nearby coverage notes, determine whether this document is
owned by the tests subtree or the runtime module, and place the resulting test
coverage overview at the lowest common ancestor under tests/.
```

### Lifecycle

```text
Use $project-doc-lifecycle-skill to inspect this implemented RFC family,
decide whether the parent should split into child docs, repair lineage, and
produce the concrete handoffs that $project-doc-record-skill should execute.
```

## Reference: Package Layout

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

Operational details stay in each skill's own `SKILL.md` and `references/`.
