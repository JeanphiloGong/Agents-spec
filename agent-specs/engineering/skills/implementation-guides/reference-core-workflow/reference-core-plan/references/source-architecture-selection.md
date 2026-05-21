# Source Architecture Selection

Use this when planning the internal `src/` layout for a reference-core learning
module. The layout should fit the chain being extracted, not copy production
architecture and not default to DDD.

## Selection Rule

Choose the simplest structure that lets another engineer follow the chain from
entry input to output while seeing the important state, decisions, transitions,
and invariant checks.

Upgrade only when the chain itself creates pressure for more structure.

## Common Shapes

### Chain-First

Use for algorithms, parsers, schedulers, caches, editor loops, graph runners,
ranking flows, and mechanism-heavy state transitions.

```text
src/
├── chain.*
├── state.*
└── rules.*
```

Choose this when a direct flow file plus explicit state/rules keeps the chain
readable.

### State Machine

Use when the core is lifecycle, mode, status, or event transition behavior.

```text
src/
├── state.*
├── events.*
└── transitions.*
```

Choose this when correctness depends on allowed transitions and rejected
transitions.

### Pipeline

Use for validation flows, ETL, compiler passes, enrichment, normalization, or
multi-stage processing.

```text
src/
├── pipeline.*
└── stages/
```

Choose this when each stage has a visible input/output contract.

### DDD-Inspired

Use when business entities, value objects, policies, and invariants would blur
together in a flat chain file.

```text
src/
├── domain/
└── application/
```

Choose this for order approval, billing, permission, inventory, booking,
settlement, or other rule-heavy business chains.

### Ports And Adapters

Use when external boundaries are part of understanding the chain and need fake
repositories, gateways, clocks, queues, search clients, or transports.

```text
src/
├── domain/
├── application/
├── ports/
└── adapters/
```

Choose this when boundary contracts are part of the invariant or tests need
replaceable fakes.

### Event-Sourced Or Projection

Use when replay, append-only events, derived views, audit trails, or read/write
model separation define the chain.

```text
src/
├── events.*
├── reducer.*
└── projections/
```

Choose this when the learning target is how state is reconstructed or views are
derived.

### Custom

Use only when none of the common shapes fits. Name the shape, list directories,
and explain the chain pressure that justifies it.

## Upgrade Triggers

Move beyond chain-first only when one or more of these are true:

- multiple business entities or value objects are necessary
- invariants are spread across several rules
- fake repositories, gateways, clocks, queues, or transports are needed
- multiple use cases share the same domain state
- read/write views, replay, or derived state define correctness
- tests require setup that a direct chain layout cannot explain
- README cannot explain the code shape without naming layers

## Red Flags

- The layout mirrors production folders without explaining the learning need.
- DDD appears because it feels "complete" rather than because rules need it.
- Ports/adapters appear even though no fake boundary is needed.
- A single `chain.*` hides state transitions or boundary behavior.
- The chosen shape cannot be explained in one sentence in the README.
