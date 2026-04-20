---
name: human-led-main-landing-skill
description: v0.1.20 - Guide one human-led, main-first landing wave from an AI draft or worktree, keeping `Human-Owned` core logic on `main`, AI output as reference only, and verification plus `commit_when` checkpoints explicit.
---

# Human-Led Main Landing Skill (One-Wave, Main-First)

## Trigger and Scope

Use this skill when you want a human-led, AI-assisted plan for landing one
smallest useful feature wave from an AI worktree or branch into `main`
without losing control of business logic.

Primary fit:
- AI already produced a draft implementation in a worktree or branch
- the human reviewed it and does not want to trust-copy the core logic
- the human wants to reimplement the business-critical path on `main`
- AI output is kept as reference material for glue, tests, examples, and edge
  cases

In scope:
- one-wave main-first landing plans
- ownership splitting across `Human-Owned`, `Human-Confirm`, and `AI-Auto`
- verification planning on `main`
- defining reversible `commit_when` checkpoints
- calling `from-scratch-implementation-skill` for `Human-Owned` steps when the human
  needs step-by-step derivation before coding

Out of scope:
- tutorial-first teaching with no landing or integration context
- final-code-only requests with no reasoning or ownership control
- post-hoc diff summaries or code review
- broad multi-wave roadmaps

Use `from-scratch-implementation-skill` when the user mainly wants to learn how to
derive and build the core logic step by step.

## Core Purpose

Keep attention on user-visible behavior, business closure, and controlled
landing on `main`, not diff migration.

This skill exists to help you:
- decide what the human must control
- decide what AI code can be adopted as glue
- land one smallest useful closed loop on `main`
- define verification and commit boundaries for small, reversible commits
- use `from-scratch-implementation-skill` for `Human-Owned` core reasoning when
  derivation matters more than raw velocity

This skill does **not** assume the AI branch is the source of truth.

## Default Operating Model (Main-First, AI-Sandbox)

- AI worktree or branch is a parallel experiment sandbox and can be discarded.
- `main` is the only source of truth.
- Human is the integrator and decision owner.
- AI is used for exploration, draft implementations, edge cases, test cases,
  and boilerplate.

## Fixed Defaults

- `mode=feature-wave`
- `main_target=main`
- `wave_scope=single-closed-loop`
- `output_style=wave-plan-first`
- `plan_horizon=this-wave-only`
- `integration_strategy=human-led-main-first`
- `teaching_subroutine=from-scratch-implementation-skill-when-needed`
- `agent_mode=single|multi(optional)`
- `human_core_reimplementation=default-on`

## Mode Selection (Required)

- Choose `feature-wave` by default when AI has already drafted code and the
  goal is to land one smallest useful closed loop on `main`.
- Run the repository-local tmux bootstrap skill first whenever this flow will
  produce or modify real code.
- Run `reference-core-impl-skill` first when the core is novel,
  architecture-heavy, or too noisy to learn safely from the production code or
  AI draft directly.
- Run `from-scratch-implementation-skill` for `Human-Owned` steps when the user needs
  the reasoning path for reimplementing the core logic before touching code.
- Choose `triage` only when the AI diff or change surface is too large to
  reason about safely in one wave.

## Primary Usage Pattern (Required)

Default operating pattern:

1. Start from a dedicated worktree boundary for the task.
2. Human reviews the draft and identifies the `Human-Owned` core path.
3. If the core is still too noisy to reason about safely, run
   `reference-core-impl-skill` to distill a runnable minimal-complete sample
   first.
4. If a `Human-Owned` step still needs structured derivation, run
   `from-scratch-implementation-skill` before coding on `main`.
5. Human reimplements that core path on `main` from requirements, invariants,
   and the learned sample or teaching output, not by trust-copying the AI
   diff.
6. AI draft is used as reference for glue, tests, examples, and non-core
   scaffolding.
7. The wave closes only when `main` has the minimal verified business result.

This is the default path the skill should optimize for.

Recommended upstream or downstream chain:
1. repository-local tmux bootstrap skill
2. `reference-core-impl-skill` when needed
3. `human-led-main-landing-skill`
4. `from-scratch-implementation-skill` when needed for `Human-Owned` steps
5. `git-commit-skill`

## What Counts as "One Wave"

One wave is one smallest verifiable business closure on `main`.

A wave may contain multiple small commits.
A wave must not try to solve the whole feature end-to-end if that breaks focus.

Examples:
- first request path returns correct response for one happy path
- one state transition is implemented with checks and tests
- one read or write loop works with a stable contract

## Five Closed-Loop Questions (Required)

Before planning a wave, answer these five questions:

1. What is the user path or business path for this wave?
2. What is the success condition (verifiable)?
3. What invariant must not be broken?
4. What is the smallest change set on `main` to deliver this wave?
5. How will `main` be verified (test, script, or manual steps)?

These questions are the primary attention anchor. If the plan drifts into
migration details before these are clear, reset and answer them first.

## Quick Control Split (Required, Lightweight)

Use this split to decide control ownership before landing code.

### `Human-Owned`

Human decides and implements or refactors the core behavior. AI may provide
ideas or drafts, but the human owns the production result.

Default for:
- business semantics and rule boundaries
- core algorithms and state machines
- invariants and consistency guarantees
- public contracts, API behavior, and event-schema meaning
- security, auth, and permission logic
- data-model semantics, migrations, backfills, and deletion strategies
- idempotency, retry, and ordering guarantees

### `Human-Confirm`

AI may draft, but human must explicitly review and approve before merge.

Default for:
- table or schema changes
- cross-module interfaces
- migration scripts
- permission checks
- reliability-sensitive configuration

### `AI-Auto`

AI can draft directly and the human performs a quick spot-check before merge.

Default for:
- CRUD handlers and repository boilerplate
- DTOs, mappers, and adapters
- repetitive glue code
- test scaffolding and example cases
- logging or metrics template wiring for non-policy decisions
- documentation updates for implemented behavior

## Workflow (Mode: `feature-wave`)

1. State the wave goal for this wave only.
2. Answer the five closed-loop questions.
3. Split the planned changes with `Quick Control Split`.
4. Restate the `Human-Owned` core path in requirement terms before touching
   code.
5. For each `Human-Owned` step, decide whether to call
   `from-scratch-implementation-skill` first to derive:
   - behavior and invariants
   - structure from constraints
   - public method or boundary
   - helper contracts
6. Use AI worktree output only as reference material, not as the merge target.
7. Land code on `main` in human-led order:
   - core boundary or contract skeleton first
   - minimal path to close the loop
   - AI glue or CRUD where safe
   - surrounding refactors only when required to complete the loop
8. Define verification for this wave on `main`.
9. Define `commit_when` checkpoints for each small landing step.
10. Stop after one wave and propose the next wave in one line only.

## Commit Boundary Rule (Required)

This skill is commit-aware because a wave can contain many commits.

Rules:
- Prefer small, focused commits such as `feat`, `fix`, or `refactor`, not a
  single "design plan" commit.
- Each commit must be reversible and independently reviewable.
- Every landing step in the output must include a `commit_when` condition.
- Commit when a step reaches a verifiable local milestone, not when the whole
  feature is finished.

Good `commit_when` examples:
- request path compiles and returns placeholder response with tests adjusted
- invariant check is enforced in one write path and a test passes
- mapper or DTO glue is wired with no contract change and a smoke check passes

## Optional Fallback: Migration Triage Mode (`mode=triage`)

Use this only when the AI diff is too large to reason about safely. Examples:
many files, cross-layer changes, audit-heavy handoff, or high-risk
data or contract changes.

In `triage` mode, you may produce a phase or gate-style mapping plan, but it
must still begin with:
- one-wave closed-loop goal
- quick control split
- human checkpoints

Triage is a fallback tool, not the default development entry point.

## Multi-Agent Use (Optional)

Default is single-agent.

Use multi-agent discussion only when it improves decision quality, not for
routine code copying.

Good multi-agent uses:
- comparing 2 or 3 implementation strategies for a `Human-Owned` core path
- reviewing a `Human-Confirm` schema or contract change
- designing rollback or verification for high-risk behavior

Suggested reviewer roles when used:
- business-rule reviewer
- contract or interface reviewer
- data or reliability reviewer
- test or rollback reviewer

## Required Inputs (Minimal)

- `mode` or a clear user intent signal
- `ai_branch` or AI worktree path
- `main_branch` with default `main`
- current wave goal in one sentence
- optional diff evidence such as `git diff`, changed files list, or file paths

## Output Format (`feature-wave`, One Wave Only)

```text
## Wave Goal
- ...

## Five Closed-Loop Answers
- user/business path:
- success condition:
- invariant:
- smallest main change set:
- main verification:

## Quick Control Split
- Human-Owned:
- Human-Confirm:
- AI-Auto:

## This Wave Landing Steps (Main-First)
- Step 1:
  - owner:
  - use_ai_reference:
  - use_from_scratch_implementation:
  - done_when:
  - commit_when:
- Step 2:
  - owner:
  - use_ai_reference:
  - use_from_scratch_implementation:
  - done_when:
  - commit_when:
- Step 3:
  - owner:
  - use_ai_reference:
  - use_from_scratch_implementation:
  - done_when:
  - commit_when:

## Verification (This Wave)
- check:
- expected:

## Next Wave (One Line)
- ...

## Blocking Questions (Only If Blocking)
- ...
```

## Guardrails

- Do not default to full migration planning.
- Do not treat the AI diff as the source of truth.
- Do not default to copying the AI core algorithm into `main`; reimplement the
  `Human-Owned` path from explicit reasoning and use
  `from-scratch-implementation-skill` when needed.
- Do not start from schema or model work unless the current wave truly
  requires it.
- Do not output a full multi-wave roadmap unless explicitly requested.
- Keep output to one wave at a time.
- Keep human control explicit for `Human-Owned` and `Human-Confirm` items.
- Do not output secrets, tokens, or PII.

## Verification Hooks

- Verify the wave goal and five closed-loop answers are explicit before the
  landing steps begin.
- Verify every landing step includes `owner`, `done_when`, and `commit_when`.
- Verify every `Human-Owned` step names its reasoning source:
  requirements, `reference-core-impl-skill`, or
  `from-scratch-implementation-skill`, not the AI diff alone.
- Verify the output ends after one wave with a one-line next-wave pointer.
