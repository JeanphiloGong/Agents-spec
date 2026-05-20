# What Counts as "Minimal Complete"

## Definition

A minimal-complete reference core is the smallest runnable learning module that
still preserves the real chain the human wants to master.

It is not:
- a pseudocode sketch
- a half-wired interface skeleton
- a production module with a few files deleted
- a teaching toy that changes the invariant to make the code shorter
- a single loose file that hides how the chain should be run, checked, and
  reviewed

## Required Qualities

- **Runnable**: it can be executed directly or validated with tiny tests.
- **Chain-complete**: one meaningful path shows entry input, state/data
  movement, decisions, transitions, and output.
- **Faithful**: it keeps the real state transitions, ordering rules, or algorithmic pressure.
- **Scoped**: it strips away infrastructure that does not define the core.
- **Reviewable**: it lives as a small directory that can be reviewed and
  committed as one git slice.
- **Readable**: its README lets another engineer run it and explain the chain
  back.
- **Transferable**: it includes an explicit path back to the production implementation.

## Default Module Shape

```text
examples/reference-core/<feature-slug>/
├── README.md
├── src/
├── tests/
├── fixtures/   # optional
└── traces/     # optional
```

Use a single file only when the chain is genuinely tiny and the README explains
why a directory layout would add noise.

## Scenario-Fit `src/` Architecture

Default to the simplest internal layout that makes the extracted chain easy to
follow. Do not start with DDD, ports/adapters, or production-like layering just
because those patterns are familiar.

The `src/` layout should already be chosen by `reference-core-plan`. If the
layout is unclear, use the plan skill's
`references/source-architecture-selection.md` before building.

## Good Compression Moves

- Replace DB access with an in-memory repository.
- Replace framework orchestration with a plain function call loop.
- Replace distributed state with a local deterministic model.
- Collapse config layers into a small literal config object.
- Keep only the errors that explain the design.

## Bad Compression Moves

- Remove retries/ordering when those behaviors define correctness.
- Hide concurrency or queue semantics when they are the core difficulty.
- Replace meaningful state transitions with one generic `run()` function.
- Rename domain concepts into generic placeholders that erase the model.

## Default Size Heuristic

- target: about `400` lines across module source, tests, and README
- acceptable range: `150-700` lines when the chain requires fixtures or traces
- file shape: `README.md`, `src/`, `tests/`, optional `fixtures/` or `traces/`

Go smaller only if the real core still survives. Go larger only if shrinking further would hide the real design pressure.
