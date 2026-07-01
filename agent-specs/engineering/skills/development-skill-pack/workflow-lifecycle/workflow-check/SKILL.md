---
name: workflow-check
description: v0.1.1 - Checks an implementation slice against its task-run sketch contract. Use after workflow-build when a slice used .agent-runs artifacts, when a build reports deviations, when a risky multi-file slice needs adherence verification before commit, or when you need to distinguish sketch adherence from broad code review.
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

This is not a general code review. A slice can pass `workflow-check` because it
followed the sketch and still need `workflow-review` for correctness,
maintainability, security, performance, or product risks.

## When to Use

- A slice was built from `.agent-runs/<run-id>/sketches/<slice-id>.yaml`.
- The user asks whether an implementation followed the sketch.
- A build phase reports deviations and needs acceptance review.
- A multi-file implementation should be checked before commit.

**When NOT to use:** changes that did not use a sketch artifact, or normal code
review that needs broad correctness, security, and maintainability feedback.
Use `workflow-review` for general review.

## The Check Process

### Step 1: Locate the Run and Slice

Identify the exact run and slice under review:

- Read `.agent-runs/<run-id>/plan.yaml` when present to confirm the slice
  belongs to the recorded plan.
- Read `.agent-runs/<run-id>/sketches/<slice-id>.yaml`.
- Read `.agent-runs/<run-id>/build-log.md` when present.
- If the run or slice is ambiguous, stop and ask for the run_id and slice_id.

Do not invent a sketch from memory or from the final code. The sketch is the
contract being checked.

### Step 2: Establish the Diff Under Review

Inspect the implementation diff before judging it:

```text
git status --short
git diff --name-only
git diff
```

Use the current unstaged diff by default. If the user explicitly asks to check
staged changes, use:

```text
git diff --cached --name-only
git diff --cached
```

Record which diff basis was checked in `check-result.json`. If the working tree
contains unrelated changes, either narrow the diff basis or fail the scope
check for unrelated files.

### Step 3: Check File Scope

Compare changed files with `architecture.target_files` from the sketch:

- Files inside `architecture.target_files` are in scope.
- Files outside `architecture.target_files` are deviations.
- A deviation can be accepted only when the sketch was updated before build or
  the human explicitly approved it and the build log records that approval.

If the diff includes `.agent-runs/` artifacts, ignore those for business-code
scope but verify they are not staged for commit unless the human explicitly
asks to commit task-run artifacts.

### Step 4: Check Helper Budget

Compare new helpers, utility files, abstractions, wrappers, adapters, facades,
or compatibility layers with `implementation_contract.helper_budget`:

- Anything listed in `helper_budget.allowed` is allowed only for the stated
  reason.
- Anything listed in `helper_budget.forbidden` is a failure if present.
- A new helper not listed in `allowed` is a failure unless the build log records
  an approved sketch update.

This check is deliberately conservative. If helper detection is uncertain,
report a finding instead of silently passing.

### Step 5: Check the Implementation Contract

Compare the diff against `implementation_contract`:

- Confirm every meaningful change fits `allowed_changes`.
- Scan for named `forbidden_changes`.
- Confirm the implementation did not expand the slice into adjacent behavior.
- Confirm open questions from the sketch were resolved before implementation
  if they affected target files, ownership, or verification.
- Confirm deviations are recorded in `build-log.md`, not only explained in
  chat.

This is a contract check, not a style review. Do not rewrite code while
checking.

### Step 6: Check Verification Evidence

Compare `implementation_contract.verification` with build evidence:

- Commands or manual checks listed in the sketch should appear in
  `build-log.md` or in the current session evidence.
- A check that ran and passed is `pass`.
- A check that did not run is `fail` unless there is a concrete environment or
  tooling blocker.
- A check blocked by missing tooling, missing credentials, external service
  downtime, or unavailable dependency is `blocked`, not `pass`.

Do not replace a required test with an easier command unless the sketch or
human approved that substitution.

### Step 7: Decide the Result

Use this result rule:

- `pass`: scope, helper budget, implementation contract, and verification all
  pass; no unapproved deviations remain.
- `fail`: the diff violates scope, helper budget, forbidden changes,
  verification, or deviation rules.
- `blocked`: required artifacts or evidence are missing in a way that prevents
  a meaningful check, and the blocker is outside the checker itself.

A partial pass is a failure with findings. Do not mark the overall result
`pass` when any required section is `fail` or `blocked`.

### Step 8: Write the Result Artifact

Write:

```text
.agent-runs/<run-id>/check-result.json
```

Follow `references/check-result-template.json` and include:

- `result`
- `sketch_path`
- `build_log_path`
- `changed_files`
- `scope`
- `helper_budget`
- `contract_findings`
- `verification`
- `deviations`
- `next_actions`

Then report the result to the user. The chat response should summarize the
artifact, not replace it.

## Check Result Template

```json
{
  "schema_version": "0.1",
  "run_id": "<yyyymmdd-hhmmss-topic>",
  "slice_id": "<slice-id>",
  "result": "pass | fail | blocked",
  "sketch_path": ".agent-runs/<run-id>/sketches/<slice-id>.yaml",
  "build_log_path": ".agent-runs/<run-id>/build-log.md",
  "changed_files": [],
  "scope": {
    "target_files": [],
    "out_of_scope_files": [],
    "status": "pass | fail | blocked"
  },
  "helper_budget": {
    "allowed_helpers": [],
    "helpers_found": [],
    "undeclared_helpers": [],
    "forbidden_helpers_found": [],
    "status": "pass | fail | blocked"
  },
  "contract_findings": [],
  "verification": {
    "expected": [],
    "run": [],
    "missing": [],
    "blocked": [],
    "status": "pass | fail | blocked"
  },
  "deviations": [],
  "next_actions": []
}
```

Keep findings specific enough that `workflow-build` can repair the slice
without reinterpreting the whole feature.

## Check vs Review

Use `workflow-check` for adherence:

- Did the build follow the sketch?
- Were changed files inside the allowed target files?
- Were helpers within the helper budget?
- Were forbidden changes avoided?
- Were required checks run or honestly blocked?

Use `workflow-review` for engineering judgment:

- Is the implementation correct?
- Are there hidden bugs or regressions?
- Is the design maintainable?
- Are security, accessibility, performance, or product risks present?
- Are tests sufficient for the behavior?

## Decision Points

- If no sketch exists, stop and report that this check cannot prove contract
  adherence.
- If no build log exists, continue only when the diff and session evidence are
  enough to check; otherwise mark missing evidence as `blocked`.
- If the diff contains unrelated files, fail the check even if the code looks
  plausible.
- If verification did not run because tooling is missing, mark that check
  `blocked`, not `passed`.
- If a deviation is useful but unapproved, fail with a recommendation to update
  the sketch or split a new slice.
- If the diff basis is unclear because staged and unstaged changes differ,
  ask which basis to check before writing the result.
- If the check finds broad quality concerns outside sketch adherence, mention
  them as a reason to run `workflow-review`, not as a substitute check result.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The code seems correct, so the sketch does not matter." | This skill checks process adherence and scope discipline, not only correctness. |
| "The build-log says it followed the sketch." | The diff must still be inspected against target files, helper budget, and forbidden changes. |
| "A missing test is fine because compile passed." | Verification must match the sketch or be recorded as blocked. |
| "The extra file is small." | Extra files are scope deviations unless the sketch or human approved them. |
| "The check can also fix the code." | Checking reports adherence; fixing belongs to `workflow-build` or a follow-up edit. |
| "Review and check are basically the same." | Check verifies the sketch contract; review evaluates broader code quality and behavior. |
| "A chat summary is enough." | The task-run result must be written to `check-result.json` when a sketch artifact was used. |

## Red Flags

- `check-result.json` says pass while changed files are outside target files.
- Missing verification is reported as success.
- The helper budget is ignored because helpers are hard to detect.
- Deviations are explained only in the final chat response, not in the run
  artifact.
- The check rewrites the implementation instead of reporting findings.
- The checker uses a newly generated sketch instead of the original pre-build
  sketch.
- The checker marks `blocked` to avoid a clear fail.
- The output gives broad style review comments but never answers whether the
  sketch was followed.

## Verification

- [ ] The sketch artifact was read.
- [ ] The diff basis was stated.
- [ ] Changed files were compared with `architecture.target_files`.
- [ ] Helper additions were compared with `helper_budget`.
- [ ] Forbidden changes were scanned.
- [ ] Verification evidence was checked.
- [ ] `.agent-runs/<run-id>/check-result.json` was written.
- [ ] No business code was modified while checking.

## Output Format

Report:

```text
## Check Result
- result:
- artifact:

## Scope
- status:
- out_of_scope_files:

## Helper Budget
- status:
- undeclared_helpers:
- forbidden_helpers_found:

## Contract Findings
- status:
- findings:

## Verification
- status:
- missing:
- blocked:

## Next Actions
- none | <repair, sketch update, review, or blocker resolution>
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
