# <Nano Module Name>

## Real-World Scenario

Describe the ordinary situation this logic solves without naming the source
project first.

Example shape:

- a user or system event happens
- multiple actions may be requested
- some actions share state or depend on earlier work
- the logic must decide what starts, waits, reuses, or finishes

## The Problem

Explain why the naive implementation is not enough.

- what can be duplicated
- what can run too early
- what state can become inconsistent
- what the scheduler, parser, cache, graph, or loop must guarantee

## Engineering Zero

State the smallest useful mechanism before this version's added behavior.

```text
entry input
-> minimal state/data
-> minimal decision
-> minimal output
```

## This Version Adds

- version:
- starts from:
- adds:
- why this version is worth learning:

## Mental Model

- concept:
- state:
- decision:
- invariant:

## Extracted Chain

```text
entry input
-> key state/data
-> decision points
-> transitions
-> output
```

## What This Module Proves

- ...
- ...

## Included Invariants

- ...
- ...

## Deferred Learning Boundaries

- ...
- ...

## Module Layout

```text
.
├── README.md
├── src/
├── tests/
├── fixtures/   # optional
└── traces/     # optional
```

## Source Architecture

- style: chain-first | ddd-inspired | ports-and-adapters | custom
- why this fits:
- directories:
  - `src/<path>`:
- upgrade triggers intentionally not used:

## Version Checkpoint

- asset line:
- version:
- version role:
- starts from:
- adds:
- checkpoint type: internal-learning | reusable | publishable | map-back-ready
- source commit:
- tag recommended: yes | no
- tag:
- tag reason:

## How To Run

```bash
<command>
```

## How To Validate

- happy path:
- boundary/failure case:

## Notes

- This is a learning module, not a production source of truth.
- Keep the first explanation about the standalone logic, not the source project.
