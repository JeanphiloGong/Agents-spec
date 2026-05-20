---
name: reference-core-impl-skill
description: v0.1.6 - Distill a feature or system core through a step-verified runnable reference cycle before `main` integration. Use when production code or an AI draft is too noisy to learn from safely. Use when a human needs a minimal-complete sample that preserves the real invariants before landing with `human-led-main-landing-skill`.
---

# Reference Core Implementation Skill

## Overview

Build a runnable minimal-complete reference sample that exposes the real core of
a feature before production constraints are added back. The sample is a learning
and design artifact: small enough to rederive by hand, strict enough to fail
when a defining invariant is broken, and mapped back to the production codebase
so the learning transfers.

This skill is not a shortcut to production edits. Use it to understand the
core, then hand off to `human-led-main-landing-skill` for controlled
integration on `main`.

## When to Use

- Production code or an AI draft is too noisy to learn from directly.
- The human wants to reimplement the core logic by hand after understanding it
  once.
- The feature is centered on a core loop, state machine, scheduler, cache,
  graph runner, editor loop, or other architecture-heavy flow.
- A team needs a small runnable reference artifact before adding production
  constraints back in.
- The next safe step is proving one invariant in isolation, not modifying
  production modules.

**When NOT to use:** polishing sample code into production-ready code, copying a
full production module into a smaller folder, producing final integration
patches, or replacing `human-led-main-landing-skill` for `main` landing.

## The Reference Core Operating Loop

Build the sample as a proof loop, not as a review report. Do not advance past a
step until its verification condition is satisfied or the gap is named as an
open risk.

1. Identify Core
   - State the feature or system slice and the user-visible or core-visible
     success condition.
   - Mark each required input as `provided`, `inferred`, or `missing`.
   - Name the defining invariant, ordering rule, or state transition.
   - Verify: one core invariant is explicit and no missing input would make the
     sample misleading or unsafe.
2. Strip Production Boundaries
   - Separate what stays in the reference from what belongs only in production.
   - Replace storage, network, framework, auth, logging, and rollout concerns
     with fakes or deferred notes unless they define the core behavior.
   - Verify: `Included In Reference` and `Deferred To Production` are concrete
     and non-overlapping.
3. Choose Sample Shape
   - Pick the smallest runtime model that preserves the invariant.
   - Prefer one file and in-memory state unless another file materially improves
     teachability.
   - Resolve placement as persisted under
     `examples/reference-core/<feature-slug>/` or explicitly ephemeral.
   - Verify: the planned sample fits the file and line budget and has a safe
     production-import barrier.
4. Build Runnable Sample
   - Produce the minimal-complete sample with real domain names and only the
     helpers needed to reveal the core flow.
   - Add a colocated `README.md` from the template when persisting the sample.
   - Verify: a happy-path command or inline test runs one meaningful
     end-to-end path.
5. Prove Boundary
   - Add one boundary, failure, or invariant-breaking example.
   - State what the sample proves and what it does not prove.
   - Verify: the boundary or failure check is executable or directly testable
     and fails visibly if the defining invariant is broken.
6. Map Back
   - Name the production modules, boundaries, adapters, and tests that should
     receive the learned core next.
   - Identify which production constraints must be reintroduced first.
   - Verify: another engineer can find the target production files and first
     landing test without reopening the sample design discussion.
7. Handoff
   - Recommend `human-led-main-landing-skill` for integrating the learned core,
     or one more reference iteration when the sample still hides the invariant.
   - Verify: the next human rewrite step is a concrete action, not a generic
     "continue implementation" instruction.

## Decision Points

- If the defining invariant is unknown, infer it from code or context only when
  evidence is strong; otherwise ask before drafting the sample.
- If production boundaries are themselves the core behavior, keep the smallest
  faithful version of that boundary in the sample and explain why.
- If a sample cannot be runnable without hiding the invariant, state the blocker
  and produce a design-only draft with an explicit follow-up validation step.
- If persistence in the target project is unsafe or unclear, make the sample
  ephemeral and state what confirmation is needed before writing files.
- If the reference sample reveals a mismatch with production assumptions, stop
  and hand off through `human-led-main-landing-skill` rather than patching
  production directly.

## What Counts as Minimal Complete

A reference sample is acceptable only if all of these are true:

1. It can execute one meaningful end-to-end path.
2. It preserves the feature's defining invariants or state transitions.
3. It uses small fake or in-memory boundaries instead of production
   infrastructure unless the boundary itself is core behavior.
4. It includes at least one happy path and one important failure or boundary
   check.
5. It explicitly lists deferred production constraints.
6. It is small enough that a human could plausibly retype or rederive it in one
   focused sitting.

If any of these are missing, the sample is either incomplete or too abstract.

## Reference Map

- `references/what-counts-as-minimal-complete.md`
  Read when the line budget or boundary feels contested and you need to recheck
  what must survive compression.
- `references/project-placement-policy.md`
  Read when project placement is unclear or the sample might accidentally land
  in a production-imported path.
- `references/mapping-back-to-main-checklist.md`
  Read before finalizing the mapping section so the handoff back to production
  modules stays concrete.
- `references/worked-example-mini-langgraph.md`
  Read when the feature is graph-runner, orchestration, or scheduler shaped.
- `references/worked-example-mini-viim.md`
  Read when the feature is editor-loop, command-dispatch, or state-machine
  shaped.
- `assets/reference-core-readme-template.md`
  Read when the sample will persist in the target project repository and needs a
  colocated `README.md`.

## Minimal Sample Design Rules

- Keep the sample runnable by default.
- Prefer one file unless multiple files materially improve clarity.
- Inline only the helpers needed to reveal the core flow.
- Use real names for the real concepts; do not rename away the domain just to
  make the sample feel generic.
- Replace non-core dependencies with the smallest faithful substitute.
- Preserve failure modes that define the design.

## Project Placement Policy

By default, persist the reference sample in the target project repository, not
in the skill repository and not inside the main production runtime tree.

Default placement:
- `examples/reference-core/<feature-slug>/`

Allowed alternatives when they fit better:
- `docs/reference-core/<feature-slug>/` for documentation-first samples that
  are still useful to read and lightly run.
- `playground/reference-core/<feature-slug>/` for operator-owned or
  intentionally non-supported experiments.

Avoid by default:
- `app/`
- `src/`
- `pkg/`
- `internal/`
- any directory that production code imports by default

Every persisted sample must include the sample code, a colocated `README.md`,
an included-vs-deferred note, and a mapping back to production modules. If the
sample is intentionally ephemeral, state that explicitly and explain why.

## Reference-vs-Production Split

Always separate these two lists.

Included in reference:
- invariants and ordering rules
- state transitions
- decision points
- essential data model
- the smallest meaningful public surface

Deferred to production:
- persistence/database wiring
- network/RPC/http transport
- logging/metrics/tracing policy
- auth/permissions when not central to the core
- rollout flags, retries, rate limits, and config layering unless they define
  the core algorithm

## Required Inputs

- feature or system name
- one-sentence core behavior goal
- non-negotiable invariants or constraints
- optional current AI draft path or production file paths
- optional target project repository path or project root
- optional preferred size budget
- optional preferred language/runtime for the sample

If the feature name, core behavior goal, or defining invariant is missing, ask
for it before drafting the sample unless repository context makes the answer
explicit.

## Fixed Defaults

- `mode=reference-core`
- `artifact_type=minimal-complete-sample`
- `line_budget=150-500`
- `file_budget=1-4`
- `dependency_policy=stdlib-or-existing-lightweight-deps`
- `runtime_policy=in-memory-first`
- `validation_policy=example-first`
- `mapping_back_to_main=required`
- `sample_repository_policy=target-project-repo-preferred`
- `sample_path_policy=examples/reference-core/<feature-slug>`
- `sample_readme=required`
- `production_import_barrier=required`
- `output_style=tutorial-plus-code`
- `agent_mode=single-default|multi-by-explicit-request`

## Output Format

```text
## Core Slice
## Assumptions / Missing Inputs
## Included In Reference
## Deferred To Production
## Suggested Project Placement
## Runnable Sample
## Reference README Outline
## Validation
## Mapping Back To Main
## Next Landing Step
## Open Risks / Unknowns
```

## Output Contract

Every non-trivial run must make these items explicit:

- whether each required input was provided, inferred, or still missing
- the defining invariant, ordering rule, or state transition
- one happy-path validation command or test
- one important failure or boundary validation
- one sentence on what the sample proves
- one sentence on what the sample does not prove
- concrete deferred production constraints
- exact production modules or boundaries that the sample maps back to next
- the next human rewrite or landing step

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "A small code snippet is enough." | A reference core must run one meaningful path and prove one boundary. |
| "The production module can just be copied and trimmed." | Copying preserves incidental complexity and hides the real invariant. |
| "We can skip the failure case to stay small." | Without a boundary check, the sample may not protect the defining behavior. |
| "Mapping back can wait until landing." | The sample only transfers value when production targets and first tests are named. |
| "Putting it under `src/` is convenient." | Reference samples should not be production-importable by default. |

## Red Flags

- The sample has no named invariant, ordering rule, or state transition.
- The sample cannot be run or manually executed through one meaningful path.
- The sample contains production adapters, rollout logic, or framework ceremony
  that is not core behavior.
- Included and deferred constraints overlap or stay vague.
- The sample has no boundary or failure check.
- The output claims the sample is production-ready or the source of truth for
  `main`.
- The mapping back names no production files, modules, tests, or landing step.
- A persisted sample has no colocated README or placement rationale.

## Verification

Before finishing, confirm:

- [ ] One runnable example or smoke command is present.
- [ ] One boundary or failure example is present.
- [ ] The defining invariant, ordering rule, or state transition is explicit.
- [ ] The output states what the sample proves.
- [ ] The output states what the sample does not prove.
- [ ] Included and deferred production constraints are concrete and separate.
- [ ] Suggested placement avoids production runtime directories by default.
- [ ] Mapping back names concrete production modules, boundaries, or tests.
- [ ] The next landing step points to `human-led-main-landing-skill` or one
      more reference iteration.

## Skill Maintenance Mode

This section applies only when improving the skill package itself. It does not
apply to ordinary reference-sample generation.

- Default: off.
- Enable only with an explicit signal such as `reinforcement=on`.
- If enabled, keep the change to one failure mode and validate audit records
  with `python scripts/validate_reinforcement_audit.py references/reinforcement-audit.jsonl`.

## Guardrails

- Do not treat the reference sample as production-ready by default.
- Do not omit a defining invariant just to hit a line budget.
- Do not bloat the sample with production adapters or framework ceremony.
- Do not output an un-runnable skeleton when a runnable sample is feasible.
- Do not hide deferred constraints; list them explicitly.
- Do not claim the sample is the source of truth for `main`.
- Do not skip the mapping back to production modules.
- Do not place persisted samples under production runtime directories by
  default.
- Do not leave a persisted sample without a colocated `README.md`.
