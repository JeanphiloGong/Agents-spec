# Multi-Agent Protocol (Default: auto)

This skill uses a **main agent + reviewers** pattern. The main agent owns the final output and decision gate.

## Execution Modes

- `agent_mode=auto` (default): decide `single` vs `multi` using the complexity triggers below.
- `agent_mode=single`: main agent only.
- `agent_mode=multi`: main agent + reviewer agents by risk surface.

If multi-agent execution is not available, the main agent must run the same steps as a **sequential self-review** using the same scopes and output format.

## Complexity Triggers (auto → multi)

Switch to `agent_mode=multi` if any are true:

1. Auto-RED surfaces touched >= 2
   - Example: pricing + migrations, auth + public contract, concurrency + infra.
2. Cross-layer change
   - Example: touches both application logic and infra/CI/deploy config.
3. Size/shape threshold (pick the first you can measure)
   - Changed files >= 15, OR
   - Diff hunks are spread across >= 4 directories/modules, OR
   - Multiple languages/frameworks are touched (e.g., backend + frontend).
4. Uncertainty signal
   - Any part of classification would be `UNKNOWN`, or
   - There are no tests near a RED change and verification is unclear.

Otherwise, keep `agent_mode=single`.

## Reviewer Scopes (Deterministic Assignment)

Assign reviewers based on file paths and change inventory. Use this mapping:

- **Security/Auth reviewer**
  - Trigger keywords: `auth`, `permission`, `rbac`, `abac`, `acl`, `oauth`, `token`, `jwt`, `session`, `csrf`.
- **Pricing/Billing reviewer**
  - Trigger keywords: `price`, `pricing`, `bill`, `billing`, `coupon`, `discount`, `refund`, `invoice`, `payment`, `quota`, `entitlement`.
- **Data/Migrations reviewer**
  - Trigger keywords: `migration`, `migrate`, `schema`, `ddl`, `seed`, `backfill`, `prisma`, `alembic`, `gorm`, `sql`, `db`.
- **Contracts reviewer**
  - Trigger keywords: `api`, `openapi`, `swagger`, `proto`, `graphql`, `sdk`, `contract`, `schema`, `event`, `message`.
- **Infra/CI reviewer**
  - Trigger paths/keywords: `.github/workflows`, `ci`, `docker`, `k8s`, `helm`, `terraform`, `deploy`, `env`, `config`.
- **Frontend reviewer** (only when frontend is touched)
  - Trigger keywords: `web`, `frontend`, `ui`, `components`, `pages`, `svelte`, `react`, `vue`, `next`, `nuxt`.
- **Testing/Rollback reviewer** (mandatory when any RED exists)
  - Trigger: any RED item, or any irreversible change.

If multiple keywords match, assign all relevant reviewers.

## Reviewer Output Format (Strict)

Each reviewer returns findings only, using this structure:

```
id: <scope-short-name>
scope: <what you reviewed>
evidence: <files and diff snippets referenced>
findings:
  - severity: critical|high|medium|low
    item: <what is wrong/missing>
    risk: <what breaks if missed>
    suggested_fix: <concrete next step>
    verification: <minimal test/check>
```

## Arbitration Rules (Main Agent)

The main agent must:

1. Merge findings into the Control Map (upgrade classification if needed).
2. Resolve conflicts by priority:
   - (1) rubric hard rules and evidence
   - (2) risk (blast radius, irreversibility)
   - (3) verification sufficiency
3. If any `critical` finding remains unresolved, the decision gate must be `BLOCK`.

## Minimal multi-agent evidence in the final output

When `agent_mode=multi`, the main agent must list:
- `reviewers`: the scopes used
- `critical/high findings`: a short summary list (or “none found”)
