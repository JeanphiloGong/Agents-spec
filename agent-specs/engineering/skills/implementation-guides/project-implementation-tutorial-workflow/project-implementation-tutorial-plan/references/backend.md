# Backend Mode

Use for service, worker, domain, and persistence capabilities in the existing
project. Derive the module boundary from one coherent business responsibility,
not one tutorial module per architectural layer.

## V0: Discuss the Business Contract and Produce the Module Design

Inspect the real actors/events, existing callers, domain rules, interfaces,
repositories, schema/migrations, and tests relevant to the requested scope.
Trace one operation from input through decisions and side effects to the
observable result, including what initiates the next action.

Settle the decisions that affect implementation:

- Objects, ownership, lifecycle, invariants, prerequisites, and valid state
  transitions. Separate domain uncertainty or rejection from transport and
  service failure.
- Input/output and error contracts for actual consumers, including the
  frontend when applicable; authentication, authorization, user/tenant scope,
  pagination, and version/concurrency semantics where needed.
- Persistence requirements and real database dialect; transaction owner,
  constraints, migration, idempotency, retries, or event consistency only when
  this operation requires them. State whether a failure occurs before or after
  a write/external effect.
- Owning methods, domain/application/repository/interface responsibilities,
  direct callers, and required configuration or worker wiring. Identify
  genuine model differences; do not copy the same object into every layer.

Write one module V0 design document containing the scenario, agreed rules,
models/responsibilities, data and interface design, full operation and failure
flow, acceptance examples, open decisions, and proposed V1–Vn increments.
Reuse the authoritative API/schema docs by reference; record proposed changes
without silently editing a published contract during planning.

DDD is an option when the domain and project warrant it, not a required stack.
A rule-bearing core model may be the first implementation increment; a simple
query need not acquire aggregates, repository interfaces, or an extra service
to follow a template. Reuse an already agreed design without making the user
repeat a completed V0 discussion.

## V1–Vn: Plan Executable Business Capabilities

Choose versions by observable rules and real operation boundaries. A bounded
core-model increment must execute its invariant. An endpoint increment must
include its actual callers, authorization, persistence, and response path.
Several files can form one increment; a database layer or API signature alone
does not fulfill a complete-feature promise.

Name exact source paths/symbols, migration/configuration when required, and an
immediate reader-executable check. Database acceptance uses the project's
actual dialect and relevant constraints; API mocks or SQLite cannot establish
PostgreSQL locking. Keep external effects fake and data disposable.

For a shared frontend/backend feature, name the authoritative contract and
the other module's exact prerequisite version. Do not equate a ready endpoint
with a completed user interaction, or require every future UI screen before
a bounded backend capability can be checked.
