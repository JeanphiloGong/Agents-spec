# What Counts as "Minimal Complete"

## Definition

A minimal-complete sample is the smallest runnable artifact that still preserves the real core behavior of the feature.

It is not:
- a pseudocode sketch
- a half-wired interface skeleton
- a production module with a few files deleted
- a teaching toy that changes the invariant to make the code shorter

## Required Qualities

- **Runnable**: it can be executed directly or validated with tiny tests.
- **End-to-end**: one meaningful path goes from input to output.
- **Faithful**: it keeps the real state transitions, ordering rules, or algorithmic pressure.
- **Scoped**: it strips away infrastructure that does not define the core.
- **Transferable**: it includes an explicit path back to the production implementation.

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

- target: about `400` lines
- acceptable range: `150-500` lines
- file count: `1-4`

Go smaller only if the real core still survives. Go larger only if shrinking further would hide the real design pressure.

