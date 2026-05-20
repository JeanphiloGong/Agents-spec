---
name: reference-core-review
description: v0.1.0 - Review runnable reference-core samples before production landing. Use when checking whether a sample is minimal-complete, invariant-preserving, executable, safely placed, and ready for map-back.
---

# Reference Core Review

## Overview

Review a reference-core sample as a runnable proof artifact. Findings come
first and focus on whether the sample proves the intended invariant without
smuggling in production complexity or becoming production-importable.

Use this skill before trusting a sample or mapping it back to production.

## When to Use

- A reference-core sample has been built and needs acceptance review.
- A sample may be too large, too abstract, or not actually runnable.
- The production-import barrier needs checking.
- Map-back should not start until the sample quality is clear.

**When NOT to use:** planning or building the sample, production code review,
tutorial review, or writing map-back guidance.

## The Review Loop

1. Read the Plan and Artifact
   - Identify intended core slice, invariant, included/deferred boundaries, and
     sample files.
   - Verify: the review target is clear.
2. Check Minimal Completeness
   - Confirm the sample runs one meaningful path and preserves the defining
     invariant.
   - Verify: the sample is neither a vague sketch nor a copied production
     module.
3. Check Validation Evidence
   - Inspect happy path and boundary or failure check.
   - Verify: the boundary check would fail visibly if the invariant broke.
4. Check Placement and Imports
   - Confirm the sample is outside production-imported paths by default.
   - Verify: no production module depends on the sample.
5. Check Deferred Constraints
   - Confirm production concerns are deferred unless they define the core.
   - Verify: included and deferred lists are concrete and non-overlapping.
6. Produce Verdict
   - Use `pass`, `revise`, or `block`.
   - Lead with findings, then residual risks.

## Severity

- `block`: sample cannot be trusted as a reference proof.
- `revise`: sample is useful but needs concrete fixes before map-back.
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
| "It is small, so it must be minimal." | Minimal means preserving the invariant, not just having few lines. |
| "The happy path proves enough." | Boundary or failure evidence protects the defining behavior. |
| "It lives in examples, so placement is safe." | Imports and repository conventions still need checking. |

## Red Flags

- No runnable happy path exists.
- No boundary or failure check exists.
- The sample copies broad production structure.
- The sample lives in or is imported by production code.
- Deferred production constraints are missing or vague.
- The invariant is not named in the artifact.

## Verification

- [ ] Findings are ordered by severity.
- [ ] Minimal completeness was checked.
- [ ] Happy-path and boundary/failure validation were checked.
- [ ] Placement and imports were checked.
- [ ] Included/deferred boundaries were checked.
- [ ] Verdict is `pass`, `revise`, or `block`.

## Guardrails

- Do not rewrite the sample during review unless the user asks for fixes.
- Do not approve a sample only because it is short.
- Do not start production map-back when verdict is `block`.
- Do not treat production integration code as a reference sample.
