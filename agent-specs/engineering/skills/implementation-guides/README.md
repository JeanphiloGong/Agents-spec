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
| Production code or an AI draft is too noisy to learn from safely | [`reference-core-impl-skill`](reference-core-workflow/reference-core-impl-skill/SKILL.md) | Build a runnable minimal-complete reference sample that preserves the defining invariant and maps back to production. |
| AI draft or reference output needs to land on `main` under human control | [`human-led-main-landing-skill`](human-led-main-landing-skill/SKILL.md) | Plan one human-led, main-first wave with `Human-Owned` logic, AI reference boundaries, verification, and `commit_when` checkpoints. |

## From-Scratch Tutorial Workflow

`from-scratch-tutorial-workflow/` is the package for tutorial-writing skills
that teach implementation from first principles. It contains lifecycle skills
for planning, building, reviewing, and simplifying tutorial artifacts.

## Reference Core Workflow

`reference-core-workflow/` is the package for runnable core reference samples.
It contains lifecycle skills for planning, building, reviewing, and mapping a
minimal-complete sample back to production, plus the core
`reference-core-impl-skill` builder.

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
$reference-core-plan
$reference-core-build
$reference-core-review
$reference-core-map-back
```

Use this path when noisy production code or an AI draft needs a gated runnable
reference sample before landing.

```text
$reference-core-impl-skill
$human-led-main-landing-skill
```

Use this when production code or an AI draft is too noisy, and a runnable core
sample should teach the invariant before landing.

Use `$from-scratch-tutorial-build`, `$reference-core-impl-skill`, and
`$human-led-main-landing-skill` together only when the work needs both
first-principles tutorial derivation, runnable reference proof, and controlled
landing on `main`.

## Boundaries

- Use `from-scratch-tutorial-build` for tutorial-first reasoning, not production
  landing.
- Use `reference-core-impl-skill` for runnable core samples, not final
  production patches.
- Use `human-led-main-landing-skill` for one verified main-first landing wave,
  not broad multi-wave migration planning.
