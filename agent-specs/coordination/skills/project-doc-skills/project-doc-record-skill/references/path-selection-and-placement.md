# Path Selection And Placement

Use this reference when choosing where a concrete doc should live in the
ownership tree.

## Placement Order

1. Inspect nearby local docs around the owning code node.
2. Determine the ownership node.
3. Place the doc at the lowest common ancestor that fully owns the knowledge.
4. Reuse an existing local docs subtree only when it already matches that node.

## Root `docs/`

Use root `docs/` for:
- system purpose and overview
- cross-module architecture
- shared contracts
- governance
- top-level indexes

## Node-Local `*/docs/`

Use node-local docs for:
- local current-state
- local proposals
- local guides and runbooks
- detailed implementation plans

Use the node root `README.md` for:
- module or submodule purpose
- node boundary summary
- child-area navigation

## Decision Rules

- system or cross-module knowledge => root `docs/`
- one module only => `<module>/docs/`
- one submodule only => `<module>/<submodule>/docs/`
- one component only => component-local docs only when that level has durable
  standalone knowledge
- child detail under a broad parent => child path plus parent summary link
- do not add `<node>/docs/README.md` by default when `<node>/README.md`
  already owns the node summary

## Naming Rules

- Use lowercase kebab case.
- Name the topic, not only the type.
- Prefer stable filenames for long-lived local docs.
