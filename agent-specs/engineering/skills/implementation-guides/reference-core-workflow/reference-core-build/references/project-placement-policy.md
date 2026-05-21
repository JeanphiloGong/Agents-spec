# Project Placement Policy

## Default Rule

Persist the reference core learning module in the target project repository so
it evolves with the real codebase, but keep it outside the production runtime
tree.

## Default Location

- `examples/reference-core/<feature-slug>/`

This should be the first choice unless the project already has a stronger convention for runnable examples.

## Allowed Alternatives

- `docs/reference-core/<feature-slug>/`
  - use when the module is documentation-first and only lightly runnable
- `playground/reference-core/<feature-slug>/`
  - use when the module is exploratory, operator-owned, or intentionally non-supported

## Avoid By Default

- `app/`
- `src/`
- `pkg/`
- `internal/`
- any path consumed by production imports or release packaging

## Required Module Files

Every persisted module should ship with:
- `README.md`
- `src/` or an explicitly justified single source file
- `tests/` or an inline test command with a clear reason
- any tiny input fixture or trace needed to understand the chain

## README Must Explain

- the extracted chain from input to output
- what the module proves
- why the `src/` architecture fits this scenario
- which invariants are preserved
- which production concerns were deferred
- how to run or validate it
- which real modules it maps back to

## Exception Rule

If the module should **not** live in the project repository, the output must state:
- why it is ephemeral
- where it should live temporarily
- when it should be deleted or promoted
