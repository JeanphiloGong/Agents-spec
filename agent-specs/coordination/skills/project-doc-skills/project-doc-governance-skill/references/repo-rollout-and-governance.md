# Repo Rollout and Governance

Use this reference when deciding where documents live, how they relate to
issues and code, and how to roll a documentation system out inside one
repository.

## Responsibility Boundary

- `issue`: tracks why the work exists, scope, acceptance, and progress
- `repo document`: stores durable knowledge, contracts, design, and operations
- `code comment`: explains local implementation details

Do not make the same knowledge authoritative in two places.

## Default Docs Layout

Projects may adapt depth, but this structure is the default recommendation:

```text
docs/
  00-index/
  10-rfcs/
  20-adrs/
  30-architecture/
  40-specs/
  50-guides/
  60-runbooks/
  70-postmortems/
  90-archive/
```

If a repo is small, collapse categories conservatively rather than creating
empty folders.

## Domain Subfolders

Add domain subfolders only when they improve retrieval:

- `frontend/`
- `backend/`
- `ai/`
- `data/`
- `shared/`

Example:

```text
docs/10-rfcs/backend/knowledge-graph/graph-plan-v2.md
docs/30-architecture/frontend/design-system/navigation.md
docs/40-specs/shared/context-retrieve-contract.md
```

## Naming Rules

- Use lowercase kebab case for filenames.
- Keep names based on the topic, not the document type only.
- Prefer stable names for long-lived docs.
- Use ASCII unless the repository already standardizes on another language.

## Source-of-Truth Rule

Within one scope, only one document should be marked `source_of_truth: true`
for the same contract or design surface.

Examples:

- one authoritative API spec per API surface
- one authoritative architecture doc for a module
- one current runbook per operational flow

## Minimal Automation Baseline

- validate required front matter fields
- validate enumerated `type`, `level`, `status`, and `domain`
- check broken internal links
- check `review_by` expiry
- detect duplicate `source_of_truth` within the same scope

## Rollout Strategy

1. Inspect current docs first.
2. Define the project-local governance model.
3. Apply the rules to all new important docs:
   - open RFCs
   - active architecture docs
   - active specs
   - current runbooks
4. Upgrade touched high-value docs during normal work.
5. Archive or review unclear legacy docs incrementally.
6. Add automation only after the metadata contract stabilizes.

## Migration Rule

Do not rewrite every old document at once. Migrate incrementally:

- new important docs must follow the governance model
- touched high-value docs should be upgraded when edited
- stale legacy docs should be archived or reviewed explicitly

## Governance Rule

Changes to the project’s doc system should:

1. name the owner
2. define affected folders and document types
3. define migration impact
4. define when the new rule becomes required
