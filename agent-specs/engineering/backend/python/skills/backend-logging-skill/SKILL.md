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
7. Run verification hooks and record evidence.
8. Complete reinforcement checkpoints before finishing.

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

## Output Format

```
## Logging Standard (Python)
## Field Schema
## Logger Setup
## Context/Correlation
## Error Logging Rules
## Examples
## Checklist
## Verification Notes
## Reinforcement Mechanism
```

## Verification Hooks

- Provide at least one positive example and one negative example.
- Confirm request/trace IDs are present on entry/exit logs.
- Confirm redaction rules are stated for secrets/PII.
- Note what was checked and where (files/services), or state unknowns.

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
