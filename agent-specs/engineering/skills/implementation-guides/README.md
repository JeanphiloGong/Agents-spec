# Implementation Guide Skills

This package contains skills for understanding and landing implementation work
without losing control of core logic.

## Skills

| Skill | Use when |
| --- | --- |
| [`from-scratch-implementation-skill`](from-scratch-implementation-skill/SKILL.md) | The human wants to learn how to build a feature or method from behavior, invariants, and small code fragments. |
| [`reference-core-impl-skill`](reference-core-impl-skill/SKILL.md) | A feature or system core needs a minimal runnable reference sample before integration into production code. |
| [`human-led-main-landing-skill`](human-led-main-landing-skill/SKILL.md) | AI draft work or a reference implementation needs to be landed on `main` under human control. |

## Typical Flow

```text
$from-scratch-implementation-skill
$reference-core-impl-skill
$human-led-main-landing-skill
```

Use the full flow when the goal is both learning and landing. For quick
implementation guidance, start with `from-scratch-implementation-skill`; for
noisy production changes, start with `reference-core-impl-skill`.
