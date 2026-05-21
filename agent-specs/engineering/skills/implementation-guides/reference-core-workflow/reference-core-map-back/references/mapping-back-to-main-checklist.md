# Mapping Back To Main Checklist

Use this after the minimal-complete learning module is understood and
validated.

## 0. Confirm placement hygiene

- Is the module stored in an isolated path such as `examples/reference-core/<feature-slug>/`?
- Does it have a colocated `README.md` that states the extracted chain, what is included, and what is deferred?
- Is production code prevented from importing or depending on the module by default?

## 1. Confirm the real chain matches the module

- Identify the production invariant/state transition that the module proved.
- Identify the production entrypoint, state/data movement, decisions,
  transitions, and output that correspond to the module.
- Identify any production-only behavior that must be reintroduced immediately.

## 2. Map module boundaries to real modules

- Which file/module owns the equivalent public entrypoint?
- Which adapters replace the module's in-memory substitutes?
- Which production helper names should stay, and which should be rederived?
- Which module-only traces or fixtures become production tests, docs, or no
  production artifact?

## 2.5 Translate architecture deliberately

- Does the learning module use chain-first, DDD-inspired, ports/adapters, or a
  custom `src/` layout?
- Which parts reflect real production pressure?
- Which parts exist only to make the learning chain easier to inspect?
- Should production mirror, partially mirror, or ignore the module layout?

## 3. Reintroduce constraints in order

- contracts and invariants first
- persistence/network boundaries second
- observability and operational guardrails third
- scaling/performance optimizations last unless they define correctness

## 4. Port validation in the same order

- happy path smoke
- boundary/failure case
- invariant-specific regression

## 5. Hand Off To `human-led-main-landing-skill`

- use the module as reference, not merge target
- land one smallest closed loop on `main`
- keep `Human-Owned` logic rederived from the module and requirements
