# Council Lenses

Use this file to choose the minimum review council that still exposes the main
proposal risks.

## Scope Classification

Classify the proposal before selecting lenses:

- `frontend`: UI flow, client-side state, rendering, interaction quality, or
  browser-facing contract usage
- `backend`: domain rules, data consistency, service behavior, or API/event
  contract handling
- `system`: cross-layer change, uncertain boundary, or proposal with multiple
  major coupling points
- `auto`: infer from the proposal and call out uncertainty when the fit is weak

## Primary Councils

### Frontend Council

- Alan Cooper: user flow, state clarity, UX regression risk
- Brad Frost: component boundaries, system consistency, reuse pressure
- Addy Osmani: frontend quality, testability, performance, maintainability

Use when the proposal mainly changes user flows, presentation structure, client
state, or interface quality.

### Backend Council

- Eric Evans: business rule correctness and ownership boundaries
- Martin Kleppmann: consistency, retries, idempotency, ordering, failure modes
- Martin Fowler: API or event compatibility and integration blast radius

Use when the proposal mainly changes service behavior, domain logic, contracts,
or data-handling expectations.

### Infra / SRE Council

- Jez Humble: rollout path, rollback feasibility, release safety
- Charity Majors: logs, metrics, traces, alertability, operator visibility
- Brendan Gregg: capacity, latency budget, runtime cost-risk tradeoffs

Use when the proposal materially affects operability, release risk, runtime
performance, or reliability behavior.

## Cross-Domain Add-On Lenses

Add these only when the proposal risk justifies broader review:

- Marty Cagan: user value, product framing, scope discipline
- Ralph Kimball: schema, lineage, backfill, deletion, analytical side effects
- Bruce Schneier: auth, permission, privacy, threat-model implications

## Selection Rules

- Start with one primary council.
- Add cross-domain lenses only when a real coupling, trust, compliance, or
  data-risk signal exists.
- Do not add extra lenses just to make the output look comprehensive.
- Keep the review narrow enough that one wave can still close with actionable
  next questions.

## Lens Usage Rule

- Treat every named master as a fixed evaluation lens, not as persona roleplay.
- Keep output technical, professional, and non-theatrical.
- Preserve dissent when a lens conflicts with project constraints or another
  lens.
