---
name: reference-core-plan
description: v0.1.4 - Plan a runnable reference-core learning module before building it. Use when a noisy production feature, AI draft, architecture-heavy flow, or teaching-plan handoff needs one extracted chain, invariant, scenario-fit src architecture, included/deferred boundary, placement, and validation plan.
---

# Reference Core Plan

## Overview

Plan one runnable reference-core learning module before writing code. The plan
identifies the exact chain to learn, defining invariant, visible steps,
scenario-fit `src/` architecture, included reference behavior, deferred
production constraints, git-reviewable module layout, safe project placement,
teaching-asset constraints when provided, and validation targets that
`reference-core-build` will implement.

Use this skill to avoid copying production complexity into a smaller folder or
building a module that does not teach the real chain.

## When to Use

- Production code or an AI draft is too noisy to learn from directly.
- The human wants to extract one chain before code is written.
- The chain entrypoint, invariant, `src/` architecture, module layout, or
  placement is not yet explicit.
- A learning module must map back to production modules later.
- A `reference-core-teaching-plan` output should shape the module plan.

**When NOT to use:** writing the module, reviewing a completed module,
production landing, tutorial-only derivation, or final integration patches.

## The Planning Loop

1. Identify Learning Chain
   - Name the feature, system slice, and one-sentence chain mastery goal.
   - If a `reference-core-teaching-plan` handoff exists, carry forward its
     zero point, lineage gate, from-zero promise, and asset constraints.
   - If the handoff says the selected chain is blocked by missing prerequisite
     work, plan the prerequisite asset instead or stop for the blocking open
     question.
   - State the chain as `entry input -> key state/data -> decisions ->
     transitions -> output`.
   - Mark required inputs as `provided`, `inferred`, or `missing`.
   - Verify: no missing input would change the chain boundary.
2. Name the Defining Invariant
   - State the ordering rule, state transition, data invariant, or core loop
     the module must preserve.
   - Verify: a module that breaks this rule would visibly fail.
3. Split Included vs Deferred
   - List what belongs in the reference and what remains production-only.
   - Verify: storage, network, auth, logging, rollout, and config concerns are
     deferred unless they define the core behavior.
4. Choose Module Layout and Placement
   - Pick runtime, directory layout, dependency policy, and module path.
   - Include README sections, traces, fixtures, or staged examples required by
     the teaching promise when one exists.
   - Prefer `examples/reference-core/<feature-slug>/` unless context proves a
     safer alternative.
   - Verify: the path is outside production-imported code by default.
5. Choose Scenario-Fit `src/` Architecture
   - Choose the simplest internal `src/` layout that keeps the extracted chain
     understandable for this scenario.
   - Prefer chain-first files for small algorithms, state machines, schedulers,
     parsers, caches, editor loops, and graph runners.
   - Use DDD-inspired `domain/` and `application/` only when business entities,
     rules, and invariants would otherwise blur together.
   - Add `ports/`, `adapters/`, or `projections/` only when external
     boundaries, fake gateways, or read/write views are part of understanding
     the chain.
   - Verify: every proposed `src/` directory has a job in the learning chain;
     no directory exists just to resemble production architecture.
6. Plan Validation
   - Define one happy path and one boundary or failure check.
   - State what the module will prove and not prove.
   - Verify: `reference-core-build` can execute or directly test both checks.
7. Prepare Map-Back Notes
   - Name likely production modules, boundaries, adapters, and first landing
     tests.
   - Verify: `reference-core-map-back` has concrete targets to refine.

## Decision Points

- If the defining invariant is unknown, ask before planning the module unless
  repository evidence makes it explicit.
- If a production boundary is part of the core behavior, keep the smallest
  faithful version in the reference and explain why.
- If safe placement is unclear, choose an ephemeral module and ask for
  confirmation before persisting files.
- If the user wants a teaching guide instead of a runnable module, use
  `from-scratch-tutorial-workflow`.
- If `reference-core-teaching-plan` marks the chain
  `blocked-by-missing-prerequisite`, do not plan the current chain as if it can
  start from zero. Switch to the prerequisite asset or ask for the missing base
  evidence.
- If a teaching-plan handoff lacks `real_world_zero` or `engineering_zero`,
  ask for the missing zero point before planning the module shape.
- If a teaching-plan handoff puts the current-chain behavior inside
  `engineering_zero`, split the base mechanism from `current_chain_adds` before
  planning the module layout.

## Reference Map

- `references/source-architecture-selection.md`
  Read when choosing `src_architecture`, especially if the chain could be
  chain-first, state-machine, pipeline, DDD-inspired, ports/adapters,
  event-sourced, projection-based, or custom.
- `reference-core-teaching-plan` output
  Read when the human wants the learning module to support a blog, nano
  project, tutorial, source-reading note, or personal knowledge-base entry.

## Output Format

```markdown
# Reference Core Plan: <Feature>

## Learning Chain
- Feature:
- Chain mastery goal:
- Chain trace:
- Inputs:

## Teaching Asset Constraints
- real_world_zero:
- engineering_zero:
- current_chain_position:
- current_chain_adds:
- base_current_split:
- lineage_verdict:
- base_asset:
- base_asset_status:
- starts_from:
- example_should_begin_with:
- from_zero_sentence:
- asset_type:
- must_show:
- must_run:
- must_test:
- must_trace:
- must_explain:
- exclusions:

## Defining Invariant
- ...

## Included In Reference
- ...

## Deferred To Production
- ...

## Module Layout and Placement
- runtime:
- directory_layout:
- required_files:
- src_architecture:
  - style: chain-first | ddd-inspired | ports-and-adapters | custom
  - src_layout:
  - why_this_fits:
  - upgrade_triggers_not_used:
- dependency_policy:
- suggested_path:
- production_import_barrier:
- git_review_boundary:

## Validation Plan
- happy_path:
- boundary_or_failure_check:
- proves:
- does_not_prove:

## Map-Back Starting Points
- production_modules:
- boundaries_or_adapters:
- first_landing_tests:

## Build Handoff
- recommended_builder: reference-core-build
- notes:
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The module can discover the invariant while being built." | If the invariant is unclear, the module may prove the wrong thing. |
| "Copying production code is the fastest plan." | Copying preserves incidental complexity instead of isolating the core. |
| "Placement can be decided later." | Placement determines whether the module can accidentally become production-importable. |
| "DDD is a good default." | Architecture should follow the chain pressure; full DDD can hide small mechanisms. |

## Red Flags

- The plan lacks a chain trace or defining invariant.
- A provided teaching promise is ignored or not reflected in module
  requirements.
- A provided lineage gate is ignored, especially when it blocks on missing
  prerequisite work.
- Included and deferred concerns overlap.
- No boundary or failure check is planned.
- The suggested path is inside production-imported code.
- The layout is a loose file instead of a reviewable module directory without
  justification.
- `src_architecture` is missing, generic, or copied from production without
  explaining why it fits the chain.
- DDD, adapters, or projections appear without business-rule or boundary
  pressure.
- Map-back targets are absent.

## Verification

- [ ] Required inputs are marked as `provided`, `inferred`, or `missing`.
- [ ] The learning chain is explicit as entry, state/data, decisions,
      transitions, and output.
- [ ] Teaching asset constraints are carried forward when provided.
- [ ] Lineage constraints are carried forward when provided, including base
      asset, starts-from point, and prerequisite status.
- [ ] The defining invariant is explicit.
- [ ] Included and deferred concerns are concrete and non-overlapping.
- [ ] Module layout is git-reviewable and has a production-import barrier.
- [ ] `src_architecture` names a scenario-fit style, concrete `src/` layout,
      rationale, and rejected upgrade triggers.
- [ ] Happy-path and boundary/failure validation are planned.
- [ ] Map-back starting points are named.

## Guardrails

- Do not write module code during planning.
- Do not invent invariants or production modules without evidence.
- Do not plan production patches.
- Do not place modules in production-imported paths by default.
