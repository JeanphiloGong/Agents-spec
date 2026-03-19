---
name: issue-gate-skill
description: v0.1.7 - Enforce pre-commit issue gate with auto-inferred and auto-drafted issue content, gh/glab check/create/link flow, cleaner issue templates, and dry-run plus human confirmation.
---

# Issue Gate Skill

## Trigger and Scope

Use this skill before preparing commit messages when a repo requires each
feature/bug change to be tracked by an issue.

For meaningful tracked work, prefer confirming or creating the issue before
implementation starts, then run this skill again before commit preparation as
the final verification gate.

In scope:
- pre-commit issue existence check
- issue create when missing
- issue link output for commit `Refs`

Out of scope:
- auto-closing issues
- PR creation/merge workflows
- release notes generation

## Core Purpose

- Ensure every meaningful change is traceable to an issue.
- Prefer issue creation close to planning and scope definition, not as a default post-implementation repair step.
- Use task-level traceability by default: one issue may cover multiple related commits for the same tracked work.
- Keep the business purpose in the issue even when a linked commit only advances, investigates, or partially implements the work.
- Keep commit flow human-controlled with automation guardrails.
- Provide a deterministic bridge from issue lifecycle to commit metadata.

## Input Policy (Auto-First)

Default behavior is auto-inference. Ask human only when inference confidence is
low or conflict exists.

### Auto-Inferred First

- `repo_root`: from current git root.
- `change_type`: infer from branch name, change intent, and file scope.
- `platform_hint`: detect from remote and CLI availability (`gh`/`glab`).
- `gate_mode`: read repo policy first, fallback to default.

### Required Only When Auto Fails

One of:
- `existing_issue_id`, or
- `issue_title` and `issue_body`.

## Optional Inputs

- `labels`: comma-separated labels.
- `assignee`: issue assignee.
- `milestone`: milestone name.

## Fixed Defaults

- `gate_mode=required`
- `platform_hint=auto`
- `execution_mode=dry-run-then-confirm`
- `action_scope=check-create-link`
- `input_mode=auto-infer-first`
- `auto_draft=on`
- `confirm_before_create=on`
- `timing_policy=prefer-pre-implementation-confirmation`
- `verification_gate=pre-commit-final-check`
- `traceability_granularity=one-issue-to-many-commits-allowed`
- `issue_repo_policy=canonical-repo-preferred`
- `closure_policy=reference-by-default`

## Traceability Granularity

- Each meaningful tracked commit should point to an issue-backed purpose when repository policy requires issue tracking.
- The default unit of intent is the task or requirement, not the individual commit.
- One issue may cover multiple related commits when they belong to the same task, fix, or delivery slice.
- Do not create a new issue per commit unless repository-specific policy explicitly requires that behavior.

## Canonical Issue Location and Lifecycle

- When work is intended to land in an upstream or shared repository, prefer creating or reusing the issue in that canonical repository rather than in a personal fork.
- Commits may be authored in a fork or worktree before code is synchronized upstream; they should still reference the canonical task issue when that is the true source of purpose.
- Fork-local issues are a fallback for fork-only work, private-only work, or cases where canonical issue creation is unavailable or inappropriate.
- Linking a commit to an issue does not mean that the commit resolves the issue.
- Default to a reference bridge such as `ISSUE: #123` or equivalent `Refs` semantics.
- Only use issue-closing semantics when the change truly resolves the issue and the operator explicitly intends closure.
- An issue may remain open, blocked, deferred, or partially implemented after one or more linked commits.

## Platform Selection

1. If `platform_hint` is `gh` or `glab`, use that platform.
2. If `platform_hint=auto`:
   - use `gh` when available in current repo context
   - else use `glab` when available
   - else gate failure

## Inference Rules

1. `repo_root`
   - `git rev-parse --show-toplevel` succeeds => use result.
   - failure => ask human for `repo_root`.
2. `change_type`
   - infer from branch prefix (`feat/`, `fix/`, `hotfix/`, etc.).
   - fallback from change intent text.
   - if low confidence => ask human to confirm.
3. `platform_hint`
   - infer from remote host and installed CLI.
   - if both available but mismatch in repo context => ask human to choose.
4. `gate_mode`
   - read repository policy if present.
   - fallback to `required`.

## Auto Draft Rules

- If no `existing_issue_id`, auto-generate `issue_title` and `issue_body`.
- Draft source priority:
  1) current task prompt/context
  2) branch and commit intent
  3) changed-file scope and inferred module
- Draft must respect template-required fields by `change_type`.
- If any required field cannot be inferred:
  - insert explicit TODO placeholder
  - keep `confirm_before_create=on` and require human confirmation.

## Issue Templates (Required)

Use template by `change_type`:

- `bugfix|hotfix` => Bug Template
- `feat` => Feature Template
- `chore|docs|refactor|test` => optional lightweight task template (no forced
  create when repo policy allows skip)

### Template Style Rule

- Prefer clean section headings without `（必填）` or `（可选）` in the rendered issue body.
- Keep requiredness in skill validation rules and repository templates, not in user-facing heading text.
- When a repository already provides canonical issue templates, mirror their field names and heading structure unless there is a strong reason not to.

### Bug Template

Required fields:
- `问题概述`
- `复现步骤`
- `预期结果`
- `实际结果`

Recommended fields:
- `影响范围 / 严重程度`
- `修复验收`

Optional fields:
- `日志`
- `截图`
- `环境信息（浏览器 / OS / 后端版本 / 模型版本等）`
- `输入样例 / 文件类型 / 任务 ID`

Template:

```
## 🐛 问题概述
...

## 🔁 复现步骤
1. ...
2. ...
3. ...

## ✅ 预期结果
...

## ❌ 实际结果
...

## 🎯 影响范围 / 严重程度
- 影响范围：...
- 严重程度：...
- 是否可绕过：...

## 🧪 修复验收
- 修复完成的判断标准：...
- 需要回归的场景：...

## 📎 其他信息
- 日志：...
- 截图：...
- 环境信息：...
- 输入样例 / 文件类型 / 任务 ID：...
```

### Feature Template

Required fields:
- `影响模块`
- `背景 / 场景`
- `需求描述`
- `范围边界`
- `验收标准`

Recommended fields:
- `技术约束`
- `验证方式`

Optional fields:
- `接口文档`
- `设计稿`
- `关联 Issue / 需求编号`
- `风险说明`

Template:

```
## 📦 影响模块
- 涉及的服务 / 模块 / 仓库：...
- 涉及的接口 / 数据结构：...
- 是否影响现有兼容性：...

## 🧩 背景 / 场景
- 为什么要做这个需求：...
- 当前遇到什么问题：...
- 现有替代方案：...
- 不做的影响：...

## ✨ 需求描述
1. 当 ...
2. 系统应 ...
3. 若出现异常或依赖不可用，系统应 ...

## 🎯 范围边界
- 本次要做：...
- 本次不做：...

## ⚙️ 技术约束
- 依赖限制：...
- 性能 / 时延要求：...
- 数据来源 / 外部服务约束：...
- 回滚或降级要求：...

## ✅ 验收标准
- [ ] 功能场景一：...
- [ ] 功能场景二：...
- [ ] 兼容性要求：...
- [ ] 回归范围：...
- [ ] 异常 / 降级行为：...

## 🧪 验证方式
- 手工验证：...
- 自动化测试：...
- 日志 / 指标 / 观测点：...

## 📎 其他信息
- 接口文档：...
- 设计稿：...
- 关联 Issue / 需求编号：...
- 风险说明：...
```

## Template Validation Rule

- If template-required fields are missing:
  - `gate_mode=required` => `BLOCK`
  - `gate_mode=recommended` => `PASS_WITH_WARNING`
- Validation output must distinguish `missing_required_fields` and `missing_recommended_fields`.
- For `feat` work that is clearly backend-, AI-, workflow-, or integration-heavy, missing `技术约束` or `验证方式` should emit an explicit warning even when the gate does not block.
- Validation output must list missing fields explicitly.

## Workflow

1. Determine operating point:
   - recommended default for `feat|bugfix|hotfix|non-trivial refactor`: run once before implementation to confirm or create the issue
   - mandatory final pass: run again before commit preparation to verify traceability and emit `refs_line`
   - small `docs|chore|test` work and approved spikes may skip the early pass only when repository policy allows it
2. Validate required inputs and gate mode.
3. Auto-infer `repo_root/change_type/platform_hint/gate_mode`.
4. Resolve platform (`gh` or `glab`) and verify CLI availability.
5. Resolve issue target:
   - prefer the canonical repository issue when the work is intended for upstream or shared history
   - prefer reusing the existing task issue when the current commit belongs to an already tracked task
   - verify `existing_issue_id`, or
   - auto-draft create payload (`issue_title` + `issue_body`) from context.
6. Emit dry-run plan:
   - exact check/create/link command plan
   - expected artifact (`issue_id`, `issue_url`, `refs_line`)
   - drafted issue preview (`title/body`)
7. Wait for human confirmation.
8. Execute selected actions:
   - `check` issue
   - `create` only when missing
   - `link` by generating commit `Refs` line
9. Emit gate result:
   - `required` + failure => `BLOCK`
   - `recommended` + failure => `PASS_WITH_WARNING`

## Common CLI Commands (gh/glab)

Use these commands as reference snippets for check/create/link flows.

### GitHub CLI (`gh`)

```bash
# list issues
gh issue list --limit 20

# view issue
gh issue view <issue_number>

# create issue
gh issue create --title "<title>" --body "<body>" --label "<label>"

# add comment (link commit/branch context)
gh issue comment <issue_number> --body "Linked commit: <sha>"
```

### GitLab CLI (`glab`)

```bash
# list issues
glab issue list

# view issue
glab issue view <issue_number>

# create issue
glab issue create --title "<title>" --description "<body>" --label "<label>"

# add comment (link commit/branch context)
glab issue note <issue_number> -m "Linked commit: <sha>"
```

### Repository Selection

```bash
# gh target repository
gh issue list -R <host/owner/repo>

# glab target repository
glab issue list -R <owner/repo>
```

## Template-to-Command Mapping Examples

Use `change_type` to select template and command payload automatically.

### `feat` => Feature Template => create

```bash
gh issue create \
  --title "feat: <short feature title>" \
  --body "$(cat <<'EOF'
## 📦 影响模块
- 涉及的服务 / 模块 / 仓库：<module>
- 涉及的接口 / 数据结构：<contract or n/a>
- 是否影响现有兼容性：<yes/no + note>

## 🧩 背景 / 场景
- 为什么要做这个需求：<reason>
- 当前遇到什么问题：<problem>
- 现有替代方案：<alternative or n/a>
- 不做的影响：<impact>

## ✨ 需求描述
1. 当 <trigger> 时，系统应 <behavior>
2. 系统应 <expected behavior>
3. 若出现异常或依赖不可用，系统应 <fallback>

## 🎯 范围边界
- 本次要做：<in scope>
- 本次不做：<out of scope>

## ⚙️ 技术约束
- 依赖限制：<constraints or n/a>
- 性能 / 时延要求：<requirements or n/a>
- 数据来源 / 外部服务约束：<dependencies or n/a>
- 回滚或降级要求：<rollback plan or n/a>

## ✅ 验收标准
- [ ] 功能场景一：<scenario 1>
- [ ] 功能场景二：<scenario 2>
- [ ] 兼容性要求：<compatibility>
- [ ] 回归范围：<regression scope>
- [ ] 异常 / 降级行为：<failure handling>

## 🧪 验证方式
- 手工验证：<manual check>
- 自动化测试：<tests or n/a>
- 日志 / 指标 / 观测点：<signals or n/a>

## 📎 其他信息
- 接口文档：<link or n/a>
- 设计稿：<link or n/a>
- 关联 Issue / 需求编号：<id or n/a>
- 风险说明：<risk or n/a>
EOF
)"
```

```bash
glab issue create \
  --title "feat: <short feature title>" \
  --description "$(cat <<'EOF'
## 📦 影响模块
- 涉及的服务 / 模块 / 仓库：<module>
- 涉及的接口 / 数据结构：<contract or n/a>
- 是否影响现有兼容性：<yes/no + note>

## 🧩 背景 / 场景
- 为什么要做这个需求：<reason>
- 当前遇到什么问题：<problem>
- 现有替代方案：<alternative or n/a>
- 不做的影响：<impact>

## ✨ 需求描述
1. 当 <trigger> 时，系统应 <behavior>
2. 系统应 <expected behavior>
3. 若出现异常或依赖不可用，系统应 <fallback>

## 🎯 范围边界
- 本次要做：<in scope>
- 本次不做：<out of scope>

## ⚙️ 技术约束
- 依赖限制：<constraints or n/a>
- 性能 / 时延要求：<requirements or n/a>
- 数据来源 / 外部服务约束：<dependencies or n/a>
- 回滚或降级要求：<rollback plan or n/a>

## ✅ 验收标准
- [ ] 功能场景一：<scenario 1>
- [ ] 功能场景二：<scenario 2>
- [ ] 兼容性要求：<compatibility>
- [ ] 回归范围：<regression scope>
- [ ] 异常 / 降级行为：<failure handling>

## 🧪 验证方式
- 手工验证：<manual check>
- 自动化测试：<tests or n/a>
- 日志 / 指标 / 观测点：<signals or n/a>

## 📎 其他信息
- 接口文档：<link or n/a>
- 设计稿：<link or n/a>
- 关联 Issue / 需求编号：<id or n/a>
- 风险说明：<risk or n/a>
EOF
)"
```

### `bugfix|hotfix` => Bug Template => create

```bash
gh issue create \
  --title "bugfix: <short bug title>" \
  --body "$(cat <<'EOF'
## 🐛 问题概述
<problem summary>

## 🔁 复现步骤
1. <step 1>
2. <step 2>
3. <step 3>

## ✅ 预期结果
<expected>

## ❌ 实际结果
<actual>

## 🎯 影响范围 / 严重程度
- 影响范围：<scope>
- 严重程度：<severity>
- 是否可绕过：<yes/no + workaround>

## 🧪 修复验收
- 修复完成的判断标准：<done criteria>
- 需要回归的场景：<regression scope>

## 📎 其他信息
- 日志：<log or n/a>
- 截图：<link or n/a>
- 环境信息：<env>
- 输入样例 / 文件类型 / 任务 ID：<sample or n/a>
EOF
)"
```

```bash
glab issue create \
  --title "bugfix: <short bug title>" \
  --description "$(cat <<'EOF'
## 🐛 问题概述
<problem summary>

## 🔁 复现步骤
1. <step 1>
2. <step 2>
3. <step 3>

## ✅ 预期结果
<expected>

## ❌ 实际结果
<actual>

## 🎯 影响范围 / 严重程度
- 影响范围：<scope>
- 严重程度：<severity>
- 是否可绕过：<yes/no + workaround>

## 🧪 修复验收
- 修复完成的判断标准：<done criteria>
- 需要回归的场景：<regression scope>

## 📎 其他信息
- 日志：<log or n/a>
- 截图：<link or n/a>
- 环境信息：<env>
- 输入样例 / 文件类型 / 任务 ID：<sample or n/a>
EOF
)"
```

### Existing Issue => link for commit

```bash
# gh
gh issue comment <issue_number> --body "Linking commit: <sha>"
```

```bash
# glab
glab issue note <issue_number> -m "Linking commit: <sha>"
```

## Worked Example: Successful Required GitLab Flow (Sanitized)

Use this example when:
- the repository is hosted on a self-managed GitLab instance
- `change_type=feat`
- `gate_mode=required`
- no matching open issue exists yet

This example is intentionally sanitized:
- use placeholder hosts such as `<gitlab-host>`
- use placeholder repositories such as `<group>/<repo>`
- do not include local filesystem paths, tokens, or user-specific identifiers

### 1. Auto-Inferred Inputs

The gate may infer:
- `repo_root`: current git root
- `change_type`: `feat` from branch naming such as `task/feat/<date>-<slug>`
- `platform_hint`: `glab`
- `gate_mode`: `required`

### 2. Dry-Run Plan

```bash
export GITLAB_HOST=<gitlab-host>
glab issue list -R <group>/<repo> --search "Cypher retriever" --per-page 20
glab issue create -R <group>/<repo> \
  --title "feat: 完成 Cypher retriever 首版实现" \
  --description "<auto-drafted feature template body>"
```

Expected dry-run outcome:
- no matching open issue is found
- a feature-template issue draft is ready for confirmation
- the future commit bridge will be `ISSUE: #<issue_number>`

### 3. Human Confirmation

Before create:
- show the drafted title/body
- wait for explicit human confirmation

### 4. Executed Result

Successful execution should look like:

```text
== CHECK EXISTING ==
No open issues match your search in <group>/<repo>

== CREATE ISSUE ==
<issue_url>
```

Where:
- `<issue_url>` is the created issue URL on `<gitlab-host>`
- `<issue_number>` is parsed from that created issue

### 5. Gate Output Bridge

Successful gate output should include:

```text
## Gate Result
- gate_mode: required
- result: PASS
- reason: existing open issue not found; new issue created successfully

## Platform
- selected: glab
- cli_ready: yes

## Issue Action
- action: create
- issue_id: <issue_number>
- issue_url: <issue_url>
- title_source: auto_draft

## Commit Bridge
- refs_line: ISSUE: #<issue_number>
- next_for_commit_skill: include this line under Refs
```

### 6. Why This Example Matters

This example demonstrates the intended happy path:
- infer first
- dry-run before create
- preserve human confirmation
- create only when missing
- emit a deterministic `Refs` bridge for commit tooling

## Output Contract

```
## Gate Result
- gate_mode:
- result: PASS | PASS_WITH_WARNING | BLOCK
- reason:

## Platform
- selected: gh | glab
- cli_ready:

## Issue Action
- action: reuse | create | failed
- repo_target: canonical | fork | explicit_override
- issue_id:
- issue_url:
- title_source: user_input | auto_draft

## Commit Bridge
- refs_line: ISSUE: #<id>
- next_for_commit_skill:

## Execution Trace
- dry_run_plan:
- draft_preview:
- executed_commands:
- timestamp:
```

## Failure and Recovery

- If CLI is missing:
  - `required` => `BLOCK` with manual fallback steps
  - `recommended` => `PASS_WITH_WARNING`
- If create fails:
  - surface first failing command and retry suggestion
- Never hide partial failure; always return explicit state

## Guardrails

- Never print tokens or secrets.
- Never auto-close issues.
- Never skip dry-run confirmation by default.
- Keep automation reversible and auditable.
- Do not modify commit message directly; only provide `refs_line`.
- Do not ask for inputs that can be inferred reliably.
- Do not treat retroactive issue creation after implementation as the standard path for meaningful tracked work.
- Do not force one new issue per commit when multiple commits belong to the same tracked task.
- Do not default to creating the task issue in a fork when the work is meant for the canonical upstream repository.
- Do not treat issue linkage as issue resolution by default.
