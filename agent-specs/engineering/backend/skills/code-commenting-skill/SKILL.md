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
3. Bias for newcomer clarity.
   - Treat collaborators as newcomers; prioritize business intent at decision boundaries.
4. Apply minimal, high-signal comments.
   - Avoid duplicating the code; emphasize why and risks.
5. Standardize style.
   - Use consistent tense and comment placement.
6. Verify no behavior change.
   - Comment-only edits unless WRITE_CODE is granted.

## Commenting Standards (Master Level)

- Prefer intent over narration: explain the reason and constraints.
- Capture invariants, preconditions, and domain rules.
- Document error boundaries and recovery rationale.
- Note performance/latency tradeoffs with context.
- Record security and privacy implications explicitly.
- Use TODO only with ownership or decision context.
- Use inline comments only when intent is not obvious from names or structure.

## Business Intent Emphasis

- Write comments that explain why a business rule exists or why a log/decision is emitted.
- Avoid re-stating control flow; focus on intent, constraints, and downstream impact.
- Keep comments stable and updated; remove if the intent no longer applies.

Example:

```
// Why: Emit once so downstream retries can dedupe and avoid double-charging.
log.warning("payment retry scheduled", order_id=oid, attempt=attempt)
```

Anti-example:

```
// Log a warning with order_id and attempt.
log.warning("payment retry scheduled", order_id=oid, attempt=attempt)
```

## Recommended Comment Template (Standard)

Use this structure when helpful. By default, do not add literal prefixes; only add them when explicitly required.

```
<purpose> <what this block/function is for>
<why> <why this design or behavior exists>
<tradeoff> <what is sacrificed or constrained>
```

## Comment Types and Templates

### File-Level
```
<purpose> <module responsibility>
<why> <why this module exists>
<tradeoff> <constraints or boundaries>
```

### Class/Struct-Level
```
<purpose> <what this type models or manages>
<why> <why this type encapsulates the behavior>
<tradeoff> <limitations or chosen constraints>
```

### Function/Method-Level
```
<purpose> <what the function does>
<why> <why this approach is used>
<tradeoff> <what is sacrificed or constrained>
```

### Inline/Block-Level
```
<why> <why this line/block exists>
<tradeoff> <what is accepted as a cost>
```

## Examples

```
// Purpose: Normalize filters to a canonical shape for ranking.
// Why: Ranking assumes normalized input; inconsistent input causes silent misordering.
// Tradeoff: Legacy inputs may be rejected to preserve correctness.
```
```
// Purpose: Cache lookup with bounded staleness to protect the database.
// Why: p95 latency is dominated by DB reads; staleness is acceptable here.
// Tradeoff: Users may see slightly outdated data under load.
```

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
