---
name: change-control-triage-skill
description: v0.1.13 - Generate one-wave, human-led feature creation plans from two branches with explicit control boundaries, closed-loop execution, and commit triggers.
---

# Change Control Triage Skill

## Trigger

Use this skill when comparing two branches and producing a tutorial-first
feature creation plan for only the current wave.

## Core Purpose

Human controls boundaries and decisions; AI accelerates implementation inside
approved scope.
- Use AI branch as reference input, not copy-paste source.
- Keep system control with humans for high-risk and contract decisions.
- Maximize delivery speed by assigning glue and repetitive work to AI.

## Required Inputs

- `base_branch`
- `head_branch`

## Fixed Defaults

- `mode=fast-one-wave`
- `output_scope=current-wave-only`
- `next_wave_policy=defer`
- `phase_order=fixed-1-to-7`
- `agent_mode=multi` (default)
- `single_fallback=allowed-when-trivial`
- `migration_strategy=existing-files-first`
- `new_file_policy=deny-by-default`

## Workflow Set (Pick One Per Wave)

- `loop-first` (default): prioritize smallest business loop.
- `risk-first`: prioritize highest-risk item first.
- `contract-first`: prioritize API/contract compatibility first.
- `delivery-first`: prioritize demo-ready path first.

Selection rule:
- If Security/Data/Contract gate triggers, prefer `risk-first`.
- If cross-service schema/API change dominates, prefer `contract-first`.
- If deadline/demo pressure dominates, prefer `delivery-first`.
- Otherwise use `loop-first`.

## Fixed Master Flow (1->7)

1. Rules and Invariants
2. Loop Semantics and Domain Logic (no DDL execution)
3. Contract and Compatibility
4. Minimal Executable Slice
5. Data/Infra Landing (only if required by current wave)
6. Verification and Rollback Drill
7. Release and Observability Handoff

## Control Map (Required)

For every change unit, mark exactly one:
- `Human-Owned`: human decides and approves.
- `AI-Assist`: AI drafts, human approves.
- `AI-Auto`: AI can propose directly, human spot-checks before merge.

`Human-Owned` by default when touching:
- security/auth/permission
- data model/migration/backfill/deletion
- public contract/API/event schema
- reliability guarantees (idempotency/retry/order)

## Workflow

1. Compare `base_branch..head_branch` and split change units.
2. Build `Control Map` for each unit.
3. Build `Loop Inventory`; select current wave only (default one smallest closed loop, max 1-2 when strongly coupled).
4. Choose one workflow (`loop-first|risk-first|contract-first|delivery-first`).
5. Generate current-wave tutorial plan in fixed 1->7.
6. For each phase, define `action`, `commit_when`, and `done_when`.
7. Generate `Per-Step Gate` and blocking questions.
8. Generate `Wave Commit Plan` (N small, reviewable commits as needed).
9. Use multi-agent reviewers by default; downgrade to single only for trivial and low-risk waves.
10. Output current wave only, plus one-line `Next Wave Entry Condition`.

## Minimal Closed-Loop Rule

Each wave must contain one end-to-end verifiable loop.
Minimal loop means:
- user/business trigger is defined
- core behavior executes on real code path
- one verification proves behavior is correct
- rollback entry is known if risk is non-trivial

## Commit Policy

No fixed commit count per wave; use as many as needed.
Each commit must satisfy:
- single intent
- reviewable in 5-15 minutes
- includes verification note
- safe to rollback independently

Commit trigger rule:
- Commit only when phase `done_when` is met for a concrete progress slice.
- Prefer `feat|fix|refactor|test|docs|chore` subjects; avoid vague "plan-only" commits for implementation waves.

## Gate Rule

Gate set: `Security`, `Data`, `Contract`, `Reliability`.

- gates block progression at current phase
- gates do not reorder phase order
- unresolved blocking gate => `Decision=BLOCK`

## Output Contract (`fast-one-wave`)

Use `references/edit-plan-template.md` exactly.

Required sections:
- `Wave Tutorial Summary`
- `Control Map`
- `Current Wave Plan (1->7)`
- `Per-Step Gate`
- `Wave Commit Plan`
- `Minimal Verification`
- `Rollback (If High Risk)`
- `Multi-Agent Plan (When multi)`
- `Blocking Questions (Only If Blocking)`
- `Next Wave Entry Condition (One Line)`

## Guardrails

- Output only current wave; do not pre-plan full future waves.
- Do not execute DDL/migration in phase 2.
- Do not let AI decide Human-Owned items.
- Do not copy AI branch blindly; convert it through Control Map and current-wave constraints.
- Keep output concise, tutorial-first, implementation-ready.
- Do not propose new files unless unavoidable and justified.
- Do not output secrets, tokens, or PII.

## References

- `references/edit-plan-template.md`
- `references/acceptance-criteria.md`
- `references/operator-playbook.md`
- `references/multi-agent-protocol.md`
- `references/control-rubric.md`
- `references/master-development-flow.md`
