# Mapping Back To Main Checklist

Use this after the minimal-complete sample is understood and validated.

## 1. Confirm the real core matches the sample

- Identify the production invariant/state transition that the sample proved.
- Identify any production-only behavior that must be reintroduced immediately.

## 2. Map sample boundaries to real modules

- Which file/module owns the equivalent public entrypoint?
- Which adapters replace the sample's in-memory substitutes?
- Which production helper names should stay, and which should be rederived?

## 3. Reintroduce constraints in order

- contracts and invariants first
- persistence/network boundaries second
- observability and operational guardrails third
- scaling/performance optimizations last unless they define correctness

## 4. Port validation in the same order

- happy path smoke
- boundary/failure case
- invariant-specific regression

## 5. Hand Off To `human-core-feature-wave-skill`

- use the sample as reference, not merge target
- land one smallest closed loop on `main`
- keep `Human-Owned` logic rederived from the sample and requirements

