---
name: project-doc-record-skill
description: v0.3.0 - Record one concrete documentation artifact by classifying lifecycle role, locating system placement, choosing the primary file, and landing the right local updates for that one documentation wave.
---

# Project Documentation Record Skill

## Trigger and Scope

Use this skill when one concrete project change, plan, decision, current-state
update, contract, guide, or operation record must be written into repository
documentation.

In scope:
- inspecting the project's current documentation rules first
- locating the change in the system before choosing the document type
- classifying lifecycle role before doc type
- deciding whether the result is a single-document record or requires
  companion updates
- choosing the target path and whether to create or update a file
- generating front matter that matches the project's current conventions
- writing the document body in a clean, decision-grade structure
- linking the new or updated doc back to the relevant issue, current-state,
  proposal, decision, contract, guide, or runbook context

Out of scope:
- redesigning the repository's entire documentation governance model from
  scratch
- writing product copy, README prose, or informal notes with no durable
  knowledge intent
- recording a plan before the content has enough clarity to stand as a durable
  document
- migrating a whole docs tree in one pass

Use this skill when prompts sound like:
- "record this agreed design into docs"
- "turn this change into the right current-state or ADR record"
- "for this feature, which docs should exist besides the main proposal?"
- "write the right doc for this one change"

## Core Purpose

Record one documentation artifact in the right place and land the immediate
updates needed for that one documentation wave.

This skill exists to help you:
- place a change in the system before selecting a doc type
- distinguish proposal, decision, current-state, contract, development, and
  operational records
- allow low-impact local changes to remain single-doc when that is sufficient
- decide the immediate companion updates needed for the current recording wave
- keep lineage and discoverability explicit instead of leaving them in chat
  context
- hand off lifecycle progression and stale-doc reconciliation to
  `project-doc-lifecycle-skill`

## Mode Selection

- `record-proposal`
  - Use for proposed changes, design options, or rollout plans that are not yet
    the repository's implemented current state.
- `record-decision`
  - Use for one settled decision that already deserves an ADR or equivalent
    decision record.
- `record-current-state`
  - Use for how the system works now after implementation or clarification.
- `record-contract`
  - Use for stable, depended-on APIs, schemas, state models, or interface
    boundaries.
- `record-operation`
  - Use for developer workflow, operator recovery, troubleshooting, rollback,
    or runbook material.

If the user does not specify a mode, infer it from lifecycle role and disclose
the inference in the output.

If the request is really about:
- RFC promotion after implementation
- stale or conflicting doc families
- supersede, archive, or status progression

then stop and hand the task to `project-doc-lifecycle-skill` instead of
stretching this skill.

## System Placement Check (Required)

Before choosing the primary document type, locate the change in the system.

The output must answer:
- which module or service owns the change
- which higher-level capability or user-visible function it serves
- which core flow or subsystem it affects
- whether it changes proposal, decision, current-state, contract, development
  flow, or operation
- which current-state or manual page must be created or updated, if any

This step decides whether a single document is enough or whether the current
recording wave also needs immediate companion updates.

## Workflow

1. Inspect current repository doc rules and entry pages first.
   - Look for root `docs/`, module-local `*/docs/`, entry pages, RFC, ADR,
     architecture, guide, runbook, or spec files, front matter patterns,
     naming rules, and indexing conventions.
   - If the project has no clear rules, fall back to a light default structure
     and note that `project-doc-architecture-skill` should be used later to
     formalize the system.
2. Run the `System Placement Check`.
   - Locate the change in the system before selecting the primary artifact.
3. Classify the lifecycle role first.
   - Choose among:
     - proposal
     - decision
     - current-state
     - contract
     - development guide
     - operation
4. Select the primary artifact.
   - Choose the primary file type and level from lifecycle role, project rules,
     and scope.
5. Decide immediate companion updates.
   - Explicitly decide whether the change also requires:
     - architecture or current-state updates
     - contract or spec updates
     - guide updates
     - runbook updates
     - root or section index updates
   - Low-impact local changes may remain `single-doc only` if discoverability
     and system understanding are not materially affected.
6. Decide whether to create or update.
   - Reuse an existing authoritative doc when the new content clearly belongs
     in it.
   - Create a new file when reusing would blur scope, ownership, or lifecycle.
7. Build front matter.
   - Reuse the project's metadata pattern when one exists.
   - Otherwise apply a small default front matter set with owner, status, and
     dates.
8. Build lineage.
   - Add explicit links back to the relevant proposal, decision, current-state,
     contract, guide, or runbook context.
   - Prefer an explicit lineage block when the relationship would otherwise be
     hard to discover.
9. Update indexes or entry pages when required.
   - Update the relevant current-state, section, or root entry pages when
     discoverability changes.
10. Verify fit.
   - Confirm the lifecycle role, system placement, primary artifact, companion
     updates, path, and status all match the content.
   - Confirm the result can be found later by a developer who did not join the
     original discussion.

## Required Inputs

- Project or repository name
- The concrete plan, decision, implementation state, contract, guide, or
  operation content to record
- Any known related issue, task, or existing document

## Defaults

- Inspection mode: inspect repo docs first, then adapt
- Decision order:
  - system placement first
  - lifecycle role second
  - doc type third
- Default active type set: `rfc`, `architecture`, `guide`, `policy`
- Default reserved type set: `adr`, `spec`, `runbook`, `postmortem`
- Default levels: `system`, `domain`, `module`, `component`
- Default front matter baseline: `id`, `title`, `type`, `level`, `domain`,
  `status`, `owner`, `created_at`, `updated_at`
- Default placement strategy: root `docs/` for project-level decisions and
  shared contracts; module-local `*/docs/` for local implementation guidance
- Default create or update rule: update only when scope clearly matches;
  otherwise create a new file
- Single-doc rule: low-impact local changes may remain a single document
- Companion update rule: system-affecting changes must explicitly decide
  immediate companion updates for this recording wave
- Lifecycle handoff rule: implemented RFC progression and stale-doc
  reconciliation belong to `project-doc-lifecycle-skill`
- ADR rule: use directly only when the input is already one settled decision
- Contract rule: only when stability and downstream consumers justify it
- Runbook rule: only when operator recovery or intervention matters
- Index update rule: required when discoverability changes
- Default status choice:
  - proposal => `draft`
  - accepted proposal => `accepted`
  - current architecture/spec/guide/runbook => `active`

## Bundled Resources

- `references/lifecycle-role-classification.md`
- `references/system-placement-check.md`
- `references/companion-update-rules.md`
- `references/doc-lineage-block-template.md`
- `references/index-update-rules.md`
- `references/create-vs-update-rules.md`
- `references/doc-type-classification.md`
- `references/frontmatter-template-rules.md`
- `references/path-selection-and-placement.md`

## Output Format

```text
## Recording Goal
## System Placement
- owning module/service:
- serves capability:
- affects core flow:
- lifecycle role:

## Primary Artifact
## Immediate Companion Updates
- current-state/manual:
- contract/spec:
- guide:
- runbook:
- indexes:

## Create or Update Decision
## Front Matter Plan
## Doc Lineage Plan
## Index Update Plan
## Notes and Risks
```

## Guardrails

- Do not record a feature-level or system-affecting change without locating it
  in the system first.
- Do not choose the primary document type before lifecycle role is explicit.
- Do not use this skill to reconcile the full lifecycle of an already
  implemented RFC family.
- Do not create ADR unless the input is already one settled decision that
  clearly deserves a decision record.
- Do not create spec unless the boundary is stable and depended on.
- Do not place project-level RFC, ADR, or cross-module spec records into
  module-local `*/docs/`.
- Do not place module-only implementation notes into root `docs/` unless they
  are intentionally being promoted to project-level visibility.
- Do not finish without deciding whether current-state or manual pages must
  update in this recording wave.
- Do not leave lineage implicit in chat history alone.
- Do not use front matter fields that the repo cannot realistically maintain.
- Do not turn a formal doc into a task checklist or sprint log.

## Verification Hooks

- Verify that the repo's current documentation pattern was checked first.
- Verify that system placement is explicit before doc type is chosen.
- Verify that the lifecycle role matches the content's primary job.
- Verify that low-impact local changes are allowed to remain `single-doc only`
  when appropriate.
- Verify that system-affecting changes decide immediate companion updates
  explicitly.
- Verify that the chosen level is the smallest level that still fits.
- Verify that the selected path follows repo conventions or a clear default.
- Verify that the selected docs root matches the document scope and
  source-of-truth role.
- Verify that front matter is coherent and not over-specified.
- Verify that lineage can be followed forward and backward without the original
  chat context.
