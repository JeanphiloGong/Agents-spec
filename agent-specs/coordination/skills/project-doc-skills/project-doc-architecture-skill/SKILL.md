---
name: project-doc-architecture-skill
description: v0.1.0 - Design or refactor one repository's documentation information architecture, including reader-first entry points, active-vs-reserved doc types, current-state/manual ownership, and bootstrap plans when a codebase lacks a usable system overview.
---

# Project Documentation Architecture Skill

## Trigger and Scope

Use this skill when you must inspect, design, or refactor the documentation
system for one concrete repository.

In scope:
- inspecting actual docs usage, not only folder layout
- identifying missing or weak reader entry points
- deciding how top-level docs should be organized for human navigation
- defining active versus reserved doc types for this repo
- deciding where current-state or manual pages live
- deciding how root indexes, module indexes, and architecture entry pages fit
  together
- scanning the codebase and existing docs to bootstrap a missing system
  overview
- defining a metadata baseline and index rules
- defining migration guidance for the docs structure itself

Out of scope:
- recording one concrete feature proposal into a target file
- deciding the lifecycle progression of one specific RFC or doc cluster
- reconciling stale, superseded, or archived docs across an existing document
  family
- replacing concrete doc-writing work for one change

Use this skill when prompts sound like:
- "this repo needs a better docs structure"
- "the docs feel siloed and there is no system overview"
- "we need a start-here path and a current-state layer"
- "scan the codebase and bootstrap an overview"

## Core Purpose

Define how a repository's durable knowledge should be structured and entered
from the top down.

This skill exists to help you:
- design reader-first entry points
- bootstrap a missing system overview from code and docs inspection
- choose which doc types are active and which stay reserved
- assign current-state or manual ownership
- define index and navigation rules that stay maintainable

## Mode Selection

- `inspect-doc-architecture`
  - Use when the repo already has docs and you need to evaluate what works,
    what is missing, and where the information architecture is failing.
- `redesign-doc-architecture`
  - Use when the current docs structure needs a deliberate new layout,
    navigation model, and role split.
- `bootstrap-system-overview`
  - Use when the repo has no useful system overview and the skill must scan the
    codebase plus existing docs to propose overview coverage and file layout.

## Workflow

1. Inspect current docs usage.
   - Look for root `docs/`, module-local `*/docs/`, existing indexes, current
     architecture pages, and the real density of RFCs, guides, contracts, and
     operational docs.
   - Classify the repo as:
     - `existing-doc-architecture`
     - `partial-doc-architecture`
     - `missing-doc-architecture`
2. Identify reader-facing failure modes.
   - Check for:
     - no clear `Start Here`
     - no usable current-state or manual layer
     - RFC overload
     - empty or ornamental categories
     - weak index or navigation paths
     - module docs with no clear relation to root docs
3. If overview coverage is weak, scan the codebase.
   - Derive:
     - system boundary
     - major modules or services
     - core flows or subsystems
     - obvious external interfaces and operational surfaces
   - Record unknowns explicitly instead of inventing architecture.
4. Define the reader entry model.
   - Decide how readers should move through:
     - `Start Here`
     - `System Overview`
     - `Current State`
     - `Active Changes`
     - `Key Decisions`
     - `Stable Contracts`
     - `Development`
     - `Operations`
     - `Governance`
5. Define active versus reserved doc types.
   - Activate only the types this repo can sustain.
   - Keep the rest available but not mandatory.
6. Choose current-state or manual ownership.
   - Decide which path owns "how the system works now."
   - Ensure it acts as an entry layer into detailed docs, not as a duplicate
     authority for every lower-level page.
7. Define navigation and index rules.
   - State what the root docs entry should contain.
   - Decide when section indexes and module indexes are required.
8. Define metadata and storage baseline.
   - Keep the metadata small enough to maintain.
   - Decide how root docs and module-local docs divide responsibility.
9. Produce the architecture proposal.
   - Return the reader entry model, overview coverage plan, active types,
     current-state ownership, and index rules.
10. Provide rollout guidance.
   - Explain how the repo can adopt the structure incrementally without
     rewriting the whole docs tree at once.

## Required Inputs

- Project or repository name
- Current documentation pain points or desired cleanup goal
- Primary maintainers or doc owners if known
- Whether the result should be advisory or required in review

## Defaults

- Operating target: `project-doc-information-architecture`
- Inspection mode: inspect docs usage first, then scan codebase if overview
  coverage is weak
- Reader entry baseline:
  - `Start Here`
  - `System Overview`
  - `Current State`
  - `Active Changes`
  - `Key Decisions`
  - `Stable Contracts`
  - `Development`
  - `Operations`
  - `Governance`
- Active doc types by default: `rfc`, `architecture`, `guide`, `policy`
- Reserved doc types by default: `adr`, `spec`, `runbook`, `postmortem`
- Current-state owner: `architecture/README.md` or an equivalent current-state
  landing page
- Overview bootstrap policy: enabled when a usable top-level overview is
  missing
- Module model: derive from real code and docs, not from ideal taxonomy
- Metadata baseline: small YAML front matter with owner, status, and dates
- Placement strategy: hybrid by default

## Bundled Resources

- `references/reader-entry-model.md`
- `references/active-vs-reserved-types.md`
- `references/current-state-manual-pattern.md`
- `references/bootstrap-system-overview.md`
- `references/index-and-navigation-rules.md`

## Output Format

```text
## Architecture Goal
## Current Documentation State
## Reader-Facing Failure Modes
## System Overview Coverage
## Reader Entry Model
## Active vs Reserved Types
## Current-State Ownership
## Navigation and Index Rules
## Metadata and Storage Baseline
## Rollout Plan
## Open Questions
```

## Guardrails

- Do not optimize for folder symmetry over reader discoverability.
- Do not invent a system overview without inspecting code and existing docs.
- Do not activate more doc types than the repo can actually sustain.
- Do not make the current-state or manual layer a duplicate source of truth for
  everything underneath it.
- Do not use this skill to write a concrete feature proposal or perform
  lifecycle promotion decisions for one document family.

## Verification Hooks

- Verify that actual docs usage was inspected before redesigning structure.
- Verify that the reader entry model gives a clear top-down path.
- Verify that the current-state or manual owner is explicit.
- Verify that overview coverage is grounded in inspected code or docs.
- Verify that active doc types are fewer than or equal to what the repo can
  sustain.
