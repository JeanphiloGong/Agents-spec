# Reference Core Workflow

This package holds skills for distilling noisy production code, AI drafts, or
architecture-heavy behavior into a runnable minimal-complete reference sample
before landing anything on `main`.

## Layout

| Workflow step | Skill | Purpose |
| --- | --- | --- |
| Plan the core slice | [`reference-core-plan`](reference-core-plan/SKILL.md) | Identify the defining invariant, included vs deferred boundaries, placement, and validation targets before writing a sample. |
| Build the sample | [`reference-core-build`](reference-core-build/SKILL.md) | Turn the plan into a runnable minimal-complete sample with happy-path and boundary checks. |
| Review the sample | [`reference-core-review`](reference-core-review/SKILL.md) | Check that the sample is runnable, minimal-complete, invariant-preserving, and outside production-import paths. |
| Map back to production | [`reference-core-map-back`](reference-core-map-back/SKILL.md) | Convert the learned core into concrete production modules, first landing tests, and handoff guidance. |

## Operating Order

Use the full workflow when the sample needs explicit gates:

```text
$reference-core-plan
$reference-core-build
$reference-core-review
$reference-core-map-back
```

Use the builder directly only when the core slice, invariant, placement, and
validation checks are already explicit:

```text
$reference-core-build
$reference-core-review
$reference-core-map-back
```

After map-back, use `human-led-main-landing-skill` for controlled integration on
`main`.

## Boundaries

- Use this package for runnable reference samples, not production patches.
- Use `from-scratch-tutorial-workflow` when the output is a teaching guide
  rather than a runnable sample artifact.
- Keep reference samples out of production-imported paths unless the human
  explicitly approves a different placement.
