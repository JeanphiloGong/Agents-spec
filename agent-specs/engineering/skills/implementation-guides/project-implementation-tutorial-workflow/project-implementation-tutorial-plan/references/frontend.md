# Frontend Mode

Use for browser or client interface modules. A module is a coherent user
capability such as workspace navigation, file research, or approval review;
several screens may belong to one module.

## V0: Discuss Behavior and Produce the Module Design

Inspect the design's relevant frames, prototype links, annotations, and current
UI, plus actual routes, API clients, state owners, and tests. Record which
design revision was inspected; unavailable Figma access is a stated limitation,
not a reason to invent its contents. Figma is useful input, not proof of runtime
behavior or a mandatory tool when another agreed design source exists.

First walk the complete bounded user task from intent through its observable
result and next action, including alternatives and failures. Derive contracts
and ownership from this flow before planning implementation exercises. Settle
the decisions that change the implementation:

- What does each consequential action do: navigate, change an unsaved selection,
  create a record, submit a job, or approve a specific write? Include its
  prerequisites, confirmation, cancellation, and return path.
- Which loading, empty, failed, partial, pending, success, and stale states
  actually apply? Distinguish no data from inability to load it. Describe
  transitions, refresh/deep links, and late responses after navigation.
- For each view/action, identify required fields, units, identities, scope,
  counts, pagination, request/response and error semantics, and existing API
  support. Label gaps and proposed changes; coordinate with the owning backend
  contract instead of designing an unrelated second API.
- Assign server-owned facts, URL state, shared application state, and local
  drafts to actual owners. Trace user/tenant/workspace changes, invalidation,
  request cancellation, and any optimistic update or retry that matters.
- Identify route/layout/component responsibilities from this flow. Reuse
  current code. Cover keyboard/focus, relevant viewport changes, long text,
  localization, and existing theme behavior where they affect the task.

Deliver the V0 design plus complete applicable contract documents with the
tutorial's reference project. Define interaction/state rules and the consumed
API's fields, error behavior and ownership; reuse sufficient authoritative
contracts without creating a second API definition. New or changed required
contracts cannot remain empty templates or future implementation tasks.
An unrelated database or RPC document is not required for a frontend module.

The lesson presents user flow first, contracts and constraints next, and
V1–Vn exercises with acceptance scenarios last. Link the actual documents
without repeating their full contents or prescribing per-file copy/patch
steps. Use existing checkpoints or versions to preserve the V0 contract state.

An assistant's proposed answer is not a user decision. Resolve blocking choices
in conversation, then update the document. Reuse already confirmed rules.
Unresolved API ownership or action semantics block only dependent coding
scope, not independent design inspection. Never label static prototype clicks
as verified authorization, persistence, or actual hit targets.

## V1–Vn: Plan Working User Capabilities

Choose a first complete action through the real routes and APIs. A useful
increment might load a workspace's files with correct empty/error states;
later versions add selection and research handoff. Do not default to one
version for markup, one for CSS, and another for all behavior and failures.

Name exact components, clients, callers, state changes, and reader checks.
Checks exercise visible results and relevant boundaries: workspace isolation,
late responses, Source return context, duplicate submission, or permission
changes as needed. Include a real browser path for interaction/layout claims;
type checks or component snapshots alone cannot prove the whole task.

If the API is missing, settle or name the backend prerequisite. Explicitly
agreed mocks must have an activation boundary and verification limits. A
mock-backed UI is not completed backend integration. Do not impose backend
DDD, repositories, or duplicated business rules on the browser without a real
frontend responsibility requiring them.
