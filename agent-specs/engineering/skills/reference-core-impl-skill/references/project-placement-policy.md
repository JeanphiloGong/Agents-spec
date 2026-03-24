# Project Placement Policy

## Default Rule

Persist the reference sample in the target project repository so it evolves with the real codebase, but keep it outside the production runtime tree.

## Default Location

- `examples/reference-core/<feature-slug>/`

This should be the first choice unless the project already has a stronger convention for runnable examples.

## Allowed Alternatives

- `docs/reference-core/<feature-slug>/`
  - use when the sample is documentation-first and only lightly runnable
- `playground/reference-core/<feature-slug>/`
  - use when the sample is exploratory, operator-owned, or intentionally non-supported

## Avoid By Default

- `app/`
- `src/`
- `pkg/`
- `internal/`
- any path consumed by production imports or release packaging

## Required Companion Files

Every persisted sample should ship with:
- `README.md`
- the minimal sample code
- any tiny input/test fixture needed to run the sample

## README Must Explain

- what the sample proves
- which invariants are preserved
- which production concerns were deferred
- how to run or validate it
- which real modules it maps back to

## Exception Rule

If the sample should **not** live in the project repository, the output must state:
- why it is ephemeral
- where it should live temporarily
- when it should be deleted or promoted

