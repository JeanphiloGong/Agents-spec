# Example Output

Use this reference when the operator wants a concrete example of a finished
project-level documentation governance proposal.

## Example 1: Project Governance Proposal

```text
## Governance Goal
- Establish a maintainable documentation system for this repository so RFCs,
  ADRs, architecture docs, specs, guides, and runbooks have clear placement,
  ownership, and lifecycle rules.

## Current State
- Existing docs are partially organized.
- Some RFC-like design notes exist, but there is no consistent front matter.
- Architecture and contract knowledge is split across issues and markdown
  files.

## Target Taxonomy
- `rfc`: proposed changes before or during implementation
- `adr`: durable record of key decisions and tradeoffs
- `architecture`: current real design of a system, domain, or module
- `spec`: stable contracts such as APIs, schemas, and state behavior
- `guide`: human-facing usage or extension instructions
- `runbook`: repeatable operational procedures
- `postmortem`: durable incident learning
- `policy`: repository documentation rules

## Metadata Standard
- Required front matter:
  - `id`
  - `title`
  - `type`
  - `level`
  - `domain`
  - `status`
  - `owner`
  - `created_at`
  - `updated_at`
- Strongly recommended:
  - `last_verified_at`
  - `review_by`
  - `version`
  - `source_of_truth`
  - `related_issues`

## Lifecycle Model
- Shared state set:
  - `draft`
  - `review`
  - `accepted`
  - `implemented`
  - `active`
  - `deprecated`
  - `superseded`
  - `archived`
- RFC flow:
  - `draft -> review -> accepted -> implemented`
- Architecture/spec flow:
  - `active -> deprecated -> superseded -> archived`
- Replacement rule:
  - mark old docs `superseded`
  - link replacement in `superseded_by`
  - do not delete accepted decision history by default

## Source of Truth Rules
- Issues track why work exists, scope, and progress.
- Repository docs store durable design, contract, and operations knowledge.
- Code comments explain local implementation details only.
- Only one document in the same scope may be marked `source_of_truth: true`
  for the same contract surface.

## Storage and Ownership
- Root `docs/` holds project-level and cross-module source-of-truth docs:
  - `docs/10-rfcs/`
  - `docs/20-adrs/`
  - `docs/30-architecture/`
  - `docs/40-specs/`
  - `docs/50-guides/`
  - `docs/60-runbooks/`
  - `docs/70-postmortems/`
- Module-local docs such as `frontend/docs/` or `app/docs/` hold local
  implementation notes and module-owned operating docs.
- Add domain subfolders only where retrieval improves.
- Every formal doc must have a named owner.

## Validation and Automation
- Validate required front matter fields.
- Validate `type`, `level`, `domain`, and `status` enums.
- Check broken internal links.
- Check `review_by` expiry.
- Detect duplicate `source_of_truth` within the same scope.

## Rollout Plan
- Start with all new RFC, architecture, and spec docs.
- Upgrade touched high-value docs during normal work.
- Review unclear legacy docs incrementally.
- Add linting only after the metadata contract is stable.

## Open Questions
- Whether ADRs should use the same front matter or a lighter variant.
- Which team owns updates to the project’s doc governance itself.
```

## Example 2: Module-Level Classification

```text
Question:
Where should a proposed backend design for Graph Plan V2 live in this repo?

Answer:
- type: `rfc`
- level: `module`
- domain: `backend`
- suggested path:
  - `docs/10-rfcs/backend/knowledge-graph/graph-plan-v2.md`

Reason:
- It is a proposed module-level backend design, not current architecture and
  not a stable contract yet.
```
