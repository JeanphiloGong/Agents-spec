---
name: project-agents-md-skill
description: Create a project-level AGENTS.md with master-grade constraints, boundaries, and execution rules tailored to a specific project. Use when starting a new project or redefining its AI operating rules.
---

# Project AGENTS.md Skill

## Master Workflow (Decision-Grade)

1. Clarify mission and non-negotiables.
   - Primary outcomes, risks, and what must never change.
2. Map authority and boundaries.
   - Define scope boundaries and decision approvals without emphasizing permission flags.
3. Lock the execution contract.
   - Output format, confirmation gates, and mandatory checklists.
4. Define scope and exclusion zones.
   - Allowed directories and immutable areas.
5. Encode quality bars and evidence.
   - Required tests, verification notes, and rollback criteria.
6. Add decision and accountability rules.
   - Where decisions are logged and who approves.
7. Integrate product and project standards.
   - Goals, success metrics, scope, milestones, acceptance criteria, and risks.
8. Identify domain philosophies.
   - Determine relevant domains (engineering, frontend, backend, data, science, medical, algorithmic, security).
   - Include master-level philosophy sections for each relevant domain.
9. Draft the AGENTS.md with measurable rules and golden rules.
   - Use short, enforceable statements.

## Master Workflow (Decision-Grade)

1. Clarify mission and non-negotiables.
   - Primary outcomes, risks, and what must never change.
2. Map authority and boundaries.
   - Define scope boundaries and decision approvals without emphasizing permission flags.
3. Lock the execution contract.
   - Output format, confirmation gates, and mandatory checklists.
4. Define scope and exclusion zones.
   - Allowed directories and immutable areas.
5. Encode quality bars and evidence.
   - Required tests, verification notes, and rollback criteria.
6. Add decision and accountability rules.
   - Where decisions are logged and who approves.
7. Integrate product and project standards.
   - Goals, success metrics, scope, milestones, acceptance criteria, and risks.
8. Identify domain philosophies.
   - Determine relevant domains (engineering, frontend, backend, data, science, medical, algorithmic, security).
   - Include master-level philosophy sections for each relevant domain.
9. Draft the AGENTS.md with measurable rules and golden rules.
   - Use short, enforceable statements.

## Required Inputs (Minimal)

- Project name and one-sentence purpose
- Tech stack and key directories

## Defaults (Use Unless User Specifies)

- Scope boundaries: permissive by default; allow doc/spec/code/config changes unless explicitly restricted.
- High-risk areas: deployment configs, production data paths, CI/CD, auth, billing.
- Strictly forbidden: secrets/keys/PII and irreversible history changes.
- Proof before “done”: note tests run, or state “not run” with reason.
- Decisions/risks log: project root docs or `agent-collab/coordination/` if present.
- Release/safety: avoid breaking changes; require rollback notes if risk is high.
- Collaboration mode: single-agent unless explicitly enabled.
- Domain philosophies: default to strict thinking; enumerate options, choose the relevant domains, and justify omissions.
- Language: English, ASCII unless the project already uses another language.

## Master Checklist (Must Answer)

- What is the highest-risk failure mode?
- Which files are strictly forbidden to change?
- What approvals are required for code or config?
- What proof is required before declaring "done"?
- Where are decisions and risks recorded?

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
```

## Domain Philosophy Guidance

Select only domains that materially apply to the project, and include the following:

## Domain Identification Prompts

- What domains materially shape success or risk in this project?
- What is the highest cost of failure in each domain?
- What evidence is required to trust decisions in that domain?
- What constraints are non-negotiable?

## Domain Philosophy Guidance

Select only domains that materially apply to the project, and include the following:

## Domain Identification Prompts

- What domains materially shape success or risk in this project?
- What is the highest cost of failure in each domain?
- What evidence is required to trust decisions in that domain?
- What constraints are non-negotiable?

## Domain Philosophy Guidance

Select only domains that materially apply to the project, and include the following:

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
