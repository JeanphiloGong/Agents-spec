---
name: reference-core-plan
description: v0.1.0 - Plan a runnable reference-core sample before building it. Use when a noisy production feature, AI draft, or architecture-heavy flow needs a core slice, invariant, included/deferred boundary, placement, and validation plan.
---

# Reference Core Plan

## Overview

Plan one runnable minimal-complete reference sample before writing code. The
plan identifies the core slice, defining invariant, included reference behavior,
deferred production constraints, safe project placement, and validation targets
that `reference-core-build` will implement.

Use this skill to avoid copying production complexity into a smaller folder or
building a sample that does not prove the real invariant.

## When to Use

- Production code or an AI draft is too noisy to learn from directly.
- The human wants a reference sample plan before code is written.
- The core invariant, sample boundary, or placement is not yet explicit.
- A reference sample must map back to production modules later.

**When NOT to use:** writing the sample, reviewing a completed sample,
production landing, tutorial-only derivation, or final integration patches.

## The Planning Loop

1. Identify Core Slice
   - Name the feature, system slice, and one-sentence core behavior goal.
   - Mark required inputs as `provided`, `inferred`, or `missing`.
   - Verify: no missing input would change the sample's core boundary.
2. Name the Defining Invariant
   - State the ordering rule, state transition, data invariant, or core loop
     the sample must preserve.
   - Verify: a sample that breaks this rule would visibly fail.
3. Split Included vs Deferred
   - List what belongs in the reference and what remains production-only.
   - Verify: storage, network, auth, logging, rollout, and config concerns are
     deferred unless they define the core behavior.
4. Choose Sample Shape and Placement
   - Pick runtime, file budget, dependency policy, and sample path.
   - Prefer `examples/reference-core/<feature-slug>/` unless context proves a
     safer alternative.
   - Verify: the path is outside production-imported code by default.
5. Plan Validation
   - Define one happy path and one boundary or failure check.
   - State what the sample will prove and not prove.
   - Verify: `reference-core-build` can execute or directly test both checks.
6. Prepare Map-Back Notes
   - Name likely production modules, boundaries, adapters, and first landing
     tests.
   - Verify: `reference-core-map-back` has concrete targets to refine.

## Decision Points

- If the defining invariant is unknown, ask before planning the sample unless
  repository evidence makes it explicit.
- If a production boundary is part of the core behavior, keep the smallest
  faithful version in the reference and explain why.
- If safe placement is unclear, choose an ephemeral sample and ask for
  confirmation before persisting files.
- If the user wants a teaching guide instead of a runnable sample, use
  `from-scratch-tutorial-workflow`.

## Output Format

```markdown
# Reference Core Plan: <Feature>

## Core Slice
- Feature:
- Core behavior goal:
- Inputs:

## Defining Invariant
- ...

## Included In Reference
- ...

## Deferred To Production
- ...

## Sample Shape and Placement
- runtime:
- file_budget:
- dependency_policy:
- suggested_path:
- production_import_barrier:

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
| "The sample can discover the invariant while being built." | If the invariant is unclear, the sample may prove the wrong thing. |
| "Copying production code is the fastest plan." | Copying preserves incidental complexity instead of isolating the core. |
| "Placement can be decided later." | Placement determines whether the sample can accidentally become production-importable. |

## Red Flags

- The plan lacks a defining invariant.
- Included and deferred concerns overlap.
- No boundary or failure check is planned.
- The suggested path is inside production-imported code.
- Map-back targets are absent.

## Verification

- [ ] Required inputs are marked as `provided`, `inferred`, or `missing`.
- [ ] The defining invariant is explicit.
- [ ] Included and deferred concerns are concrete and non-overlapping.
- [ ] Sample placement has a production-import barrier.
- [ ] Happy-path and boundary/failure validation are planned.
- [ ] Map-back starting points are named.

## Guardrails

- Do not write sample code during planning.
- Do not invent invariants or production modules without evidence.
- Do not plan production patches.
- Do not place samples in production-imported paths by default.
