---
name: change-control-triage-skill
description: v0.1.2 - Classify project changes by required human control and generate strict mastery checklists + verification gates.
---

# Change Control Triage Skill

## Trigger and Scope

Use this skill when you have **current changes** in a project (working tree, branch diff, or PR diff) and you want to decide:
- Which changes you **must fully control** (RED) before merging.
- Which changes you **must understand** (YELLOW).
- Which changes you can **delegate** (GREEN) with light review.

In scope:
- Evidence-backed change inventory from real diffs.
- Deterministic RED/YELLOW/GREEN classification.
- Strict “mastery” requirements for RED.
- Verification + rollback gates for risky changes.

Out of scope:
- Implementing the changes.
- Approving changes without evidence.
- Inventing system behavior that isn’t supported by the diff or existing code.

## Mission and Audience

- Mission: prevent “black-box core logic” from shipping by forcing explicit ownership, mastery criteria, and verification for high-risk changes.
- Audience: engineers using AI for delivery speed while preserving personal responsibility for correctness and risk.

## Required Inputs

- `repo_root` (default: current workspace)
- `diff_target` (choose one)
  - Working tree (default): uncommitted changes.
  - Range: `origin/main...HEAD` (or `<base>..<head>`).
  - Single commit: `<sha>` (use `<sha>^..<sha>` as the range).
- Optional context flags (improve accuracy; omit if unknown):
  - `public_api`, `has_auth`, `has_billing_or_pricing`, `has_migrations`, `has_concurrency`, `touches_infra`

If inputs are missing, do not guess; label as `UNKNOWN` and ask.

## Defaults

- Strictness: **Strict**
- Diff target: **working tree**
- AI trace policy: **minimize** (do not require AI session IDs; treat AI as a proposal generator, not the author of `main`).

## Execution Mode (agent_mode)

The skill supports either single-agent or multi-agent execution. Default behavior uses multi-agent **only when the analysis is complex**.

- `agent_mode=auto` (default)
  - Use multi-agent when complexity triggers are met (see `references/multi-agent-protocol.md`).
  - Otherwise, run as single-agent.
- `agent_mode=single`
  - Run the full workflow with one agent (no reviewer roles).
- `agent_mode=multi`
  - Main agent produces the final triage output.
  - Reviewer agents focus on specific risk surfaces and only report findings (see `references/multi-agent-protocol.md`).

## Control Tiers (Required)

- **RED — Must-Control**
  - You must be able to re-derive the logic (rules + state + boundaries), modify it safely, and design verification + rollback.
- **YELLOW — Must-Understand**
  - You own design intent and verification; AI may draft code, but you can explain and safely change it.
- **GREEN — Delegate**
  - Low-risk, reversible, or boilerplate changes; AI can implement; you verify interfaces and basic behavior.

## What Counts as “Mastery” (RED Definition)

For each RED item, “mastery” is satisfied only if you can produce the following (in the output; no need to store as files):
- **Invariants** (>= 3): rules that must always hold.
- **Preconditions / state boundaries**: when the operation is allowed vs forbidden.
- **State transitions**: what changes after the operation (“done means what?”).
- **Failure modes** (>= 3) and handling: reject/return/throw/compensate.
- **Verification**: at least 1 negative test for each policy gate.
- **Rollback / stop-the-bleeding**: the minimal way to undo or limit impact.

Use `references/mastery-checklist-template.md` for the required structure.

## Workflow

1. Collect evidence (no guessing).
   - Use `references/git-evidence-commands.md` to collect:
     - changed file list, status, and a minimal diff view for high-signal files.
2. Build an Evidence Map.
   - Group changed files by layer and risk surface (domain rules, auth, pricing, persistence, contracts, concurrency, infra, UI/docs).
3. Decide execution mode (agent_mode).
   - If `agent_mode=auto`, apply the complexity triggers in `references/multi-agent-protocol.md` to choose `single` or `multi`.
4. Draft initial classification (main agent).
   - Classify into RED/YELLOW/GREEN using `references/control-rubric.md`.
5. If `agent_mode=multi`, run reviewer protocol.
   - Assign reviewers by risk surface and collect findings (see `references/multi-agent-protocol.md`).
   - Main agent arbitrates and finalizes the Control Map.
6. Finalize classification into RED/YELLOW/GREEN.
   - Apply `references/control-rubric.md` deterministically.
   - If an **auto-RED** category is touched, it must not be GREEN.
7. For every RED item, output a Mastery Checklist.
   - Fill the template and mark missing facts as `UNKNOWN` (blocking).
8. Produce a Verification Plan.
   - RED: must include negative cases + rollback check.
   - YELLOW: must include boundary/contract checks.
9. Emit a decision gate.
   - `BLOCK`: any RED item missing mastery checklist, or missing negative tests / rollback notes for irreversible or high-impact changes.
   - `CONDITIONAL`: only YELLOW items have verification gaps.
   - `OK`: all required mastery + verification items are present.
10. Run acceptance review and propose next iteration.
   - Use `references/acceptance-criteria.md`.

## Output Format (Strict)

```
## Control Triage Summary
- Repo:
- Diff target:
- Decision: BLOCK|CONDITIONAL|OK

## Evidence Map
- Commands:
- Changed files (grouped):

## Control Map
- RED (Must-Control):
- YELLOW (Must-Understand):
- GREEN (Delegate):

## RED Mastery Checklist (Required)
- Item:
  - Invariants:
  - Preconditions/State:
  - State transitions:
  - Failure modes + handling:
  - Negative test(s):
  - Rollback/stop-the-bleeding:

## Verification Plan
- Tests to run:
- Negative cases:
- Rollback checks:

## Unknowns / Blocking Questions
- ...

## Notes
- AI trace policy: minimized
- agent_mode: auto|single|multi
- reviewers (when multi): <scope list>
```

## Guardrails

- Do not classify without evidence from real diffs.
- If evidence is missing, mark `UNKNOWN` and ask.
- Never recommend “just trust the AI”.
- Do not mark these as GREEN:
  - auth/authz changes, pricing/billing changes, migrations, public contract/schema changes, concurrency/idempotency changes, infra/deploy changes.
- Do not output secrets, tokens, or PII.

## Verification Hooks

- Evidence completeness: every classification cites concrete file paths from the diff.
- RED completeness: every RED item has a filled mastery checklist with no `UNKNOWN`.
- Gate correctness: `BLOCK|CONDITIONAL|OK` matches the rubric rules.

## Iteration Loop (Required)

- Draft output → acceptance review (`references/acceptance-criteria.md`) → capture gaps → revise output.
- Record the single highest-risk gap and one concrete verification step to close it.

## Reinforcement Plan (Default: off)

Goals:
- Reduce repeated misclassification and missed high-risk areas.
- Improve first-pass usefulness of triage outputs.

Enablement:
- Default: off.
- Enable only when operator says `reinforcement=on`.

Audit baseline (when enabled):
- Append one JSON object line per round to `references/reinforcement-audit.jsonl`.
- Validate with: `python scripts/validate_reinforcement_audit.py agent-specs/engineering/skills/change-control-triage-skill/references/reinforcement-audit.jsonl`.

Four-step cycle (when enabled):
1) Plan: objective + acceptance criteria + scope in/out + evidence refs + exit condition.
2) Change: update rubric/workflow targeting one failure mode + rollback.
3) Verify: run checks + collect evidence + decide promote/hold/rollback.
4) Reflect: quantify improvements + pick next highest-impact refinement.

Step gate (when enabled):
- After each step, ask `continue?` and do not proceed until the operator replies `continue`.

## File Map

- `references/acceptance-criteria.md`
- `references/control-rubric.md`
- `references/mastery-checklist-template.md`
- `references/git-evidence-commands.md`
- `references/ai-draft-branch-policy.md`
- `references/multi-agent-protocol.md`
- `references/examples/control-example-map.md`
- `references/examples/order-pricing.md`
- `references/reinforcement-audit.jsonl`
