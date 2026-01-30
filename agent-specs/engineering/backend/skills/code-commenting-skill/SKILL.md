---
name: code-commenting-master
description: v0.1.6 - Add master-level code comments for backend code; use when asked to improve comment quality, explain intent and tradeoffs, or standardize commenting practices without changing logic.
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

## Mandatory Comment Rule (Required)

Every function/method must have a comment written in one natural-language sentence.
The sentence must use the function/method name as the grammatical subject, and cover: why it exists, inputs/constraints, and outputs/side effects.
In Automation Mode, keep the one-sentence summary as the first line; tags may follow on subsequent lines.
No exceptions unless explicitly approved by the owner.

## Master-Level Comment Coverage Map (Required)

Comment these when present; list explicit omissions with reasons:

- Decision points: non-obvious branching, policies, heuristics, thresholds.
- Invariants/contracts: required ordering, idempotency, retry rules, consistency model.
- Boundaries: external calls, timeouts, retries, fallbacks, error translation.
- Data handling: PII/secret redaction, retention, masking, access limits.
- Performance/cost: hot paths, caching, batching, backpressure, budgets.
- Concurrency: locks, race avoidance, eventual consistency, async ordering.
- Feature flags/migrations: rollout strategy and rollback risks.
- Observability: why specific logs/metrics/traces exist.

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
Write one natural-language sentence that uses the class/struct name as the grammatical subject and includes:
- class/struct name
- responsibility (what it owns/models)
- why it exists (constraint/tradeoff/why not elsewhere)
- key dependencies/config it accepts
- what it provides (capability + side effects if any)

Recommended phrasing (write naturally; order may vary):
- `<ClassName>` 负责 `<职责>`，因为 `<约束/原因>` 而封装 `<关键行为>`，接收 `<依赖/配置>`，对外提供 `<能力/副作用>`。

Examples (one sentence each):
- `RetryScheduler` 负责订单重试编排，因为要避免重复扣费而封装重试策略，接收订单ID与上限配置，对外提供下次执行时间并写入重试队列。

### Function/Method-Level
Write a single natural-language sentence that includes:
- function name
- why it exists / why this behavior is needed
- what it accepts (key constraints)
- what it returns or emits (including side effects)

Recommended phrasing (write naturally; order may vary):
- `<FunctionName>` 因为 `<业务/系统原因>` 而执行 `<关键动作>`，接收 `<关键输入/约束>`，返回/产生 `<关键输出/副作用>`。

Examples (one sentence each):
- `parse_bid_doc` 因为要统一标书字段结构而解析原始文档，接收文件流与格式约束，返回规范化内容并记录解析失败指标。
- `schedule_retry` 因为要避免重复扣费而只在失败后触发重试，接收订单ID与重试上限，返回下次执行时间并写入重试队列。

### Inline/Block-Level
```
<why> <why this line/block exists>
<tradeoff> <what is accepted as a cost>
```

## Automation Mode (Required for Automatic Evaluation)

When evaluation must be fully automatic, enable Automation Mode and require tags so checks are machine-verifiable.

Tag format (single-line or multi-line comments):
- `@purpose:` short purpose
- `@why:` rationale/constraint
- `@tradeoff:` cost/limitation
- `@risk:` boundary/edge-case/rollback
- `@data:` PII/retention/redaction note (if applicable)
- `@perf:` performance/cost note (if applicable)

Placement rule:
- Tags must appear within 3 lines above the relevant block/function, or inline on the same block.

If Automation Mode is enabled, tags are mandatory for any item in the Coverage Map that applies.
Keep a one-sentence summary comment/docstring as the first line for each function/method; tags may follow.
Use `@na:` only for coverage-map items that truly do not apply (not for the function comment itself).

## Non-Comment Zones (Avoid)

- Obvious control flow or self-explanatory names.
- Pure data plumbing with no business rules.
- Comments that repeat variable names or syntax.

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
- Risk level (low/medium/high) for required coverage depth

## Output Format

```
## Scope
## Comment Targets
## Proposed Comments
## Evaluation Method
## Quality Score
## Risks / Open Questions
```

## Guardrails

- Do not change code behavior.
- Do not add redundant comments that restate code.
- Do not invent requirements or behaviors.

## Evaluation Method (Master-Level, Fully Automatic)

0. Function summary check: every function/method has a one-sentence summary where the subject is the function name, and it states why, inputs, and outputs/side effects.
1. Build a coverage checklist from the "Coverage Map" for the target area.
2. Detect applicable items via static cues (AST/regex): branching, retries, timeouts, external calls, locks, cache, PII fields, feature flags.
3. In Automation Mode, require tagged comments (`@why`, `@risk`, etc.) within the placement rule.
4. Mark each item as: covered / not applicable / missing (with reason tag `@na:`).
5. Score quality with the rubric below.
6. Fail if any critical rule is violated.

Critical fail conditions:
- Comment contradicts code behavior.
- Security/PII handling is misleading or missing in sensitive paths.
- Retry/timeout semantics are unclear at boundaries.

Rubric (0-2 each, total 12):
- Intent clarity: explains why and constraints, not just what.
- Correctness: matches code behavior and invariants.
- Coverage: required items covered or explicitly N/A (>= 90%).
- Risk/Boundary: external failures, retries, fallbacks documented.
- Business alignment: domain rules translated to business intent.
- Maintainability: minimal, stable, non-redundant.

Pass criteria:
- No critical fails.
- Average >= 1.5 with no single category at 0.

Evidence format (automatic):
- Coverage checklist summary (machine-readable).
- Tag presence report per item.
