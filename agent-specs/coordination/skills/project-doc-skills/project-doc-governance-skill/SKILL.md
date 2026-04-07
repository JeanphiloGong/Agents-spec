---
name: project-doc-governance-skill
description: v0.2.1 - Inspect or design a project-specific documentation governance model with document taxonomy, front matter, lifecycle states, and root-vs-module docs placement rules; use when a repository lacks a clear docs system or its RFC, ADR, architecture, and spec docs are drifting.
---

# Project Documentation Governance Skill

## Trigger and Scope

Use this skill when you must assess, define, or update the documentation
governance model for one concrete project repository.

In scope:
- inspecting whether the project already has documentation rules
- classifying the current state as `existing`, `partial`, or `missing`
- defining document taxonomy and scope levels for this repo
- defining YAML front matter and lifecycle states
- defining source-of-truth boundaries between issue, doc, and code
- defining naming, placement, ownership, and review cadence
- defining project-local migration and rollout guidance

Out of scope:
- recording one specific feature proposal into docs
- writing a one-off README or guide without governance work
- enforcing a company-wide standard across unrelated repositories
- migrating an entire wiki or docs tree in one pass

## Workflow

1. Inspect the project before proposing rules.
   - Look for root-level `docs/`, module-local `*/docs/`, existing RFC or ADR
     files, doc front matter, naming conventions, and any repository
     instructions that already govern docs.
   - Classify the repo as:
     - `existing-governance`
     - `partial-governance`
     - `no-governance`
2. Define the target governance problem.
   - Identify the concrete failure modes: drift, overlap, stale docs, unclear
     ownership, missing lifecycle, or misplaced design records.
   - Keep the target project-local unless the user explicitly asks for a
     broader reusable standard.
3. Preserve what already works.
   - Reuse existing document categories or metadata fields when they are
     coherent and actively maintained.
   - Change only the parts that are inconsistent, missing, or harmful.
4. Define document taxonomy before repo structure.
   - Decide which document types this project actually needs.
   - Reject duplicate document types unless their boundaries are explicit.
5. Define the scope model.
   - Separate `system`, `domain`, `module`, and `component` levels only if the
     project needs them.
   - Map frontend, backend, AI, data, and shared content into those levels.
6. Define the metadata contract.
   - Standardize YAML front matter for formal docs.
   - Keep required fields small enough to maintain.
7. Define lifecycle and replacement rules.
   - Choose the statuses this repo will use.
   - Define when a doc becomes `implemented`, `active`, `deprecated`,
     `superseded`, or `archived`.
8. Define source-of-truth boundaries.
   - State what belongs in issues, repository docs, and code comments.
   - Prevent the same knowledge from being authoritative in multiple places.
9. Define storage, naming, and indexing rules.
   - Recommend a stable layout for this repo.
   - Decide whether the repo should use a hybrid model:
     - root `docs/` for project decisions and formal source-of-truth docs
     - module-local `*/docs/` for implementation and local operating notes
   - Define file naming and index expectations only to the degree the team can
     maintain.
10. Define governance operations.
   - Assign owner expectations, review cadence, update triggers, and approval
     rules for changes to the project’s docs system.
11. Produce the project governance proposal.
   - Return the chosen taxonomy, metadata, lifecycle, storage rules, and
     rollout guidance.
   - Distinguish clearly between reused existing rules and new requirements.
12. Provide migration guidance.
   - Explain how the repo can adopt the governance model incrementally without
     rewriting every old document at once.

## Required Inputs

- Project or repository name
- Current documentation pain points or desired cleanup goal
- Primary maintainers or doc owners if known
- Whether the result should be advisory or required in review

## Defaults

- Operating target: `project-specific-governance`
- Inspection mode: inspect repo rules first, then adapt
- Default document types: `rfc`, `adr`, `architecture`, `spec`, `guide`,
  `runbook`, `postmortem`, `policy`
- Default levels: `system`, `domain`, `module`, `component`
- Metadata format: YAML front matter
- Default required metadata: `id`, `title`, `type`, `level`, `domain`,
  `status`, `owner`, `created_at`, `updated_at`
- Default review metadata: `last_verified_at`, `review_by`
- Default lifecycle: `draft`, `review`, `accepted`, `implemented`, `active`,
  `deprecated`, `superseded`, `archived`
- Deletion policy: keep decision-grade docs; prefer `superseded` or `archived`
- Source-of-truth rule: issues track work, repo docs hold durable knowledge,
  code comments explain local implementation
- Placement strategy: hybrid by default
- Automation baseline: front matter validation, broken-link checks,
  `review_by` expiry checks, and duplicate-authority checks

## Bundled Resources

- `references/document-taxonomy.md`
- `references/example-output.md`
- `references/frontmatter-and-lifecycle.md`
- `references/repo-rollout-and-governance.md`

## Output Format

```text
## Governance Goal
## Current State
## Target Taxonomy
## Metadata Standard
## Lifecycle Model
## Source of Truth Rules
## Storage and Ownership
## Validation and Automation
## Rollout Plan
## Open Questions
```

## Guardrails

- Do not skip inspection of the project’s current doc system.
- Do not replace a coherent local convention just to make it look generic.
- Do not put stable architecture or contract knowledge only in issues.
- Do not invent more document types than the team can explain and maintain.
- Do not require so many metadata fields that authors stop maintaining them.
- Do not let two document types carry the same authority without an explicit
  boundary.
- Do not force all formal docs into root `docs/` when module-local docs are the
  clearer home for implementation guidance.
- Do not let module-local `*/docs/` become a parallel authority for
  project-level RFC, ADR, or cross-module spec records.
- Do not delete accepted decision history by default; mark it `superseded` and
  link the replacement.
- Do not declare a document authoritative without naming its scope, owner, and
  lifecycle.

## Verification Hooks

- Verify that the repo’s current conventions were inspected before proposing a
  new system.
- Verify that each selected document type has a unique purpose.
- Verify that the level model is no deeper than the project needs.
- Verify that the front matter contract is small enough to maintain and rich
  enough to govern.
- Verify that each lifecycle state has an operational meaning.
- Verify that source-of-truth boundaries between issue, doc, and code are
  explicit.
- Verify that the storage model clearly separates project-level docs from
  module-local docs when the repo uses multiple docs roots.
- Verify that at least one frontend, backend, and module example can be
  classified without ambiguity.
- Verify that the automation plan is realistic for normal repository workflows.
