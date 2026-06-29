---
name: workflow-check
description: v0.1.0 - Checks an implementation slice against its task-run sketch. Use after workflow-build when a slice used .agent-runs artifacts, or when you need to verify that code changes followed a model, architecture, and implementation contract.
---

# Workflow Check

## Overview

Compare the implementation with the sketch that authorized it. This skill is a
lightweight acceptance gate for task-run artifacts: it reads the sketch,
build-log, and git diff, then reports whether the build stayed inside the
implementation contract.

The first version is intentionally practical. It uses file-path checks,
declared helper checks, forbidden-change scans, verification evidence, and
explicit deviations. It does not need a full AST checker to be useful.

## When to Use

- A slice was built from `.agent-runs/<run-id>/sketches/<slice-id>.yaml`.
- The user asks whether an implementation followed the sketch.
- A build phase reports deviations and needs acceptance review.
- A multi-file implementation should be checked before commit.

**When NOT to use:** changes that did not use a sketch artifact, or normal code
review that needs broad correctness, security, and maintainability feedback.
Use `workflow-review` for general review.

## The Operating Loop

1. Locate the run artifacts.
   - Read the relevant `sketches/<slice-id>.yaml`.
   - Read `build-log.md` when present.
   - Inspect `git diff --name-only` and the relevant diff.
2. Check scope.
   - Compare changed files with `architecture.target_files`.
   - Flag any file outside the target list unless `build-log.md` records an
     accepted deviation.
3. Check helper budget.
   - Compare newly introduced helpers, abstractions, or files with
     `implementation_contract.helper_budget`.
   - Flag undeclared helpers and forbidden abstractions.
4. Check implementation contract.
   - Confirm allowed changes match the diff at a high level.
   - Scan for forbidden changes named in the sketch.
   - Confirm deviations are explicit.
5. Check verification evidence.
   - Compare `implementation_contract.verification` with commands or checks in
     `build-log.md`.
   - Mark missing checks as failed or blocked with the stated reason.
6. Write the result.
   - Write `.agent-runs/<run-id>/check-result.json` using
     `references/check-result-template.json`.
   - Report pass/fail, findings, blocked checks, and next actions.

## Decision Points

- If no sketch exists, stop and report that this check cannot prove contract
  adherence.
- If the diff contains unrelated files, fail the check even if the code looks
  plausible.
- If verification did not run because tooling is missing, mark that check
  `blocked`, not `passed`.
- If a deviation is useful but unapproved, fail with a recommendation to update
  the sketch or split a new slice.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The code seems correct, so the sketch does not matter." | This skill checks process adherence and scope discipline, not only correctness. |
| "The build-log says it followed the sketch." | The diff must still be inspected against target files, helper budget, and forbidden changes. |
| "A missing test is fine because compile passed." | Verification must match the sketch or be recorded as blocked. |
| "The extra file is small." | Extra files are scope deviations unless the sketch or human approved them. |

## Red Flags

- `check-result.json` says pass while changed files are outside target files.
- Missing verification is reported as success.
- The helper budget is ignored because helpers are hard to detect.
- Deviations are explained only in the final chat response, not in the run
  artifact.
- The check rewrites the implementation instead of reporting findings.

## Verification

- [ ] The sketch artifact was read.
- [ ] Changed files were compared with `architecture.target_files`.
- [ ] Helper additions were compared with `helper_budget`.
- [ ] Forbidden changes were scanned.
- [ ] Verification evidence was checked.
- [ ] `.agent-runs/<run-id>/check-result.json` was written.

## Output Format

Report:

```text
## Check Result
## Scope
## Helper Budget
## Contract Findings
## Verification
## Next Actions
```

## Guardrails

- Do not modify business code while checking.
- Do not mark a check passed without reading both the sketch and the diff.
- Do not treat `.agent-runs/` as commit-worthy output unless the human asks.
- Do not hide unapproved deviations in prose; write them to
  `check-result.json`.
- Do not replace `workflow-review`; use this for sketch adherence only.

## References

- `references/check-result-template.json`
  Minimal JSON result structure for sketch adherence checks.
