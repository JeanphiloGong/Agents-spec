---
name: from-scratch-tutorial-review
description: v0.1.2 - Review from-scratch implementation tutorials for defect-driven teaching-chain correctness and executable continuity. Use when checking a tutorial draft for skipped reasoning, vague step rationale, disconnected code versions, unexplained helpers, missing step checks, silent semantic choices, or final-code drift before accepting it.
---

# From-Scratch Tutorial Review

## Overview

Review a from-scratch implementation tutorial as a teaching artifact. The
primary question is whether a reader can follow the guide from external
behavior to final code without trusting a hidden answer. Findings lead the
response, ordered by severity, with file or section references when available.

Use the bundled quality standards reference when headings are present but the
tutorial may still hide state, skip semantic choices, or read like an internal
generation artifact.

## When to Use

- A from-scratch tutorial draft needs acceptance review.
- A guide may have skipped reasoning, hidden helper contracts, or disconnected
  code versions.
- The final code must be checked against the incremental steps.
- A simplification pass needs a quality baseline before editing.

**When NOT to use:** writing the first draft, planning the teaching path,
general code review, production merge review, or publishing metadata review.

## Reference Map

- `references/quality-standards.md`
  Read when reviewing a complete or near-complete tutorial. It defines checks
  for executable continuity, defect-driven depth, semantic choice visibility,
  evidence quality, and reader-facing publishability.

## The Review Loop

1. Identify the Tutorial Contract
   - Read reader goal, external contract, constraints, and teaching example.
   - Verify: supplied facts and inferred assumptions are separated.
2. Check Version Continuity
   - For each numbered step, compare the previous version, add/replace action,
     code change, current capability, freeze statement, and remaining gap.
   - Read `references/quality-standards.md` and check executable continuity.
   - Verify: every step can only depend on code already introduced, and every
     step check would run from visible state.
3. Check Defect-Driven Teaching Depth
   - Inspect `What Breaks`, `New Requirement`, `Why This Change Works`, and
     `Step Self-Review` when present.
   - Verify: every step names a concrete defect in the naive or previous
     version before introducing the next structure.
4. Check Step Evidence
   - Inspect `Step Check` and `What To Verify`.
   - Verify: checks prove the current version's named defect was addressed,
     not the final solution.
5. Check Semantic Choice Visibility
   - Look for behavior choices that appear silently: copying vs mutating,
     raising vs returning, stopping vs continuing, rejecting before side
     effects, or private helper boundaries.
   - Verify: every meaningful behavior change is explained where it first
     appears and has a small check when needed.
6. Check Helper Necessity
   - Ensure every helper appears only after a requirement pressure creates it.
   - Verify: helper purpose, inputs, output or mutation boundary are explicit.
7. Check Final-Code Drift
   - Compare the final complete code to the connected steps.
   - Verify: no state, branch, helper, or mutation rule appears only at the
     end.
8. Check Reader-Facing Publishability
   - Identify internal scaffolding, excessive compliance language, or missing
     reader recap after correctness issues are handled.
   - Verify: publishability feedback is not used to hide blocking correctness
     findings.
9. Produce Verdict
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
| "The step has a `Why This Matters` line, so the rationale is covered." | The rationale must name concrete defects in the current version and show why the next change follows. |
| "The final tests pass, so intermediate snippets are fine." | Tutorial steps must be executable from visible state; final tests do not prove connected continuity. |
| "Copying context is a small implementation detail." | Silent semantic choices can change the behavior the tutorial taught earlier. |

## Red Flags

- A step lacks `Naive or Previous Version`, `What Breaks`, `New Requirement`,
  `Add or Replace`, `Step Check`, `Freeze This Version`, `Still Lacks`, or an
  equivalent step-level self-review.
- A step's rationale is generic and does not explain what breaks in the naive
  or previous version.
- The guide advances to the next step without a visible step-level self-review
  or equivalent quality gate.
- A code block cannot be explained as an addition to or replacement of the
  previous version.
- A step check depends on stale state, hidden setup, or a registry that was not
  updated after a function or helper changed.
- A meaningful behavior choice appears without explanation or a targeted check.
- The final code has helper logic not introduced in steps.
- The guide starts with internal structure before external behavior.
- A helper lacks a caller, input, output, or mutation boundary.
- The tutorial has no concrete trace or check.
- The tutorial reads like an internal compliance checklist rather than a
  reader-facing guide.

## Verification

- [ ] Findings are ordered by severity.
- [ ] Version continuity was checked step by step.
- [ ] Executable continuity was checked against the quality standards
      reference.
- [ ] Teaching depth was checked for concrete previous-version defects.
- [ ] Meaningful semantic choices were checked for explanation and evidence.
- [ ] Step checks were reviewed for relevance to the current version.
- [ ] Helper necessity and mutation boundaries were checked.
- [ ] Final-code drift was checked.
- [ ] Verdict is `pass`, `revise`, or `block`.

## Guardrails

- Do not rewrite the tutorial during review unless the user asks for fixes.
- Do not approve a guide only because the final code is correct.
- Do not invent source facts to make a teaching gap look acceptable.
- Do not bury blocking findings under summaries.
