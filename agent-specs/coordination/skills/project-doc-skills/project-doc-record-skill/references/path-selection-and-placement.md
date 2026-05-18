# Choose The Path From Ownership, Not From Buckets

Use this reference after the ownership node is known. The path should make it
clear who owns the knowledge and how readers move from summary to detail.

## Placement Order

1. Inspect nearby local docs around the owning code node.
2. Determine the ownership node.
3. Place the doc at the lowest common ancestor that fully owns the knowledge.
4. Reuse an existing local docs subtree only when it already matches that
   owning node.

## What Counts As A Node

Only real code-owned seams count as ownership nodes.

Docs-only grouping folders such as `docs/rfcs`, `docs/guides`, or topic
buckets are containers by default, not nodes.

## Root-Level Paths

Use root `docs/` for:

- system purpose and overview
- cross-module architecture
- shared contracts
- governance
- top-level indexes

Use root `README.md` for:

- repository identity
- light runtime or developer orientation
- a short pointer to `docs/README.md`

## Node-Local Paths

Use node-local docs for:

- local current-state
- local accepted decisions
- local guides and runbooks
- local contracts and long-lived direction
- test-suite-local coverage, fixture, harness, and verification docs when the
  tests subtree owns the knowledge

Use the node root `README.md` for:

- module or submodule purpose
- node boundary summary
- child-area navigation

Use the tests-node `README.md` for:

- test-scope summary
- coverage or verification boundary explanation
- navigation into test-local coverage or fixture docs when needed

## Topic-Family Paths

A topic-family container such as `<node>/docs/<topic_path>/` is warranted when:

- the same node and topic path now need a second durable page
- one local subject has 2 or more durable sibling pages
- one local subject mixes accepted decisions, current-state docs, guides,
  contracts, operations notes, and long-lived direction
- readers would understand the local subject more clearly as a small family
  than as another loose file in root `docs/rfcs` or `docs/plans`

Treat the topic-family folder as a subject container, not as a new ownership
node.
Do not create a topic-family folder that contains only `README.md` or empty
placeholder role pages unless the same wave also creates a concrete second
durable page.

A `topic_path` may be one segment such as `parser` or a small tree such as
`core/comparable-result` when the local subject naturally has parent topics
and subtopics.

## Practical Decision Rules

- system or cross-module knowledge => root `docs/`
- one module only => `<module>/docs/`
- one submodule only => `<module>/<submodule>/docs/`
- one component only => component-local docs only when that level has durable
  standalone knowledge
- one test suite or verification slice only => the matching lowest common
  ancestor under `tests/`
- coverage or fixture docs spanning multiple test files => the shared ancestor
  under `tests/`
- child detail under a broad parent => child path plus parent summary link
- one local subject with 2 or more durable sibling pages =>
  `<node>/docs/<topic_path>/`
- one local subject with accepted decisions, current-state, guides, contracts,
  operations notes, and long-lived direction siblings =>
  `<node>/docs/<topic_path>/`
- same node and topic path gains a second durable page => promote to
  `<node>/docs/<topic_path>/`
- one standalone local doc with no sibling alternatives or mixed intents =>
  keep one file at the owning node
- do not add `<node>/docs/README.md` by default when `<node>/README.md`
  already owns the node summary
- only add `<node>/docs/README.md` when the local docs subtree has at least 4
  durable docs, spans mixed intents, or has a genuinely non-obvious reader
  path
- do not keep one node's topic family in root `docs/rfcs` or `docs/plans` by
  default when the family has a clear owning node
- do not confuse root `docs/plans`, `docs/rfcs`, or similar type buckets with
  the local subject container
- do not treat root `README.md` as the full docs index when `docs/README.md`
  exists

## Naming Guidance

Organize in this order:

1. owning node
2. local topic path
3. page role

## Default Shapes

When one local topic path has one durable page, prefer:

- `<node>/docs/<topic_path>.md`

When one local topic path has multiple durable sibling docs, prefer:

- `<node>/docs/<topic_path>/README.md`
- `<node>/docs/<topic_path>/decision.md`
- `<node>/docs/<topic_path>/current-state.md`
- `<node>/docs/<topic_path>/guide.md`
- `<node>/docs/<topic_path>/operations.md`
- `<node>/docs/<topic_path>/direction.md`

The topic folder names the subject. The child filenames name the role.
Use a topic name that stays specific enough inside the node. Do not over-shorten
`<topic_path>/` until it becomes ambiguous.

## Topic-Family Role Priority

- `README.md`: reading entry and navigation map for the topic family; it does
  not replace the authority pages
- `decision.md`: accepted decision, boundary, or conclusion when a formal
  decision page exists
- `current-state.md`: current implemented truth when the system already has a
  live state to describe
- `guide.md`: stable reader workflow
- `operations.md`: diagnosis, recovery, or intervention knowledge
- `direction.md`: long-lived evolution direction

If both `decision.md` and `current-state.md` exist, they serve different jobs:
`decision.md` records what was chosen, while `current-state.md` records what is
currently true in the system.

Do not create `proposal.md`, `implementation-plan.md`, or similar pending-work
docs by default. Keep workflow-plan outputs, task lists, issue acceptance
checklists, and one-off execution sequencing in issues, PR/MRs, planning
artifacts, or comments unless they have become durable project knowledge.

## Filename Rules

- Use lowercase kebab case.
- Name the topic, not only the doc type.
- Prefer stable filenames for long-lived local docs.
- Avoid abbreviations unless the abbreviation is already stable and widely
  understood in this repository.
- Avoid churn-prone suffixes such as `final`, `latest`, `new`, `temp`, or
  `v2`.
- Keep dates out of durable doc filenames unless the document is inherently
  time-scoped, such as a note, log, or meeting record.
- If a durable doc stands alone, do not name it only `decision.md`, `guide.md`,
  or `current-state.md`; include the topic in the filename.
- If a durable doc stands alone, do not use overly broad names such as
  `architecture.md`, `design.md`, or `plan.md`; the subject should still be
  clear outside directory context.

## Default Rule

Name files so the path answers three questions in order: who owns this
knowledge, what topic it belongs to, and what role this page plays.
