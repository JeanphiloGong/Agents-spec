# Implementation Guide Skills

This package contains skills for learning, distilling, and landing
implementation work without losing control of core logic. Use it when the next
step is not just "write code", but first understanding what must stay human
owned, what invariant defines the implementation, and how the result should
move toward `main`.

## Skill Routing

| User situation | Skill | Purpose |
| --- | --- | --- |
| Learn the core from first principles before trusting final code | [`from-scratch-tutorial-build`](from-scratch-tutorial-workflow/from-scratch-tutorial-build/SKILL.md) | Derive one feature or method through connected code versions that add to or replace the previous version until the final step yields complete code. |
| A project, module, or AI draft has multiple unclear core logic chains | [`reference-core-scan`](reference-core-workflow/reference-core-scan/SKILL.md) | Inventory candidate chains and recommend the first extraction target. |
| A selected production chain or AI draft is too noisy to learn from safely | [`reference-core-build`](reference-core-workflow/reference-core-build/SKILL.md) | Build a runnable learning module that extracts the chain, preserves the defining invariant, and is ready for review and map-back. |
| AI draft or reference output needs to land on `main` under human control | [`human-led-main-landing-skill`](human-led-main-landing-skill/SKILL.md) | Plan one human-led, main-first wave with `Human-Owned` logic, AI reference boundaries, verification, and `commit_when` checkpoints. |

## From-Scratch Tutorial Workflow

`from-scratch-tutorial-workflow/` is the package for tutorial-writing skills
that teach implementation from first principles. It contains lifecycle skills
for planning, building, reviewing, and simplifying tutorial artifacts.

## Reference Core Workflow

`reference-core-workflow/` is the package for runnable reference-core learning
modules. It contains lifecycle skills for planning, building, reviewing, and
mapping an extracted chain back to production. It also includes a scan skill for
inventorying candidate chains before planning. `reference-core-build` is the
only builder entrypoint.

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
$reference-core-plan
$reference-core-build
$reference-core-review
$reference-core-map-back
```

Use this path when noisy production code or an AI draft needs a gated runnable
learning module before landing.

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
