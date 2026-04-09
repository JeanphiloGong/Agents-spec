---
name: project-doc-governance-skill
description: v0.3.0 - Inspect or redesign one repository's documentation information architecture with reader-first entry points, active-vs-reserved doc types, current-state/manual ownership, promotion rules, and doc-lineage rules when RFCs are overloaded or docs feel siloed.
---

# Project Documentation Governance Skill

## Trigger and Scope

Use this skill when you must assess, define, or update the documentation
information architecture for one concrete project repository.

In scope:
- inspecting actual doc usage, not only folder layout
- classifying the current state as `existing`, `partial`, or `missing`
- identifying failure modes such as RFC overload, weak navigation, or siloed
  docs
- defining reader-first entry points and documentation navigation
- defining active versus reserved doc types for this repo
- assigning current-state or manual ownership
- defining promotion rules between proposal, decision, current-state, contract,
  and operational docs
- defining doc-lineage rules and index-update expectations
- defining metadata, lifecycle, placement, ownership, and review cadence
- defining project-local migration and rollout guidance

Out of scope:
- recording one specific feature proposal into docs
- writing one-off README or guide prose without governance work
- enforcing one company-wide standard across unrelated repositories
- migrating an entire docs tree in one pass

Use this skill when prompts sound like:
- "RFCs are carrying too much and the other doc types barely get used"
- "The docs feel siloed and there is no good start-here path"
- "We need a current-state or manual layer"
- "Help me redesign this repo's docs IA before we keep writing more files"

## Core Purpose

Design a documentation system that is understandable from the reader's point of
view, not only tidy from the folder's point of view.

This skill exists to help you:
- define how readers enter and traverse the repository's durable knowledge
- reduce RFC overuse without inventing unnecessary doc categories
- make current-state knowledge discoverable without duplicating every source of
  truth
- define when a proposal must be promoted into architecture, ADR, contract,
  guide, or runbook layers
- make document lineage explicit enough that related docs do not become
  isolated islands

## Default Operating Model

- Start from the repository's existing habits and active usage, not from a
  blank ideal taxonomy.
- Reader entry and discoverability matter more than visual symmetry of folders.
- Activate only the doc types that the project can actually sustain.
- Use a current-state or manual layer as an entrypoint, not as a duplicate
  authority for all lower-level docs.
- Prefer explicit promotion and lineage rules over relying on ad hoc
  `related_docs` fields alone.

## Workflow

1. Inspect actual repository doc usage.
   - Look for root `docs/`, module-local `*/docs/`, current indexes, RFC/ADR
     density, empty categories, front matter patterns, and any repository
     instructions that already govern docs.
   - Classify the repo as:
     - `existing-governance`
     - `partial-governance`
     - `no-governance`
2. Identify the current failure modes.
   - Check for:
     - RFC overload
     - missing current-state entrypoint
     - weak cross-links or doc lineage
     - empty or ornamental doc categories
     - stale docs with no lifecycle or promotion path
   - Keep the target project-local unless the user explicitly asks for a
     broader reusable standard.
3. Preserve what already works.
   - Reuse categories, metadata fields, or entry pages that are coherent and
     actively maintained.
   - Change only the parts that are inconsistent, missing, or harmful.
4. Define the reader entry model before finalizing taxonomy.
   - Decide how a reader should move through:
     - start here
     - current state
     - active changes
     - key decisions
     - stable contracts
     - development and operations
     - governance
5. Define active versus reserved doc types.
   - Decide which doc types the project should use regularly.
   - Keep additional doc types reserved but inactive unless real usage justifies
     them.
   - Reject duplicate document types unless their boundaries are explicit.
6. Choose current-state or manual ownership.
   - Decide which path or index page owns the "how the system works now" entry
     role.
   - Keep that layer as a reader-facing map into authoritative lower-level docs,
     not as a duplicate source of truth.
7. Define promotion rules.
   - State when a proposal must remain a single document and when it must also
     update:
     - current-state or manual pages
     - ADRs
     - contracts or specs
     - guides
     - runbooks
   - Define the default rule for implemented RFCs.
8. Define lineage rules.
   - State how proposal, decision, current-state, contract, guide, and runbook
     docs should link to each other.
   - Decide whether lineage lives in front matter, a body section, or both.
9. Define metadata, lifecycle, storage, and index rules.
   - Standardize YAML front matter only to the degree the repo can maintain.
   - Choose statuses and replacement rules that have operational meaning.
   - Decide placement between root `docs/` and module-local `*/docs/`.
   - Define which indexes or entry pages must update when new docs land.
10. Define governance operations.
   - Assign owner expectations, review cadence, update triggers, and approval
     rules for changes to the docs system.
11. Produce the governance proposal.
   - Return the reader entry model, active types, promotion rules, lineage
     rules, metadata, storage rules, and rollout guidance.
   - Distinguish clearly between reused existing rules and new requirements.
12. Provide migration guidance.
   - Explain how the repo can adopt the model incrementally without rewriting
     every old document at once.

## Required Inputs

- Project or repository name
- Current documentation pain points or desired cleanup goal
- Primary maintainers or doc owners if known
- Whether the result should be advisory or required in review

## Defaults

- Operating target: `project-specific-doc-ia`
- Inspection mode: inspect actual usage first, then adapt
- Reader entry baseline:
  - `start here`
  - `current state`
  - `active changes`
  - `key decisions`
  - `stable contracts`
  - `development and operations`
  - `governance`
- Active doc types by default: `rfc`, `architecture`, `guide`, `policy`
- Reserved doc types by default: `adr`, `spec`, `runbook`, `postmortem`
- Current-state owner: `architecture/README.md` or an equivalent current-state
  index
- RFC rule: RFC is never the final authority for implemented current-state
  behavior by default
- Promotion baseline: implemented RFCs require an explicit
  current-state or manual decision
- ADR rule: use only for durable, revisitable decisions
- Contract rule: use only for stable, depended-on boundaries
- Operation split:
  - `guide` for developer or integrator usage
  - `runbook` for operator recovery, rollback, or incident handling
- Levels: `system`, `domain`, `module`, `component`
- Metadata format: YAML front matter
- Default required metadata: `id`, `title`, `type`, `level`, `domain`,
  `status`, `owner`, `created_at`, `updated_at`
- Default review metadata: `last_verified_at`, `review_by`
- Default lineage baseline: maintainable front matter plus an explicit lineage
  section for core docs when needed
- Default lifecycle: `draft`, `review`, `accepted`, `implemented`, `active`,
  `deprecated`, `superseded`, `archived`
- Deletion policy: keep decision-grade docs; prefer `superseded` or `archived`
- Source-of-truth rule: issues track work, docs hold durable knowledge, code
  comments explain local implementation
- Placement strategy: hybrid by default
- Automation baseline: front matter validation, broken-link checks,
  `review_by` expiry checks, and duplicate-authority checks

## Bundled Resources

- `references/reader-first-navigation.md`
- `references/active-vs-reserved-types.md`
- `references/current-state-manual-pattern.md`
- `references/promotion-rules.md`
- `references/doc-lineage-patterns.md`
- `references/document-taxonomy.md`
- `references/frontmatter-and-lifecycle.md`
- `references/repo-rollout-and-governance.md`

## Output Format

```text
## Governance Goal
## Current Failure Modes
## Reader Entry Model
## Active vs Reserved Types
## Current-State Manual Ownership
## Promotion Rules
## Doc Lineage Rules
## Metadata and Lifecycle
## Index and Navigation Rules
## Rollout Plan
## Open Questions
```

## Guardrails

- Do not skip inspection of the project's actual doc usage before proposing a
  new model.
- Do not replace a coherent local convention just to make it look generic.
- Do not invent more active doc types than the team can explain and maintain.
- Do not let RFC remain the only long-term explanation of implemented
  behavior.
- Do not create a current-state or manual layer that duplicates every lower
  document instead of guiding readers to them.
- Do not rely on generic `related_docs` as the only lineage mechanism when the
  docs are already siloed.
- Do not force all formal docs into root `docs/` when module-local docs are the
  clearer home for implementation guidance.
- Do not let module-local `*/docs/` become a parallel authority for
  project-level RFC, ADR, or cross-module spec records.
- Do not delete accepted decision history by default; mark it `superseded` and
  link the replacement.
- Do not optimize folder elegance over reader discoverability.
- Do not declare a document authoritative without naming its scope, owner, and
  lifecycle.

## Verification Hooks

- Verify that the repo's current conventions and actual doc usage were
  inspected before proposing a new system.
- Verify that active doc types are no more numerous than the repo can sustain.
- Verify that each active doc type has a unique job.
- Verify that there is a clear current-state entrypoint.
- Verify that implemented proposals have explicit promotion rules.
- Verify that source-of-truth boundaries between issue, doc, and code are
  explicit.
- Verify that the storage model clearly separates project-level docs from
  module-local docs when the repo uses multiple docs roots.
- Verify that a reader can move from the root entry to current state to source
  proposal, decision, or contract without ambiguity.
- Verify that the automation plan is realistic for normal repository
  workflows.
