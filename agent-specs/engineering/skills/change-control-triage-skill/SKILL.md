---
name: change-control-triage-skill
description: v0.1.11 - Generate fast 1->7 migration plans from AI diff to main with per-step gates and optional multi-agent planning.
---

# Change Control Triage Skill

## Trigger

Use this skill when you need a fast, executable plan to migrate AI-branch changes into `main`.

## Fixed Defaults

- `mode=fast` (only mode)
- `diff_target=working tree` (or `<base>..<head>`)
- `main_target=main`
- `migration_strategy=existing-files-first`
- `new_file_policy=deny-by-default`
- `agent_mode=auto|single|multi`

## Fixed Master Flow (1->7)

1. Rules and Invariants
2. Domain and Model Design
3. Contract and Interface Design
4. Core Implementation
5. Integration and Infrastructure
6. Verification
7. Release and Observability

## Core Habits

- Define invariants/contracts before implementation.
- Build one smallest verifiable closed loop first.
- Require rollback and observability before release.

## Gate Rule

Gate set: `Security`, `Data`, `Contract`, `Reliability`.

- gates block progression at current phase
- gates do not reorder phase order
- unresolved blocking gate => `Decision=BLOCK`

## Workflow

1. Read AI diff and split meaningful change units.
2. Map each unit to `main_target` (existing files first).
3. Assign each mapped unit to phase 1->7.
4. Generate `Main Mapping Plan` by phase.
5. Generate `Per-Step Gate` for each phase.
6. Generate `Minimal Landing Batch (Top 3)` for one closed loop.
7. Add minimal verification and rollback (when high-risk).
8. Emit blocking questions only.
9. Plan multi-agent reviewers when `agent_mode=multi` or `auto` triggers multi.

## Multi-Agent Planning

`auto` switches to `multi` if any:
- changed files >= 15
- cross-layer change (e.g. domain + infra/frontend)
- any blocking gate is triggered

Reviewer scopes:
- security/auth
- data/migration
- contract/api
- infra/runtime
- testing/rollback

## Output Contract (`fast`)

Use `references/edit-plan-template.md` exactly.

Required sections:
- `Change Plan Summary`
- `Main Mapping Plan (1->7)`
- `Per-Step Gate`
- `Minimal Landing Batch (Top 3)`
- `Minimal Verification`
- `Rollback (If High Risk)`
- `Multi-Agent Plan (When multi)`
- `Blocking Questions (Only If Blocking)`

## Guardrails

- Keep output implementation-first and concise.
- No Evidence Map and no long checklist sections.
- Keep phase order fixed at 1->7.
- Do not propose new files unless unavoidable.
- Do not output secrets, tokens, or PII.

## References

- `references/edit-plan-template.md`
- `references/acceptance-criteria.md`
- `references/operator-playbook.md`
- `references/multi-agent-protocol.md`
