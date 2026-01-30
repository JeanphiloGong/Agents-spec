---
name: backend-logging-skill
description: v0.1.2 - Define and improve Python backend logging standards; use when designing log formats, levels, fields, correlation, error logging, or when auditing logging quality in Python services.
---

# Backend Logging Skill (Python)

## Python Defaults

- Use structured logging (JSON) with `logging` + formatter or `structlog`.
- Centralize logger configuration at process start.

## Workflow

1. Confirm framework and logging stack (stdlib logging, structlog).
2. Define a unified config with handlers and formatters.
3. Align log statements with business intent (prioritize newcomer clarity in log messages and fields).
4. Enforce schema fields for every log entry.
5. Inject request/trace IDs via middleware/contextvars.
6. Define exception logging and stack handling.
7. Validate sampling, log size, and redaction.
8. Run critical-path logging coverage check and decision-coverage metrics.
9. Run automated master-level logging review and record score/evidence.
10. Run verification hooks and record evidence.
11. Complete reinforcement checkpoints before finishing.

## Required Fields

- `timestamp`, `level`, `service`, `env`, `message`
- `request_id`, `trace_id`
- `user_id` (hashed/opaque when applicable)
- `duration_ms` for requests/jobs
- `error.type`, `error.message`, `error.stack`

## Level Mapping (Python)

- DEBUG/INFO/WARNING/ERROR/CRITICAL per `logging` module

## Level Usage Rules (Required)

- INFO: boundary events and outcomes (request/job start & end, external call result, data mutation result).
- DEBUG: internal details for troubleshooting (branch detail, loop state, intermediate values).
- WARNING: degraded but continuing (retry, fallback, partial failure, SLA risk).
- ERROR/CRITICAL: failed boundary outcomes (request failed, job failed, unrecoverable external call).

Rule of thumb:
- If it helps operations decide "what to do next", it belongs in INFO/WARN/ERROR.
- If it only helps developers trace code paths, it belongs in DEBUG.

## Exception Rules

- Use `logger.exception(...)` once at the boundary.
- Avoid re-logging the same exception in lower layers.
- Include error cause chain if available.

## Example (structlog)

```
log.info("request completed",
  request_id=rid,
  trace_id=tid,
  duration_ms=dur_ms,
)
```

## Chinese Log Format Standard (Module-Aware)

Use a module-aware prefix based on location:

- `svc`: service layer (business services)
- `router`: routing layer
- `controller`: controller/handler layer
- `domain`: domain layer

Format:

```
[<module>.<component>] <动作描述> 关键字段=%s 关键字段=%s
```

Example:

```
"[svc.content_process] 目录节点加载完成 请求id=%s 节点题目=%s 选择的内容=%s"
```

## Boundary Logs (Required)

Every request/job must have logs at entry and exit with consistent IDs.

Required boundaries:
- router/controller: request_received, request_completed (include status, duration_ms).
- service/domain: operation_start, operation_success, operation_failure.
- db/repo: query_start, query_success, query_failure (use query_name, avoid raw SQL).
- external integration: call_start, call_success, call_failure (include provider, status).

Minimum fields at boundaries:
- `request_id`, `trace_id`, `duration_ms` (where applicable)
- `status` or `result`
- `error.*` on failures

## Module Responsibility Matrix

- router/controller:
  - MUST log: request_received, request_completed.
  - SHOULD log: request_rejected (auth/validation failures).
- service/domain:
  - MUST log: operation_start/success/failure for critical flows.
  - SHOULD log: key state transitions.
- db/repo:
  - MUST log: query_start/success/failure with query_name.
  - SHOULD log: rows_affected, cache_hit (if affects correctness).
- integration/adapter:
  - MUST log: call_start/success/failure with provider + latency.
  - SHOULD log: retry/backoff decisions.

## Output Format

```
## Logging Standard (Python)
## Field Schema
## Logger Setup
## Context/Correlation
## Error Logging Rules
## Level Usage Rules
## Boundary Logs
## Module Responsibility Matrix
## Examples
## Checklist
## Coverage Check
## Automated Master Review
## Verification Notes
## Reinforcement Mechanism
```

## Verification Hooks

- Provide at least one positive example and one negative example.
- Confirm request/trace IDs are present on entry/exit logs.
- Confirm redaction rules are stated for secrets/PII.
- Note what was checked and where (files/services), or state unknowns.

## Coverage Check (Required)

Goal: prevent critical logic from being unlogged.

Steps:
1. List critical flows (requests, jobs, integrations) and their boundaries.
2. For each flow, confirm logs exist for start, success, and failure.
3. Identify decision points (conditionals, retries, fallbacks, state transitions).
4. Apply decision logging policy (below) and record coverage metrics.
5. Record missing logs as TODO with owner and target location.

Decision logging policy (明确每个 if 是否需要日志):
- Not every if needs a log. Only decision points that change external behavior or risk must be logged.
- MUST log when the branch affects: security/permission, money/cost, data mutation, error handling, retries/backoff, fallbacks, external calls, or user-visible output.
- SHOULD log when the branch affects: cache hit/miss that changes correctness, rate limits, feature flags, or workflow state transitions.
- MAY skip logging for internal, low-risk, in-process optimizations if no external effect (but document the skip).
- For MUST decisions, include fields: `decision`, `decision_outcome`, `decision_reason` (machine-parsable).

Decision coverage metrics (must be reported):
- Critical flow coverage: 100% of critical flows have entry/success/failure logs.
- Tier-1 decision coverage: 100% of MUST decisions have a log that records the outcome.
- Tier-2 decision coverage: >= 90% of SHOULD decisions logged, unless waived with reason.
- Error-path coverage: 100% of non-2xx responses and raised exceptions have an error log at the boundary.

Coverage checklist template:
```
Flow:
- Entry log:
- Success log:
- Failure log:
- Key decision/state log:
- Evidence (file/function):
- Gaps/TODO:
```

Decision checklist template:
```
Decision:
- Type (MUST/SHOULD/MAY):
- Branch outcome logged:
- Required fields present:
- Evidence (file/function):
- Waiver reason (if skipped):
```

## Automated Master Review (Required)

Goal: zero-human, scriptable assessment of master-level logging quality.

Automated evaluation signals (score 0-2 each, must total >= 10 and no 0 in critical items):
- Clarity (critical): >= 98% of logs have non-empty `message` and match the action-phrase pattern (verb + object).
- Traceability (critical): 100% of request/response logs include `request_id` and `trace_id`.
- Decision visibility (critical): 100% of MUST decisions include `decision`, `decision_outcome`, `decision_reason`.
- Business alignment: >= 80% of decision logs include `impact` or `biz_metric` fields.
- Signal-to-noise: avg. logs/request <= 50 and duplicate identical messages <= 3 per request (or document a waiver).
- Actionability: 100% boundary error logs include `error.type`, `error.message`, and `error.action` (or `error.code`) for remediation.

Master pass criteria (automated):
- Total score >= 10/12.
- No 0 in Clarity/Traceability/Decision visibility.
- Coverage metrics meet thresholds defined in Coverage Check.

Automated master review template:
```
Score:
- Clarity:
- Traceability:
- Decision visibility:
- Business alignment:
- Signal-to-noise:
- Actionability:
Pass/Fail:
Evidence (log examples + locations):
Gaps/TODO:
```

## Reinforcement Mechanism

- Self-check loop:
  - Validate required fields are all listed.
  - Verify exception rule is stated once-at-boundary.
  - Confirm sampling/size/redaction checks are explicit.
- Checkpoints (must complete before finishing):
  - Checklist includes field schema + correlation + error rules.
  - Verification notes include evidence or explicit unknowns.

## Guardrails

- Do not log secrets or raw PII.
- Avoid logging large payloads in production.
