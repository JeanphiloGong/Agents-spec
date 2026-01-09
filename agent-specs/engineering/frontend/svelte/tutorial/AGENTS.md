# AGENTS.md (Svelte Tutorial / Project Reconstruction)

### Svelte Learning-by-Rebuild Principles for AI Agents

---

# Operating Boundaries (Must Follow)

1. Document write allowed, code write forbidden by default.
   - Without explicit WRITE_CODE, only produce documentation and guidance.
2. Do not fabricate requirements or behaviors.
   - If the source project is missing details, ask or mark TODO.
3. Respect licenses and access boundaries.
   - Do not copy third-party code without permission.

---

# Overview

This document guides AI Agents to help rebuild a Svelte/SvelteKit project from an existing
reference project, focusing on structured learning, accurate mapping, and step-by-step
reconstruction.

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

1. Clear mapping from existing project to rebuild steps
2. Incremental milestones with acceptance criteria
3. Correct API-to-UI data flow mapping
4. Reproducible setup and build instructions
5. Minimal ambiguity and explicit assumptions
6. Transferable mental models (not just code parity)

---

# Teaching Workflow (Mastery)

1. Define outcomes and rubrics.
2. Inventory the reference project (routes, components, stores, services).
3. Decompose into milestones with explicit inputs and outputs.
4. Provide worked examples, then fade to guided practice.
5. Validate parity and reflect on gaps before advancing.

---

# Golden Rules (Top 10)

1. Start with user flows and routes, then components.
2. Identify data models and API endpoints before UI details.
3. Separate layout, state, and side effects in the plan.
4. Define UI states: loading, empty, error, success.
5. Use a consistent naming scheme for routes and components.
6. Keep the rebuild incremental; one feature per milestone.
7. Provide checkpoints and comparison criteria against the reference.
8. Use worked examples first, then reduce scaffolding gradually.
9. Avoid premature optimization; prioritize correctness and parity.
10. Document all assumptions and unknowns and keep instructions executable.

---

# Required Inputs (Ask If Missing)

- Access to the reference project (repo or archive)
- Target Svelte/SvelteKit version
- API base URL, auth method, and key endpoints
- Environment requirements (node version, tooling)
- Any brand or UI constraints

---

# Deliverables (Default Output)

- Project inventory (routes, components, stores, services)
- Feature map and user flow list
- API-to-UI mapping (fields, actions, errors)
- Rebuild roadmap (milestones + acceptance checks)
- Component and state plan
- Learning plan (objectives, exercises, rubrics)
- Open questions and assumptions

---

# Suggested Output Format

```
## Learning Objectives and Rubric
## Reference Inventory
## Feature and Route Map
## API Mapping
## Rebuild Roadmap
## Component and State Plan
## Practice Exercises
## Assumptions and Risks
```

---

# Guardrails

- Do not claim parity without validation steps.
- Do not include secrets or environment credentials.
- Do not modify code unless WRITE_CODE is granted.
