# AGENTS.md (Project Rules: agents-hub)

## Overview
- Project: agents-hub (Go backend + Svelte frontend).
- Goal: maintain a role/spec-driven repository with consistent, auditable AI outputs.
- Mode: single-agent by default.

## Core Principles
1. Rules over improvisation.
2. Only change what you can explain and verify.
3. Prefer clarity and traceability over speed.
4. Minimize cross-cutting changes.
5. Document decisions and risks, not raw diffs.

## Domain Philosophies (Master-Level)
### Engineering Philosophy
- Goal: Build systems that are correct, maintainable, and explainable.
- Constraints: Avoid hidden complexity and brittle coupling.
- Evidence: Clear interfaces, explicit ownership, and reviewable changes.
- Failure Cost: Silent regressions and untraceable behavior.
- Tradeoffs: Choose clarity over cleverness when in doubt.
- Non-negotiables: No undocumented coupling across modules.

### Backend Philosophy
- Goal: Reliability and contract stability under load.
- Constraints: Preserve API contracts and operational safety.
- Evidence: Observability, error budgets, and stable interfaces.
- Failure Cost: Downstream outages and data inconsistency.
- Tradeoffs: Favor correctness and safety over latency micro-optimizations.
- Non-negotiables: No breaking changes without explicit approval.

### Frontend Philosophy
- Goal: Clear user intent, fast feedback, and accessible interaction.
- Constraints: Keep primary flows simple and predictable.
- Evidence: Usability cues, state visibility, and performance metrics.
- Failure Cost: User confusion and task abandonment.
- Tradeoffs: Prefer simplicity and clarity over decorative complexity.
- Non-negotiables: Accessibility regressions are unacceptable.

### Product Philosophy
- Goal: Deliver measurable user value with minimal scope creep.
- Constraints: Maintain scope discipline and prioritize outcomes.
- Evidence: Defined success metrics and acceptance criteria.
- Failure Cost: Misaligned work and wasted effort.
- Tradeoffs: Reduce feature breadth to increase quality of the core path.
- Non-negotiables: No work without a defined user impact.

### Project Management Philosophy
- Goal: Predictable delivery through clear milestones and ownership.
- Constraints: Respect dependencies and sequencing.
- Evidence: Explicit milestones, risks, and delivery checkpoints.
- Failure Cost: Missed deadlines and cascading delays.
- Tradeoffs: Defer low-impact work to protect critical milestones.
- Non-negotiables: Critical path changes must be escalated.

## Product & Project Standards
- Define measurable success metrics for each milestone.
- Maintain a single source of truth for scope and priority.
- Require acceptance criteria for all significant changes.
- Track risks with clear owners and mitigation plans.

## 12 Golden Rules (Why / How / Check)
1. Start from user outcomes.
   - Why: Prevents drifting into low-impact work.
   - How: Tie every task to a measurable outcome.
   - Check: Each task references a metric or acceptance criterion.
2. Keep scope explicit.
   - Why: Avoids hidden work and late surprises.
   - How: Document scope and exclusions upfront.
   - Check: Scope boundaries are referenced in plans.
3. Minimize cross-cutting changes.
   - Why: Reduces regression risk and review load.
   - How: Localize changes by feature or module.
   - Check: Changes touch the smallest viable set of files.
4. Preserve contracts.
   - Why: Prevents downstream breakage.
   - How: Treat public APIs as stable unless approved.
   - Check: Contract changes are explicitly reviewed.
5. Make state and intent visible.
   - Why: Improves trust and debugging speed.
   - How: Use clear UI states and logs.
   - Check: Loading/error/empty states are explicit.
6. Optimize for readability.
   - Why: Ensures long-term maintainability.
   - How: Prefer straightforward structure and naming.
   - Check: Changes are explainable in one sentence.
7. Validate high-risk paths first.
   - Why: Reduces costly rollbacks.
   - How: Test critical flows early.
   - Check: Critical paths have explicit verification notes.
8. Keep decisions traceable.
   - Why: Prevents repeating mistakes.
   - How: Record rationale with changes.
   - Check: Decisions reference risks or metrics.
9. Protect user trust.
   - Why: Trust loss is hard to recover.
   - How: Avoid regressions in core flows.
   - Check: Core flows are explicitly verified.
10. Maintain accessibility by default.
   - Why: Accessibility is baseline quality.
   - How: Follow semantic patterns and keyboard support.
   - Check: Accessibility checks are included in review.
11. Keep performance budgets.
   - Why: Performance is a feature.
   - How: Track and enforce budgets.
   - Check: Changes note any performance impact.
12. Close the loop with metrics.
   - Why: Outcomes matter more than outputs.
   - How: Define and track success metrics.
   - Check: Post-change metrics are referenced.

## Scope Boundaries
- Default focus: documentation and specs.
- High-risk areas: `app/`, `webapp/`, deployment configs.
- Changes outside docs require explicit approval and scope definition.

## Execution Rules
- Ask for missing requirements before writing.
- Provide outcome-focused updates: deliverables, risks, next steps, support needed.
- Do not auto-stage unrelated changes.
- Keep `Why/What` in every structured commit body. Add `Impact` only for an
  independent effect or preserved boundary, `Verification` only for actual
  result-bearing evidence, and `Refs` only for a real, verified reference.

## Quality Bar
- Every change must be explainable in one sentence.
- State testing status explicitly; if not run, say why.
- No secrets, tokens, or PII in outputs.

## Decision & Accountability
- Owner: `human/gong`.
- Single-agent execution unless explicitly enabled.
- Record major decisions and risks in documentation when relevant.

## Risks & Open Questions
- Confirm which subdirectories are allowed for future code edits.
- Clarify test strategy for Go backend and Svelte frontend when code changes are allowed.
