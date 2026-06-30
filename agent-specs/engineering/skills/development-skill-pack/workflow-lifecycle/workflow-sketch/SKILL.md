---
name: workflow-sketch
description: v0.1.1 - Creates a code-before-build sketch artifact for one implementation slice. Use when a planned slice needs an explicit model, architecture, invariants, helper budget, and implementation contract before code changes, when a previous build drifted, or before workflow-build on non-trivial or multi-file changes.
---

# Workflow Sketch

## Overview

Create a task-run sketch before implementation. The sketch is an external work
artifact that captures how the agent understands the feature, where
responsibility belongs, and what changes are allowed. It is not code
scaffolding and it is not implementation.

The goal is to make the agent's implementation model reviewable before code is
written, then give `workflow-build` a concrete contract to follow.

The sketch is the missing thinking layer between `workflow-plan` and code:
`workflow-plan` names the slice, `workflow-sketch` explains how the slice should
work, and `workflow-build` implements inside that contract.

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

## The Sketching Process

### Step 1: Locate the Task Run and Slice

Identify exactly which planned slice is being sketched:

- Reuse the current `.agent-runs/<run-id>/` when the user or recorded plan
  provides one.
- Read `.agent-runs/<run-id>/plan.yaml` when present.
- Select one `slice_id`; do not sketch multiple implementation slices in one
  artifact.
- If no run exists and implementation is expected, ask for
  `workflow-plan-record` to record the approved plan before sketching.

Do not create or rewrite `plan.yaml`. Plan recording belongs to
`workflow-plan-record`.

### Step 2: Read the Source Plan Slice

Extract the slice boundary from the recorded plan:

- `goal`: the one-sentence slice outcome
- `scope`: what is in and out for this task run
- `target_areas`: the modules or subsystems the plan expects
- `depends_on`: earlier slices that must already be true
- `verify`: checks the plan expects later build/check steps to run

If the plan slice is too vague to identify a concrete outcome, target files,
or verification, stop and ask to refine the plan instead of inventing details
inside the sketch.

### Step 3: Inspect Only Relevant Code

Read code to discover existing ownership and data flow:

- Find current owners for the state, behavior, route, model, service, or UI
  surface touched by the slice.
- Inspect nearby tests and existing helpers.
- Prefer existing patterns and local abstractions.
- Do not edit business code while sketching.

The output should reflect code reality, not a generic architecture pattern.

### Step 4: Write the Model Section

Fill `model` with how the slice should work:

- `current_system`: existing flow, owner, state, or contract relevant to this
  slice.
- `feature_model`: the intended behavior for this slice, not the whole feature.
- `domain_states`: named states and their meaning when state or lifecycle
  matters.
- `invariants`: conditions implementation must preserve.
- `open_questions`: unresolved questions that could change target files,
  ownership, or verification.

If an open question would materially change implementation, stop after writing
the question and ask the human before build.

### Step 5: Write the Architecture Section

Fill `architecture` with where responsibility belongs:

- `target_files`: concrete file paths, not broad areas.
- `ownership`: which existing module, type, function, or component owns each
  responsibility.
- `data_flow`: ordered runtime or persistence flow for this slice.
- `rejected_options`: tempting approaches that should not be used and why.
- `risk_points`: where build is likely to drift, over-abstract, or regress.

Target files are a contract. `workflow-build` should treat files outside this
list as deviations unless the sketch is updated or the human approves.

### Step 6: Write the Implementation Contract

Fill `implementation_contract` with build boundaries:

- `allowed_changes`: specific changes allowed in this slice.
- `forbidden_changes`: specific changes that must not happen now.
- `helper_budget.allowed`: helpers or abstractions allowed by name and reason,
  or `none`.
- `helper_budget.forbidden`: helper types, wrappers, adapters, compatibility
  layers, or abstractions that would expand scope.
- `verification`: commands, tests, static checks, or manual checks expected
  after build.
- `expected_build_log`: fields build must report after implementation.

If the sketch allows a new helper, explain why existing ownership is not enough.
Otherwise, explicitly forbid new abstractions.

### Step 7: Write One Sketch Artifact

Write:

```text
.agent-runs/<run-id>/sketches/<slice-id>.yaml
```

Follow `references/sketch-template.yaml`. Keep it compact enough to be checked,
but concrete enough that another build pass could implement from it without
guessing.

### Step 8: Verify the Sketch Before Build

Before reporting success:

- Confirm the sketch has exactly one slice.
- Confirm `target_files` are concrete paths.
- Confirm model states and invariants are specific to the slice.
- Confirm allowed and forbidden changes are both present.
- Confirm `helper_budget` names allowed helpers or says `none`.
- Confirm verification is executable or names a blocker.
- Confirm no business code was modified.

## Sketch Template

```yaml
schema_version: 0.1
run_id: "<yyyymmdd-hhmmss-topic>"
slice_id: "<slice-id>"
goal: "<one sentence outcome for this slice>"

model:
  current_system:
    - "<existing owner, flow, or contract relevant to this slice>"
  feature_model:
    - "<how this feature should behave in this slice>"
  domain_states:
    - "<state-name>: <meaning>"
  invariants:
    - "<condition the implementation must preserve>"
  open_questions:
    - "<question that would change implementation, or 'none'>"

architecture:
  target_files:
    - "<path/to/file>"
  ownership:
    - "<which existing module/type/function should own which responsibility>"
  data_flow:
    - "<step in the intended runtime or persistence flow>"
  rejected_options:
    - "<approach that should not be used and why>"
  risk_points:
    - "<where the implementation is likely to drift or regress>"

implementation_contract:
  allowed_changes:
    - "<specific kind of change allowed in this slice>"
  forbidden_changes:
    - "<specific kind of change not allowed in this slice>"
  helper_budget:
    allowed:
      - "<helper name and reason, or 'none'>"
    forbidden:
      - "<helper or abstraction class not allowed>"
  verification:
    - "<command, test, static check, or manual check>"
  expected_build_log:
    - "used_sketch"
    - "files_changed"
    - "helpers_added"
    - "checks_run"
    - "deviations"
    - "cleanup_done"
```

The template is not optional prose. It is the contract consumed by
`workflow-build` and checked by `workflow-check`.

## Decision Points

- If the plan slice is too broad, split the slice in the sketch and mark the
  original as too large for one build pass.
- If the run has no recorded plan and implementation is expected, ask for
  `workflow-plan-record`; do not backfill `plan.yaml`.
- If target ownership is unclear after reading the code, record the competing
  owners and ask before implementation.
- If the sketch requires a new abstraction, put it in `helper_budget.allowed`
  with the reason; otherwise forbid new abstractions explicitly.
- If a required verification command is unavailable, keep the check in the
  sketch and let build/check report the environment blocker.
- If target files would exceed the plan scope, stop and ask whether to update
  the plan or split the slice.
- If the sketch reveals an architecture decision that belongs in durable
  project docs, note it for later promotion; do not put released documentation
  into `.agent-runs/`.

## Sketching Examples

Good sequence:

```text
$workflow-plan
  -> full human-readable implementation plan

$workflow-plan-record
  -> .agent-runs/<run-id>/plan.yaml

$workflow-sketch <slice-id>
  -> .agent-runs/<run-id>/sketches/<slice-id>.yaml

$workflow-build <slice-id>
  -> implementation constrained by the sketch
```

Bad sequence:

```text
$workflow-sketch
  -> write a broad implementation plan
  -> change code while deciding ownership
  -> fill target_files after the code already changed
```

The bad sequence turns the sketch into a retroactive explanation. A sketch must
exist before build so the implementation can be checked against it.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I can just implement and explain afterward." | The point is to externalize the implementation model before code can drift. |
| "Comments in the code are enough." | Code comments are implementation. The sketch is an external contract that can be reviewed before edits. |
| "The plan already has tasks." | A plan names slices. A sketch explains the model, ownership, invariants, and allowed implementation shape for one slice. |
| "I can create the missing plan.yaml here." | Recording a plan is owned by `workflow-plan-record`; sketching should not invent or backfill the plan artifact. |
| "I'll keep the sketch short by omitting forbidden changes." | Forbidden changes are how the build phase avoids scope expansion. |
| "I'll list broad modules so build has flexibility." | Broad targets make check meaningless. Use concrete files or stop until ownership is known. |
| "Helper budget can be decided during build." | Helper budget is a pre-build constraint; otherwise abstractions appear by momentum. |
| "Open questions can stay implicit." | Questions that affect ownership, files, or verification must be surfaced before code edits. |

## Red Flags

- The sketch lists tasks but has no model, ownership, or invariants.
- `target_files` says broad areas instead of concrete file paths.
- `helper_budget` is missing or allows vague helpers.
- The sketch silently expands beyond the plan slice.
- Business code changed while producing the sketch.
- The sketch creates or rewrites `plan.yaml`.
- Open questions that affect implementation are buried instead of escalated.
- The sketch covers multiple slices or a whole feature.
- `allowed_changes` and `forbidden_changes` are generic opposites instead of
  slice-specific boundaries.
- `rejected_options` is empty even though previous attempts drifted.

## Verification

- [ ] `.agent-runs/<run-id>/sketches/<slice-id>.yaml` exists.
- [ ] The sketch has `model`, `architecture`, and
      `implementation_contract`.
- [ ] `architecture.target_files` uses concrete paths.
- [ ] `model.invariants` and `architecture.risk_points` are concrete.
- [ ] `implementation_contract.allowed_changes`,
      `forbidden_changes`, `helper_budget`, and `verification` are present.
- [ ] `helper_budget` explicitly allows named helpers or forbids new helpers.
- [ ] Open questions that affect implementation are resolved or escalated.
- [ ] No business code was modified while creating the sketch.

## Output Format

Report:

```text
## Sketch Artifact
- path:
- status: created | updated

## Slice
- run_id:
- slice_id:
- goal:

## Key Model
- current_system:
- feature_model:
- invariants:
- open_questions:

## Architecture Boundary
- target_files:
- ownership:
- rejected_options:
- risk_points:

## Implementation Contract
- allowed_changes:
- forbidden_changes:
- helper_budget:
- verification:

## Verification
- template_complete:
- target_files_concrete:
- business_code_modified:

## Blockers
- none | <blocker>
```

## Guardrails

- Do not implement code in this skill.
- Do not create compatibility layers unless the sketch explicitly justifies
  them and the human approves before build.
- Do not use `.agent-runs/` artifacts as released documentation.
- Do not store secrets, credentials, or private data in task-run artifacts.
- Do not let the sketch become a transcript dump; write the implementation
  model, not the conversation.
- Do not create or rewrite `plan.yaml`; use `workflow-plan-record` for that.

## References

- `references/sketch-template.yaml`
  Three-section task-run sketch template.
