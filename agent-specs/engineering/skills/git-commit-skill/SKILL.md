---
name: git-commit-skill
description: v0.12.19 - Create standard, high-quality git commit messages and commit plans; use when asked to suggest commit wording, split commits, or enforce commit message conventions.
---

# Git Commit Skill

## Core Goals

1. Traceability
2. Intent clarity
3. Consistency and readability
4. Safety (avoid history damage)
5. Collaboration efficiency

## Workflow

1. Clarify scope and repository policy.
   - Default to this skill's template and do not ask about other conventions unless the user explicitly mentions one.
   - Ignore unrelated changes by default; do not add them unless explicitly requested.
2. Set AI trace requirement (high priority).
   - For AI-authored commits, enable local trace mode by default.
   - Pre-check that `~/.agents/commit-session-index.jsonl` is the target sink and will be updated after commit success.
3. Review change intent.
   - Summarize what changed and why, not how.
4. Propose commit splits.
   - Separate logically independent changes.
5. Draft commit messages.
   - Use Conventional Commits unless another standard is specified.
6. Apply the subject rules and checklist.
   - Use the simple one-sentence subject standard.
   - Verify the subject checklist passes before finalizing.
7. Build the commit body.
   - Follow the Why/What/Impact/Tests/Refs rules below.
8. Add validation notes.
   - Include relevant tests or verification steps if provided.
   - If tests are not run, use a concrete operational reason (avoid "not requested").
9. Staging policy.
   - Do not run `git add` by default; the human reviews and stages changes.
   - If AI-authored changes are not staged, remind the user to stage them.
   - If only unrelated changes are unstaged, do not prompt.
10. Record AI session trace locally.
   - For AI-authored commits, write a local JSONL record to `~/.agents/commit-session-index.jsonl` after commit success.
   - Keep raw `session_id` in local index only; do not place it in commit subject/body by default.
   - If local index write fails, keep commit flow unblocked but do not mark the task done until retry succeeds or an explicit waiver is recorded in `Risks & Notes`.

## Commit Message Standard

Use this exact structure:

```
<type>(optional-scope): <subject>

Why:
- ...

What:
- ...

Impact:
- ...

Tests:
- ...

Refs:
- ...
```

This structure is mandatory. The intent and quality bar for each section are defined in "Commit Body: Why / What / Impact / Tests / Refs" below.

## Subject Rules (Simple, One-Sentence)

Structured subject output is required.
Use concise, imperative, present-tense subjects. Focus on what changed + scope.
Reasons and impact belong in the Why/Impact sections, not the subject.

Subject output template (required):
```
<type>(optional-scope): <one-sentence subject>
```

Subject checklist (required):
- One sentence with an imperative verb + object + scope.
- No cause/impact clauses (avoid “because/so that/以便/由于/因此”).
- Prefer user-facing capability or doc area over implementation detail.
- Keep under 50 characters when possible; trim adjectives first.

Type verb hints (optional, not mandatory):
- feat: add / enable / introduce / support
- bugfix: fix / handle / prevent
- hotfix: restore / mitigate / stop
- docs: clarify / add / update
- refactor: refactor / simplify / reorganize
- test: add / expand / cover
- chore: update / bump / clean

Subject guardrails:
- One sentence that states exactly what changed and where.
- Include the affected capability and the scope implied by type/scope.
- Do not include cause/impact clauses in the subject; put them in Why/Impact.
- Avoid vague verbs (e.g., "update stuff", "misc").
- Prefer user-facing scope over internal implementation details.

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
bugfix(auth): handle refresh token expiry

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

## Commit Body: Why / What / Impact / Tests / Refs (Required)

Purpose: make rationale, scope, risk, and verification auditable. This section explains the rationale behind the required structure above; do not add/remove sections.

Why（必要性，诊断式表达）

- 目标不是“我想做”，而是“为什么必须做”。
- 一句必须包含：触发信号 + 受影响对象 + 代价（时间/风险/损失/阻塞）。
- 语言像诊断，不像愿望：先事实，再结论。
- 最低合格：能让陌生人读完立即判断“是否该做”。

What（结果，非过程）

- 描述的是“已改变的现实”，而非“改动过程”。
- 列出来的每一条都应可被代码/文档/测试直接验证。
- 刻意排除“手段”与“实现细节”，只保留“最终变更结果”。
- 最低合格：读完能写出一个 check-list 来复查是否确实做到了。

Impact（外部影响）

- 只讨论用户/接口/运行风险，不谈内部结构。
- 必须回答三件事：
  1. 对谁有影响
  2. 影响什么行为/契约
  3. 有无风险/迁移/回滚需求
- 这是“可控性宣言”，让审阅者知道是否安全上线。

Tests
- State what was run (suite or command).
- If not run, use one of these default reasons:
- `not run (manual run pending)`
- `not run (docs-only change)`
- `not run (config-only change)`
- `not run (blocked: <reason>)`
- Avoid "not requested" as a reason; state the operational reason instead.

Refs
- 目的是“追溯决策和上下文”，不是附件列表。
- 允许 n/a，但只有在没有任何外部关联时才成立。
- 任何高风险变更必须可回溯到 Issue/Spec/Incident/PR 之一。
- AI 生成的提交可添加 `AI-TRACE: local-index` 标记，但默认不暴露原始 `session_id`。

Format rules:
- Follow the "Commit Message Standard" structure exactly; do not add extra sections.
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

## AI Session Trace Policy (Local Index)

Goal:
- Keep AI commit traceability without exposing sensitive or local-only identifiers in public history.

Priority:
- P1 (default on) for AI-authored commits.
- Treat trace write result as required delivery evidence in the final response.

Local index path:
- `~/.agents/commit-session-index.jsonl` (one JSON object per line).
- This file is local runtime state and must never be tracked into the repository.

Write timing:
- Only write after commit success and commit hash is available.
- If the operation is "suggest message only" and no commit is created, do not write an index entry.
- Prefer writing the index before final handoff message so trace status is explicit at delivery time.

Minimal JSON schema:
- `ts` (ISO-8601 UTC timestamp)
- `repo_root` (absolute repo path)
- `branch` (current branch name)
- `commit` (full commit hash)
- `session_id` (local session identifier)
- `agent` (e.g., `codex`)
- `subject` (final commit subject line)

Example entry:
```json
{"ts":"2026-02-06T10:00:00Z","repo_root":"/home/gong/date/2025/dec/week2/9,Tue/Agents","branch":"main","commit":"abc123...","session_id":"sess_local_001","agent":"codex","subject":"docs(git-commit-skill): add local session trace policy"}
```

Operational workflow:
1. Prepare commit message using this skill.
2. Complete commit and capture commit hash.
3. Ensure `~/.agents` exists, then append one JSON line to `~/.agents/commit-session-index.jsonl`.
4. Add `AI-TRACE: local-index` in `Refs` when the commit is AI-authored.
5. Never include raw `session_id` in `Refs` for public/shared repositories unless explicitly approved.

Failure handling:
- If local index write fails, do not block commit completion.
- Record `not run (blocked: local index write failed: <reason>)` or equivalent note in `Risks & Notes`.
- Retry index write once environment is stable; keep the task in `to-verify` state until resolved or waived.

## Output Format

```
## Suggested Commit Messages
## Split Recommendations
## Validation Steps
## AI Trace Status
## Risks & Notes
```

## Guardrails

- Do not run git commands or modify history unless explicitly authorized.
- Do not include secrets or sensitive data in commit messages.
- Do not include raw AI `session_id` in public commit history by default.
- Do not commit `~/.agents/commit-session-index.jsonl` or mirrors of its content into any repository.
- If a repo has its own convention, follow it first.
