---
name: change-control-triage-skill
description: v0.1.13 - Guide human-led AI worktree feature integration with one-wave closed-loop planning; use migration triage only as an on-demand fallback.
---

# Change Control Triage Skill (Worktree-First)

## Trigger

Use this skill when you want a human-led, AI-assisted plan for landing one feature wave from an AI worktree into `main` without losing control of business logic.

## Non-Trigger (Default Behavior)

Do not use this skill as the default entry point for every feature.

If you are still exploring how to implement the feature with AI, discuss implementation directly and keep the AI worktree as a sandbox. Use this skill only when you want a landing wave plan for `main`.

## Core Purpose

Keep attention on business closure, not diff migration.

This skill exists to help you:
- decide what the human must control
- decide what AI code can be adopted as glue
- land one smallest useful closed loop on `main`
- define commit boundaries (`commit_when`) for small, reversible commits

This skill does **not** assume the AI branch is the source of truth.

## Default Operating Model (Human-Core, AI-Sandbox)

- AI worktree/branch is a parallel experiment sandbox (can be discarded).
- `main` is the only source of truth.
- Human is the integrator and decision owner.
- AI is used for exploration, draft implementations, edge cases, test cases, and boilerplate.

## Fixed Defaults

- `mode=feature-wave` (default)
- `main_target=main`
- `wave_scope=single-closed-loop`
- `output_style=tutorial-first`
- `plan_horizon=this-wave-only`
- `integration_strategy=human-led-main-first`
- `agent_mode=single|multi(optional)`

## What Counts as "One Wave"

One wave is one smallest verifiable business closure on `main`.

A wave may contain multiple small commits.
A wave must not try to solve the whole feature end-to-end if that breaks focus.

Examples:
- first request path returns correct response for one happy path
- one state transition is implemented with checks and tests
- one read/write loop works with a stable contract

## Five Closed-Loop Questions (Required)

Before planning a wave, answer these five questions:

1. What is the user path or business path for this wave?
2. What is the success condition (verifiable)?
3. What invariant must not be broken?
4. What is the smallest change set on `main` to deliver this wave?
5. How will `main` be verified (test/script/manual steps)?

These questions are the primary attention anchor. If the plan drifts into migration details before these are clear, reset and answer them first.

## Quick Control Split (Required, Lightweight)

Use this split to decide control ownership before landing code.

### `Human-Owned`

Human decides and implements/refactors the core behavior (AI may provide ideas or drafts).

Default for:
- business semantics and rule boundaries
- core algorithms and state machines
- invariants and consistency guarantees
- public contracts / API behavior / event schema meaning
- security/auth/permission logic
- data model semantics, migrations, backfills, deletion strategies
- idempotency / retry / ordering guarantees

### `Human-Confirm`

AI may draft, but human must explicitly review and approve before merge.

Default for:
- table/schema changes
- cross-module interfaces
- migration scripts
- permission checks
- reliability-sensitive configuration

### `AI-Auto`

AI can draft directly; human performs quick spot-check before merge.

Default for:
- CRUD handlers and repository boilerplate
- DTOs / mappers / adapters
- repetitive glue code
- test scaffolding and example cases
- logging/metrics template wiring (non-policy decisions)
- documentation updates for implemented behavior

## Workflow (Default: `feature-wave`)

1. State the wave goal (this wave only).
2. Answer the five closed-loop questions.
3. Split the planned changes with `Quick Control Split` (`Human-Owned` / `Human-Confirm` / `AI-Auto`).
4. Use AI worktree output only as reference material (not merge target).
5. Land code on `main` in human-led order:
   - core boundary or contract skeleton first (human)
   - minimal path to close the loop
   - adopt AI glue/CRUD where safe
   - refactor core logic where needed
6. Define verification for this wave on `main`.
7. Define `commit_when` checkpoints for each small landing step.
8. Stop after one wave and propose the next wave in one line only.

## Commit Boundary Rule (Required)

This skill is commit-aware because a wave can contain many commits.

Rules:
- Prefer small, focused commits (`feat`/`fix`/`refactor`), not a single "design plan" commit.
- Each commit must be reversible and independently reviewable.
- Every landing step in the output must include a `commit_when` condition.
- Commit when a step reaches a verifiable local milestone, not when the whole feature is finished.

Good `commit_when` examples:
- request path compiles and returns placeholder response with tests adjusted
- invariant check is enforced in one write path and test passes
- mapper/DTO glue is wired with no contract change and smoke check passes

## Optional Fallback: Migration Triage Mode (`mode=triage`)

Use this only when the AI diff is too large to reason about safely (for example: many files, cross-layer changes, audit-heavy handoff, or high-risk data/contract changes).

In `triage` mode, you may produce a phase/gate-style mapping plan, but it must still begin with:
- one-wave closed-loop goal
- quick control split
- human checkpoints

Triage is a fallback tool, not the default development entry point.

## Multi-Agent Use (Optional)

Default is single-agent.

Use multi-agent discussion only when it improves decision quality, not for routine code copying.

Good multi-agent uses:
- comparing 2-3 implementation strategies for a `Human-Owned` core path
- reviewing a `Human-Confirm` schema/contract change
- designing rollback/verification for high-risk behavior

Suggested reviewer roles (when used):
- business-rule reviewer
- contract/interface reviewer
- data/reliability reviewer
- test/rollback reviewer

## Required Inputs (Minimal)

- `ai_branch` (or AI worktree path)
- `main_branch` (default `main`)
- current wave goal (one sentence)
- optional: diff evidence (`git diff`, changed files list, or file paths)

## Output Format (Tutorial-First, One Wave Only)

```
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
  - done_when:
  - commit_when:
- Step 2:
  - owner:
  - use_ai_reference:
  - done_when:
  - commit_when:
- Step 3:
  - owner:
  - use_ai_reference:
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
- Do not treat AI diff as the source of truth.
- Do not start from schema/model work unless the current wave truly requires it.
- Do not output a full multi-wave roadmap unless explicitly requested.
- Keep output to one wave at a time.
- Keep human control explicit for `Human-Owned` and `Human-Confirm` items.
- Do not output secrets, tokens, or PII.

