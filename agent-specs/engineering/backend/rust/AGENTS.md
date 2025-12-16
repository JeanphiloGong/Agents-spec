# **AGENTS.md（后端开发规范·Rust 版）**

### Backend Code Authoring Principles for AI Agents — Rust

> 基于 **Clean Architecture（Uncle Bob）**、**Martin Fowler 企业级模式**、**Eric Evans DDD**、**Sam Newman 微服务模式**，并结合 **Rust 工程实践（所有权 / Borrowing / Zero-Cost Abstractions / Async 安全）**。

---

# **📘 概述**
本文件用于指导 AI Agents 在本项目中如何编写高质量的 Rust 后端代码，确保可读、安全、可维护，并充分利用 Rust 的类型系统与并发模型。

---

# **🎯 Rust 后端代码核心目标**
1. **类型安全优先**：用类型表达约束与不变量，降低运行时错误。
2. **清晰分层**：领域隔离基础设施，业务不依赖框架细节。
3. **显式依赖**：通过 trait/接口注入外部依赖，杜绝隐式全局状态。
4. **可测试可替换**：面向接口 + 纯净业务核心，易于单测与集成测试。
5. **并发安全**：Send/Sync 明确，避免数据竞争；谨慎使用 `Arc`、`RwLock`/`Mutex`，优先不可变数据与消息传递。
6. **可恢复 & 可观测**：错误分级、日志/指标/追踪齐全，便于排障。

---

# **🏛 理念来源**
- **Clean Architecture（Robert C. Martin）**：业务核心不依赖框架；依赖方向指向领域层。
- **Martin Fowler 企业级模式**：Repository、Service Layer、DTO、Circuit Breaker/Retry。
- **DDD（Eric Evans）**：聚合维护不变量，值对象不可变，应用服务只协调。
- **Rust 工程最佳实践**：所有权/借用、零成本抽象、`Result`/`?` 错误链、`#![deny(unsafe_code)]`（除非有书面豁免）、`cargo fmt`/`clippy`/`test` 一致性。

---

# **🧠 Rust 版十大黄金法则**
## 1）业务只在 Service，不在 Handler/Controller
Handler 负责校验/转换，业务流程在应用或领域服务中完成。

## 2）模型分层明确（DTO / Domain / Persistence）
DTO 仅用于 I/O；领域实体维护不变量；持久化模型封装在仓储。

## 3）一切外部依赖接口化（trait 即边界）
DB/Cache/第三方 API 通过 trait 注入；实现放在 infra 层，领域不依赖具体库。

## 4）函数短小纯净，避免隐式副作用
明确借用/所有权；减少不必要的 `clone`；必要时标注生命周期；保持单一职责。

## 5）流程显式，拒绝魔法
步骤与错误路径可读；避免宏隐式副作用；配置/特性开关显式声明。

## 6）错误分级与语义化
业务错误 vs 系统错误 vs 外部依赖错误；使用 `thiserror`/`anyhow` 结构化错误；禁止在业务路径 `unwrap/expect`（初始化/测试除外）。

## 7）幂等与可恢复
HTTP 重试、消息消费、定时任务需支持幂等键/事务；外部调用考虑重试 + 熔断 + 超时。

## 8）可测试设计
依赖通过 trait 注入；避免全局单例；领域逻辑可纯函数化；`#[cfg(test)]` 提供内存实现/假对象。

## 9）不跨层泄漏
领域层不出现框架类型（如 `axum::Json`、ORM 模型）；仓储实现不向上泄漏数据库细节。

## 10）安全与性能守则
默认 `#![deny(unsafe_code)]`；必要的 `unsafe` 需隔离并加注释和测试；谨慎使用共享可变状态；避免不必要的分配/拷贝。

---

# **🦀 Rust 特有实践**
- **类型表达业务**：使用新类型（如 `UserId(String)`）替代裸 `String`/`i64`；用枚举建模状态机。
- **异步约定**：统一 runtime（如 Tokio）；为外部依赖设定超时、重试与 backoff；避免阻塞调用进入 async 路径。
- **序列化边界**：仅在接口层做 `serde`（`Deserialize`/`Serialize`）；领域模型保持最小派生。
- **配置与特性**：显式 `Cargo.toml` features；禁止在领域层读环境变量。
- **可观测性**：使用 `tracing`（span + structured log）；指标/追踪放在 infra 层注入。

---

# **🧩 代码结构示例（Rust）**
```
/src
  /domain
    mod.rs
    user.rs              # 实体/值对象/领域服务
  /application
    mod.rs
    user_service.rs      # 应用服务，协调用例
    commands.rs
    queries.rs
  /infrastructure
    mod.rs
    persistence/
      mod.rs
      user_repository.rs # 仓储实现（如 SQL/NoSQL）
    external/
      sms_provider.rs    # 第三方/网关实现
  /interfaces
    http/
      handlers.rs
      dto.rs
    queue/
      consumer.rs
  /bootstrap
    main.rs              # 组合依赖、配置、路由
```
- 领域层不依赖框架；接口层仅持有 DTO 与 handler。
- 仓储通过 trait 暴露；实现细节封装在 infra。
- 测试可在 `tests/` 或模块内 `#[cfg(test)]`，使用内存实现替代外部依赖。

---

# **⚙ 工具链约定**
- 强制 `cargo fmt`、`cargo clippy --all-targets --all-features`、`cargo test`。
- 依赖变更需审查许可证；避免不必要的宏魔法。
- 生成代码时优先使用稳定版 Rust；特殊 nightly 需说明理由与回退方案。

---

# **🔚 总结声明（AI 必须遵守）**
- 严格遵循 Clean Architecture + DDD 分层，依赖指向领域核心。
- 使用 Rust 类型系统表达不变量，避免隐式副作用与 `unwrap`。
- 外部依赖接口化，业务可测试、可替换、可观测。
- 默认安全（无 `unsafe`），默认可读（短小函数、显式错误），默认可靠（幂等 + 重试 + 超时）。
