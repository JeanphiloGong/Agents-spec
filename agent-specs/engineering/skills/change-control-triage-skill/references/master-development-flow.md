# Master Development Flow

This flow is the default ordering model (`development_flow=master`) for all domains:
- backend
- frontend
- data
- infrastructure
- AI workflow
- release and operations

It is a synthesized engineering flow from multiple masters, not a single framework:
- Domain-driven design: Eric Evans, Vaughn Vernon
- Refactoring and evolutionary design: Martin Fowler
- Test-first feedback loop: Kent Beck
- Continuous delivery and release discipline: Jez Humble, David Farley
- Data and distributed correctness: Martin Kleppmann
- Reliability operations: Google SRE

## Phase 1: Requirements and Invariants

Focus:
- target outcome
- constraints
- non-negotiable rules
- acceptance target

Output:
- concise rule set and success criteria

Source anchors:
- Eric Evans (ubiquitous language and model constraints)
- Gojko Adzic style acceptance-by-example workflow

## Phase 2: Domain and Model Design

Focus:
- domain objects and states
- invariants and transitions
- data semantics and ownership boundaries

Output:
- model and behavior design ready for implementation

Source anchors:
- Eric Evans
- Vaughn Vernon

## Phase 3: Contract and Interface Design

Focus:
- API/schema/event contracts
- UI state contracts
- compatibility and versioning expectations

Output:
- explicit contracts that implementation must follow

Source anchors:
- Martin Fowler (interface boundaries and evolution)
- Sam Newman style service contract thinking

## Phase 4: Core Implementation

Focus:
- use cases and core business logic
- frontend state logic and user-flow behavior
- transformation logic in data pipelines

Output:
- core logic implemented before wiring-heavy integration

Source anchors:
- Kent Beck (small steps, fast feedback)
- Robert C. Martin style separation of concerns

## Phase 5: Integration and Infrastructure

Focus:
- persistence adapters
- middleware and runtime integration
- deployment/runtime config wiring

Output:
- integrated system surfaces with stable glue

Source anchors:
- Sam Newman (integration boundaries)
- Martin Kleppmann (consistency and correctness concerns)

## Phase 6: Verification

Focus:
- critical path tests
- negative tests and failure paths
- integration checks

Output:
- minimum confidence to release

Source anchors:
- Kent Beck (test-first rigor)
- Michael Feathers (safe change in evolving codebases)

## Phase 7: Release and Observability

Focus:
- release plan
- rollback path
- monitoring and alert checks
- docs/runbook completion

Output:
- operationally ready release state

Source anchors:
- Jez Humble and David Farley (continuous delivery)
- Google SRE reliability operations

## Ordering Rule

Do not jump to later phases unless prerequisites from earlier phases are materially complete, except when gate preemption is required.
