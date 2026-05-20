# Reference Core Workflow

This package holds skills for extracting one important chain from noisy
production code, AI drafts, or architecture-heavy behavior into a runnable
learning module before landing anything on `main`.

The goal is chain mastery, not a smaller demo. The module should make the
entrypoint, state/data movement, decisions, invariants, boundary cases, and
production mapping visible enough that another engineer can run it, review it
in git, and explain the chain back.

## Layout

| Workflow step | Skill | Purpose |
| --- | --- | --- |
| Scan for core chains | [`reference-core-scan`](reference-core-scan/SKILL.md) | Inventory candidate chains in a project, module, subsystem, or AI draft before choosing one to extract. |
| Plan the core chain | [`reference-core-plan`](reference-core-plan/SKILL.md) | Identify the chain to learn, defining invariant, module layout, included vs deferred boundaries, and validation targets before writing code. |
| Build the module | [`reference-core-build`](reference-core-build/SKILL.md) | Turn the plan into a git-reviewable learning module with runnable code, README, happy-path check, and boundary check. |
| Review the module | [`reference-core-review`](reference-core-review/SKILL.md) | Check that the module is runnable, chain-complete, invariant-preserving, readable, and outside production-import paths. |
| Map back to production | [`reference-core-map-back`](reference-core-map-back/SKILL.md) | Convert the learned chain into concrete production modules, first landing tests, and handoff guidance. |

## Operating Order

Use the full workflow when the chain needs explicit gates:

```text
$reference-core-scan
$reference-core-plan
$reference-core-build
$reference-core-review
$reference-core-map-back
```

Skip scan when the chain is already selected:

```text
$reference-core-plan
$reference-core-build
$reference-core-review
$reference-core-map-back
```

Use the builder directly only when the chain, invariant, module layout, and
validation checks are already explicit:

```text
$reference-core-build
$reference-core-review
$reference-core-map-back
```

After map-back, use `human-led-main-landing-skill` for controlled integration on
`main`.

## Boundaries

- Use this package for runnable learning modules, not production patches.
- Use `reference-core-scan` for inventory and prioritization, not detailed
  single-chain planning.
- Use `from-scratch-tutorial-workflow` when the output is a teaching guide
  rather than a runnable module artifact.
- Keep learning modules out of production-imported paths unless the human
  explicitly approves a different placement.
