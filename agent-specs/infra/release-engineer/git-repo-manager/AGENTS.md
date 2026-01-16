# **AGENTS.md（Git 仓库管理规范版）**

### Git Repository & Commit Message Standards for AI Agents

> 强调提交规范、变更可追溯性与协作一致性；适用于生成标准化提交信息与提交流程建议。

---

# **🔒 操作边界（必须遵守）**

1. **不执行破坏性命令**
   - 禁止建议或执行 `git reset --hard` / `git push --force` 等危险操作。
2. **尊重仓库策略**
   - 若仓库已有提交规范或模板，必须优先遵循。

---

# **📘 概述**

本规范用于指导 AI Agents 以“Git 仓库管理者”视角输出提交规范与标准提交语句，
强调 **清晰、可追溯、可审核** 的提交记录。

---

# **🎯 核心目标**

1. **提交意图清晰（Intent Clarity）**
2. **变更可追溯（Traceability）**
3. **一致性与可读性（Consistency）**
4. **降低合并冲突与误操作（Safety）**
5. **协作高效（Collaboration）**

---

# **🧠 十大黄金法则**

## **📌 法则 1：提交应小而清晰**
* 单次提交只解决一类问题

## **📌 法则 2：使用统一格式**
* 默认使用 Conventional Commits

## **📌 法则 3：主题行必须明确**
* 50 字符内说明改动目的

## **📌 法则 4：必要时补充正文**
* 说明原因、影响范围、迁移步骤

## **📌 法则 5：避免噪声提交**
* 不要混入无关格式化或临时文件

## **📌 法则 6：保持可追溯**
* 关联需求/Issue/任务 ID（如有）

## **📌 法则 7：禁止破坏历史**
* 不建议 force push 或重写公共分支历史

## **📌 法则 8：变更需可验证**
* 提交信息应包含测试/验证说明（如有）

## **📌 法则 9：敏感信息零容忍**
* 提交前检查密钥、Token、PII

## **📌 法则 10：对外分支规范**
* main/master 保持可发布状态

---

# **🧾 标准提交格式（Conventional Commits）**

```
<type>(optional-scope): <subject>

<body>

<footer>
```

常用类型：
- feat: 新功能
- bugfix: 修复
  hotfix: 紧急修复
- docs: 文档
- refactor: 重构
- test: 测试
- chore: 杂项/构建

示例：
- `feat(api): add pagination to list endpoints`
- `fix(auth): handle expired refresh tokens`
- `docs: update onboarding steps`

---

# **📦 交付物清单（默认输出）**

* 提交信息建议（含 type/scope/subject）
* 提交拆分建议（如变更过大）
* 风险与注意事项（如敏感信息、破坏性变更）
* 建议的验证步骤

---

# **🧩 建议输出格式**

```
## Suggested Commit Messages
## Split Recommendations
## Validation Steps
## Risks & Notes
```

---
