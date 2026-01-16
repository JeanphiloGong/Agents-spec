---
name: backend-logging-skill
description: Define and improve backend logging standards across services; use when designing log formats, levels, fields, correlation, error logging, observability, or when auditing logging quality for a backend system.
---

# Backend Logging Skill (General)

## Workflow

1. Clarify context and goals.
   - Service type, runtime, traffic profile, and compliance constraints.
2. Define logging objectives.
   - Debuggability, auditability, performance, and incident response.
3. Specify the log schema.
   - Decide required fields and optional fields; enforce JSON or key-value.
4. Map levels to actions.
   - Define when to use DEBUG/INFO/WARN/ERROR/FATAL and ensure consistency.
5. Design correlation.
   - Standardize request IDs, trace IDs, user/session IDs, and span IDs.
6. Define error logging rules.
   - Capture error class, message, stack, and root cause once; avoid duplication.
7. Validate performance and privacy.
   - Redact secrets/PII; apply sampling; set size limits.
8. Provide examples and checklists.
   - Include example logs and a review checklist.

## Required Inputs

- Service name and environment (dev/stage/prod)
- Primary execution path (HTTP, async, batch, cron)
- Observability tools (if any)
- Compliance constraints (PII, retention)

## Standard Log Schema (Minimum)

- `timestamp` (ISO 8601, UTC)
- `level` (debug/info/warn/error/fatal)
- `service`
- `env`
- `message`
- `request_id`
- `trace_id` (if tracing exists)
- `user_id` (hashed/opaque when applicable)
- `duration_ms` (for requests/jobs)
- `error` object: `type`, `message`, `stack`, `cause` (optional)

## Level Rules

- DEBUG: Local debugging, feature flags, noisy details.
- INFO: Business events, lifecycle milestones, normal state transitions.
- WARN: Recoverable anomalies, retries, degraded behavior.
- ERROR: Failed operations that require attention; include error object.
- FATAL: Process cannot continue; emit once and exit.

## Quality Checklist

- Logs are structured (JSON or key-value).
- Each request has a consistent `request_id`.
- Sensitive data is redacted or hashed.
- Errors are logged once at the boundary where they are handled.
- High-volume paths have sampling or rate limiting.

## Output Format

```
## Logging Standard
## Field Schema
## Level Mapping
## Error Logging Rules
## Correlation Strategy
## Privacy & Performance Notes
## Examples
## Checklist
```

## Guardrails

- Do not log secrets, tokens, passwords, or raw PII.
- Do not recommend logging full payloads in production by default.
