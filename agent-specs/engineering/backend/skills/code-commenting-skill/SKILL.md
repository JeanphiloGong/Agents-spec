---
name: code-commenting-master
description: Add master-level code comments for backend code; use when asked to improve comment quality, explain intent and tradeoffs, or standardize commenting practices without changing logic.
---

# Code Commenting Master (Backend)

## Foundations

- Robert C. Martin (Clean Code): Comments explain why, not what.
- Kent Beck: Keep intent clear; comments support design intent and constraints.
- Martin Fowler: Comments record tradeoffs and constraints; avoid masking code smells.
- PEP 257 / PEP 8: Docstring and style conventions for Python.

## Workflow

1. Clarify scope and constraints.
   - Identify language, module, and the intended audience.
2. Identify intent and decisions.
   - Find non-obvious rationale, tradeoffs, and invariants.
3. Apply minimal, high-signal comments.
   - Avoid duplicating the code; emphasize why and risks.
4. Standardize style.
   - Use consistent tense and comment placement.
5. Verify no behavior change.
   - Comment-only edits unless WRITE_CODE is granted.

## Commenting Standards (Master Level)

- Prefer intent over narration: explain the reason and constraints.
- Capture invariants, preconditions, and domain rules.
- Document error boundaries and recovery rationale.
- Note performance/latency tradeoffs with context.
- Record security and privacy implications explicitly.
- Use TODO only with ownership or decision context.

## Required Inputs

- Target language and framework
- Commenting target (module/function/class)
- Audience (team, external, future maintenance)

## Output Format

```
## Scope
## Comment Targets
## Proposed Comments
## Risks / Open Questions
```

## Guardrails

- Do not change code behavior.
- Do not add redundant comments that restate code.
- Do not invent requirements or behaviors.
