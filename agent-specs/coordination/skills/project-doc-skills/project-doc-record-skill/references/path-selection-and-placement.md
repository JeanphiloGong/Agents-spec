# Path Selection And Placement

Use this reference when choosing where a concrete doc should live in the
ownership tree.

## Placement Order

1. Inspect nearby local docs around the owning code node.
2. Determine the ownership node.
3. Place the doc at the lowest common ancestor that fully owns the knowledge.
4. Reuse an existing local docs subtree only when it already matches that node.

## Node Definition

Only real code-owned seams count as ownership nodes.

Docs-only grouping folders such as `docs/rfcs`, `docs/guides`, or topic
buckets are containers by default, not nodes.

## Root `docs/`

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

## Node-Local `*/docs/`

Use node-local docs for:
- local current-state
- local proposals
- local guides and runbooks
- detailed implementation plans
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

## Decision Rules

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
- one local subject with 2 or more live alternatives => `<node>/docs/<topic>/`
- one local subject with proposal, decision, implementation-plan, and
  current-state siblings => `<node>/docs/<topic>/`
- one standalone local doc with no sibling alternatives or mixed intents =>
  keep one file at the owning node
- do not add `<node>/docs/README.md` by default when `<node>/README.md`
  already owns the node summary
- only add `<node>/docs/README.md` when the local docs subtree has at least 4
  durable docs, spans mixed intents, or has a genuinely non-obvious reader
  path
- do not keep one node's topic family in root `docs/rfcs` or `docs/plans` by
  default when the family has a clear owning node
- do not treat root `README.md` as the full docs index when `docs/README.md`
  exists

## Naming Rules

- Use lowercase kebab case.
- Name the topic, not only the type.
- Prefer stable filenames for long-lived local docs.
