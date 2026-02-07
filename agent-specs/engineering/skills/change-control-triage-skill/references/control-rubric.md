# Control Rubric: RED / YELLOW / GREEN

This rubric is deterministic. Do not “vibe” the classification.

## Step 0 — Evidence Gate

If you do not have a diff-backed file list, you must output `UNKNOWN` and request evidence.

## Step 1 — Auto-RED Categories (Hard Rules)

If a change touches any category below, it is **RED** by default (cannot be GREEN):

- **Auth & Authorization**: authn/authz, permissions, roles, token validation, session handling.
- **Pricing/Billing/Quotas**: price calculation, charging, refunds, coupons, discounts, entitlements, usage limits.
- **State Machines / Workflows**: order/payment lifecycle, approvals, job orchestration, sagas, retry workflows.
- **Data Migrations / Irreversible Writes**: schema migrations, backfills, deletion jobs, reconciliation processes.
- **Public Contracts**: API schemas, SDK interfaces, message formats, event schemas, DB contract tables.
- **Concurrency / Idempotency / Retries**: locking, dedupe keys, exactly-once/at-least-once semantics, ordering.
- **Infra / Deploy / CI**: runtime config, deployment manifests, feature flags that affect safety, CI gates.

If the project is small and has no clear “public API”, treat any boundary consumed by external clients as public.

## Step 2 — Scoring (For Non Auto-RED Items)

Score each change group across 5 dimensions. Each dimension is 0–2 points.

### A) Blast radius
- 0: local module, no external consumers
- 1: shared module or multiple call sites
- 2: cross-service / user-facing / many consumers

### B) Irreversibility
- 0: revert is trivial; no data implications
- 1: revert requires coordination or data cleanup
- 2: revert is hard; may require compensations/migrations

### C) Uncertainty
- 0: behavior fully understood, tests already exist
- 1: partial understanding or limited test coverage
- 2: unclear behavior, ambiguous requirements, or missing tests

### D) Trust boundary / security impact
- 0: internal-only, no sensitive data
- 1: handles external input or moderate sensitivity
- 2: auth, secrets, PII, payments, or policy enforcement

### E) Failure cost
- 0: inconvenience; easy to detect and fix
- 1: partial outage or moderate user impact
- 2: data loss, security incident, money loss, or widespread breakage

### Threshold mapping
- Total 0–2 → **GREEN**
- Total 3–5 → **YELLOW**
- Total 6–10 → **RED**

## Step 3 — Overrides (Explicit)

Promote to RED if any are true:
- The change introduces or modifies **business rules** (even if it’s “just a few ifs”).
- The change alters an **invariant** or an “only-once”/idempotency guarantee.
- There is no rollback story and the blast radius is 1+.

Promote to YELLOW if any are true:
- The change modifies cross-module interfaces but is reversible with tests.
- The change refactors non-trivial logic without behavior change proof.

## What “GREEN” Is (Examples)

GREEN is usually:
- formatting-only changes
- comment/documentation changes
- mechanical renames with tooling support and tests passing
- boilerplate adapters where the contract does not change

If a GREEN change is still confusing, mark it YELLOW and require a brief explanation.
