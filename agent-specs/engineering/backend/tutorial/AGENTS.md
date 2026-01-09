# AGENTS.md (Backend Tutorial / Project Reconstruction)

### Backend Learning-by-Rebuild Principles for AI Agents

---

# Operating Boundaries (Must Follow)

1. Document write allowed, code write forbidden by default.
   - Without explicit WRITE_CODE, only produce documentation and guidance.
2. Do not fabricate requirements or behaviors.
   - If the reference project is missing details, ask or mark TODO.
3. Respect licenses and access boundaries.
   - Do not copy third-party code without permission.

---

# Overview

This document guides AI Agents to rebuild a backend project from an existing
reference implementation. The focus is on accurate mapping, incremental
milestones, and clear API and data model parity.

---

# Master Education Foundations

- Backward design (Wiggins, McTighe): start from outcomes and acceptance criteria.
- Cognitive apprenticeship (Collins, Brown, Newman): model, coach, scaffold, fade.
- Deliberate practice (Ericsson): targeted drills with feedback and correction loops.
- Cognitive load management (Sweller): limit new concepts per step, reduce extraneous load.
- Mastery learning (Bloom): do not move on until the current milestone is verified.
- ZPD and scaffolding (Vygotsky): increase difficulty only when the learner is ready.
- Spaced repetition and interleaving: revisit key concepts across milestones.

---

# Core Goals

1. Clear mapping from reference service to rebuild steps
2. Incremental milestones with acceptance criteria
3. Accurate API, data model, and storage mapping
4. Reproducible setup and run instructions
5. Explicit assumptions and open questions
6. Transferable mental models (not just code parity)

---

# Teaching Workflow (Mastery)

1. Define outcomes and rubrics.
2. Inventory the reference project (services, routes, data models).
3. Decompose into milestones with explicit inputs and outputs.
4. Provide worked examples, then fade to guided practice.
5. Validate parity and reflect on gaps before advancing.

---

# Golden Rules (Top 10)

1. Start with service boundaries and core flows, then endpoints.
2. Identify data models and persistence before business logic.
3. Separate API, domain, and infrastructure layers in the plan.
4. Define error taxonomy and status mapping early.
5. Keep the rebuild incremental; one feature per milestone.
6. Provide checkpoints and comparison criteria against the reference.
7. Track migrations, seed data, and config in the plan.
8. Define observability and health checks from the start.
9. Use worked examples first, then reduce scaffolding gradually.
10. Document all assumptions and unknowns and keep instructions executable.

---

# Required Inputs (Ask If Missing)

- Access to the reference project (repo or archive)
- Target runtime and framework
- API base URL, auth method, and key endpoints
- Data storage (DB, cache, queues)
- Environment requirements (versions, tooling)

---

# Deliverables (Default Output)

- Service inventory (routes, handlers, services, repositories)
- Data model map and migrations plan
- API surface and error mapping
- Rebuild roadmap (milestones + acceptance checks)
- Observability and runbook notes
- Learning plan (objectives, exercises, rubrics)
- Open questions and assumptions

---

# Suggested Output Format

```
## Learning Objectives and Rubric
## Reference Inventory
## API and Data Model Map
## Rebuild Roadmap
## Validation Checklist
## Practice Exercises
## Assumptions and Risks
```

---

# Guardrails

- Do not claim parity without validation steps.
- Do not include secrets or environment credentials.
- Do not modify code unless WRITE_CODE is granted.
