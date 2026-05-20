---
name: reference-core-review
description: v0.1.2 - Review runnable reference-core learning modules before production landing. Use when checking whether a module is chain-complete, invariant-preserving, scenario-fit in src architecture, executable, git-reviewable, safely placed, and ready for map-back.
---

# Reference Core Review

## Overview

Review a reference-core learning module as a runnable proof artifact. Findings
come first and focus on whether the module teaches the extracted chain, proves
the intended invariant, and avoids smuggling in production complexity or
becoming production-importable.

Use this skill before trusting a module or mapping it back to production.

## When to Use

- A reference-core learning module has been built and needs acceptance review.
- A module may be too large, too abstract, or not actually runnable.
- The production-import barrier needs checking.
- Map-back should not start until the module quality is clear.

**When NOT to use:** planning or building the module, production code review,
tutorial review, or writing map-back guidance.

## The Review Loop

1. Read the Plan and Artifact
   - Identify intended learning chain, invariant, included/deferred boundaries,
     and module files.
   - Verify: the review target is clear.
2. Check Chain Completeness
   - Confirm the module exposes entry input, state/data movement, decisions,
     transitions, output, and defining invariant.
   - Verify: the module is neither a vague sketch nor a copied production
     module.
3. Check Validation Evidence
   - Inspect happy path and boundary or failure check.
   - Verify: the boundary check would fail visibly if the invariant broke.
4. Check Placement and Imports
   - Confirm the module is outside production-imported paths by default.
   - Verify: no production module depends on the module.
5. Check Module Shape
   - Confirm the artifact is a git-reviewable directory with README, source,
     checks, and optional fixtures/traces, or a justified single-file exception.
   - Verify: another engineer can run and review the module without reopening
     the production draft.
6. Check `src/` Architecture Fit
   - Confirm the internal `src/` layout matches the planned style and the
     chain pressure.
   - Verify: chain-first modules are not over-layered, and DDD-inspired or
     ports/adapters modules name the business or boundary pressure that earns
     those directories.
7. Check Deferred Constraints
   - Confirm production concerns are deferred unless they define the core.
   - Verify: included and deferred lists are concrete and non-overlapping.
8. Produce Verdict
   - Use `pass`, `revise`, or `block`.
   - Lead with findings, then residual risks.

## Severity

- `block`: module cannot be trusted as a reference proof.
- `revise`: module is useful but needs concrete fixes before map-back.
- `suggestion`: optional improvement that does not block map-back.

## Output Format

```markdown
## Findings
- [severity] [file/section]: [issue]
  Evidence: ...
  Required change: ...

## Verdict
- pass | revise | block

## Map-Back Readiness
- ready: yes | no
- reason:

## Verification Notes
- ...
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It is small, so it must be minimal." | Minimal means preserving and explaining the chain, not just having few lines. |
| "The happy path proves enough." | Boundary or failure evidence protects the defining behavior. |
| "It lives in examples, so placement is safe." | Imports and repository conventions still need checking. |
| "A single file is simpler." | A learning module needs reviewable structure unless the chain is genuinely tiny. |
| "More layers means more complete." | More layers can hide the extracted chain unless the scenario needs them. |

## Red Flags

- No runnable happy path exists.
- No boundary or failure check exists.
- The module does not expose the chain steps.
- The `src/` architecture is generic, production-shaped, or over-layered for
  the chain.
- The module copies broad production structure.
- The module lives in or is imported by production code.
- Deferred production constraints are missing or vague.
- The invariant is not named in the artifact.
- The README reads like a topic note instead of a runnable module guide.

## Verification

- [ ] Findings are ordered by severity.
- [ ] Chain completeness was checked.
- [ ] Happy-path and boundary/failure validation were checked.
- [ ] Module directory shape and README were checked.
- [ ] `src/` architecture fit was checked against the plan and chain pressure.
- [ ] Placement and imports were checked.
- [ ] Included/deferred boundaries were checked.
- [ ] Verdict is `pass`, `revise`, or `block`.

## Guardrails

- Do not rewrite the module during review unless the user asks for fixes.
- Do not approve a module only because it is short.
- Do not start production map-back when verdict is `block`.
- Do not treat production integration code as a reference module.
