---
name: git-commit-skill
description: v0.12.7 - Create standard, high-quality git commit messages and commit plans; use when asked to suggest commit wording, split commits, or enforce commit message conventions.
---

# Git Commit Skill

## Core Goals

1. Intent clarity
2. Traceability
3. Consistency and readability
4. Safety (avoid history damage)
5. Collaboration efficiency

## Workflow

1. Clarify scope and repository policy.
   - Default to this skill's template and do not ask about other conventions unless the user explicitly mentions one.
   - Ignore unrelated changes by default; do not add them unless explicitly requested.
2. Review change intent.
   - Summarize what changed and why, not how.
3. Propose commit splits.
   - Separate logically independent changes.
4. Draft commit messages.
   - Use Conventional Commits unless another standard is specified.
5. Apply the subject blueprint and checklist.
   - Use the master subject blueprint and type-specific pattern.
   - Verify the subject checklist passes before finalizing.
5. Add validation notes.
   - Include relevant tests or verification steps if provided.
   - If tests are not run, use a concrete operational reason (avoid "not requested").
6. Staging policy.
   - Do not run `git add` by default; the human reviews and stages changes.
   - If AI-authored changes are not staged, remind the user to stage them.
   - If only unrelated changes are unstaged, do not prompt.

## Commit Message Standard

```
<type>(optional-scope): <subject>

<body>

<footer>
```

## Subject Rules (by Type)

Structured subject output is required.
Use concise, intent-first subjects. Prefer outcome + scope over implementation detail.
Each subject must explain the change in one sentence with clear context (goal or cause).

Subject output template (required):
```
<type>(optional-scope): <one-sentence subject>
```

Master subject blueprint (one sentence, fill slots in order):
- EN: `<action> <object> to <goal>, because <subject> <verb> causing <impact> (in <context>)`
- ZH: `为<目标><动作><对象>，因为<主体><动作>导致<影响>（在<上下文>）`

Slot guidance:
- action: add / fix / restore / clarify / refactor / test / update
- object: capability, defect, doc area, module, tests, config/dependency
- goal: measurable outcome (accuracy, stability, coverage, clarity)
- cause/signal: why now; must be a full clause with impact (subject + verb + impact)
- context: user group, path, environment, or scope if not already in prefix

Subject checklist (required):
- One sentence that states what changed + why (goal and cause when known).
- Includes the affected capability or failure and the scope implied by type/scope.
- If the root cause is known, include it explicitly (bugfix/hotfix must include cause).
- Uses the type-specific pattern below.

- feat: deliver a user-visible capability.
  - Required (EN): `add <capability> for <goal>` / `enable <capability> for <goal>`
  - Optional cause (EN): append `because <subject> <verb> causing <impact>`
  - Required (ZH): `为<目标>新增<能力>` / `为<目标>支持<能力>`
  - Optional cause (ZH): append `因为<主体><动作>导致<影响>`
  - Example (EN): `feat(search): add date range filters for accuracy because users reported misses`
  - Example (ZH): `feat(search): 为提升搜索准确性新增日期范围筛选，因为用户反馈结果遗漏`
- bugfix: fix a specific defect with a clear cause or symptom.
  - Required (EN): `fix <cause> causing <bug>` / `fix <cause> triggering <symptom>`
  - Required (ZH): `修复<原因>导致的<问题>` / `修复<原因>触发的<问题>`
  - Example (EN): `bugfix(auth): fix clock drift causing refresh failures`
  - Example (ZH): `bugfix(auth): 修复时钟漂移导致的刷新失败`
- hotfix: urgent production-impacting fix; state impact.
  - Required (EN): `fix <cause> causing <prod impact>` / `restore <critical path> after <cause>`
  - Required (ZH): `修复<原因>导致的<线上影响>` / `恢复<关键路径>（因<原因>中断）`
  - Example (EN): `hotfix(payments): fix gateway timeouts causing checkout failures`
  - Example (ZH): `hotfix(payments): 修复网关超时导致的结算失败`
- docs: update a defined documentation scope.
  - Required (EN): `clarify <doc area> for <audience>` / `add <doc section> for <goal>`
  - Optional cause (EN): append `because <subject> <verb> causing <impact>`
  - Required (ZH): `为<目标/受众>补充<文档范围>` / `为<目标>明确<文档范围>`
  - Optional cause (ZH): append `因为<主体><动作>导致<影响>`
  - Example (EN): `docs(onboarding): clarify required env vars because config changes broke setup`
  - Example (ZH): `docs(onboarding): 为新同事补充环境变量说明，因为配置变更导致配置失败`
- refactor: restructure without behavior change; name the area.
  - Required (EN): `refactor <module/flow> to <goal>` / `simplify <component> for <goal>`
  - Optional cause (EN): append `because <subject> <verb> causing <impact>`
  - Required (ZH): `为<目标>重构<模块/流程>` / `为<目标>简化<组件>`
  - Optional cause (ZH): append `因为<主体><动作>导致<影响>`
  - Example (EN): `refactor(api): simplify validation pipeline for clarity because reviews flagged confusion`
  - Example (ZH): `refactor(api): 为提升可读性简化请求校验流程，因为评审指出理解困难`
- test: add or adjust tests; name the coverage area.
  - Required (EN): `add tests for <area> to cover <risk>` / `expand <area> coverage for <case>`
  - Optional cause (EN): append `because <subject> <verb> causing <impact>`
  - Required (ZH): `为<风险/场景>补充<范围>测试` / `扩展<范围>覆盖以验证<场景>`
  - Optional cause (ZH): append `因为<主体><动作>导致<影响>`
  - Example (EN): `test(search): add tests for filter edge cases because regressions recurred`
  - Example (ZH): `test(search): 为过滤边界场景补充测试，因为回归问题反复出现`
- chore: maintenance tasks (tooling/config/deps); be specific.
  - Required (EN): `update <tool/config> for <goal>` / `bump <dependency> to <version> for <goal>`
  - Optional cause (EN): append `because <subject> <verb> causing <impact>`
  - Required (ZH): `为<目标>更新<工具/配置>` / `升级<依赖>至<版本>以<目标>`
  - Optional cause (ZH): append `因为<主体><动作>导致<影响>`
  - Example (EN): `chore(ci): update build cache settings for stability because cache misses spiked`
  - Example (ZH): `chore(ci): 为稳定性更新构建缓存配置，因为缓存命中率下降`

Subject guardrails:
- One sentence must explain exactly what changed, in context.
- Include the affected capability or failure and the scope (module/feature) implied by the type/scope.
- Use the required pattern for the type; if the cause/goal is missing, rewrite.
- If you cannot state the cause/goal clearly, clarify the context before writing the subject.
- Cause clauses must be complete (subject + verb + impact); avoid fragments.
- Avoid vague verbs (e.g., "update stuff", "misc").
- Prefer measurable scope over internal implementation details.
- Keep under 50 characters when possible; trim adjectives first.

Common types:
- feat: new feature
- bugfix: bug fix (non-urgent; normal release cadence)
- hotfix: urgent fix (production-impacting, expedited release)
- docs: documentation
- refactor: refactor without behavior change
- test: add or update tests
- chore: tooling or maintenance

Selection rules:
- Use bugfix for defects that can ship in the next normal release.
- Use hotfix for production-impacting issues that require an expedited release.
- If unsure, default to bugfix and note urgency in the Impact section.

All commits must use the master template below with full Why/What/Impact/Tests/Refs sections.

Examples (full format):
```
feat(search): add date range filters

Why:
- Users need to narrow results by date and status.

What:
- Add filter params to query builder.
- Extend search handler to accept new filters.

Impact:
- More precise results; no breaking changes.

Tests:
- unit: search_filter_spec

Refs:
- ISSUE-1423
```
```
bugfix(auth): fix refresh failures caused by token expiry

Why:
- Sessions were failing silently after token expiry.

What:
- Add explicit refresh error handling in auth middleware.
- Surface a clear user-facing error message.

Impact:
- Fewer auth drop-offs; no API changes.

Tests:
- unit: auth_refresh_spec

Refs:
- AUTH-221
```
```
docs(onboarding): clarify setup prerequisites

Why:
- New environment variables were added and not documented.

What:
- Add setup prerequisites and env var table.
- Clarify local dev workflow.

Impact:
- Faster onboarding; no runtime impact.

Tests:
- not run (documentation-only change)

Refs:
- DOCS-45
```
```
feat(search): add date range filters

Why:
- Users need to narrow results by date and status.

How:
- Add filter params to query builder.

Tests:
- unit: search_filter_spec
```
```
hotfix(payments): restore checkout after gateway timeouts

Why:
- External gateway timed out in peak hours.

Notes:
- Retry is capped at 2 attempts.

Refs:
- ISSUE-1423
```

## Master Commit Template

```
<type>(optional-scope): <subject>

Why:
- <user or system problem being solved>

What:
- <key change 1>
- <key change 2>

Impact:
- <behavior impact, compatibility, or migration notes>

Tests:
- <tests run, or "not run" with reason>

Refs:
- <issue/ticket/PR>
```

## Mandatory Format Rule

- Every commit must use the full template with Why/What/Impact/Tests/Refs.
- Single-line commit messages are not allowed.
- Prefer file-based commits (e.g., `git commit -F <file>`) to avoid newline escaping/garbling.

## Tests Reason Defaults

Use one of these default reasons when tests are not run:
- `not run (manual run pending)`
- `not run (docs-only change)`
- `not run (config-only change)`
- `not run (blocked: <reason>)`

Avoid "not requested" as a reason; state the operational reason instead.

## Golden Rules (Top 10)

1. Keep commits small and focused on a single change.
2. Use one consistent format (default: Conventional Commits).
3. Keep subject under 50 characters and describe intent.
4. Add a body when rationale or migration steps matter.
5. Avoid noisy commits (unrelated formatting or temp files).
6. Link to issues or task IDs when available.
7. Avoid rewriting public history or force pushes.
8. Include verification or test notes when relevant.
9. Never commit secrets, tokens, or PII.
10. Keep main/master in releasable state.

## Change Scope Rule

- Base commit messages only on the AI's own changes.
- If unrelated or user-made changes are present, ask once before including them, then proceed.

## Output Format

```
## Suggested Commit Messages
## Split Recommendations
## Validation Steps
## Risks & Notes
```

## Guardrails

- Do not run git commands or modify history unless explicitly authorized.
- Do not include secrets or sensitive data in commit messages.
- If a repo has its own convention, follow it first.
