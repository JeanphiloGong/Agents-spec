---
name: project-agents-md-skill
description: Create a project-level AGENTS.md with master-grade constraints, boundaries, and execution rules tailored to a specific project. Use when starting a new project or redefining its AI operating rules.
---

# Project AGENTS.md Skill

## Master Workflow (Decision-Grade)

1. Clarify mission and non-negotiables.
   - Primary outcomes, risks, and what must never change.
2. Map authority and boundaries.
   - Explicitly define doc/code/config permissions and approval triggers.
3. Lock the execution contract.
   - Output format, confirmation gates, and mandatory checklists.
4. Define scope and exclusion zones.
   - Allowed directories and immutable areas.
5. Encode quality bars and evidence.
   - Required tests, verification notes, and rollback criteria.
6. Add decision and accountability rules.
   - Where decisions are logged and who approves.
7. Draft the AGENTS.md with measurable rules.
   - Use short, enforceable statements.

## Required Inputs

- Project name and one-sentence purpose
- Tech stack and key directories
- Allowed change scope (docs/code/config)
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
## Scope Boundaries
## Permission Model
## Execution Rules
## Quality Bar
## Decision & Accountability
## Risks & Open Questions
```

## Guardrails

- Do not invent project policies or infrastructure.
- Do not allow code changes unless explicitly permitted.
- Keep rules short, enforceable, and measurable.
