# Path Selection and Placement

Use this reference when choosing where a concrete document should live.

## Placement Order

1. Reuse the project’s current docs layout if it is coherent.
2. Reuse current domain subfolders if they already exist.
3. If the repo has no clear layout, fall back to:

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

## Path Heuristics

- project-wide rule => `docs/policy/` or existing governance location
- module design proposal => `docs/10-rfcs/<domain>/<module>/...`
- current backend design => `docs/30-architecture/backend/...`
- stable API or schema => `docs/40-specs/...`

## Naming Rules

- Use lowercase kebab case.
- Name the topic, not only the type.
- Prefer stable filenames for long-lived docs.
