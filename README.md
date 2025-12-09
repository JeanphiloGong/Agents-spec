# agents-spec-repo

## 📘 项目介绍
agents-spec-repo 是一个用于管理 AI Agents 在不同工程角色下的行为规范与代码生成规则的项目。目标不是写业务代码，而是定义：
- AI 如何作为后端/前端/测试工程师写代码
- 不同场景下应使用的架构方法论
- 生成代码必须遵守的工程规则、风格与边界

## 🎯 为什么需要这个仓库？
- 现代团队会同时使用 AI 作为文档助手、代码生成助手、单元测试生成器、架构设计辅助工具、多智能体协作框架中的子 Agent
- 缺少统一规范会导致风格混乱、业务与架构不一致、测试不可靠、行为不一致以及潜在安全风险
- 通过角色分离（Role-Based AI Behavior），保证 AI 输出稳定、专业、可控

## 📁 仓库目录结构
```text
agents-spec-repo/
  ├── AGENTS.md                # 根级规范：权限、写文件规则、模式总定义
  ├── README.md                # 当前项目说明
  ├── agent-specs/
  │     ├── backend/
  │     │     └── AGENTS.md    # 后端工程师规范
  │     ├── frontend/
  │     │     └── AGENTS.md    # 前端工程师规范
  │     ├── testing/
  │     │     └── AGENTS.md    # 测试工程师规范
  │     ├── devops/
  │     │     └── AGENTS.md    # DevOps/SRE 规范（预留）
  │     ├── ai/
  │     │     └── AGENTS.md    # AI 工程师规范（预留）
  │     ├── security/
  │           └── AGENTS.md    # 安全工程规范（预留）
  └── scripts/
        └── create_agents_repo.sh   # 自动脚本（可选）
```

## 🧩 已实现角色规范
| 角色 | 规范文件 | 大师级方法论来源 |
| --- | --- | --- |
| 后端工程师 | agent-specs/backend/AGENTS.md | Clean Architecture（Uncle Bob）、DDD（Eric Evans）、Enterprise Patterns（Fowler） |
| 前端工程师 | agent-specs/frontend/AGENTS.md | Dan Abramov、Evan You、Kent C. Dodds、Ryan Florence |
| 测试工程师 | agent-specs/testing/AGENTS.md | Kent Beck（TDD）、Gerard Meszaros（Test Patterns）、Fowler、Kent C. Dodds |

### 预留角色（待未来集成）
- DevOps / SRE / Infra
- AI 工程师（LLM、RAG、Agent Orchestration）
- Security / 渗透测试工程师
- 数据工程师 / 数据科学家

## 🛠️ 如何使用这个仓库？
### 对于人类开发者
- 查看 AI 行为规范，定义团队级编码标准与工程文化
- 控制 AI 在不同角色下的生成风格，审核并改进 AI 使用策略
- 适用于 ChatGPT/Claude 协作、多智能体系统、企业内 AI 助手体系

### 对于 AI Agents
- 扮演某个工程角色时必须读取对应目录下的 `AGENTS.md`
- 输出必须严格遵循该角色规范，禁止跨角色行为
- 应体现对应大师的工程方法论

### 角色应用示例
- 后端任务 → 参考 `agent-specs/backend/AGENTS.md`，使用 Clean Architecture，严格分层，遵循依赖倒置（DIP）
- 前端任务 → 参考 `agent-specs/frontend/AGENTS.md`，单向数据流、最小状态、组件拆分、像 Dan Abramov 那样写代码
- 测试任务 → 参考 `agent-specs/testing/AGENTS.md`，AAA 模式、单一断言原则、以用户行为为测试目标，模拟外部依赖而非业务

## 📜 规范哲学：大师来源说明
1. Clean Architecture（Robert C. Martin）：依赖倒置、分层隔离、纯净业务逻辑
2. Enterprise Patterns（Martin Fowler）：服务层模式、DTO、Repository、Test Pyramid
3. DDD（Eric Evans）：聚合、不变量、领域模型
4. 现代前端哲学（Dan Abramov / Evan You / Kent Dodds）：声明式 UI、最小状态、可组合逻辑、像用户那样测试
5. 测试大师方法论（Kent Beck / Gerard Meszaros）：TDD、AAA、测试反模式识别

## 🧱 扩展与新增角色规范
- `mkdir -p agent-specs/<role>/`
- `touch agent-specs/<role>/AGENTS.md`
- 每个角色一个独立规范文件，互不干扰，方便团队扩展

## 🌱 Roadmap（发展计划）
- 添加 DevOps 规范
- 添加 Security 规范
- 添加 Data Engineering 规范
- 添加 AI 工程师规范
- 加入角色能力矩阵（RACI Matrix）
- 提供 JSON 格式的规范输出供工具读取
- 发布 VS Code 插件自动提示 AI 规范

## 🤝 贡献指南（Contributing）
- 欢迎 PR：新角色规范、工程方法论补充、修复拼写/格式、添加语言版本（中/英可选）
- PR 需要：清晰描述新增内容、遵守仓库风格、不得修改本 README 定义的基础结构

## 📄 License
默认使用 MIT License，你可以根据需要更改。

MIT License
