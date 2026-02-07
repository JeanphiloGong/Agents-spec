# Example Map: What You Must Control vs Delegate

Use this file as a fast “muscle memory” guide when you are unsure where a change belongs.

## Core rule (repeatable)

- More rules, more states, higher liability → **you lead** (RED/YELLOW).
- More standardized glue, replaceable structure, low failure cost → **delegate** (GREEN).

## Backend

### Typically RED (Must-Control)
- **Ordering, pricing, billing, settlement**
  - pricing rules, discount stacking, refunds/rollbacks, idempotency
- **Auth & authorization**
  - RBAC/ABAC rules, special cases, boundary enforcement, risk controls
- **State machines & workflows**
  - order status transitions, approvals, saga/compensation logic
- **Cross-service coordination**
  - transaction boundaries, event ordering, consistency model choices

### Typically GREEN (Delegate)
- **Controllers / API glue**
  - request parsing, error mapping, thin routing, basic DTO plumbing
- **Repositories / ORM CRUD**
  - standard queries, mappings, persistence adapters (when contracts don’t change)

## Frontend

### Typically RED (Must-Control)
- **Complex interaction state**
  - multi-step forms, wizards, conditional visibility, undo/redo (state machine behavior)
- **Permission & visibility logic**
  - role-based routing, gated actions, “when a button is allowed” rules
- **Performance-critical paths**
  - large lists, virtual scrolling, caching strategy, expensive derived state

### Typically GREEN (Delegate)
- **Styling & layout**
  - CSS/Tailwind, animations, visual polish (unless it changes semantics/accessibility)
- **Page composition**
  - dashboard wiring, basic list/detail pages with no tricky state or policy

## Testing

### Typically RED (Must-Control)
- **Property/invariant tests**
  - invariants, boundaries, negative cases, forbidden combinations
  - tests that prove “cannot happen” and “only-once” semantics

### Typically GREEN (Delegate, with your review)
- **Case expansion**
  - parameter combinations, table-driven tests, fuzz/property scaffolding

## Infrastructure / DevOps

### Typically RED (Must-Control)
- **Architecture decisions**
  - service boundaries, messaging vs RPC, consistency model, rollout model
- **Security policies**
  - secrets management, IAM permissions, network isolation, least privilege

### Typically GREEN (Delegate)
- **CI configs**
  - GitHub Actions/GitLab CI templates (verify but don’t over-invest)
- **Disposable scripts**
  - small deploy helpers, one-off automation (keep them reversible)

## Data / Analytics

### Typically RED (Must-Control)
- **Metric definitions**
  - business semantics, dedupe rules, time windows, attribution logic
  - (definition wrong → dashboards and decisions wrong)

### Typically GREEN (Delegate)
- **SQL mechanics**
  - joins, group by, query rewrites (as long as semantics are already pinned)

## AI Systems (Prompted Products)

### Typically RED (Must-Control)
- **Prompt I/O contracts**
  - input/output schema, failure fallbacks, safety/risk controls
  - “what must be true” for outputs and what is forbidden

### Typically GREEN (Delegate)
- **Wording variants**
  - phrasing, examples, and prompt style variants (once the contract is locked)

## One-line heuristic

Ask: **“Does this change define a fact that must always be true?”**
- If yes → you lead (RED/YELLOW).
- If it only executes, transports, or formats already-defined facts → delegate (GREEN).
