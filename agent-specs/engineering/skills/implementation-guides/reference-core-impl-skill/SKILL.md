---
name: reference-core-impl-skill
description: v0.1.4 - Distill a feature or system core into a runnable minimal-complete reference sample before `main` integration; use it when production code or an AI draft is too noisy to learn from safely, then hand off to human-led main landing.
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
- replacing `human-led-main-landing-skill` for `main` landing and integration

Typical trigger prompts:
- `Use $reference-core-impl-skill to distill this scheduler into a runnable core sample before we touch main.`
- `Use $reference-core-impl-skill to compare this noisy AI draft with the real invariant and produce a minimal-complete sample plus mapping back to production.`
- `Use $reference-core-impl-skill to extract the editor loop into a tiny runnable example that a human can rederive by hand.`

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
- If the sample will be persisted or used to drive production edits, the task should already be inside a dedicated worktree.

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

## Mode Selection

- Choose `reference-core` by default when the goal is a runnable minimal sample.
- Choose `reference-plus-map` when the output must include an explicit production mapping plan in the same response.
- Choose `compare-draft` when an AI draft or existing module already exists and the task is to distill its real core into a cleaner sample.

## Reference Map (Read As Needed)

- `references/what-counts-as-minimal-complete.md`
  - read when the line budget or boundary feels contested and you need to recheck what must survive compression
- `references/project-placement-policy.md`
  - read when project placement is unclear or the sample might accidentally land in a production-imported path
- `references/mapping-back-to-main-checklist.md`
  - read before finalizing the mapping section so the handoff back to production modules stays concrete
- `references/acceptance-criteria.md`
  - read during acceptance review and before proposing the next rewrite step
- `references/worked-example-mini-langgraph.md`
  - read when the feature is graph-runner, orchestration, or scheduler shaped
- `references/worked-example-mini-viim.md`
  - read when the feature is editor-loop, command-dispatch, or state-machine shaped
- `assets/reference-core-readme-template.md`
  - read when the sample will persist in the target project repository and needs a colocated `README.md`

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
2. State required inputs that are still missing; stop and ask for them only when the missing item would make the sample misleading or unsafe.
3. Separate core invariants from production constraints.
4. Define the smallest boundary that still preserves the real core.
5. Choose the minimum runtime model:
   - in-memory state
   - fake adapters
   - synchronous loop unless async behavior is itself core
6. Resolve the sample placement strategy in the target project repo.
7. Define the sample structure:
   - essential types/state
   - core loop or public entrypoints
   - essential helper contracts
8. Produce a runnable minimal-complete sample within the line/file budget.
9. Add a colocated `README.md` using the reference template when the sample is meant to persist in the project repo.
10. Validate it with one happy path and one important failure or edge case.
11. Run acceptance review against `references/acceptance-criteria.md` and record pass/fail evidence.
12. List deferred constraints, adapters, and production-only policies.
13. Map the sample back to the real codebase:
   - which modules own the equivalent behavior
   - which abstractions must be reintroduced
   - which tests should be ported first
14. Recommend the next step:
   - use `human-led-main-landing-skill` to land the learned core on `main`, or
   - iterate once more if the sample still hides the real invariant.

## Minimal Sample Design Rules (Required)

- Keep the sample runnable by default.
- Prefer one file unless multiple files materially improve clarity.
- Inline only the helpers needed to reveal the core flow.
- Use real names for the real concepts; do not rename away the domain just to make the sample feel generic.
- Replace non-core dependencies with the smallest faithful substitute.
- Preserve failure modes that define the design.

## Project Placement Policy (Required)

By default, persist the reference sample in the target project repository, not in the skill repository and not inside the main production runtime tree.

Default placement:
- `examples/reference-core/<feature-slug>/`

Allowed alternatives when they fit better:
- `docs/reference-core/<feature-slug>/` for documentation-first samples that are still useful to read and lightly run
- `playground/reference-core/<feature-slug>/` for operator-owned or intentionally non-supported experiments

Avoid by default:
- `app/`
- `src/`
- `pkg/`
- `internal/`
- any directory that production code imports by default

Every persisted sample must include:
- the sample code
- a colocated `README.md`
- a short note on what is included vs deferred
- a mapping back to the production modules

If the sample is intentionally ephemeral and should not live in the project repo, state that explicitly and explain why.

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
- one sentence explaining where the sample should live in the target project repo

## Daily Workflow Position

Use this skill after the repository-local tmux bootstrap skill and before
`human-led-main-landing-skill` when the feature's core is novel,
architecture-heavy, or difficult to learn from the production code directly.

Recommended sequence:
1. repository-local tmux bootstrap skill
2. `reference-core-impl-skill`
3. `human-led-main-landing-skill`
4. `git-commit-skill`

Interpretation:
- `reference-core-impl-skill` is a distillation and learning stage, not the final production edit stage.
- If the reference sample reveals a production mismatch, use `human-led-main-landing-skill` to decide and land the real production change.
- Do not patch production code directly from the sample without the landing/invariant review step.

## Required Inputs (Minimal)

- feature or system name
- one-sentence core behavior goal
- non-negotiable invariants or constraints
- optional current AI draft path or production file paths
- optional target project repository path or project root
- optional preferred size budget
- optional preferred language/runtime for the sample

## Missing Inputs Policy (Required)

- If the feature name, core behavior goal, or defining invariant is missing, ask for it before drafting the sample unless the repository context makes the answer explicit.
- If invariants are only partially known, infer them from the provided code or problem statement and label them `inferred` in the output.
- If the target project root is unknown, produce an ephemeral placement recommendation and state that persistence is blocked on project-path confirmation.
- If the language/runtime is unspecified, default to the production language when practical; otherwise choose the simplest local runtime that preserves the invariant and explain why.
- Do not fake certainty: unresolved constraints must stay in `## Open Risks / Unknowns`.

## Defaults

- size budget: target `~400` lines, acceptable `150-500`
- language: same as production language when practical
- runtime: local in-memory sample
- validation: inline example or tiny tests
- placement: `examples/reference-core/<feature-slug>/` inside the target project repo
- sample location in response: code first, mapping second
- reference style: complete enough to run, small enough to rewrite manually

## Output Format

```
## Core Goal
## Missing Inputs / Assumptions
## Minimal Boundary
## Suggested Project Placement
## Minimal Complete Sample
## Reference README Outline
## Included Invariants
## Deferred Constraints
## Validation
## Acceptance Review
## Mapping Back To Main
## Next Human Rewrite Step
## Open Risks / Unknowns
```

## Output Contract (Required)

Every non-trivial run must make these items explicit:

- whether each required input was provided, inferred, or still missing
- one happy-path validation command or test
- one important failure or boundary validation
- one sentence on what the sample proves
- one sentence on what the sample does **not** prove
- pass/fail evidence against `references/acceptance-criteria.md`
- the exact production modules or boundaries that the sample maps back to next

## Iteration Loop (Required)

- Run acceptance review using `references/acceptance-criteria.md` and record pass/fail evidence.
- Capture the highest-impact gap in the sample (for example: invariant missing, runtime too noisy, boundary not faithful).
- Define one next-iteration change that makes the sample more teachable without making it production-heavy.
- Name the one verification step that proves the next iteration improved the sample.

## Reinforcement Plan (Required)

This section applies only when improving the skill package itself. It does
not apply to ordinary use of the skill for generating a reference sample.

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
- validation via `python scripts/validate_reinforcement_audit.py references/reinforcement-audit.jsonl`

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
- Do not place persisted samples under production runtime directories by default.
- Do not leave a persisted sample without a colocated `README.md`.
