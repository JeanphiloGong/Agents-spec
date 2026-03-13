# agents-spec-repo

[English](#english)

## 📘 项目介绍
agents-spec-repo 用于管理 AI Agents 在不同工程/产品角色下的行为规范与代码生成规则。目标不是写业务代码，而是提供角色化规范，确保输出一致、专业、可控。
仓库同时提供多智能体协作模板与角色索引，方便新项目快速落地与复用。

## 🎯 为什么需要这个仓库？
- AI 同时承担文档助手、代码生成、测试生成、架构辅助、多智能体子角色等任务，需要统一规范
- 缺少规范会导致风格混乱、架构不一致、测试质量下滑、行为不可控及安全风险
- 通过角色分离（Role-Based AI Behavior）让输出稳定、专业，便于审计与扩展

## 🔧 Skills（Codex 技能）
本仓库支持将项目规范与工作流沉淀为 Codex Skills，便于外部开发者或客户通过 AI 直接与项目交互。
参考： [OpenAI Codex Skills](https://developers.openai.com/codex/skills)
技能推荐按角色放置在 `agent-specs/<role>/skills/` 目录中，便于与角色规范绑定；如需本机使用，可同步到 `~/.codex/skills`。
多 agent 协作规范已迁移为可选技能 `agent-collab-skill`，需要时再启用。
显式外部记忆体系可使用 `project-memory-skill`，默认将项目记忆沉淀到 `~/.agents/memories/projects/<project-slug>/`。

## 🤝 协作方式
- 先阅读 `AGENTS.md` 与 `AGENTS.template.md`，理解权限与协作边界
- 新角色请放在 `agent-specs/` 下，并补齐对应 `AGENTS.md`
- 讨论与变更请记录到 `agent-collab/` 的相应频道或日志

## ✅ 贡献指南
- 仅修改文档类文件时使用 `WRITE_DOC`
- 任何代码/配置变更必须获得 `WRITE_CODE` 授权
- 变更提交请保持可追溯、可解释

## 🧭 沟通与支持
- 角色沟通：`agent-collab/agents/<id>/inbox.md` 与 `outbox.md`
- 部门内讨论：`agent-collab/channels/dept-*.md`
- 跨部门沟通：`agent-collab/channels/global.md`

## 🔒 安全与合规
- 禁止提交密钥、Token、PII
- 生产相关决策需记录在 `agent-collab/coordination/decisions.md`

## 🏷️ 版本与发布
- 本仓库以文档规范为主，发布节奏以变更合并为准
- 需要正式发布说明时可新增 `CHANGELOG.md`

## 📜 许可
- 暂未指定，按需补充

## 📁 仓库目录结构
```text
agents-spec-repo/
  ├── AGENTS.md
  ├── README.md
  └── agent-specs/
        ├── engineering/           # 后端、前端、全栈、移动、客户端、架构、平台、系统、SDK
        ├── qa/                    # QA/自动化/性能/安全测试
        ├── data/                  # 数据分析/工程/科学/平台/MLOps
        ├── ai-advanced/           # LLM/Prompt/Agent/评估/训练
        ├── design/                # UI/UX/交互/设计系统
        ├── documentation/         # 技术写作/文档规范
        ├── marketing/             # 市场营销/增长/定位
        ├── legal/                 # 法务/合规
        ├── infra/                 # DevOps/SRE/云/安全/网络/DBA/发布/运维
        ├── product/               # PM/PO/项目经理/Scrum Master
        └── leadership/            # Tech Lead/Engineering Manager/CTO
```

## 角色与规范索引
### 🧑‍💻 工程开发类（Engineering Roles）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 后端工程师 | 业务逻辑、数据库、服务端架构、API | `agent-specs/engineering/backend/AGENTS.md` |
| 前端工程师 | UI、交互、页面与组件、Web 构建 | `agent-specs/engineering/frontend/AGENTS.md` |
| 全栈工程师 | 跨前后端交付与集成 | `agent-specs/engineering/fullstack/AGENTS.md` |
| 移动端工程师 | 原生移动端（iOS/Android） | `agent-specs/engineering/ios/AGENTS.md` / `agent-specs/engineering/android/AGENTS.md` / `agent-specs/engineering/mobile/AGENTS.md` |
| 客户端工程师 | Flutter/React Native 等跨端客户端 | `agent-specs/engineering/client/AGENTS.md` |
| 架构师 | 整体系统架构、技术选型、规范指导 | `agent-specs/engineering/architecture/AGENTS.md` |
| 平台工程师 | 内部平台、CI/CD、工程工具、统一框架 | `agent-specs/engineering/platform/AGENTS.md` |
| 系统工程师 | 底层系统设计（Linux、网络、内核调优） | `agent-specs/engineering/system/AGENTS.md` |
| 爬虫工程师（工程） | 抓取系统、并发/限速、容错与监控 | `agent-specs/engineering/crawler-engineer/AGENTS.md` |
| DevOps 工程师 | 自动化部署、流水线、基础设施即代码 | `agent-specs/infra/devops/AGENTS.md` |
| SRE | 监控、日志、报警、容灾、可靠性 | `agent-specs/infra/sre/AGENTS.md` |
| 安全工程师 | 安全审计、渗透、安全防护、密钥体系 | `agent-specs/infra/security/AGENTS.md` |
| 云工程师 | AWS/GCP/Azure 云架构与优化 | `agent-specs/infra/cloud-engineer/AGENTS.md` |
| API / SDK 工程师 | API 设计、SDK 打包、集成体验 | `agent-specs/engineering/sdk/AGENTS.md` |

### 🧪 质量与测试类（QA & Testing）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 测试工程师 | 设计测试用例，手动/自动验证质量 | `agent-specs/qa/testing/AGENTS.md` |
| 自动化测试工程师 | 编写 E2E/集成/单测脚本（Cypress/Playwright/Jest 等） | `agent-specs/qa/automation-qa/AGENTS.md` |
| 测试架构师 | 设计测试框架、测试平台、质量体系 | `agent-specs/qa/test-architect/AGENTS.md` |
| 性能测试工程师 | 压测、容量预测、性能瓶颈分析 | `agent-specs/qa/performance-test/AGENTS.md` |
| 安全测试工程师 | 渗透测试、漏洞扫描、安全验证 | `agent-specs/qa/security-test/AGENTS.md` |

### 📊 数据相关角色（Data Roles）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 数据分析师 | 分析数据、产出业务洞察 | `agent-specs/data/data-analyst/AGENTS.md` |
| 数据科学家 | 建模、实验、预测分析 | `agent-specs/data/data-scientist/AGENTS.md` |
| 数据工程师 | 构建 ETL、数据流、数据仓库 | `agent-specs/data/data-engineer/AGENTS.md` |
| 数据平台工程师 | 大数据平台、湖仓、数据治理 | `agent-specs/data/data-platform-engineer/AGENTS.md` |
| MLOps / ML 工程师 | 模型部署、监控、漂移治理 | `agent-specs/data/mlops-engineer/AGENTS.md` |
| 爬虫工程师（数据采集） | 数据采集、质量控制、字段口径 | `agent-specs/data/crawler-engineer/AGENTS.md` |

### 🤖 AI 相关角色（AI/LLM Roles）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| AI 工程师 / LLM Engineer | 构建 AI pipeline、RAG、Prompt 工程 | `agent-specs/ai-advanced/llm-engineer/AGENTS.md` |
| Prompt Engineer | 设计与优化提示，提升模型行为 | `agent-specs/ai-advanced/prompt-engineer/AGENTS.md` |
| AI Agents 编排工程师 | 多智能体系统、调度策略、上下文框架 | `agent-specs/ai-advanced/agent-orchestrator/AGENTS.md` |
| AI 评估工程师 | 模型/方案评测、基准对比、质量分析 | `agent-specs/ai-advanced/ai-evaluator/AGENTS.md` |
| 模型训练工程师 | 预训练、微调、蒸馏流程 | `agent-specs/ai-advanced/model-training-engineer/AGENTS.md` |
| （附）LLM Engineer 深入版 | 细分的 AI 子规范 | `agent-specs/ai-advanced/llm-engineer/ai/AGENTS.md` |

### 🧭 产品与项目类（Product & Project）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 产品经理 | 定义需求、路线图、功能优先级 | `agent-specs/product/product-manager/AGENTS.md` |
| 产品负责人 | 拥有业务方向与迭代决策权 | `agent-specs/product/product-owner/AGENTS.md` |
| 项目经理 | 协调团队、排期、进度管理 | `agent-specs/product/project-manager/AGENTS.md` |
| Scrum Master | 敏捷流程、站会、迭代仪式 | `agent-specs/product/scrum-master/AGENTS.md` |
| 实验负责人 / A/B 测试 | 实验设计、指标与统计评估 | `agent-specs/product/experiment-manager/AGENTS.md` |

### 📣 市场与增长类（Marketing & Growth）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 市场营销经理 | 定位、传播、渠道与增长策略 | `agent-specs/marketing/marketing-manager/AGENTS.md` |

### 🎨 设计与用户体验类（Design & UX）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| UI 设计师 | 界面视觉稿、组件视觉规范 | `agent-specs/design/ui-designer/AGENTS.md` |
| UX 设计师 | 用户研究、体验策略、信息架构 | `agent-specs/design/ux-designer/AGENTS.md` |
| 交互设计师 | 交互流程、操作路径、可用性 | `agent-specs/design/interaction-designer/AGENTS.md` |
| 设计系统工程师 | 组件库、主题样式、设计系统工程化 | `agent-specs/design/design-system-engineer/AGENTS.md` |

### 📝 文档与知识管理（Documentation）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 文档工程师 / Technical Writer | 项目说明、API 文档、前端与运维文档 | `agent-specs/documentation/technical-writer/AGENTS.md` |

### 📦 运维、发布与基础设施类（Ops & Infra）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 运维工程师 | 服务器、生产环境、部署 | `agent-specs/infra/ops-engineer/AGENTS.md` |
| 发布工程师 | 灰度/金丝雀发布、变更管理、回滚策略 | `agent-specs/infra/release-engineer/AGENTS.md` |
| 网络工程师 | 网络架构、CDN、路由与安全 | `agent-specs/infra/network-engineer/AGENTS.md` |
| 数据库管理员 | 数据库调优、备份恢复、查询优化 | `agent-specs/infra/database-admin/AGENTS.md` |

### ⚖️ 法务与合规类（Legal & Compliance）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |

---

# English

## 📘 Overview
agents-spec-repo defines role-based AI agent behavior specs and collaboration norms for engineering and product teams. It is not a business codebase; it is a role-spec repository to keep outputs consistent, professional, and auditable.
It also ships multi-agent collaboration templates and role indexes for quick adoption in new projects.

## 🎯 Why this repository?
- AI agents span documentation, code generation, testing, architecture support, and multi-agent roles
- Without shared norms, outputs become inconsistent, unsafe, and hard to audit
- Role-based specifications make results stable and reusable

## 🔧 Skills (Codex)
This repo supports Codex Skills so external developers or customers can use AI to integrate with a project.
Reference: [OpenAI Codex Skills](https://developers.openai.com/codex/skills)
Place skills under `agent-specs/<role>/skills/` and sync to `~/.codex/skills` if needed.

## 🤝 Collaboration
- Read `AGENTS.md` and `AGENTS.template.md` first to understand boundaries
- Add new roles under `agent-specs/` with a matching `AGENTS.md`
- Record discussions and changes in `agent-collab/` channels/logs

## ✅ Contributing
- Use `WRITE_DOC` for documentation-only changes
- Any code or config change requires explicit `WRITE_CODE`
- Keep commits traceable and explain intent

## 🧭 Support
- Role inbox/outbox: `agent-collab/agents/<id>/inbox.md` and `outbox.md`
- Department channels: `agent-collab/channels/dept-*.md`
- Cross-department: `agent-collab/channels/global.md`

## 🔒 Security & Compliance
- Never commit secrets, tokens, or PII
- Record production-impacting decisions in `agent-collab/coordination/decisions.md`

## 🏷️ Versioning & Releases
- This repo is documentation-first; releases align with merged updates
- Add `CHANGELOG.md` if formal release notes are needed

## 📜 License
- Not specified yet
| 法务顾问 / Legal Counsel | 合规审查、风险识别、合同条款 | `agent-specs/legal/legal-counsel/AGENTS.md` |

### 💎 团队高级角色（Leadership）
| 角色 | 职责 | AGENTS 路径 |
| --- | --- | --- |
| 技术负责人 / Tech Lead | 技术决策、代码质量、架构评审 | `agent-specs/leadership/tech-lead/AGENTS.md` |
| 工程经理 | 团队管理、绩效、招聘、成长 | `agent-specs/leadership/engineering-manager/AGENTS.md` |
| CTO | 技术战略方向、技术体系建设 | `agent-specs/leadership/cto/AGENTS.md` |

### 🧬 待补充角色
- 风险与合规工程师（Risk & Compliance Engineer）— AGENTS.md 待补充
- 技术支持工程师（Support Engineer）— AGENTS.md 待补充

## 🛠️ 如何使用这个仓库？
### 对于人类开发者
- 按角色查阅对应 `AGENTS.md`，定义团队级规范与工程文化
- 控制 AI 在不同角色下的生成风格，审核并改进 AI 使用策略
- 适用于 ChatGPT/Claude 协作、多智能体系统、企业内 AI 助手体系

### 对于 AI Agents
- 执行任务前读取对应目录下的 `AGENTS.md`，禁止跨角色行为
- 输出必须符合该角色规范，并体现对应方法论与工程原则

## 📜 规范哲学：大师来源说明
1. Clean Architecture（Robert C. Martin）：依赖倒置、分层隔离、纯净业务逻辑
2. Enterprise Patterns（Martin Fowler）：服务层模式、DTO、Repository、Test Pyramid
3. DDD（Eric Evans）：聚合、不变量、领域模型
4. 现代前端哲学（Dan Abramov / Evan You / Kent Dodds）：声明式 UI、最小状态、可组合逻辑、像用户那样测试
5. 测试大师方法论（Kent Beck / Gerard Meszaros）：TDD、AAA、测试反模式识别

## 🌱 Roadmap（发展计划）
- 添加更多角色规范或补充缺失的 AGENTS.md
- 加入角色能力矩阵（RACI Matrix）
- 提供 JSON 格式的规范输出供工具读取
- 发布 VS Code 插件自动提示 AI 规范

## 🤝 贡献指南（Contributing）
- 欢迎 PR：新角色规范、工程方法论补充、修复拼写/格式、添加语言版本（中/英可选）
- PR 需要：清晰描述新增内容、遵守仓库风格、不得修改本 README 定义的基础结构

## 📄 License
默认使用 MIT License，你可以根据需要更改。

MIT License
