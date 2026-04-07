# Document Taxonomy

Use this reference when you need the default document families and scope model
for one project repository.

## Document Types

### `policy`
- Purpose: define project rules, standards, or governance requirements.
- Use when: the document tells this repo how it must operate.
- Do not use when: the document is proposing a new feature or describing one
  module’s implementation.

### `rfc`
- Purpose: propose a change before or during implementation.
- Use when: the team needs a reviewable design or workflow proposal.
- Do not use when: the design is already accepted as current reality.

### `adr`
- Purpose: record a key decision and why it was made.
- Use when: the decision is important enough to preserve after implementation.
- Do not use when: the document must explain the full current system design.

### `architecture`
- Purpose: describe the current real design of a system, domain, or module.
- Use when: readers need to understand how the software actually works now.
- Do not use when: the document is mainly a proposal or task tracker.

### `spec`
- Purpose: define a stable contract such as API, schema, workflow, state
  machine, or interface behavior.
- Use when: the document describes something other systems or teams rely on.
- Do not use when: the content is only exploratory or temporary.

### `guide`
- Purpose: help humans use, extend, or operate a workflow.
- Use when: the target reader needs step-by-step guidance.
- Do not use when: the document is the authoritative contract or design.

### `runbook`
- Purpose: describe repeatable operational or recovery procedures.
- Use when: the reader must execute a support, incident, rollout, or recovery
  action.
- Do not use when: the content is primarily architectural explanation.

### `postmortem`
- Purpose: capture incident analysis, lessons, and corrective actions.
- Use when: a failure or notable event should create durable learning.
- Do not use when: the content is really a design proposal or open task list.

## Scope Levels

### `system`
- Entire product or service family.

### `domain`
- A major discipline or bounded area such as frontend, backend, AI, data, or
  platform.

### `module`
- A service, flow, or feature area that can be reasoned about as one unit.

### `component`
- A narrower submodule, page, library component, or task-local structure.

## Default Domain Mapping

- `frontend`: UI, UX, client architecture, page flows, component systems
- `backend`: services, APIs, storage behavior, backend workflows
- `ai`: planners, retrieval, prompts, evaluation, model workflows
- `data`: schemas, lineage, transformations, governance
- `shared`: cross-domain or end-to-end designs that do not belong to one domain

## Selection Rule

Choose the type by the document’s primary job:

- proposing => `rfc`
- deciding => `adr`
- describing current design => `architecture`
- defining contract => `spec`
- teaching => `guide`
- operating => `runbook`
- governing => `policy`
- learning from failure => `postmortem`

If a document appears to fit two types, split it unless one role is clearly
secondary.
