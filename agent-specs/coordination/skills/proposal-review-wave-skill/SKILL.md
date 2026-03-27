---
name: proposal-review-wave-skill
description: v0.1.4 - Deliberate on new feature ideas through parallel multi-agent master councils and prioritize multi-angle reasoning over strong conclusions.
---

# Proposal Review Wave Skill

## Trigger and Scope

Use this skill when a new feature idea, requirement, or plan needs cross-angle
evaluation before implementation.

In scope:
- multi-role discussion for direction shaping
- multi-angle reasoning traces and disagreement exposure
- one-wave discussion pack with clear next-wave questions

Out of scope:
- code migration planning
- direct implementation breakdown or file-level task lists
- long meeting transcripts

## Core Purpose

- Keep attention on business direction and system integrity without forcing
  premature closure.
- Use parallel multi-agent domain critique to surface tradeoffs, disagreements,
  and hidden assumptions early.
- Treat each run as one smallest useful discussion loop, not a final verdict by
  default.
- Keep final decision human-owned and allow the wave to end with structured
  tension instead of an artificial recommendation.

## Required Inputs

- `idea`: one-sentence feature or proposal statement.
- `goal`: expected user/business outcome.
- `scope_hint`: `frontend|backend|system|auto`.
- `constraints`: optional limits (time, compatibility, cost, policy).
- `depth`: optional `quick|standard`, default `standard`.

## Fixed Defaults

- `output_mode=discussion-first-pack`
- `decision_mode=human-final`
- `role_pack_strategy=layered-domain-councils`
- `masters_per_domain=3`
- `agent_mode=parallel`
- `max_parallel_agents=6`
- `evaluation_model=fixed-six-dimension-score`
- `artifact_mode=session-only`
- `discussion_priority=reasoning-over-verdict`
- `recommendation_strength=tentative`
- `closure_mode=open-unless-converged`

## Scope Classification

Classify first, then discuss:

- `frontend`: UI flow, interaction, rendering, client contract usage.
- `backend`: domain rules, data consistency, service/API behavior.
- `system`: cross-layer changes or uncertain boundary.
- `auto`: infer from input; if unclear, mark uncertainty and ask only blocking
  questions.

## Domain Master Councils

### Frontend Council (3 Masters)
- Alan Cooper (Interaction): user flow, state clarity, UX regressions.
- Brad Frost (UI Architecture): component/system boundaries, consistency, reuse.
- Addy Osmani (Frontend Quality): testability, web performance, maintainability.

### Backend Council (3 Masters)
- Eric Evans (Domain): business rule correctness and ownership boundaries.
- Martin Kleppmann (Reliability): consistency, retries/idempotency/order/failure behavior.
- Martin Fowler (Contract): API/event compatibility and integration blast radius.

### Infra/SRE Council (3 Masters)
- Jez Humble (Release): rollout strategy, rollback feasibility, operational safety.
- Charity Majors (Observability): logs/metrics/traces and alertability coverage.
- Brendan Gregg (Runtime): capacity, latency budget, cost-risk tradeoffs.

### Cross-Domain Add-ons (As Needed)
- Marty Cagan (Product): user value and scope discipline.
- Ralph Kimball (Data): schema/lineage/backfill/deletion risks.
- Bruce Schneier (Security): auth/permission/privacy/threat impact.

## Master Usage Rule

- Use these masters as fixed evaluation lenses, not persona role-play.
- Keep output professional and technical; no style imitation.
- If a master lens conflicts with project constraints, keep the dissent and let
  human decide.

## Multi-Agent Parallel Protocol

- Spawn one sub-agent per selected master lens.
- Run selected master agents in parallel; do not serialize by default.
- Each sub-agent returns exactly:
  - `working_view` (current leaning, not a final vote)
  - `reasoning_path` (how this lens interprets the proposal)
  - `key_risks` (top 3)
  - `promising_angles` (top 1-3)
  - `required_conditions` (must-have preconditions)
  - `assumptions_or_unknowns` (what this lens cannot safely infer)
  - `control_map_flags` (`Human-Owned|AI-Assist|AI-Auto`)
- Aggregate with a synthesis step:
  - shared ground
  - disagreement clusters
  - unresolved conflicts
  - unknowns that block confidence
- Do not force a `GO/BLOCK` label unless the evidence naturally converges or the
  user explicitly asks for a decision.

## Workflow (Single Wave, Discussion-First)

1. Parse inputs and classify scope (`frontend|backend|system`).
2. Define `Wave Goal` and explicit non-goals for this round.
3. Select the primary domain council and spawn one sub-agent per master.
4. Trigger cross-domain add-on master agents only when risk or coupling requires them.
5. Run all selected agents in parallel and collect structured outputs.
6. Build `Discussion Map`:
   - shared observations
   - disagreement clusters
   - untested assumptions
   - decision-shaping tensions
7. Build `Conflict Matrix` from non-trivial disagreements.
8. Score fixed six dimensions as support material, not as the final answer.
9. Draft `Option Shapes`:
   - strongest case for proceeding
   - strongest case against or delaying
   - conditional middle path
10. State a `Tentative Lean` only if the wave naturally converges; otherwise
    explicitly say that discussion remains open.
11. List mandatory human decision points and unresolved questions.
12. List minimal next-wave input checklist.
13. Apply closure gate.

## Fixed Six-Dimension Score

Score each dimension `1-5`:

- User Value
- Implementation Complexity
- Risk
- Observability
- Rollback Readiness
- Delivery Cost

## Closure Gate (All Required)

This wave is closed only when:

1. Core conflicts are identified.
2. Key assumptions and unknowns are explicit.
3. Next-wave input checklist is concrete.

Direction selection is optional. If the wave does not naturally converge, close
with an open discussion state rather than a forced verdict.

## Control Map (Required)

For each key decision, mark one:
- `Human-Owned`: human decides and approves.
- `AI-Assist`: AI drafts, human approves.
- `AI-Auto`: AI proposes directly, human spot-checks.

Always default to `Human-Owned` when discussion touches:
- security/auth/permission
- data model/migration/backfill/deletion
- public contract/API/event schema
- reliability guarantees (idempotency/retry/order)

## Output Format

```
## Wave Goal
- ...

## Scope Classification
- ...

## Agent Execution
- mode: parallel
- selected_councils:
- spawned_agents:
- completed_agents:

## Domain Master Deliberation
- primary_council:
- master_views: (must include named masters, reasoning paths, and unknowns)
- dissent_notes:

## Cross-Domain Review (When Triggered)
- ...

## Discussion Map
- shared_ground:
- disagreement_clusters:
- assumptions_and_unknowns:
- decision_shaping_tensions:
- confidence_notes:

## Option Shapes
- strongest_case_for_progress:
- strongest_case_for_delay_or_rejection:
- conditional_middle_path:
- what_would_change_the_discussion:

## Tentative Lean (Optional)
- current_lean:
- why_this_is_only_tentative:
- what_is_still_missing:

## Council Consensus (If Real Convergence Exists)
- ...
- unresolved_conflicts:
- decision: optional, only if clearly justified by discussion

## Conflict Matrix
- ...

## Six-Dimension Score
- user_value:
- implementation_complexity:
- risk:
- observability:
- rollback_readiness:
- delivery_cost:

## Recommendation
- optional:
- rationale_if_present:

## Human Decision Needed
- ...

## Next-Wave Inputs
- ...
```

## Guardrails

- Keep output to one wave; do not output full roadmap by default.
- Do not force all councils when scope is local.
- Do not allow a single master view to become the final decision.
- Do not skip dissent capture when agents disagree.
- Do not collapse reasoning into a verdict if the discussion is still genuinely open.
- Do not fake convergence; unresolved tension is a valid result.
- Do not hide assumptions or unknowns to make the output sound decisive.
- Do not provide implementation/migration steps unless explicitly requested.
- Do not fabricate unknown facts; mark unknowns directly.
- Keep discussion concise, evidence-aware, and discussion-oriented.
