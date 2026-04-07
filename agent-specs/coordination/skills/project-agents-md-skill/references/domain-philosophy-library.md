# Domain Philosophy Library

Use this file to choose only the domains that materially shape project risk,
evidence, or tradeoffs. Do not copy every domain into `AGENTS.md`.

## Engineering

- Goal: correct, maintainable, and explainable systems.
- Constraints: avoid hidden complexity and undocumented coupling.
- Evidence: clear interfaces, explicit ownership, and reviewable changes.
- Failure Cost: silent regressions and hard-to-trace behavior.
- Tradeoffs: choose clarity over cleverness when in doubt.
- Non-negotiables: no undocumented cross-module dependencies.

## Backend

- Goal: reliability and contract stability under load.
- Constraints: preserve API contracts and operational safety.
- Evidence: observability, error budgets, and stable interfaces.
- Failure Cost: downstream outages and data inconsistency.
- Tradeoffs: favor correctness and safety over latency micro-optimizations.
- Non-negotiables: no breaking changes without explicit approval.

## Frontend

- Goal: clear intent, fast feedback, and accessible interaction.
- Constraints: keep primary flows simple and predictable.
- Evidence: visible state, usability cues, and performance metrics.
- Failure Cost: user confusion, abandonment, and accessibility regressions.
- Tradeoffs: prefer clarity over decorative complexity.
- Non-negotiables: accessibility regressions are unacceptable.

## Product

- Goal: measurable user value with minimal scope creep.
- Constraints: maintain scope discipline and acceptance criteria.
- Evidence: success metrics, user outcomes, and explicit exclusions.
- Failure Cost: misaligned work and wasted effort.
- Tradeoffs: reduce breadth to increase quality on the core path.
- Non-negotiables: no work without defined user impact.

## Project Management

- Goal: predictable delivery through clear milestones and ownership.
- Constraints: respect dependencies and sequencing.
- Evidence: milestones, risk tracking, and delivery checkpoints.
- Failure Cost: missed deadlines and cascading delays.
- Tradeoffs: defer low-impact work to protect the critical path.
- Non-negotiables: critical path changes must be escalated.

## Security

- Goal: preserve confidentiality, integrity, and availability.
- Constraints: least privilege and secure defaults.
- Evidence: threat models, audits, and incident reviews.
- Failure Cost: breaches, outages, and trust loss.
- Tradeoffs: accept some friction to reduce security risk.
- Non-negotiables: no secret leakage or unchecked privilege expansion.

## Data

- Goal: trustworthy, governed, and privacy-safe data handling.
- Constraints: lineage, access control, and retention discipline.
- Evidence: data quality checks, lineage records, and audits.
- Failure Cost: bad decisions, broken analytics, and compliance exposure.
- Tradeoffs: slower ingestion to preserve integrity and traceability.
- Non-negotiables: no untracked data transformations.

## AI / ML

- Goal: safe, reliable model behavior.
- Constraints: evaluation discipline, drift awareness, and bias controls.
- Evidence: evaluation reports, monitoring, and reproducible tests.
- Failure Cost: harmful outputs and trust erosion.
- Tradeoffs: prefer robustness over marginal accuracy gains.
- Non-negotiables: no deployment without evaluation.

## Operations / SRE

- Goal: reliability, recoverability, and safe change rollout.
- Constraints: rollback readiness and incident discipline.
- Evidence: SLOs, runbooks, alerts, and postmortems.
- Failure Cost: prolonged outages and operator overload.
- Tradeoffs: slower releases to preserve stability.
- Non-negotiables: no risky change without rollback or visibility.

## Docs / Enablement

- Goal: transfer durable knowledge with clear intent.
- Constraints: progressive disclosure and stable source-of-truth boundaries.
- Evidence: maintainable docs, reviewability, and user comprehension.
- Failure Cost: confusion, drift, and repeated mistakes.
- Tradeoffs: reduce breadth to keep guidance clear and current.
- Non-negotiables: no contradictory or unowned guidance.
