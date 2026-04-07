# Path Selection and Placement

Use this reference when choosing where a concrete document should live.

## Placement Order

1. Inspect all current docs roots:
   - root `docs/`
   - module-local `*/docs/`
2. Reuse the project’s current docs layout if it is coherent.
3. Reuse current domain subfolders if they already exist.
4. If the repo has no clear layout, fall back to:

```text
docs/
  10-rfcs/
  20-adrs/
  30-architecture/
  40-specs/
  50-guides/
  60-runbooks/
  70-postmortems/
```

## Hybrid Placement Strategy

When the repository has both root `docs/` and module-local docs such as
`app/docs/` or `frontend/docs/`, use a hybrid model by default.

### Root `docs/`

Place these in root `docs/`:

- project-level RFCs and ADRs
- cross-module architecture docs
- shared specs and contracts
- project policy and governance docs
- top-level indexes

### Module-Local `*/docs/`

Place these in module-local docs:

- module implementation notes
- local architecture details
- developer guides for one module
- local runbooks
- component or submodule docs

## Decision Rules

- affects project direction or multiple modules => root `docs/`
- formal decision or shared contract => root `docs/`
- only explains one module’s implementation => module-local `*/docs/`
- local developer or operational guidance => module-local `*/docs/`
- if a local doc becomes cross-module source-of-truth later => promote it to
  root `docs/`

## Path Heuristics

- project-wide rule => `docs/policy/` or existing governance location
- module design proposal => `docs/10-rfcs/<domain>/<module>/...`
- current backend design => `docs/30-architecture/backend/...`
- stable API or schema => `docs/40-specs/...`
- module-local implementation note => `<module>/docs/<topic>.md`
- module-local runbook => `<module>/docs/<topic>-runbook.md`

## Naming Rules

- Use lowercase kebab case.
- Name the topic, not only the type.
- Prefer stable filenames for long-lived docs.
