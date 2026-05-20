---
name: from-scratch-tutorial-review
description: v0.1.0 - Review from-scratch implementation tutorials for teaching-chain correctness. Use when checking a tutorial draft for skipped reasoning, disconnected code versions, unexplained helpers, missing step checks, or final-code drift before accepting it.
---

# From-Scratch Tutorial Review

## Overview

Review a from-scratch implementation tutorial as a teaching artifact. The
primary question is whether a reader can follow the guide from external
behavior to final code without trusting a hidden answer. Findings lead the
response, ordered by severity, with file or section references when available.

## When to Use

- A from-scratch tutorial draft needs acceptance review.
- A guide may have skipped reasoning, hidden helper contracts, or disconnected
  code versions.
- The final code must be checked against the incremental steps.
- A simplification pass needs a quality baseline before editing.

**When NOT to use:** writing the first draft, planning the teaching path,
general code review, production merge review, or publishing metadata review.

## The Review Loop

1. Identify the Tutorial Contract
   - Read reader goal, external contract, constraints, and teaching example.
   - Verify: supplied facts and inferred assumptions are separated.
2. Check Version Continuity
   - For each numbered step, compare the previous version, add/replace action,
     code change, current capability, freeze statement, and remaining gap.
   - Verify: every step can only depend on code already introduced.
3. Check Step Evidence
   - Inspect `Step Check` and `What To Verify`.
   - Verify: checks prove the current version rather than the final solution.
4. Check Helper Necessity
   - Ensure every helper appears only after a requirement pressure creates it.
   - Verify: helper purpose, inputs, output or mutation boundary are explicit.
5. Check Final-Code Drift
   - Compare the final complete code to the connected steps.
   - Verify: no state, branch, helper, or mutation rule appears only at the
     end.
6. Produce Verdict
   - Use `pass`, `revise`, or `block`.
   - Include required fixes before summaries.

## Severity

- `block`: the tutorial cannot be accepted because the teaching chain is broken
  or final code contains unexplained logic.
- `revise`: the tutorial is directionally correct but needs concrete fixes.
- `suggestion`: optional improvement that does not block acceptance.

## Output Format

```markdown
## Findings
- [severity] [section/file reference]: [issue]
  Evidence: ...
  Required change: ...

## Open Questions
- ...

## Verdict
- pass | revise | block

## Verification Notes
- ...
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The final code is correct, so the tutorial is fine." | A from-scratch tutorial can fail even when the code works. |
| "A missing step check is only a documentation issue." | Step checks prove the version ladder is real. |
| "The reader can infer why the helper exists." | The tutorial must make helper pressure explicit. |
| "Review should summarize first." | Findings come first so required fixes are visible. |

## Red Flags

- A step lacks `Previous Version Can`, `Add or Replace`, `Step Check`,
  `Freeze This Version`, or `Still Lacks`.
- A code block cannot be explained as an addition to or replacement of the
  previous version.
- The final code has helper logic not introduced in steps.
- The guide starts with internal structure before external behavior.
- A helper lacks a caller, input, output, or mutation boundary.
- The tutorial has no concrete trace or check.

## Verification

- [ ] Findings are ordered by severity.
- [ ] Version continuity was checked step by step.
- [ ] Step checks were reviewed for relevance to the current version.
- [ ] Helper necessity and mutation boundaries were checked.
- [ ] Final-code drift was checked.
- [ ] Verdict is `pass`, `revise`, or `block`.

## Guardrails

- Do not rewrite the tutorial during review unless the user asks for fixes.
- Do not approve a guide only because the final code is correct.
- Do not invent source facts to make a teaching gap look acceptable.
- Do not bury blocking findings under summaries.
