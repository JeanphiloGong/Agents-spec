# Example Output

Use this reference when the operator wants an example of how one concrete plan
should be recorded into project documentation.

## Example: Graph Plan V2 Recording Decision

```text
## Recording Goal
- Record the agreed Graph Plan V2 backend design into the project docs.

## Current Repo Convention
- The repo has formal design docs under `docs/10-rfcs/` and architecture docs
  under `docs/30-architecture/`.
- The repo also uses module-local docs such as `frontend/docs/` for
  implementation notes and local operating docs.
- Existing formal docs use YAML front matter with `id`, `title`, `type`,
  `level`, `domain`, `status`, `owner`, `created_at`, and `updated_at`.

## Selected Document Type and Level
- type: `rfc`
- level: `module`
- domain: `backend`

## Target Path
- `docs/10-rfcs/backend/knowledge-graph/graph-plan-v2.md`

## Create or Update Decision
- create new
- reason: this is a new module-level proposal, not an update to current
  architecture

## Front Matter Plan
- `id: RFC-2026-018`
- `title: Graph Plan V2`
- `type: rfc`
- `level: module`
- `domain: backend`
- `status: draft`
- `owner: backend-team`

## Body Structure
- Context
- Goals
- Non-Goals
- Proposed Contract
- Execution Flow
- Risks
- Open Questions

## Related Links
- related issue: `#18`
- related previous fix issue: `#16`

## Notes and Risks
- If the repo later creates a stronger documentation governance model, this RFC
  should be updated to match the new front matter and placement rules.
```

## Example: Current-State Overview Recording Decision

```text
## Recording Goal
- Record the repository's current ingest architecture as a durable current-state
  page.

## Current Repo Convention
- The repo uses `docs/README.md` as the top-level entry and
  `docs/architecture/` for current-state pages.
- Architecture pages should explain how the system works now, not restate RFC
  proposals.

## Selected Document Type and Level
- type: `architecture`
- level: `system`
- domain: `backend`

## Target Path
- `docs/architecture/ingest-overview.md`

## Create or Update Decision
- create new
- reason: there is no existing current-state page that already owns the ingest
  boundary and flow explanation

## Front Matter Plan
- `title: Ingest Overview`
- `type: architecture`
- `level: system`
- `status: active`

## Body Structure
- System Boundary
- Major Modules and Responsibilities
- Core Ingest Flow
- External Interfaces
- Related Docs (footer)

## Footer Context
- related RFC: `docs/rfcs/document-ingest-service-layering.md`
- related current-state index: `docs/architecture/README.md`

## Notes and Risks
- Do not start with `Purpose` or `This document explains`; begin directly with
  the current system boundary and responsibilities.
- Keep the header small; place extended cross-links at the end unless the repo
  has a stronger current-state template.
```
