---
name: code-commenting-master
description: v0.1.12 - Add master-level code comments for backend code; use when asked to improve comment quality, explain intent and tradeoffs, or standardize commenting practices without changing logic.
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
6. Select execution mode (`agent_mode=single` or `agent_mode=multi`).
7. If multi mode is enabled, assign reviewer scopes by theme and collect findings.
8. Resolve reviewer conflicts and record arbitration decisions.
9. Verify no behavior change.
   - Comment-only edits unless WRITE_CODE is granted.

## Commenting Standards (Master Level)

- Prefer intent over narration: explain the reason and constraints.
- Capture invariants, preconditions, and domain rules.
- Document error boundaries and recovery rationale.
- Note performance/latency tradeoffs with context.
- Record security and privacy implications explicitly.
- Use TODO only with ownership or decision context.
- Use inline comments only when intent is not obvious from names or structure.

## Master Comment Philosophy (Required)

A good comment is a record of decisions and boundaries, not a translation of code.
It should answer:
- Why this behavior exists (not just what it does).
- What constraints/contract it must satisfy.
- What risks or tradeoffs are accepted.

If a comment does not improve future decisions, it is noise.

## Mandatory Comment Rule (Required)

Every function/method must have a one-sentence *line comment* directly above the definition (use the language's line-comment token like `//` or `#`; in Python, do not use a `\"\"\"` docstring for this rule).
The sentence must use the function/method name as the grammatical subject and start with `<Name> <verb...>` (do not write `<Name> 因为...` as the opening).
It must cover: why it exists, inputs/constraints, and outputs/side effects.
In Automation Mode, keep the one-sentence summary as the first line; tags may follow on subsequent lines.
No exceptions unless explicitly approved by the owner.

## Inline-Only Mode (Optional)

When `mode=inline-only`, skip the function/method summary requirement and focus only on inline/block comments.
Use this mode when adding inline notes without touching function comments.
Automation Mode may still be enabled; apply tags to inline/block comments only.

## Multi-Agent Strategy (Default)

Use multi-agent as the default execution mode for comment policy and standards work. Do not parallelize by file count alone.

Mode switch:
- `agent_mode=multi` (default): one main agent edits, reviewer sub-agents audit and confirm.
- `agent_mode=single`: one agent edits and self-verifies (only for explicitly low-risk/simple scopes).

Minimum staffing when multi mode is enabled:
- main agent: 1
- reviewer agents: >= 1

## Role Contract

- Main agent:
  - Owns scope planning, edits, synthesis, and conflict arbitration.
  - Must resolve every `critical/high` finding before final pass.
- Reviewer agent:
  - Owns review only by default (no direct edits unless explicitly assigned).
  - Must provide evidence-backed structured findings.
- Optional specialist reviewer:
  - Focuses on automation-checkability, rubric consistency, and false-positive control.

## Trigger Matrix

Keep `agent_mode=multi` by default.

Downgrade to `agent_mode=single` only when all conditions are true:
- Affected files <= 1.
- No changes to: `Mandatory Comment Rule`, `Inline-Only Mode`, `Evaluation Method`.
- No rubric threshold, critical-fail, or automation tag rule changes.

Reviewer parallelism guidance:
- 1 reviewer: small scope.
- 2 reviewers: medium scope or cross-section policy edits.
- 3 reviewers max: high-risk policy/threshold changes.

Not recommended:
- Fixed one-reviewer-per-file policy.

## Review Protocol

Each reviewer must output:
- `id`
- `severity` (`critical`/`high`/`medium`/`low`)
- `location`
- `risk`
- `suggested_fix`
- `evidence`

Main agent must output arbitration for each `critical/high` finding:
- `decision` (`accept` / `reject` / `defer`)
- `reason`
- `owner` + `exit_condition` when deferred

## Merge/Conflict Policy

- Resolve reviewer disagreement using priority:
  1. correctness and consistency
  2. automation/auditability
  3. style/readability
- If conflict affects pass criteria or thresholds, log it as a decision gate.
- Do not finalize with unresolved `critical` findings.

## Evidence and Audit

For `agent_mode=multi`, produce:
- agent assignment table
- reviewer findings list
- arbitration log
- final accepted change summary
- unresolved/deferred item list with owner

## Natural Language Quality Rules (Required)

Keep the sentence natural and verb-driven; avoid template-sounding phrases.

- Prefer concrete verbs: 记录/写入/计算/校验/生成/更新/发送/触发/归档/删除/同步/合并.
- Avoid vague verb-nouns like “输出/产生/进行/执行” when a concrete verb exists.
- Purpose phrasing: use “以/用于/为” after the action (not at the start).
- Inputs: say what it accepts (objects/IDs/streams), avoid only “字段” without context.
- Outputs/side effects: state concrete effects (写入日志/更新表/发送事件/返回结果), do not say “产生…副作用”.

Lintable replacements (use these in rewrites):
- “输出耗时” → “统计/计算/记录耗时”
- “产生日志副作用” → “写入/记录日志”
- “输出失败” → “返回失败/抛出错误”

## Soft Templates (Pick by Context; Not Mandatory)

1) Intent-first:
- `<Name>` `<动词…>` 以/用于 `<目的>`，接收 `<输入>`，返回/影响 `<输出/副作用>`。

2) Boundary/Failure:
- `<Name>` `<动词…>` 并处理 `<外部边界/失败模式>`，接收 `<输入>`，返回/影响 `<输出/副作用>`。

3) Contract/Invariants:
- `<Name>` `<动词…>` 且遵守 `<不变量/顺序/幂等>`，接收 `<输入>`，返回/影响 `<输出/副作用>`。

4) Tradeoff:
- `<Name>` `<动词…>` 以换取 `<收益>`（代价为 `<tradeoff>`），接收 `<输入>`，返回/影响 `<输出/副作用>`。

Placement examples:

```python
# parse_bid_doc 解析原始标书文档以统一字段结构，接收文件流与格式约束，返回规范化内容并记录解析失败指标。
def parse_bid_doc(stream, fmt): ...
```

```go
// BindEvidence 将证据绑定到实体以支持可追溯性，接收实体ID与证据ID并要求幂等，返回是否成功并写入绑定表。
func BindEvidence(entityID, evidenceID string) (bool, error) { ... }
```

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
Place this as a one-sentence line comment directly above the definition (in Python, use `#` above `class`, not a `\"\"\"` docstring).

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
- `<FunctionName>` `<动作谓语 + 对象>`（为/以/因为 `<业务/系统原因>`），接收 `<关键输入/约束>`，返回/产生 `<关键输出/副作用>`。

Examples (one sentence each):
- `parse_bid_doc` 解析原始标书文档以统一字段结构，接收文件流与格式约束，返回规范化内容并记录解析失败指标。
- `schedule_retry` 在失败后安排重试以避免重复扣费，接收订单ID与重试上限，返回下次执行时间并写入重试队列。

### Inline/Block-Level
```
<why> <why this line/block exists>
<tradeoff> <what is accepted as a cost>
```

## Automation Mode (Required for Automatic Evaluation)

When evaluation must be fully automatic, enable Automation Mode and require tags so checks are machine-verifiable.

Tag format (line comments; prefix with the language's line-comment token):
- `<comment> @purpose:` short purpose
- `<comment> @why:` rationale/constraint
- `<comment> @tradeoff:` cost/limitation
- `<comment> @risk:` boundary/edge-case/rollback
- `<comment> @data:` PII/retention/redaction note (if applicable)
- `<comment> @perf:` performance/cost note (if applicable)

Examples:
- Python: `# @why: ...`
- Go/JS/TS/Java/C#: `// @why: ...`

Placement rule:
- Tags must appear within 3 lines above the relevant block/function, or inline on the same block.

If Automation Mode is enabled, tags are mandatory for any item in the Coverage Map that applies.
Keep a one-sentence summary line comment immediately above each function/method; tags may follow (also as line comments above the definition).
Use `<comment> @na:` only for coverage-map items that truly do not apply (not for the function comment itself).

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
- Mode (default: full; optional: inline-only)
- Agent mode (default: multi; optional: single)

## Output Format

```
## Scope
## Comment Targets
## Proposed Comments
## Agent Plan
## Review Findings
## Arbitration Decision
## Evaluation Method
## Quality Score
## Risks / Open Questions
## Audit Evidence
```

## Guardrails

- Do not change code behavior.
- Do not add redundant comments that restate code.
- Do not invent requirements or behaviors.
- Do not use fixed one-reviewer-per-file fan-out.
- Do not accept reviewer findings without evidence.
- Do not finalize multi mode output with unresolved `critical` findings.
- Do not switch to single mode unless downgrade conditions are explicitly met.

## Evaluation Method (Master-Level, Fully Automatic)

0. Summary check: every function/method has a one-sentence line comment immediately above the definition, where the first token after the comment marker is the function/method name, and the summary does not start with `<Name> 因为...` (must be `<Name> <verb...>`), and it states why, inputs, and outputs/side effects.
   - If `mode=inline-only`, skip this step.
1. Build a coverage checklist from the "Coverage Map" for the target area.
2. Detect applicable items via static cues (AST/regex): branching, retries, timeouts, external calls, locks, cache, PII fields, feature flags.
3. In Automation Mode, require tagged comments (`@why`, `@risk`, etc.) within the placement rule.
4. Mark each item as: covered / not applicable / missing (with reason tag `@na:`).
5. Score quality with the rubric below.
6. Fail if any critical rule is violated.
7. Lint checks: flag banned phrases and suggest replacements from the lintable list above.
8. If `agent_mode=multi`, require review evidence and arbitration records before pass/fail.
   - If `agent_mode=single`, require explicit self-review evidence in `Audit Evidence`.

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
- If `agent_mode=multi`: unresolved `critical` findings = 0, all `high` findings have arbitration decisions.

Evidence format (automatic):
- Coverage checklist summary (machine-readable).
- Tag presence report per item.
