---
name: human-core-feature-wave-skill
description: v0.1.16 - Guide human-led AI feature landing where AI drafts first and humans reimplement core logic on main; use tutorial-first coaching inside Human-Owned steps and migration triage only as an on-demand fallback.
---

# Human-Core Feature Wave Skill (Worktree-First)

## Trigger

Use this skill when you want either:
- a tutorial-first explanation for how to implement one feature or method without losing the reason behind each data structure and helper, or
- a human-led, AI-assisted plan for landing one feature wave from an AI worktree into `main` without losing control of business logic.

Primary fit:
- AI already produced a draft implementation in a worktree or branch
- the human reviewed it and does not want to trust-copy the core logic
- the human wants to reimplement the business-critical path on `main`
- AI output is kept as reference material for glue, tests, examples, and edge cases

## Non-Trigger (Default Behavior)

Do not use this skill as the default entry point for every feature.

Do not use this skill when:
- the user only wants final code with no explanation of reasoning or structure,
- the user only wants a post-hoc diff summary or review, or
- the request is a broad multi-wave roadmap rather than one implementation slice or one landing wave.

## Core Purpose

Keep attention on user-visible behavior, business closure, and implementation reasoning, not diff migration.

This skill exists to help you:
- derive internal structure from external behavior and constraints,
- teach one smallest coherent implementation path before drowning in helper details,
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

- `mode=feature-wave`
- `main_target=main`
- `wave_scope=single-closed-loop`
- `output_style=tutorial-first`
- `implementation_style=contract-first-with-explicit-helper-boundaries`
- `plan_horizon=this-wave-only`
- `integration_strategy=human-led-main-first`
- `agent_mode=single|multi(optional)`
- `human_core_reimplementation=default-on`

## Mode Selection (Required)

- Choose `feature-wave` by default when AI has already drafted code and the goal is to land one smallest useful closed loop on `main`.
- Inside `feature-wave`, switch into `implementation-coach` only for `Human-Owned` steps where the user needs the reasoning path for reimplementing the core logic.
- Choose standalone `implementation-coach` only when there is no landing/integration context yet and the user mainly wants to learn or derive the design.
- Choose `triage` only when the AI diff or change surface is too large to reason about safely in one wave.

## Primary Usage Pattern (Required)

Default operating pattern:

1. AI drafts the feature in a sandbox worktree.
2. Human reviews the draft and identifies the `Human-Owned` core path.
3. Human reimplements that core path on `main` from requirements and invariants, not by trust-copying the AI diff.
4. AI draft is used as reference for glue, tests, examples, and non-core scaffolding.
5. The wave closes only when `main` has the minimal verified business result.

This is the default path the skill should optimize for.

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

## Implementation Coaching Rules (Required)

When `mode=implementation-coach`, teach the implementation in this order:

1. State the external behavior first.
2. Name the hard constraints and invariants.
3. Derive the internal model or data structures from those constraints.
4. Sketch the public methods first and name helper contracts before helper bodies.
5. Implement or explain the smallest primitives first.
6. Assemble the public methods from those primitives.
7. Walk one concrete example end-to-end.
8. State what each helper mutates or returns, and avoid hidden side effects.

The explanation must make the data-structure choice feel inevitable from the requirements. Do not jump straight to helper internals without first showing the constraint that forces them.

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

## Workflow (Mode: `implementation-coach`)

1. State the feature goal and user-visible behavior.
2. Name the hard constraints (`O(1)`, invariants, API/UX contract, failure behavior).
3. Derive the internal model, state, or data structures from those constraints.
4. Sketch the public surface first (`get`/`put`, handler/service method, etc.).
5. Introduce helper contracts only after their purpose is justified.
6. Implement or explain the lowest-level helper primitives first.
7. Build back up to the public methods.
8. Verify the reasoning by answering "why this structure, why not a simpler one?"
9. End with the next smallest implementation step or exercise.

## Workflow (Mode: `feature-wave`)

1. State the wave goal (this wave only).
2. Answer the five closed-loop questions.
3. Split the planned changes with `Quick Control Split` (`Human-Owned` / `Human-Confirm` / `AI-Auto`).
4. Restate the `Human-Owned` core path in requirement terms before touching code.
5. Use `implementation-coach` as a nested subroutine for each `Human-Owned` step:
   - state behavior and invariants
   - derive structure from constraints
   - sketch public method or boundary
   - name helper contracts
   - reimplement core logic on `main`
6. Use AI worktree output only as reference material (not merge target).
7. Land code on `main` in human-led order:
   - core boundary or contract skeleton first (human)
   - minimal path to close the loop
   - adopt AI glue/CRUD where safe
   - refactor surrounding code where needed
8. Define verification for this wave on `main`.
9. Define `commit_when` checkpoints for each small landing step.
10. Stop after one wave and propose the next wave in one line only.

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

## Teaching Guardrails (Required for `implementation-coach`)

- Do not recommend a helper before explaining what pressure or requirement created it.
- Do not say "store X in a map/list" without explaining what operation needs to stay `O(1)` or what invariant it protects.
- Keep one abstraction level at a time: contract first, helper details second.
- Call out mutation boundaries explicitly: what state changes, what does not, and what the caller must still do.
- Prefer one worked example over many shallow examples.
- When AI code already exists, do not treat the existing helper layout as authoritative. Re-derive the core path from requirements first.

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

- `mode` or a clear user intent signal
- for `implementation-coach`:
  - feature or method goal (one sentence)
  - optional constraints/invariants
  - optional current code or code shape
- for `feature-wave`:
  - `ai_branch` (or AI worktree path)
  - `main_branch` (default `main`)
  - current wave goal (one sentence)
  - optional: diff evidence (`git diff`, changed files list, or file paths)

## Output Format (`implementation-coach`)

```
## Feature Goal
- ...

## External Contract
- ...

## Constraints and Invariants
- ...

## Derived Structure
- ...

## Skeleton First
- public methods:
- helper contracts:

## Build Order
- Step 1:
- Step 2:
- Step 3:

## Worked Example
- ...

## Verification
- check:
- expected:

## Next Small Step
- ...

## Blocking Questions (Only If Blocking)
- ...
```

## Output Format (`feature-wave`, One Wave Only)

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

## Worked Example Reference

- See `references/worked-example-lrucache.md` for a successful example of teaching an implementation by deriving `dict + doubly linked list` from `LRUCache` requirements before dropping into helper details.
- Use that example specifically for `Human-Owned` rewrites where AI already has a candidate implementation but the human wants to rebuild the core logic with full understanding.

## Guardrails

- Do not default to full migration planning.
- Do not collapse `implementation-coach` into "here is the final code" without first explaining the requirements-to-structure path.
- Do not treat AI diff as the source of truth.
- Do not default to copying the AI core algorithm into `main`; reimplement the `Human-Owned` path from explicit reasoning.
- Do not start from schema/model work unless the current wave truly requires it.
- Do not output a full multi-wave roadmap unless explicitly requested.
- Keep output to one wave at a time.
- Keep human control explicit for `Human-Owned` and `Human-Confirm` items.
- Do not output secrets, tokens, or PII.
