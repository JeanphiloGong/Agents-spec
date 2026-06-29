---
name: workflow-sketch
description: v0.1.0 - Creates a code-before-thinking artifact for one implementation slice. Use when a planned slice needs an explicit model, architecture, and implementation contract before code changes. Use before workflow-build on non-trivial or multi-file changes.
---

# Workflow Sketch

## Overview

Create a task-run sketch before implementation. The sketch is an external work
artifact that captures how the agent understands the feature, where
responsibility belongs, and what changes are allowed. It is not code
scaffolding and it is not implementation.

The goal is to make the agent's implementation model reviewable before code is
written, then give `workflow-build` a concrete contract to follow.

## When to Use

- A planned slice touches more than one file.
- The implementation has non-obvious ownership, state, lifecycle, or
  invariants.
- A previous attempt drifted from the intended design.
- The human asks for a sketch, implementation model, external thinking space,
  or task-run artifact.
- `workflow-build` is about to implement from a `plan.yaml` slice.

**When NOT to use:** tiny single-line fixes, pure formatting changes, or
single-file edits where the model, ownership, and verification are already
obvious.

## The Operating Loop

1. Locate the task run.
   - Reuse the current `.agent-runs/<run-id>/` when the user or plan provides
     one.
   - If no run exists and implementation is expected, create a new run
     directory with `plan.yaml` or ask for the missing slice only when the
     target slice cannot be inferred.
2. Read the plan slice and relevant code.
   - Read `plan.yaml` when present.
   - Inspect only the files needed to understand ownership and data flow.
   - Do not edit business code.
3. Write one sketch for one slice.
   - Use `.agent-runs/<run-id>/sketches/<slice-id>.yaml`.
   - Follow the three-section structure from
     `references/sketch-template.yaml`: `model`, `architecture`, and
     `implementation_contract`.
4. Surface uncertainty before build.
   - Put unresolved design questions under `model.open_questions`.
   - If an answer would change target files, ownership, or verification, stop
     and ask the human instead of guessing.
5. Verify the sketch.
   - Confirm the target files are specific.
   - Confirm invariants and risk points are concrete.
   - Confirm allowed and forbidden changes are both present.
   - Confirm verification is executable or states a clear blocker.

## Decision Points

- If the plan slice is too broad, split the slice in the sketch and mark the
  original as too large for one build pass.
- If target ownership is unclear after reading the code, record the competing
  owners and ask before implementation.
- If the sketch requires a new abstraction, put it in `helper_budget.allowed`
  with the reason; otherwise forbid new abstractions explicitly.
- If a required verification command is unavailable, keep the check in the
  sketch and let build/check report the environment blocker.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I can just implement and explain afterward." | The point is to externalize the implementation model before code can drift. |
| "Comments in the code are enough." | Code comments are implementation. The sketch is an external contract that can be reviewed before edits. |
| "The plan already has tasks." | A plan names slices. A sketch explains the model, ownership, invariants, and allowed implementation shape for one slice. |
| "I'll keep the sketch short by omitting forbidden changes." | Forbidden changes are how the build phase avoids scope expansion. |

## Red Flags

- The sketch lists tasks but has no model, ownership, or invariants.
- `target_files` says broad areas instead of concrete file paths.
- `helper_budget` is missing or allows vague helpers.
- The sketch silently expands beyond the plan slice.
- Business code changed while producing the sketch.
- Open questions that affect implementation are buried instead of escalated.

## Verification

- [ ] `.agent-runs/<run-id>/sketches/<slice-id>.yaml` exists.
- [ ] The sketch has `model`, `architecture`, and
      `implementation_contract`.
- [ ] `architecture.target_files` uses concrete paths.
- [ ] `implementation_contract.allowed_changes`,
      `forbidden_changes`, `helper_budget`, and `verification` are present.
- [ ] No business code was modified while creating the sketch.

## Output Format

Report:

```text
## Sketch Artifact
## Slice
## Key Model
## Architecture Boundary
## Implementation Contract
## Verification
## Blockers
```

## Guardrails

- Do not implement code in this skill.
- Do not create compatibility layers unless the sketch explicitly justifies
  them and the human approves before build.
- Do not use `.agent-runs/` artifacts as released documentation.
- Do not store secrets, credentials, or private data in task-run artifacts.
- Do not let the sketch become a transcript dump; write the implementation
  model, not the conversation.

## References

- `references/sketch-template.yaml`
  Three-section task-run sketch template.
