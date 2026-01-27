---
name: git-commit-skill
description: Create standard, high-quality git commit messages and commit plans; use when asked to suggest commit wording, split commits, or enforce commit message conventions.
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
5. Add validation notes.
   - Include relevant tests or verification steps if provided.
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

Use concise, intent-first subjects. Prefer outcome + scope over implementation detail.

- feat: deliver a user-visible capability.
  - Pattern: `add <capability>` / `enable <capability>` / `support <capability>`
  - Example (EN): `feat(search): add date range filters`
  - Example (ZH): `feat(search): 新增日期范围筛选功能`
- bugfix: fix a specific defect with a clear cause or symptom.
  - Pattern: `fix <symptom> caused by <root>` / `prevent <failure>` / `resolve <incorrect behavior>`
  - Example (EN): `bugfix(auth): fix token refresh failures caused by clock drift`
  - Example (ZH): `bugfix(auth): 修复时钟漂移导致的刷新失败`
- hotfix: urgent production-impacting fix; state impact.
  - Pattern: `fix <prod impact>` / `restore <critical path>`
  - Example (EN): `hotfix(payments): restore checkout after gateway timeouts`
  - Example (ZH): `hotfix(payments): 修复网关超时导致的结算失败`
- docs: update a defined documentation scope.
  - Pattern: `update <doc area>` / `clarify <doc area>` / `add <doc section>`
  - Example (EN): `docs(onboarding): clarify required env vars`
  - Example (ZH): `docs(onboarding): 补充环境变量说明`
- refactor: restructure without behavior change; name the area.
  - Pattern: `refactor <module/flow>` / `simplify <component>`
  - Example (EN): `refactor(api): simplify request validation pipeline`
  - Example (ZH): `refactor(api): 简化请求参数校验流程`
- test: add or adjust tests; name the coverage area.
  - Pattern: `add tests for <area>` / `expand <area> coverage`
  - Example (EN): `test(search): add coverage for filter edge cases`
  - Example (ZH): `test(search): 增加过滤边界场景测试`
- chore: maintenance tasks (tooling/config/deps); be specific.
  - Pattern: `update <tool/config>` / `bump <dependency>`
  - Example (EN): `chore(ci): update build cache settings`
  - Example (ZH): `chore(ci): 更新构建缓存配置`

Subject guardrails:
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
