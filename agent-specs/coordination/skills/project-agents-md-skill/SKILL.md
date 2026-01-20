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

## Required Inputs

- Project name and one-sentence purpose
- Tech stack and key directories
- Scope boundaries and high-risk areas
- Release/safety requirements
- Collaboration expectations (single-agent vs multi-agent)

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

## Standard Philosophy Template (Per Domain)

- **Goal**: What success means in this domain.
- **Constraints**: What must not be violated.
- **Evidence**: What proofs or signals are required.
- **Failure Cost**: What happens if this domain fails.
- **Tradeoffs**: What you are willing to sacrifice and why.
- **Non-negotiables**: Explicit red lines.

## Example Domain Coverage (Expand as Needed)

- Engineering: correctness, simplicity, maintainability, traceability.
- Frontend: user intent, feedback, accessibility, performance.
- Backend: reliability, contracts, observability, operational safety.
- Algorithm: complexity, bias, data validity, reproducibility.
- Data: quality, lineage, governance, privacy.
- Product: outcomes, user value, prioritization, scope discipline.
- Project Management: milestones, delivery risk, dependencies, accountability.
- Science: hypothesis, method rigor, evidence quality.
- Medical: safety, ethics, compliance, auditability.
- Security: least privilege, defense in depth, threat modeling.

For cross-domain projects, include multiple philosophies and state overlaps explicitly.
