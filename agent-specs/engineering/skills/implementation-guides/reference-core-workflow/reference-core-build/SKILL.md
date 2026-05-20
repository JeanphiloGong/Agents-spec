---
name: reference-core-build
description: v0.1.0 - Build a runnable minimal-complete reference sample from a reference-core plan or explicit core inputs. Use when turning a noisy production feature, AI draft, core invariant, included/deferred boundary, placement, and validation plan into an executable sample artifact.
---

# Reference Core Build

## Overview

Turn a reference-core plan into a runnable minimal-complete sample. The sample
must preserve the defining invariant, replace non-core production boundaries
with small fakes, include one happy path and one boundary or failure check, and
stay outside production-imported paths by default.

Use this skill when code should be written as a learning and design artifact,
not as a production patch.

## When to Use

- A `reference-core-plan` output is ready to implement.
- The human provides enough explicit core inputs to build without a separate
  planning pass.
- The human wants a runnable reference artifact before production landing.
- The sample needs explicit happy-path and boundary validation.
- Production code is too noisy, but the core invariant is known.

**When NOT to use:** planning the sample, reviewing a completed sample,
mapping a sample back to production, tutorial-only writing, or production
integration edits.

## The Build Loop

```text
Implement sample -> Run happy path -> Add boundary check -> Freeze sample
```

1. Load the Plan
   - Read core slice, invariant, included/deferred lists, placement, and
     validation plan.
   - If no formal plan exists, reconstruct only the missing build inputs:
     core behavior goal, invariant, included/deferred boundary, safe placement,
     happy path, and boundary or failure check.
   - Verify: no missing input would change the code shape.
2. Create Safe Placement
   - Use the planned path, defaulting to
     `examples/reference-core/<feature-slug>/`.
   - Add a colocated README when persisting the sample.
   - Verify: the sample is outside production-imported paths.
3. Implement Minimal Core
   - Write only the state, transitions, helpers, and fakes needed to expose the
     invariant.
   - Use real domain names for real concepts.
   - Verify: the sample stays inside the planned file and dependency budget.
4. Run Happy Path
   - Add or run the planned happy-path command, inline test, or script.
   - Verify: one meaningful end-to-end path executes.
5. Add Boundary or Failure Check
   - Add the planned invariant-breaking, boundary, or failure case.
   - Verify: the check fails visibly if the defining invariant breaks.
6. Freeze the Sample
   - State what the sample proves, what it does not prove, and which
     production constraints remain deferred.
   - Verify: `reference-core-review` can assess the artifact without reopening
     the planning discussion.

## Reference Map

- `references/what-counts-as-minimal-complete.md`
  Read when the line budget or boundary feels contested and you need to recheck
  what must survive compression.
- `references/project-placement-policy.md`
  Read when project placement is unclear or the sample might accidentally land
  in a production-imported path.
- `references/worked-example-mini-langgraph.md`
  Read when the feature is graph-runner, orchestration, or scheduler shaped.
- `references/worked-example-mini-viim.md`
  Read when the feature is editor-loop, command-dispatch, or state-machine
  shaped.
- `assets/reference-core-readme-template.md`
  Read when the sample will persist in the target project repository and needs a
  colocated `README.md`.

## Fixed Defaults

- `mode=reference-core-build`
- `artifact_type=minimal-complete-sample`
- `line_budget=150-500`
- `file_budget=1-4`
- `dependency_policy=stdlib-or-existing-lightweight-deps`
- `runtime_policy=in-memory-first`
- `validation_policy=example-first`
- `sample_repository_policy=target-project-repo-preferred`
- `sample_path_policy=examples/reference-core/<feature-slug>`
- `sample_readme=required`
- `production_import_barrier=required`

## Decision Points

- If the plan lacks a defining invariant, return to `reference-core-plan`.
- If the sample cannot be runnable without hiding the invariant, stop and
  produce a design-only blocker with the missing validation step.
- If production placement is unsafe, keep the sample ephemeral and ask before
  writing files.
- If map-back is now needed, hand off to `reference-core-map-back`.

## Output Format

```markdown
## Built Sample
- path:
- files:
- run_command:

## Included In Reference
- ...

## Deferred To Production
- ...

## Validation
- happy_path:
- boundary_or_failure_check:

## What This Proves
- ...

## What This Does Not Prove
- ...

## Next Step
- review_with: reference-core-review
- map_back_with: reference-core-map-back
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "A non-runnable sketch is enough." | A reference core must execute one meaningful path unless a blocker is explicit. |
| "The fastest sample is copied production code." | Copying keeps incidental production complexity and weakens the invariant proof. |
| "The failure check can wait." | Without a boundary check, the sample may not protect the defining behavior. |

## Red Flags

- No run command or inline executable check exists.
- The sample imports production modules by default.
- Production concerns appear despite being deferred.
- The sample lacks a boundary or failure check.
- Helpers exist without preserving the invariant.

## Verification

- [ ] The sample path is safe or explicitly ephemeral.
- [ ] The sample runs one meaningful happy path.
- [ ] A boundary or failure check is executable or directly testable.
- [ ] Included and deferred concerns match the plan.
- [ ] The sample states what it proves and does not prove.
- [ ] A persisted sample has a colocated README or an explicit exception.
- [ ] No production patch was written.

## Skill Maintenance Mode

This section applies only when improving the skill package itself. It does not
apply to ordinary reference-sample generation.

- Default: off.
- Enable only with an explicit signal such as `reinforcement=on`.
- If enabled, keep the change to one failure mode and validate audit records
  with `python scripts/validate_reinforcement_audit.py references/reinforcement-audit.jsonl`.

## Guardrails

- Do not build production integration code.
- Do not copy and trim a full production module.
- Do not omit the boundary or failure check to stay small.
- Do not place the sample inside production-imported paths by default.
- Do not leave a persisted sample without a colocated `README.md`.
