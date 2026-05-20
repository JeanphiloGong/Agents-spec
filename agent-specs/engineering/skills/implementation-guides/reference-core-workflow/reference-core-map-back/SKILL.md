---
name: reference-core-map-back
description: v0.1.2 - Map a validated reference-core learning module back to production landing targets. Use when converting extracted-chain lessons into production modules, boundaries, architecture translation, first landing tests, and handoff guidance without writing the production patch.
---

# Reference Core Map Back

## Overview

Map a validated reference-core learning module back to the production codebase.
This skill turns the module's extracted chain, invariant, state transitions,
fake boundaries, and validation checks into concrete production modules,
adapters, tests, and the first landing step for
`human-led-main-landing-skill`.

Use this skill after a reference module passes review or when the builder
already produced a trusted module.

## When to Use

- A runnable reference-core learning module is ready to inform production work.
- The human needs concrete production modules and tests to touch next.
- Fake boundaries in the module need production counterparts.
- The next step should be a landing plan, not an implementation patch.

**When NOT to use:** planning or building the module, reviewing module quality,
writing production code, or replacing `human-led-main-landing-skill`.

## The Map-Back Loop

1. Read Module Evidence
   - Capture the module path, extracted chain, invariant, happy path, boundary
     check, included behavior, and deferred constraints.
   - Verify: the module has enough evidence to transfer.
2. Identify Production Targets
   - Name modules, boundaries, adapters, state owners, and tests that should
     receive the core behavior.
   - Verify: each target is concrete enough to find in the repository.
3. Translate Fakes to Real Boundaries
   - Map in-memory fakes, stubs, or simplified state to production equivalents.
   - Verify: no deferred constraint is silently reintroduced out of order.
4. Map Module Structure
   - Map `README`, `src`, `tests`, `fixtures`, and `traces` content to the
     production modules, tests, and docs they inform.
   - Preserve the distinction between learning-module architecture and
     production architecture; do not force production to mirror the module
     layout unless the same pressure exists.
   - Verify: every module section has either a production counterpart or an
     explicit "learning only" note.
5. Choose First Landing Test
   - Select the smallest production test that proves the reference invariant.
   - Verify: the test can fail before implementation and pass after landing.
6. Define Landing Sequence
   - Order the first human-owned rewrite steps and production constraints to
     reintroduce.
   - Verify: `human-led-main-landing-skill` can consume the handoff directly.

## Decision Points

- If module quality is uncertain, run `reference-core-review` before mapping
  back.
- If production targets cannot be identified, inspect the repository or ask for
  the owning module before writing the handoff.
- If the mapping requires code changes, stop at the landing plan and hand off
  to `human-led-main-landing-skill`.
- If deferred constraints conflict with production assumptions, call out the
  mismatch as a risk before landing.

## Reference Map

- `references/mapping-back-to-main-checklist.md`
  Read before finalizing production targets, constraint reintroduction order,
  validation porting, and `human-led-main-landing-skill` handoff.

## Output Format

```markdown
## Reference Evidence
- module_path:
- extracted_chain:
- invariant:
- happy_path:
- boundary_or_failure_check:

## Production Targets
- modules:
- boundaries_or_adapters:
- state_owners:
- tests:

## Module-To-Production Mapping
| Module Element | Production Counterpart | Notes |
| --- | --- | --- |

## Architecture Translation
- learning_src_architecture:
- production_architecture_match:
- differences_to_preserve:
- differences_to_drop:

## First Landing Test
- test:
- why_first:

## Landing Sequence
- Step 1:
- Step 2:
- Step 3:

## Handoff
- next_skill: human-led-main-landing-skill
- notes:

## Risks
- ...
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The module is clear, so production targets are obvious." | Map-back must name concrete files, boundaries, and tests. |
| "We can implement while mapping." | Map-back is a handoff plan, not a production patch. |
| "Deferred constraints can all return at once." | Reintroduce production constraints in the order that protects the invariant. |

## Red Flags

- Production modules are described generically instead of named.
- No first landing test is selected.
- Fake boundaries are not mapped to real boundaries.
- Module sections are not mapped back to production targets or learning-only
  notes.
- Learning-module architecture is copied to production without checking whether
  the production code has the same pressure.
- The handoff skips `human-led-main-landing-skill`.
- Risks from deferred constraints are omitted.

## Verification

- [ ] Reference evidence is summarized.
- [ ] The extracted chain is summarized.
- [ ] Production modules, boundaries, and tests are concrete.
- [ ] Module-to-production mapping is explicit.
- [ ] Architecture translation distinguishes learning layout from production
      layout.
- [ ] First landing test is named.
- [ ] Landing sequence preserves the invariant.
- [ ] Handoff names `human-led-main-landing-skill`.

## Guardrails

- Do not write production patches.
- Do not invent production targets without repository evidence.
- Do not map back an unreviewed or failing module without noting the risk.
- Do not reintroduce all production constraints at once without sequence.
