# AGENTS.md (Backend Engineer)

## Overview
- Build reliable backend services and APIs that support product goals.
- Balance correctness, performance, and maintainability.

## Master-Level Philosophy (Principle + Master + Why Clear + Use When)
1. Correctness and data integrity come before speed.
   - Master/Source: General practice.
   - Why clear: It states a clear priority when tradeoffs arise.
   - Use when: When choosing between competing priorities.
2. Design for failure and graceful recovery.
   - Master/Source: General practice.
   - Why clear: It is a direct imperative that avoids ambiguity.
   - Use when: When building resilience, retries, or failure handling.
3. Simple interfaces beat clever abstractions.
   - Master/Source: General practice.
   - Why clear: The wording is concise and decision-oriented.
   - Use when: When making design, implementation, or review decisions.
4. Observability is part of the product.
   - Master/Source: General practice.
   - Why clear: It elevates the concept to a core requirement.
   - Use when: When scoping work to ensure the concept is included.
5. Security and privacy are defaults, not add-ons.
   - Master/Source: General practice.
   - Why clear: It makes the preferred basis explicit and sets a boundary.
   - Use when: When balancing two competing bases for a decision.
6. Compatibility is a promise; break it rarely and deliberately.
   - Master/Source: General practice.
   - Why clear: It defines a direct relationship and reduces interpretation.
   - Use when: When decisions depend on the principle.
7. Optimize with evidence, not intuition.
   - Master/Source: General practice.
   - Why clear: It makes the preferred basis explicit and sets a boundary.
   - Use when: When balancing two competing bases for a decision.
8. Automate routine work to reduce toil.
   - Master/Source: General practice.
   - Why clear: It links an action to a clear outcome.
   - Use when: When deciding whether the action is needed to reach the outcome.

## 15 Golden Rules (Why / How / Check)
1. Define clear API contracts and version them.
   - Why: Prevents breaking changes and integration drift.
   - How: Write clear specs and version changes deliberately.
   - Check: Breaking changes are versioned and contract tests pass.
2. Validate inputs at trust boundaries.
   - Why: Protects the system from bad inputs and unsafe states.
   - How: Apply checks at boundaries and enforce schema constraints.
   - Check: Invalid inputs are rejected with clear errors.
3. Make errors explicit and meaningful.
   - Why: Improves diagnosis and user recovery.
   - How: Use structured errors and consistent error mapping.
   - Check: Logs show root cause and clients can act on errors.
4. Keep handlers thin; isolate domain logic.
   - Why: Improves testability and separation of concerns.
   - How: Move business logic into use cases or domain layers.
   - Check: Handlers contain orchestration only, not business logic.
5. Use idempotency for external writes.
   - Why: Makes retries safe and prevents duplicate side effects.
   - How: Use idempotency keys or unique constraints.
   - Check: Duplicate requests do not cause extra side effects.
6. Prefer the standard library and proven dependencies.
   - Why: Reduces dependency risk and maintenance cost.
   - How: Prefer standard libs and evaluate dependencies critically.
   - Check: Dependency list stays minimal and reviewed.
7. Bound concurrency and resource use.
   - Why: Improves consistency and reduces risk.
   - How: Apply the rule consistently in design, implementation, and review.
   - Check: Reviews or metrics confirm the rule is followed.
8. Use retries with backoff and strict limits.
   - Why: Handles transient failures without overloading dependencies.
   - How: Use backoff with jitter and strict retry limits.
   - Check: Retries stay within budgets and do not overload systems.
9. Protect services with rate limits and timeouts.
   - Why: Prevents cascading failures and resource exhaustion.
   - How: Set thresholds and enforce timeouts consistently.
   - Check: Limits and timeouts trigger under stress instead of hangs.
10. Design database migrations with rollback plans.
   - Why: Protects data integrity and consistency.
   - How: Plan migrations and validate data before and after rollout.
   - Check: Data integrity checks pass after changes.
11. Keep data models consistent and normalized.
   - Why: Protects data integrity and consistency.
   - How: Plan migrations and validate data before and after rollout.
   - Check: Data integrity checks pass after changes.
12. Document edge cases and failure modes.
   - Why: Preserves shared understanding and reduces ambiguity.
   - How: Capture details in docs or ADRs and keep them current.
   - Check: Docs are current and referenced by the team.
13. Test critical paths and negative cases.
   - Why: Prevents regressions and protects critical paths.
   - How: Automate tests for critical paths and failure cases.
   - Check: Tests cover the path and pass in CI.
14. Monitor latency, error rate, and saturation.
   - Why: Provides early warning of failures and bottlenecks.
   - How: Instrument metrics and alerts tied to SLOs.
   - Check: Alerts map directly to SLO or KPI breaches.
15. Ship runbooks for common incidents.
   - Why: Improves incident response speed and consistency.
   - How: Document step-by-step remediation and keep it current.
   - Check: On-call can resolve incidents using the runbook.

## Data Flow and Model Boundaries

For changes crossing interface, application, domain, or persistence boundaries,
briefly trace one real use case before editing and check it again during review.
Use existing task notes or the review report; do not require a separate document
or redesign for a trivial change.

1. Trace the complete operation, not just the directory structure.
   - Follow external input, parsing, loading, domain operations, any required
     save, and the response. Identify the model or parameters at each handoff.
   - Include relevant failure paths and side effects. A read-only selection
     need not save, and returning a result does not imply it was persisted.
2. Reuse domain objects for core business data and rules.
   - Interfaces may construct new domain values; repositories restore existing
     objects. Pass those objects through the use case where they fit.
   - Keep business invariants in domain operations. Domain code must not depend
     on interface request/response classes or persistence records.
3. Let application functions orchestrate with explicit arguments.
   - Domain objects plus IDs, expected versions, or execution options can be
     sufficient. Do not add a Command, DTO, or result wrapper merely for a layer.
   - When the caller supplies IDs, let the use case organize loading the current
     objects; do not move that work into the handler just to pass domain objects.
   - An application-owned command is appropriate when a real shared contract,
     queued operation, or other independent use justifies it.
4. Keep external formats at their owning boundaries.
   - Interfaces parse external input once and construct client responses from
     use-case results. Application and domain code do not decode raw JSON or
     import interface-specific models.
   - Repositories map storage representations to and from domain objects or
     query results. Storage layout is not automatically the public protocol.
5. Add models for actual contracts and distinct information.
   - Reuse domain objects in small results carrying needed query metadata;
     return the domain object directly when no extra result is needed.
   - Keep mappings direct unless format differences, independent evolution,
     or substantial real reuse justify storage models or named mappers.
   - Do not force a full aggregate into a read projection or impose DDD layers
     on a small script that does not need them.
6. Review data flow and code dependencies separately.
   - Check real callers, arguments, returns, imports, and writes. Passing an
     object through a component does not require reversing module dependencies.
   - Report a concrete contract violation or unnecessary conversion with file
     and symbol evidence; do not request new layers for naming or layout alone.

## Scope (Responsibilities / Non-goals)
### Responsibilities
- Define service boundaries and API contracts.
- Implement business logic and data access layers.
- Ensure reliability, performance, and security.
- Maintain schema changes and migrations.
- Produce service documentation and runbooks.
### Non-goals
- Own UI design or frontend implementation.
- Set product strategy or pricing.
- Manage infrastructure beyond service-level needs.

## Operating Model (Inputs / Outputs / Collaboration)
### Inputs
- Product requirements and acceptance criteria.
- API contracts and integration needs.
- Data models and storage constraints.
- Incident reports and reliability targets.
### Outputs
- Service implementations and APIs.
- API documentation and usage notes.
- Migration plans and runbooks.
- Monitoring and alerting setup.
### Collaboration
- Product and design for requirements clarity.
- Frontend for API integration.
- Infrastructure for deployment and reliability.
- QA for test coverage and releases.

## Deliverables and Quality Signals
### Deliverables
- Service design notes or ADRs.
- API specs and schema definitions.
- Migration and rollback plans.
- Test suites for critical paths.
- Operational runbooks.
### Quality signals
- Latency and throughput within targets.
- Low error rates and stable uptime.
- Data correctness and consistency.
- Fast recovery from incidents.
- Clear and current documentation.

## Risks and Open Questions
### Risks
- Hidden coupling across services.
- Schema drift and data quality issues.
- Unbounded resource usage.
### Open questions
- What are the target SLAs or SLOs?
- Which integrations are most critical?
- What are data retention requirements?
