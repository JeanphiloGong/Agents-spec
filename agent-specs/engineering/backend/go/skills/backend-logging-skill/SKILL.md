---
name: backend-logging-skill
description: Define and improve Go backend logging standards; use when designing log formats, levels, fields, correlation, error logging, or when auditing logging quality in Go services.
---

# Backend Logging Skill (Go)

## Go Defaults

- Use structured logging with JSON output.
- Prefer `log/slog` (Go 1.21+) or `zap` for performance and structure.

## Workflow

1. Confirm logging library (`slog` or `zap`) and deployment environment.
2. Define a shared logger initializer (global or injected).
3. Enforce schema fields for every log entry.
4. Attach `context.Context` values for request/trace IDs.
5. Define error logging with `errors` and `fmt` wrapping.
6. Validate latency impact and sampling rules.

## Required Fields

- `ts`, `level`, `service`, `env`, `msg`
- `request_id`, `trace_id`
- `user_id` (hashed/opaque when applicable)
- `duration_ms` for handlers/jobs
- `error.type`, `error.msg`, `error.stack`

## Level Mapping (Go)

- DEBUG: `slog.Debug` or `zap.Debug`
- INFO: `slog.Info` or `zap.Info`
- WARN: `slog.Warn` or `zap.Warn`
- ERROR: `slog.Error` or `zap.Error`

## Error Handling Rules

- Wrap errors with `%w` and log at boundary only.
- Include `error.type` from `errors.As` where possible.
- Avoid logging stack traces multiple times.

## Example (slog)

```
logger.Info("request completed",
  "request_id", rid,
  "trace_id", tid,
  "duration_ms", dur.Milliseconds(),
)
```

## Output Format

```
## Logging Standard (Go)
## Field Schema
## Library Setup
## Context/Correlation
## Error Logging Rules
## Examples
## Checklist
```

## Guardrails

- Do not log request bodies by default in production.
- Redact secrets and PII.
