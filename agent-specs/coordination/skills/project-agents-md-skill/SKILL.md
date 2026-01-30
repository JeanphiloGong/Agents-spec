---
name: project-agents-md-skill
description: Create a project-level AGENTS.md with master-grade constraints, boundaries, and execution rules tailored to a specific project. Use when starting a new project or redefining its AI operating rules.
---

# Project AGENTS.md Skill

## Workflow

1. Clarify mission and non-negotiables.
   - Capture primary outcomes, unacceptable failures, and the highest-risk path.
2. Map authority and boundaries.
   - Define scope boundaries, approval requirements, and ownership.
3. Lock the execution contract.
   - Confirm output format, confirmation gates, and checklists.
4. Define scope and exclusion zones.
   - Name allowed directories and immutable areas explicitly.
5. Encode quality bars and evidence.
   - Required tests, verification notes, and rollback criteria.
6. Add decision and accountability rules.
   - Who approves AGENTS.md changes; git history is the source of truth for change tracking.
7. Integrate product and project standards.
   - Goals, success metrics, scope, milestones, acceptance criteria, and risks.
8. Identify domain philosophies.
   - Select only domains that materially apply; explain omissions.
9. Draft AGENTS.md with measurable rules.
   - Use short, enforceable statements; avoid ambiguity.
10. Validate against guardrails.
   - Ensure no invented policies or hidden coupling.

## Required Inputs

- Project name and one-sentence purpose
- Tech stack and key directories
- Allowed vs forbidden directories
- Approval model for code/config changes

## Required Inputs Missing

- List any missing items before drafting AGENTS.md
- Ask concise questions to fill gaps

## Defaults (Use Only If User Confirms)

- High-risk areas: deployment configs, production data paths, CI/CD, auth, billing.
- Strictly forbidden: secrets/keys/PII and irreversible history changes.
- Proof before "done": note tests run, or state "not run" with reason.
- AGENTS.md changes are recorded in git history; no separate decision/risk log.
- Collaboration mode: single-agent unless explicitly enabled.
- Domain philosophies: enumerate options, choose relevant domains, justify omissions.
- Language: English, ASCII unless the project already uses another language.

## Master Checklist (Must Answer)

- Highest-risk failure mode
- Strictly forbidden files or directories
- Required approvals for code or config
- Proof required before declaring "done"

## Output Format

```
# AGENTS.md (Project Rules)
## Overview
## Core Principles
## Domain Philosophies (Master-Level)
## Product & Project Standards
## 12 Golden Rules (Why / How / Check)
## Scope Boundaries
## Permission Model
## Execution Rules
## Quality Bar
## Decision & Accountability
## Risks & Open Questions
```

## Guardrails

- Do not invent project policies or infrastructure.
- Keep rules short, enforceable, and measurable.
- Avoid cross-module coupling unless explicitly approved.
- No secrets, tokens, or PII.

## Iteration Loop (Required)

- Run acceptance review using `references/acceptance-criteria.md` and record pass/fail evidence.
- Capture gaps with scope impact and ownership (who resolves and by when).
- Define a next-iteration checklist that targets the highest-impact gap first.
- Explicitly name the highest-risk gap and the concrete verification step to close it.

## Reinforcement Plan (Required)

Goals

Reduce recurring failures by turning them into explicit, testable guardrails.

Improve success rate by promoting consistently high-performing workflows into defaults.

Maintain quality by retiring or demoting patterns that repeatedly fail validation.

Operating Rules

Reinforcement runs in a repeatable four-step loop.

Changes must be localized, reversible, and auditable (small diffs, clear rationale).

Every loop produces artifacts: a plan note, a change log, a verification record, and a reflection entry.

Audit baseline

Each reinforcement round must produce:
- A Git commit that contains only that round's changes.
- An audit record in `references/reinforcement-audit.jsonl`.
- Validate the record with `scripts/validate_reinforcement_audit.py`.

Four-step Reinforcement Cycle
1) Plan (Objective + Scope)

Objective

State the user outcome in one sentence (e.g., "Reduce policy violations in AGENTS.md generation.").

Define measurable acceptance criteria:

e.g., "Pass rate >= 95% on last 50 runs," "0 critical policy violations," "avg. retries <= 1."

Scope

List what is in-scope (files, modules, prompts, edge cases).

List explicit out-of-scope boundaries to prevent cross-cutting changes:

e.g., "No changes to unrelated skills," "No behavior change outside AGENTS.md flow," "No new dependencies."

Inputs

Include the evidence you are responding to:

Failure examples (IDs or links), frequency, severity, and failure taxonomy label.

Exit Condition

Define when you stop planning and move to change (e.g., "Top 1-2 failure modes identified + proposed guardrails drafted.")

2) Change (Apply Edits)

Edit Principles

Prefer clarity over cleverness.

Keep changes small and isolated (one failure mode per change set when possible).

Make edits auditable:

Add a short "Why" comment or changelog entry.

Use consistent naming for guardrails and workflows (e.g., GR-###, WF-###).

Outputs

Patch or diff summary:

What changed

Where changed

Which failure mode it targets

Expected behavior shift (before or after)

Rollback

Define how to revert (feature flag, revert commit, config toggle).

3) Verify (Checks + Evidence)

Verification Steps (must be reproducible)

Unit checks (logic-level)

Integration checks (tooling-level)

Regression checks (previously passing cases)

Negative tests (ensure boundaries are respected)

Evidence (recorded)

Test run IDs or log excerpts or screenshots as applicable

Metrics snapshot:

pass or fail counts

top remaining failure categories

any new failure introduced

Decision Rule

Promote or hold or rollback based on acceptance criteria:

Promote if criteria met

Hold if partial (define what is missing)

Rollback if any critical regressions or policy or validation failures

4) Reflect (Improvements + Next Adjustments)

What improved

Which failure modes dropped, by how much (numbers, not vibes).

What guardrail or workflow proved effective.

Risks and Tradeoffs

Any new complexity, false positives, coverage gaps.

Next highest-impact refinement

One prioritized next action:

e.g., "Add targeted test set for X edge case," "Split WF into two variants," "Demote pattern Y."

Outcome

Update the reinforcement backlog with the reflection outcome.

## Step Gate (Required)

After each of the four steps (Plan, Change, Verify, Reflect), prompt: "continue?"

Do not proceed to the next step until explicit confirmation: continue.

While awaiting confirmation, do not apply further edits, run additional checks, or advance the loop.

If the operator replies with anything other than continue, keep the loop at the current step and re-prompt "continue?" without advancing.

Confirmation token: `continue`.

## Domain Philosophy Guidance

Select only domains that materially apply to the project, and include the prompts below.

## Domain Identification Prompts

- What domains materially shape success or risk in this project?
- What is the highest cost of failure in each domain?
- What evidence is required to trust decisions in that domain?
- What constraints are non-negotiable?

## Standard Philosophy Template (Per Domain)

- **Goal**: What success means in this domain.
- **Constraints**: What must not be violated.
- **Evidence**: What proofs or signals are required.
- **Failure Cost**: What happens if this domain fails.
- **Tradeoffs**: What you are willing to sacrifice and why.
- **Non-negotiables**: Explicit red lines.

## Example Domain Coverage (Expand as Needed)

- Engineering:
  - Goal: correctness, clarity, and long-term maintainability.
  - Constraints: avoid hidden coupling and accidental complexity.
  - Evidence: clear interfaces, ownership boundaries, reviewable changes.
  - Failure Cost: regressions that are hard to trace or reverse.
  - Tradeoffs: choose clarity and stability over cleverness.
  - Non-negotiables: no undocumented cross-module dependencies.
- Frontend:
  - Goal: user intent clarity, fast feedback, accessible interaction.
  - Constraints: keep critical flows simple and predictable.
  - Evidence: usability cues, state visibility, performance metrics.
  - Failure Cost: confusion, abandonment, and accessibility regressions.
  - Tradeoffs: prioritize simplicity over visual novelty.
  - Non-negotiables: accessibility regressions are unacceptable.
- Backend:
  - Goal: reliability, contract stability, and safe failure modes.
  - Constraints: preserve API contracts and operational safety.
  - Evidence: observability, stable interfaces, error budgets.
  - Failure Cost: downstream outages and data inconsistency.
  - Tradeoffs: correctness and safety over marginal latency gains.
  - Non-negotiables: breaking changes require explicit approval.
- API/Interface:
  - Goal: predictability and integration trust.
  - Constraints: semantic versioning and compatibility discipline.
  - Evidence: documented contracts and tested examples.
  - Failure Cost: client breakage and integration churn.
  - Tradeoffs: slower change velocity to preserve stability.
  - Non-negotiables: no silent contract drift.
- Algorithm:
  - Goal: valid outputs and transparent tradeoffs.
  - Constraints: control bias, validate inputs, avoid hidden heuristics.
  - Evidence: benchmarks, error analysis, and reproducible results.
  - Failure Cost: harmful or misleading outputs.
  - Tradeoffs: interpretability over marginal accuracy when risk is high.
  - Non-negotiables: no unvalidated data assumptions.
- Data:
  - Goal: trustworthy, governed, and privacy-safe data.
  - Constraints: lineage, access control, and retention policies.
  - Evidence: data quality checks, lineage records, audits.
  - Failure Cost: incorrect decisions and compliance exposure.
  - Tradeoffs: slower ingestion to preserve data integrity.
  - Non-negotiables: no untracked data transformations.
- Product:
  - Goal: measurable user value and outcome focus.
  - Constraints: scope discipline and validated priorities.
  - Evidence: success metrics and acceptance criteria.
  - Failure Cost: misaligned delivery and wasted effort.
  - Tradeoffs: reduce breadth to improve core value.
  - Non-negotiables: no work without defined impact.
- Project Management:
  - Goal: predictable delivery and accountable execution.
  - Constraints: dependency clarity and milestone integrity.
  - Evidence: schedules, risk logs, and delivery checkpoints.
  - Failure Cost: cascading delays and missed deadlines.
  - Tradeoffs: defer non-critical work to protect milestones.
  - Non-negotiables: critical path changes require escalation.
- Science:
  - Goal: rigorous, reproducible knowledge.
  - Constraints: hypothesis discipline and methodological clarity.
  - Evidence: reproducible experiments and peerable results.
  - Failure Cost: false conclusions and wasted research cycles.
  - Tradeoffs: slower iteration to maintain rigor.
  - Non-negotiables: no claims without evidence.
- Medical:
  - Goal: patient safety and ethical integrity.
  - Constraints: compliance, auditability, and clinical boundaries.
  - Evidence: traceable decisions and validated protocols.
  - Failure Cost: patient harm and legal exposure.
  - Tradeoffs: conservative changes over experimental risk.
  - Non-negotiables: safety overrides all other goals.
- Security:
  - Goal: preserve confidentiality, integrity, and availability.
  - Constraints: least privilege and secure defaults.
  - Evidence: threat models, audits, and incident reviews.
  - Failure Cost: breaches, outages, and reputational damage.
  - Tradeoffs: reduced convenience to increase safety.
  - Non-negotiables: no secret leakage or unchecked access.
- Design/UX:
  - Goal: reduce cognitive load and prevent user errors.
  - Constraints: consistent patterns and inclusive design.
  - Evidence: usability feedback and completion rates.
  - Failure Cost: user frustration and task failure.
  - Tradeoffs: prioritize clarity over decoration.
  - Non-negotiables: critical flows must be obvious.
- Operations/SRE:
  - Goal: reliability and fast recovery.
  - Constraints: incident readiness and rollback capability.
  - Evidence: SLOs, incident runbooks, postmortems.
  - Failure Cost: prolonged outages and data loss.
  - Tradeoffs: slower releases to preserve stability.
  - Non-negotiables: no changes without rollback path.
- QA/Testing:
  - Goal: prevent regressions in critical paths.
  - Constraints: risk-based coverage and reproducibility.
  - Evidence: test results and coverage reports.
  - Failure Cost: production defects and user impact.
  - Tradeoffs: prioritize critical flows over exhaustive tests.
  - Non-negotiables: critical flows must be verified.
- Performance/Systems:
  - Goal: meet latency and throughput budgets.
  - Constraints: resource limits and predictable scaling.
  - Evidence: benchmarks, load tests, performance budgets.
  - Failure Cost: degraded UX and infrastructure cost spikes.
  - Tradeoffs: avoid complexity that harms maintainability.
  - Non-negotiables: performance regressions must be addressed.
- Compliance/Legal:
  - Goal: regulatory alignment and audit readiness.
  - Constraints: retention, consent, and data locality rules.
  - Evidence: documented policies and audit trails.
  - Failure Cost: legal exposure and operational shutdowns.
  - Tradeoffs: slower change to maintain compliance.
  - Non-negotiables: no violations of regulatory controls.
- ML/AI:
  - Goal: safe, reliable model behavior.
  - Constraints: drift monitoring, explainability, and bias controls.
  - Evidence: evaluation reports and monitoring dashboards.
  - Failure Cost: harmful outputs and loss of trust.
  - Tradeoffs: prefer robustness over marginal accuracy.
  - Non-negotiables: no deployment without evaluation.
- Finance:
  - Goal: correct and auditable financial outputs.
  - Constraints: reconciliation and fraud safeguards.
  - Evidence: audit logs and reconciliation checks.
  - Failure Cost: financial loss and regulatory exposure.
  - Tradeoffs: slower processing to preserve accuracy.
  - Non-negotiables: no unverified financial calculations.
- Growth/Marketing:
  - Goal: measurable funnel impact and clear positioning.
  - Constraints: attribution integrity and ethical messaging.
  - Evidence: funnel metrics and cohort analysis.
  - Failure Cost: misattribution and wasted spend.
  - Tradeoffs: avoid aggressive tactics that erode trust.
  - Non-negotiables: no misleading claims.
- Education/Docs:
  - Goal: learner success and knowledge transfer.
  - Constraints: progressive disclosure and clarity of intent.
  - Evidence: comprehension checks and feedback loops.
  - Failure Cost: confusion and failed adoption.
  - Tradeoffs: depth reduced to improve clarity for novices.
  - Non-negotiables: no ambiguous or contradictory guidance.
- Platform/Infrastructure:
  - Goal: stable shared foundations and consistent developer experience.
  - Constraints: backward compatibility and clear ownership.
  - Evidence: uptime, change logs, and adoption metrics.
  - Failure Cost: broken dependencies and team friction.
  - Tradeoffs: slower change to protect shared contracts.
  - Non-negotiables: no breaking changes without migration paths.
- Search/Discovery:
  - Goal: relevant results with predictable ranking.
  - Constraints: transparency and fairness in ranking signals.
  - Evidence: relevance metrics, click-through, and error analysis.
  - Failure Cost: poor discoverability and user churn.
  - Tradeoffs: simpler ranking for explainability and stability.
  - Non-negotiables: no hidden ranking logic that cannot be justified.
- Privacy:
  - Goal: user trust through data minimization and consent.
  - Constraints: retention limits and access controls.
  - Evidence: audits and compliance checks.
  - Failure Cost: legal exposure and trust loss.
  - Tradeoffs: reduce data collection to preserve privacy.
  - Non-negotiables: no data use without consent or policy basis.
- Payments/Billing:
  - Goal: accurate, traceable, and resilient financial flows.
  - Constraints: reconciliation, fraud checks, and compliance.
  - Evidence: ledger audits and chargeback monitoring.
  - Failure Cost: financial loss and regulatory penalties.
  - Tradeoffs: slower processing to ensure correctness.
  - Non-negotiables: no unverified billing operations.
- Supply Chain/Logistics:
  - Goal: reliable fulfillment and inventory accuracy.
  - Constraints: lead times and dependency risk.
  - Evidence: fulfillment SLAs and inventory audits.
  - Failure Cost: stockouts and customer dissatisfaction.
  - Tradeoffs: buffer inventory to reduce risk.
  - Non-negotiables: no untracked inventory changes.
- Content Moderation:
  - Goal: user safety and platform integrity.
  - Constraints: policy consistency and appeal workflows.
  - Evidence: moderation accuracy metrics and review audits.
  - Failure Cost: harm, legal exposure, or trust loss.
  - Tradeoffs: conservative enforcement to reduce harm.
  - Non-negotiables: no policy bypass for high-risk content.
- Gaming:
  - Goal: fair play, engagement, and stability.
  - Constraints: anti-cheat and economy balance.
  - Evidence: telemetry, retention, and exploit reports.
  - Failure Cost: player churn and economy collapse.
  - Tradeoffs: limit power to preserve balance.
  - Non-negotiables: no exploits left unaddressed.
- Design System:
  - Goal: scalable UI consistency and velocity.
  - Constraints: token governance and component contracts.
  - Evidence: adoption rates and consistency audits.
  - Failure Cost: fragmentation and UX inconsistency.
  - Tradeoffs: restrict customization to protect consistency.
  - Non-negotiables: no unreviewed design tokens.

For cross-domain projects, include multiple philosophies and state overlaps explicitly.
