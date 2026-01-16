---
name: backend-logging-skill
description: Define and improve Python backend logging standards; use when designing log formats, levels, fields, correlation, error logging, or when auditing logging quality in Python services.
---

# Backend Logging Skill (Python)

## Python Defaults

- Use structured logging (JSON) with `logging` + formatter or `structlog`.
- Centralize logger configuration at process start.

## Workflow

1. Confirm framework and logging stack (stdlib logging, structlog).
2. Define a unified config with handlers and formatters.
3. Enforce schema fields for every log entry.
4. Inject request/trace IDs via middleware/contextvars.
5. Define exception logging and stack handling.
6. Validate sampling, log size, and redaction.

## Required Fields

- `timestamp`, `level`, `service`, `env`, `message`
- `request_id`, `trace_id`
- `user_id` (hashed/opaque when applicable)
- `duration_ms` for requests/jobs
- `error.type`, `error.message`, `error.stack`

## Level Mapping (Python)

- DEBUG/INFO/WARNING/ERROR/CRITICAL per `logging` module

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

## Output Format

```
## Logging Standard (Python)
## Field Schema
## Logger Setup
## Context/Correlation
## Error Logging Rules
## Examples
## Checklist
```

## Guardrails

- Do not log secrets or raw PII.
- Avoid logging large payloads in production.
