---
name: reference-core-map-back
description: v0.1.0 - Map a validated reference-core sample back to production landing targets. Use when converting sample lessons into production modules, boundaries, first landing tests, and handoff guidance without writing the production patch.
---

# Reference Core Map Back

## Overview

Map a validated reference-core sample back to the production codebase. This
skill turns the sample's invariant, state transitions, fake boundaries, and
validation checks into concrete production modules, adapters, tests, and the
first landing step for `human-led-main-landing-skill`.

Use this skill after a reference sample passes review or when the builder
already produced a trusted sample.

## When to Use

- A runnable reference-core sample is ready to inform production work.
- The human needs concrete production modules and tests to touch next.
- Fake boundaries in the sample need production counterparts.
- The next step should be a landing plan, not an implementation patch.

**When NOT to use:** planning or building the sample, reviewing sample quality,
writing production code, or replacing `human-led-main-landing-skill`.

## The Map-Back Loop

1. Read Sample Evidence
   - Capture the invariant, happy path, boundary check, included behavior, and
     deferred constraints.
   - Verify: the sample has enough evidence to transfer.
2. Identify Production Targets
   - Name modules, boundaries, adapters, state owners, and tests that should
     receive the core behavior.
   - Verify: each target is concrete enough to find in the repository.
3. Translate Fakes to Real Boundaries
   - Map in-memory fakes, stubs, or simplified state to production equivalents.
   - Verify: no deferred constraint is silently reintroduced out of order.
4. Choose First Landing Test
   - Select the smallest production test that proves the reference invariant.
   - Verify: the test can fail before implementation and pass after landing.
5. Define Landing Sequence
   - Order the first human-owned rewrite steps and production constraints to
     reintroduce.
   - Verify: `human-led-main-landing-skill` can consume the handoff directly.

## Decision Points

- If sample quality is uncertain, run `reference-core-review` before mapping
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
- sample_path:
- invariant:
- happy_path:
- boundary_or_failure_check:

## Production Targets
- modules:
- boundaries_or_adapters:
- state_owners:
- tests:

## Fake-To-Production Mapping
| Reference Element | Production Counterpart | Notes |
| --- | --- | --- |

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
| "The sample is clear, so production targets are obvious." | Map-back must name concrete files, boundaries, and tests. |
| "We can implement while mapping." | Map-back is a handoff plan, not a production patch. |
| "Deferred constraints can all return at once." | Reintroduce production constraints in the order that protects the invariant. |

## Red Flags

- Production modules are described generically instead of named.
- No first landing test is selected.
- Fake boundaries are not mapped to real boundaries.
- The handoff skips `human-led-main-landing-skill`.
- Risks from deferred constraints are omitted.

## Verification

- [ ] Reference evidence is summarized.
- [ ] Production modules, boundaries, and tests are concrete.
- [ ] Fake-to-production mapping is explicit.
- [ ] First landing test is named.
- [ ] Landing sequence preserves the invariant.
- [ ] Handoff names `human-led-main-landing-skill`.

## Guardrails

- Do not write production patches.
- Do not invent production targets without repository evidence.
- Do not map back an unreviewed or failing sample without noting the risk.
- Do not reintroduce all production constraints at once without sequence.
