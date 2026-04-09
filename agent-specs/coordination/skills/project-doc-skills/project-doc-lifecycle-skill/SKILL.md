---
name: project-doc-lifecycle-skill
description: v0.1.0 - Manage one documentation lifecycle wave for a proposal or doc cluster by deciding promotion, status progression, ADR extraction, current-state updates, stale-doc reconciliation, and archive or supersede actions.
---

# Project Documentation Lifecycle Skill

## Trigger and Scope

Use this skill when one RFC, ADR, architecture page, or related doc cluster
needs lifecycle management rather than one-off recording.

In scope:
- deciding what stage one proposal or doc cluster is in now
- deciding what should happen after an RFC is accepted or implemented
- deciding whether an ADR should be extracted
- deciding whether current-state, contract, guide, or runbook docs must be
  created or updated
- reconciling stale or overlapping docs in one document family
- deciding supersede, deprecate, archive, or relink actions
- defining the execution order for the next lifecycle wave

Out of scope:
- redesigning the repository's overall documentation architecture
- drafting one concrete document from scratch with full body content
- replacing day-to-day record placement for one normal doc-writing request
- migrating the entire docs tree in one pass

Use this skill when prompts sound like:
- "this RFC is implemented now, what else should exist?"
- "do we need an ADR here?"
- "which docs should be updated or archived after this change?"
- "these docs overlap; how should they evolve?"

## Core Purpose

Prevent proposal docs from becoming dead ends and keep one document family
moving toward accurate system knowledge.

This skill exists to help you:
- determine lifecycle state and desired target state
- decide promotion from proposal into current-state and related docs
- separate durable decisions from transient proposals
- reconcile stale or overlapping docs without deleting history blindly
- hand concrete writing work to `project-doc-record-skill` in a clear order

## Mode Selection

- `promote-proposal`
  - Use when a proposal was accepted or implemented and the repo now needs the
    right follow-on docs.
- `extract-decision`
  - Use when a durable decision should be separated from a broader proposal or
    architecture discussion.
- `reconcile-current-state`
  - Use when current-state docs lag behind implemented behavior or overlap with
    proposal docs.
- `supersede-or-archive`
  - Use when old docs need status transitions, supersede links, or archival
    decisions.

## Workflow

1. Inspect the source doc cluster.
   - Read the triggering RFC, ADR, architecture page, or related set of docs.
   - Note status, owner, lineage, and obvious overlap.
2. Inspect implementation and current-state reality.
   - Compare the docs with code, current behavior, and current-state pages.
   - Record unknowns explicitly.
3. Determine the current lifecycle state.
   - Decide whether the source is:
     - still proposal-only
     - accepted but not implemented
     - partially implemented
     - implemented but not promoted
     - current but stale-linked
     - superseded or archival-ready
4. Decide the target lifecycle state.
   - Define what this wave should accomplish:
     - promote to current-state
     - extract ADR
     - add contract
     - add guide or runbook
     - relink current docs
     - supersede or archive old docs
5. Decide promotion targets.
   - Explicitly decide whether the wave requires:
     - architecture or current-state updates
     - ADR extraction
     - contract or spec docs
     - guide docs
     - runbook docs
6. Decide status transitions and stale-doc actions.
   - State which docs remain active, which become superseded, and which should
     be archived.
7. Decide lineage repairs.
   - Define forward and backward links the document family should have after
     this wave.
8. Produce the lifecycle action plan.
   - Order the actions.
   - State which actions `project-doc-record-skill` should execute as concrete
     doc-writing work.

## Required Inputs

- Source doc or doc cluster to evaluate
- Current implementation or rollout state
- Related current-state, contract, guide, or runbook docs if known

## Defaults

- Operating target: `one-doc-family-lifecycle-wave`
- Promotion baseline: implemented proposal requires an explicit
  current-state decision
- ADR baseline: extract only when the decision is durable and likely to be
  revisited
- Contract baseline: add only when the boundary is stable and depended on
- Runbook baseline: add only when operator recovery or intervention matters
- Archive policy: prefer `superseded` or `deprecated` before archival
- Execution model: decide the lifecycle wave here, then hand concrete doc
  writing to `project-doc-record-skill`

## Bundled Resources

- `references/status-transition-model.md`
- `references/promotion-decision-rules.md`
- `references/stale-doc-reconciliation.md`
- `references/lineage-repair-rules.md`
- `references/example-output.md`

## Output Format

```text
## Lifecycle Goal
## Source Documents
## Current Lifecycle State
## Desired End State
## Promotion Decisions
- current-state/manual:
- adr:
- contract/spec:
- guide:
- runbook:

## Status Transitions
## Lineage Repairs
## Record-Skill Handoffs
## Execution Order
## Open Questions
```

## Guardrails

- Do not redesign the entire repository IA here; use
  `project-doc-architecture-skill` for that.
- Do not treat every accepted RFC as an ADR candidate.
- Do not leave implemented behavior trapped in proposal-only docs when system
  understanding changed.
- Do not delete decision history by default; prefer supersede and archive
  links.
- Do not write full final bodies for every target doc here; hand concrete
  writing to `project-doc-record-skill`.

## Verification Hooks

- Verify that the source doc cluster and current implementation state were both
  inspected.
- Verify that the current lifecycle state and desired end state are explicit.
- Verify that promotion decisions are justified rather than automatic.
- Verify that stale-doc handling preserves history and discoverability.
- Verify that handoff actions are specific enough for
  `project-doc-record-skill` to execute.
