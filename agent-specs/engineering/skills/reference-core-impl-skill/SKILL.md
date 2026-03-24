---
name: reference-core-impl-skill
description: v0.1.0 - Produce a runnable minimal-complete reference implementation for a feature or system core before main-project integration; use it to learn the core, reimplement it yourself, and map constraints back into production.
---

# Reference Core Implementation Skill

## Trigger and Scope

Use this skill when you want to understand or reimplement the core of a feature/system by first creating a runnable minimal-complete sample.

Primary fit:
- the production code or AI draft is too noisy to learn from directly
- the human wants to reimplement the core logic by hand after understanding it once
- the feature is centered on a core loop, state machine, scheduler, cache, graph runner, editor loop, or other architecture-heavy flow
- the team wants a small reference artifact before adding production constraints back in

In scope:
- extract the core loop or state transitions into a small runnable sample
- keep only the invariants that make the feature truly itself
- replace storage/network/framework boundaries with in-memory or fake adapters
- map the sample back to the production codebase afterward

Out of scope:
- polishing the sample into production-ready code
- copying the full production module into a "mini" folder with trivial deletions
- hiding real invariants just to stay within a line budget
- replacing `human-core-feature-wave-skill` for `main` landing and integration

## Core Purpose

- Shrink a feature to the smallest complete artifact that still teaches the real core.
- Give the human something they can reimplement end-to-end without framework noise.
- Preserve the invariants and state transitions that matter before adding production constraints back.
- Produce an explicit mapping from the sample to the real codebase so the learning transfers.

## Default Operating Model

- The sample is a teaching and design artifact, not the source of truth.
- The real codebase remains the integration target.
- The human should be able to run or test the sample without the production environment.
- The sample should be simple enough to rebuild by hand, but strict enough to fail if a core invariant is broken.

## Fixed Defaults

- `mode=reference-core`
- `artifact_type=minimal-complete-sample`
- `line_budget=150-500`
- `file_budget=1-4`
- `dependency_policy=stdlib-or-existing-lightweight-deps`
- `runtime_policy=in-memory-first`
- `validation_policy=example-first`
- `mapping_back_to_main=required`
- `output_style=tutorial-plus-code`
- `agent_mode=single|multi(optional)`

## Mode Selection

- Choose `reference-core` by default when the goal is a runnable minimal sample.
- Choose `reference-plus-map` when the output must include an explicit production mapping plan in the same response.
- Choose `compare-draft` when an AI draft or existing module already exists and the task is to distill its real core into a cleaner sample.

## What Counts as "Minimal Complete" (Required)

A reference sample is acceptable only if all of these are true:

1. It can execute one meaningful end-to-end path.
2. It preserves the feature's defining invariants or state transitions.
3. It uses small fake/in-memory boundaries instead of production infrastructure unless the boundary itself is core behavior.
4. It includes at least one happy path and one important failure/boundary check.
5. It explicitly lists deferred production constraints.
6. It is small enough that a human could plausibly retype or rederive it in one focused sitting.

If any of these are missing, the sample is either incomplete or too abstract.

## Workflow

1. State the system slice and the user-visible/core-visible success condition.
2. Separate core invariants from production constraints.
3. Define the smallest boundary that still preserves the real core.
4. Choose the minimum runtime model:
   - in-memory state
   - fake adapters
   - synchronous loop unless async behavior is itself core
5. Define the sample structure:
   - essential types/state
   - core loop or public entrypoints
   - essential helper contracts
6. Produce a runnable minimal-complete sample within the line/file budget.
7. Validate it with one happy path and one important failure or edge case.
8. List deferred constraints, adapters, and production-only policies.
9. Map the sample back to the real codebase:
   - which modules own the equivalent behavior
   - which abstractions must be reintroduced
   - which tests should be ported first
10. Recommend the next step:
   - use `human-core-feature-wave-skill` to land the learned core on `main`, or
   - iterate once more if the sample still hides the real invariant.

## Minimal Sample Design Rules (Required)

- Keep the sample runnable by default.
- Prefer one file unless multiple files materially improve clarity.
- Inline only the helpers needed to reveal the core flow.
- Use real names for the real concepts; do not rename away the domain just to make the sample feel generic.
- Replace non-core dependencies with the smallest faithful substitute.
- Preserve failure modes that define the design.

## Reference-vs-Production Split (Required)

Always separate these two lists:

### Included In Reference

- invariants and ordering rules
- state transitions
- decision points
- essential data model
- the smallest meaningful public surface

### Deferred To Production

- persistence/database wiring
- network/RPC/http transport
- logging/metrics/tracing policy
- auth/permissions when not central to the core
- rollout flags, retries, rate limits, and config layering unless they define the core algorithm

## Verification Hooks (Required)

The skill must require:
- one runnable example or smoke command
- one boundary or failure example
- one sentence explaining what the sample proves
- one sentence explaining what the sample does **not** prove

## Daily Workflow Position

Use this skill before `human-core-feature-wave-skill` when the feature's core is novel, architecture-heavy, or difficult to learn from the production code directly.

Recommended sequence:
1. `reference-core-impl-skill`
2. `human-core-feature-wave-skill`
3. `git-commit-skill`

## Required Inputs (Minimal)

- feature or system name
- one-sentence core behavior goal
- non-negotiable invariants or constraints
- optional current AI draft path or production file paths
- optional preferred size budget
- optional preferred language/runtime for the sample

## Defaults

- size budget: target `~400` lines, acceptable `150-500`
- language: same as production language when practical
- runtime: local in-memory sample
- validation: inline example or tiny tests
- sample location in response: code first, mapping second
- reference style: complete enough to run, small enough to rewrite manually

## Output Format

```
## Core Goal
## Minimal Boundary
## Minimal Complete Sample
## Included Invariants
## Deferred Constraints
## Validation
## Mapping Back To Main
## Next Human Rewrite Step
## Open Risks / Unknowns
```

## Worked Example References

- `references/what-counts-as-minimal-complete.md`
- `references/worked-example-mini-langgraph.md`
- `references/worked-example-mini-viim.md`
- `references/mapping-back-to-main-checklist.md`
- `references/acceptance-criteria.md`

## Iteration Loop (Required)

- Run acceptance review using `references/acceptance-criteria.md` and record pass/fail evidence.
- Capture the highest-impact gap in the sample (for example: invariant missing, runtime too noisy, boundary not faithful).
- Define one next-iteration change that makes the sample more teachable without making it production-heavy.
- Name the one verification step that proves the next iteration improved the sample.

## Reinforcement Plan (Required)

### Goals

- Improve first-pass usability of minimal-complete samples.
- Reduce recurring failure modes such as pseudo-samples, overgrown mini-projects, and missing production mappings.
- Promote worked examples that consistently help humans reimplement the core unaided.

### Operating Rules

- Reinforcement runs only when explicitly enabled.
- Each round must target one concrete failure mode in the skill.
- Each round must produce a small, auditable change set plus verification notes.

### Reinforcement Mode Gate

- Default: off.
- Enable only with an explicit signal such as `reinforcement=on`.
- Do not auto-enable because a single sample was weak; capture the gap first.

### Audit Baseline

Each reinforcement round must produce:
- a Git commit containing only that round's changes
- an audit record in `references/reinforcement-audit.jsonl`
- validation via `scripts/validate_reinforcement_audit.py`

### Four-Step Reinforcement Cycle

1) Plan
   - objective
   - acceptance criteria
   - scope in / scope out
   - evidence inputs
   - exit condition
2) Change
   - failure mode targeted
   - files changed
   - guardrail or workflow updates
   - rollback plan
3) Verify
   - checks run
   - evidence
   - negative tests
   - decision
4) Reflect
   - improvements
   - tradeoffs/risks
   - next highest-impact refinement
   - next action owner/date

## Guardrails

- Do not treat the reference sample as production-ready by default.
- Do not omit a defining invariant just to hit a line budget.
- Do not bloat the sample with production adapters or framework ceremony.
- Do not output an un-runnable skeleton when a runnable sample is feasible.
- Do not hide deferred constraints; list them explicitly.
- Do not claim the sample is the source of truth for `main`.
- Do not skip the mapping back to production modules.

