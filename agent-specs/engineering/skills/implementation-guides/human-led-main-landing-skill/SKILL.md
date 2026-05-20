---
name: human-led-main-landing-skill
description: v0.1.21 - Plan one human-led, main-first landing wave from an AI draft or worktree. Use when the human must keep `Human-Owned` core logic on `main`, treat AI output as reference only, and define verification plus reversible `commit_when` checkpoints.
---

# Human-Led Main Landing Skill (One-Wave, Main-First)

## Overview

Plan and land one smallest useful feature wave on `main` without treating an AI
branch as the source of truth. This skill keeps attention on user-visible
behavior, business closure, human-owned core reasoning, and reversible commits.

AI worktree output is evidence and reference material for glue, tests,
examples, and edge cases. The human remains the integrator and decision owner
for the production result.

## When to Use

- AI already produced a draft implementation in a worktree or branch.
- The human reviewed the draft and does not want to trust-copy the core logic.
- The human wants to reimplement the business-critical path on `main`.
- The work needs explicit ownership across `Human-Owned`, `Human-Confirm`, and
  `AI-Auto` changes.
- The next step is one verified business closure with `commit_when`
  checkpoints, not a broad migration roadmap.

**When NOT to use:** tutorial-first teaching with no landing context,
final-code-only requests with no reasoning or ownership control, post-hoc diff
summaries, code review, or broad multi-wave planning. Use
`from-scratch-implementation-skill` when the user mainly wants to learn core
logic step by step; use `reference-core-impl-skill` when the core is too noisy
to learn safely before landing.

## The Main-First Landing Operating Loop

Optimize for one closed loop on `main`. Stop after one wave and name only the
next wave.

1. Set Worktree Boundary
   - Confirm the AI worktree or branch is a sandbox reference, not the merge
     target.
   - Identify `main` as the source of truth unless the user states another
     target branch.
   - Verify: the plan distinguishes AI reference material from production
     landing work.
2. State Wave Goal
   - Define one smallest useful user or business path for this wave only.
   - Keep the wave small enough to verify and commit in reversible steps.
   - Verify: the goal is a business closure, not a file migration theme.
3. Answer Five Closed-Loop Questions
   - What is the user path or business path for this wave?
   - What is the success condition?
   - What invariant must not be broken?
   - What is the smallest change set on `main`?
   - How will `main` be verified?
   - Verify: no landing steps appear before these answers are explicit.
4. Split Control
   - Classify work as `Human-Owned`, `Human-Confirm`, or `AI-Auto`.
   - Restate every `Human-Owned` path in requirement terms before touching code.
   - Verify: core semantics, invariants, contracts, security, and data meaning
     are human-controlled.
5. Derive Before Landing
   - For noisy or novel core behavior, run `reference-core-impl-skill` first.
   - For `Human-Owned` steps that need step-by-step reasoning, run
     `from-scratch-implementation-skill` before coding on `main`.
   - Verify: every `Human-Owned` step names its reasoning source.
6. Land on `main` in Small Steps
   - Land the core boundary or contract skeleton first.
   - Add the minimal path that closes the loop.
   - Use AI draft material only for safe glue, tests, examples, and
     non-policy scaffolding.
   - Include surrounding refactors only when required to complete the wave.
   - Verify: each landing step has `owner`, `done_when`, and `commit_when`.
7. Verify and Stop
   - Define the test, script, or manual check for this wave on `main`.
   - End with a one-line next-wave pointer.
   - Verify: the output does not become a multi-wave roadmap.

## Five Closed-Loop Questions

Before planning a wave, answer these five questions:

1. What is the user path or business path for this wave?
2. What is the success condition (verifiable)?
3. What invariant must not be broken?
4. What is the smallest change set on `main` to deliver this wave?
5. How will `main` be verified (test, script, or manual steps)?

These questions are the primary attention anchor. If the plan drifts into
migration details before these are clear, reset and answer them first.

## Quick Control Split

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

## Decision Points

- If the AI diff is too large to reason about safely, switch to
  `mode=triage`, but still begin with the wave goal, control split, and human
  checkpoints.
- If the core behavior is novel, architecture-heavy, or too noisy, run
  `reference-core-impl-skill` before this landing plan.
- If a `Human-Owned` step lacks a reasoning path, run
  `from-scratch-implementation-skill` before coding.
- If the proposed change starts with schema or model work, verify that the
  current wave truly requires it.
- If the plan needs multiple waves to be useful, shrink the current wave until
  one verifiable business closure remains.

## What Counts as One Wave

One wave is one smallest verifiable business closure on `main`.

A wave may contain multiple small commits. A wave must not try to solve the
whole feature end-to-end if that breaks focus.

Examples:
- first request path returns correct response for one happy path
- one state transition is implemented with checks and tests
- one read or write loop works with a stable contract

## Commit Boundary Rule

This skill is commit-aware because a wave can contain many commits.

Rules:
- Prefer small, focused commits such as `feat`, `fix`, or `refactor`, not a
  single design-plan commit.
- Each commit must be reversible and independently reviewable.
- Every landing step in the output must include a `commit_when` condition.
- Commit when a step reaches a verifiable local milestone, not when the whole
  feature is finished.

Good `commit_when` examples:
- request path compiles and returns placeholder response with tests adjusted
- invariant check is enforced in one write path and a test passes
- mapper or DTO glue is wired with no contract change and a smoke check passes

## Optional Fallback: Migration Triage Mode

Use `mode=triage` only when the AI diff is too large to reason about safely:
many files, cross-layer changes, audit-heavy handoff, or high-risk data or
contract changes.

In triage mode, you may produce a phase or gate-style mapping plan, but it must
still begin with:
- one-wave closed-loop goal
- quick control split
- human checkpoints

Triage is a fallback tool, not the default development entry point.

## Multi-Agent Use

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

## Required Inputs

- `mode` or a clear user intent signal
- `ai_branch` or AI worktree path
- `main_branch` with default `main`
- current wave goal in one sentence
- optional diff evidence such as `git diff`, changed files list, or file paths

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

## Output Format

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

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The AI branch already works, so copy it." | The AI branch is reference material; `main` must get human-owned core logic. |
| "Let's migrate the whole diff in one pass." | One wave is one verified business closure, not a broad migration. |
| "Schema work should come first." | Start from the current wave's user path; schema work comes first only when that path requires it. |
| "Commit after the whole feature is done." | Each landing step needs a reversible `commit_when` checkpoint. |
| "Human-Owned can be reviewed after coding." | Human-owned behavior must be restated in requirement terms before touching code. |

## Red Flags

- The output starts from changed files instead of a wave goal.
- The five closed-loop answers are missing or vague.
- The plan treats the AI diff as the source of truth.
- `Human-Owned` steps do not name a reasoning source.
- Landing steps lack `owner`, `done_when`, or `commit_when`.
- The plan expands into a multi-wave roadmap without explicit request.
- Schema, migration, or model work appears before the current wave proves it is
  necessary.
- Verification happens only after the whole feature instead of per landing
  step.

## Verification

Before finishing, confirm:

- [ ] The wave goal and five closed-loop answers are explicit before landing
      steps begin.
- [ ] The plan distinguishes AI reference material from `main` landing work.
- [ ] Every landing step includes `owner`, `done_when`, and `commit_when`.
- [ ] Every `Human-Owned` step names its reasoning source: requirements,
      `reference-core-impl-skill`, or `from-scratch-implementation-skill`.
- [ ] The verification section names a concrete test, script, or manual check
      for this wave.
- [ ] The output ends after one wave with a one-line next-wave pointer.

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
