# Issue Templates

Use this reference when resolving `template_family`, drafting the issue body,
or validating template-specific required fields.

## Table of Contents

- [Template Style Rule](#template-style-rule)
- [Bug / Incident Template](#bug--incident-template)
- [Feature / Change Template](#feature--change-template)
- [Engineering Child Issue Template](#engineering-child-issue-template)
- [Task / Maintenance Template](#task--maintenance-template)
- [Investigation / Spike Template](#investigation--spike-template)
- [Issue Title Prefix Rule](#issue-title-prefix-rule)
- [Template Validation Rule](#template-validation-rule)
- [Template-to-Command Mapping Examples](#template-to-command-mapping-examples)
- [Existing Issue => link for commit](#existing-issue--link-for-commit)

## Template Style Rule

- Prefer clean section headings without `（必填）` or `（可选）` in the rendered
  issue body.
- Keep requiredness in skill validation rules and repository templates, not in
  user-facing heading text.
- When a repository already provides canonical issue templates, mirror their
  field names and heading structure unless there is a strong reason not to.
- When referencing related issues in rendered markdown, use plain `#123`,
  `owner/repo#123`, or a full URL in normal prose; do not wrap the issue
  reference itself in backticks if the link should stay clickable.

## Issue Title Prefix Rule

New issue titles must use `<prefix>: <short title>`. Resolve `prefix` from
`change_type` before selecting the create command:

- `feat|integration|workflow|api` => `feat`
- `fix|bugfix|incident` => `bugfix`
- `hotfix` => `hotfix`
- `docs` => `docs`
- `refactor` => `refactor`
- `test` => `test`
- `tooling` => `tooling`
- `config` => `config`
- `chore` => `chore`
- `spike|research|proposal|investigation` => `proposal`

Existing issue titles without this prefix should warn, not block reuse.

## Bug / Incident Template

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

```text
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

## Feature / Change Template

Required fields:
- `背景 / 问题`
- `目标 / 期望结果`
- `范围边界`
- `外部契约或用户影响`
- `验收标准`

Recommended fields:
- `风险 / 依赖`
- `验证方式`

Optional fields:
- `兼容性说明`
- `接口文档`
- `设计稿`
- `关联 Issue / 需求编号`

Standard template:

```text
## 🧩 背景 / 场景
- 为什么现在要做：...
- 当前主要问题：...
- 如果不做会带来什么影响：...

## 🎯 目标 / 期望结果
- 这次希望达成什么结果：...
- 完成后外部应该看到什么变化：...

## 🎯 范围边界
- 本次要做：...
- 本次不做：...

## 🌐 外部契约或用户影响
- 用户侧 / 调用方会感知到什么变化：...
- 是否涉及对外接口、输入输出、兼容性要求：...
- 如果需要提接口，只描述外部行为，不展开内部实现：...

## ✅ 验收标准
- [ ] ...
- [ ] ...

## ⚠️ 风险 / 依赖
- 依赖项：...
- 风险点：...
- 需要协调或确认的事项：...

## 🧪 验证方式
- 手工验证：...
- 自动化测试：...

## 📎 其他信息
- 兼容性说明：...
- 接口文档：...
- 设计稿：...
- 关联 Issue / 需求编号：...
```

Parent issue default rules:

- Default this template to `parent_requirement` and `cross_functional` unless
  the operator explicitly requests an engineering-facing issue.
- Do not include code blocks, file paths, class names, function names, module
  splits, or internal architecture comparison by default.
- If detailed implementation discussion is required, create a linked
  engineering child issue instead of expanding the parent body.

## Engineering Child Issue Template

Use this template when the parent issue must stay product-facing but the work
still needs engineering execution detail.

Required fields:
- `父 Issue / 承接关系`
- `本次工程目标`
- `范围边界`
- `验收标准`

Recommended fields:
- `涉及模块 / 契约`
- `技术约束`
- `实施要点`
- `风险 / 依赖`

Optional fields:
- `迁移步骤`
- `回滚方案`
- `关联设计文档 / PR`

Standard template:

```text
## 🔗 父 Issue / 承接关系
- 父 Issue：...
- 本子任务承接的目标：...

## 🎯 本次工程目标
- 这次工程交付要完成什么：...
- 完成后对父 Issue 有什么支撑：...

## 🎯 范围边界
- 本次要做：...
- 本次不做：...

## 🧩 涉及模块 / 契约
- 涉及的服务 / 模块 / 仓库：...
- 涉及的内部契约 / 数据结构 / 接口：...

## ⚙️ 技术约束
- 依赖限制：...
- 迁移或兼容性要求：...
- 回滚或降级要求：...

## 🛠 实施要点
- 主链路或实施步骤：...
- 需要重点关注的内部约束：...

## ✅ 验收标准
- [ ] ...
- [ ] ...

## ⚠️ 风险 / 依赖
- 风险点：...
- 依赖项：...
- 需要协调的事项：...

## 📎 其他信息
- 迁移步骤：...
- 回滚方案：...
- 关联设计文档 / PR：...
```

Child issue default rules:

- Default this template to `delivery_task` or `implementation_task`.
- Default audience is `engineering_only`.
- Internal module, contract, and execution detail are allowed when they are
  necessary to make the engineering task actionable.
- Keep the child issue scoped to one execution layer; if it turns into a broad
  program of work, split again instead of piling unrelated implementation
  details into one engineering issue.

## Task / Maintenance Template

Required fields:
- `背景 / 目的`
- `本次范围`
- `完成标准`

Recommended fields:
- `影响模块`
- `风险 / 注意事项`
- `验证方式`

Optional fields:
- `兼容性说明`
- `回滚说明`
- `关联 Issue / 需求编号`

Standard template:

```text
## 📦 影响模块
- 涉及的服务 / 模块 / 仓库：...
- 涉及的文件 / 流程 / 工具：...

## 🎯 背景 / 目的
- 为什么现在要做：...
- 当前阻塞 / 低效 / 技术债：...

## 🛠 本次范围
- 本次要做：...
- 本次不做：...

## ✅ 完成标准
- [ ] ...
- [ ] ...

## 🧪 验证方式
- 手工验证：...
- 自动化测试：...

## 📎 其他信息
- 风险 / 注意事项：...
- 回滚说明：...
```

## Investigation / Spike Template

Required fields:
- `研究问题`
- `背景 / 动机`
- `预期产出`
- `退出条件 / 范围边界`

Recommended fields:
- `备选方案 / 假设`
- `验证方式`

Optional fields:
- `相关链接`
- `风险说明`
- `下阶段建议`

Template:

```text
## ❓ 研究问题
- 本次要回答什么问题：...
- 当前最大不确定性：...

## 🧩 背景 / 动机
- 为什么现在要做这次研究 / 预研：...
- 当前已知限制或前提：...

## 🧪 预期产出
- 需要形成的结论：...
- 需要交付的产物：...

## 🎯 退出条件 / 范围边界
- 本次要确认：...
- 本次不做：...
- 什么情况下可以结束本次研究：...

## 📎 其他信息
- 备选方案 / 假设：...
- 验证方式：...
- 相关链接：...
- 风险说明：...
- 下阶段建议：...
```

## Template Validation Rule

- Resolve `template_family` and `issue_level` first.
- Resolve and validate the issue title prefix from `change_type` before create.
- Validate semantic required fields against the selected template family, not
  against a single fixed heading set.
- Validate issue quality as well as field presence: clear problem statement,
  explicit target outcome, bounded scope, testable acceptance, and
  audience-appropriate detail.
- If template-required fields are missing:
  - `gate_mode=required` => `BLOCK`
  - `gate_mode=recommended` => `PASS_WITH_WARNING`
- Validation output must include the resolved `template_family` and
  `issue_level`.
- Validation output must distinguish:
  - `title_prefix`
  - `title_prefix_warnings`
  - `missing_required_fields`
  - `missing_recommended_fields`
  - `overspecification_warnings`
- For `feat|integration|workflow|api` work that is clearly backend-, AI-,
  workflow-, or integration-heavy, missing `技术约束` or `验证方式` should emit
  an explicit warning.
- For `spike|research|proposal|investigation` work, missing a concrete
  `预期产出` or `退出条件 / 范围边界` must be treated as a required-field
  failure, not a soft omission.
- If a `parent_requirement` draft contains speculative classes, files, routes,
  tables, workers, or unapproved architecture splits, emit an
  `overspecification_warning` and rewrite before presentation.
- If `child_issue_needed=yes`, validate that:
  - the parent issue stays product-facing
  - the child issue carries the necessary engineering detail
  - the parent/child relationship is explicit
- Validation output must list missing fields explicitly.

## Template-to-Command Mapping Examples

Use the resolved `template_family` to select template and command payload
automatically. These examples are the standard drafting shape unless a
repository-specific template overrides them.

### `feat|integration|workflow|api` => Feature / Change Template => create

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

### `fix|bugfix|hotfix|incident` => Bug / Incident Template => create

```bash
gh issue create \
  --title "<resolved-prefix>: <short bug title>" \
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
  --title "<resolved-prefix>: <short bug title>" \
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

### `chore|docs|refactor|test|tooling|config` => Task / Maintenance Template => create

```bash
gh issue create \
  --title "<resolved-prefix>: <short task title>" \
  --body "$(cat <<'EOF'
## 📦 影响模块
- 涉及的服务 / 模块 / 仓库：<module>
- 涉及的文件 / 流程 / 工具：<scope>
- 是否影响现有兼容性：<yes/no + note>

## 🎯 背景 / 目的
- 为什么现在要做：<reason>
- 当前阻塞 / 低效 / 技术债：<problem>

## 🛠 本次范围
- 本次要做：<in scope>
- 本次不做：<out of scope>

## ✅ 完成标准
- [ ] <done criteria 1>
- [ ] <done criteria 2>

## 🧪 验证方式
- 手工验证：<manual check or n/a>
- 自动化测试：<tests or n/a>
- 日志 / 指标 / 观测点：<signals or n/a>

## 📎 其他信息
- 风险 / 注意事项：<risk or n/a>
- 兼容性说明：<compat note or n/a>
- 回滚说明：<rollback or n/a>
- 关联 Issue / 需求编号：<id or n/a>
EOF
)"
```

```bash
glab issue create \
  --title "<resolved-prefix>: <short task title>" \
  --description "$(cat <<'EOF'
## 📦 影响模块
- 涉及的服务 / 模块 / 仓库：<module>
- 涉及的文件 / 流程 / 工具：<scope>
- 是否影响现有兼容性：<yes/no + note>

## 🎯 背景 / 目的
- 为什么现在要做：<reason>
- 当前阻塞 / 低效 / 技术债：<problem>

## 🛠 本次范围
- 本次要做：<in scope>
- 本次不做：<out of scope>

## ✅ 完成标准
- [ ] <done criteria 1>
- [ ] <done criteria 2>

## 🧪 验证方式
- 手工验证：<manual check or n/a>
- 自动化测试：<tests or n/a>
- 日志 / 指标 / 观测点：<signals or n/a>

## 📎 其他信息
- 风险 / 注意事项：<risk or n/a>
- 兼容性说明：<compat note or n/a>
- 回滚说明：<rollback or n/a>
- 关联 Issue / 需求编号：<id or n/a>
EOF
)"
```

### `spike|research|proposal|investigation` => Investigation / Spike Template => create

```bash
gh issue create \
  --title "proposal: <short investigation title>" \
  --body "$(cat <<'EOF'
## ❓ 研究问题
- 本次要回答什么问题：<question>
- 当前最大不确定性：<unknown>

## 🧩 背景 / 动机
- 为什么现在要做这次研究 / 预研：<reason>
- 当前已知限制或前提：<constraints>

## 🧪 预期产出
- 需要形成的结论：<expected conclusion>
- 需要交付的产物：<artifact>

## 🎯 退出条件 / 范围边界
- 本次要确认：<in scope>
- 本次不做：<out of scope>
- 什么情况下可以结束本次研究：<exit condition>

## 📎 其他信息
- 备选方案 / 假设：<alternatives or hypotheses>
- 验证方式：<validation>
- 相关链接：<links or n/a>
- 风险说明：<risk or n/a>
- 下阶段建议：<next step or n/a>
EOF
)"
```

```bash
glab issue create \
  --title "proposal: <short investigation title>" \
  --description "$(cat <<'EOF'
## ❓ 研究问题
- 本次要回答什么问题：<question>
- 当前最大不确定性：<unknown>

## 🧩 背景 / 动机
- 为什么现在要做这次研究 / 预研：<reason>
- 当前已知限制或前提：<constraints>

## 🧪 预期产出
- 需要形成的结论：<expected conclusion>
- 需要交付的产物：<artifact>

## 🎯 退出条件 / 范围边界
- 本次要确认：<in scope>
- 本次不做：<out of scope>
- 什么情况下可以结束本次研究：<exit condition>

## 📎 其他信息
- 备选方案 / 假设：<alternatives or hypotheses>
- 验证方式：<validation>
- 相关链接：<links or n/a>
- 风险说明：<risk or n/a>
- 下阶段建议：<next step or n/a>
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
