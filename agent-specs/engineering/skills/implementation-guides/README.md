# Implementation Guide Skills

This package contains skills for learning, distilling, and optionally landing
implementation work without losing control of core logic. Use it when the next
step is not just "write code", but first understanding the real-world scenario,
minimal mechanism, invariant, and learning-asset version line behind the
implementation.

## Skill Routing

| User situation | Skill | Purpose |
| --- | --- | --- |
| Learn the core from first principles before trusting final code | [`from-scratch-tutorial-build`](from-scratch-tutorial-workflow/from-scratch-tutorial-build/SKILL.md) | Derive one feature or method through connected code versions that add to or replace the previous version until the final step yields complete code. |
| A project, module, or AI draft has multiple unclear core logic chains | [`reference-core-scan`](reference-core-workflow/reference-core-scan/SKILL.md) | Inventory candidate chains and recommend the first extraction target. |
| A selected chain should become a blog, nano project, or personal knowledge asset | [`reference-core-teaching-plan`](reference-core-workflow/reference-core-teaching-plan/SKILL.md) | Gate the chain against missing prerequisite assets, then convert it into a from-zero teaching promise and constraints for the learning module plan. |
| A selected chain is ready to become a runnable nano learning module | [`reference-core-build`](reference-core-workflow/reference-core-build/SKILL.md) | Build a standalone learning module that implements the core logic, preserves the defining invariant, and is ready for review. |
| AI draft or reference output needs to land on `main` under human control | [`human-led-main-landing-skill`](human-led-main-landing-skill/SKILL.md) | Plan one human-led, main-first wave with `Human-Owned` logic, AI reference boundaries, verification, and `commit_when` checkpoints. |

## From-Scratch Tutorial Workflow

`from-scratch-tutorial-workflow/` is the package for tutorial-writing skills
that teach implementation from first principles. It contains lifecycle skills
for planning, building, reviewing, and simplifying tutorial artifacts.

## Reference Core Workflow

`reference-core-workflow/` is the package for runnable standalone learning
modules. It contains lifecycle skills for planning, building, and reviewing a
core logic chain as a nano/reference asset, plus an optional map-back skill for
production handoff after the module is understood. It also includes a scan skill
for inventorying candidate chains and a teaching-plan skill for shaping
selected chains into from-zero assets before planning, including whether a
selected chain should stop until an earlier nano module exists. Completed
learning-asset checkpoints should be commit-traceable, with tags recommended
only for review-passed checkpoints worth retrieving later.
`reference-core-build` is the only builder entrypoint.

## Operating Order

Use the smallest skill that matches the current situation:

```text
$from-scratch-tutorial-plan
$from-scratch-tutorial-build
$from-scratch-tutorial-review
$from-scratch-tutorial-simplify
```

Use this path when the work is a tutorial-writing workflow.

```text
$reference-core-scan
$reference-core-teaching-plan
$reference-core-plan
$reference-core-build
$reference-core-review
$reference-core-map-back
```

Use this path when a selected core chain should become a gated runnable learning
module. Stop after review if the goal is only a knowledge asset.

```text
$reference-core-build
$reference-core-review
$reference-core-map-back
$human-led-main-landing-skill
```

Use this when the chain, invariant, module layout, and validation checks are
already explicit enough to build without a separate planning pass.

Use `$from-scratch-tutorial-build`, `$reference-core-build`, and
`$human-led-main-landing-skill` together only when the work needs both
first-principles tutorial derivation, runnable reference proof, and controlled
landing on `main`.

## Boundaries

- Use `from-scratch-tutorial-build` for tutorial-first reasoning, not production
  landing.
- Use `reference-core-build` for runnable learning modules, not final
  production patches.
- Use `human-led-main-landing-skill` for one verified main-first landing wave,
  not broad multi-wave migration planning.
