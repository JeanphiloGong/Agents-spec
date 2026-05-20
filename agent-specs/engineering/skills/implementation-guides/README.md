# Implementation Guide Skills

This package contains skills for learning, distilling, and landing
implementation work without losing control of core logic. Use it when the next
step is not just "write code", but first understanding what must stay human
owned, what invariant defines the implementation, and how the result should
move toward `main`.

## Skill Routing

| User situation | Skill | Purpose |
| --- | --- | --- |
| Learn the core from first principles before trusting final code | [`from-scratch-implementation-skill`](from-scratch-implementation-skill/SKILL.md) | Derive one feature or method through connected code versions that add to or replace the previous version until the final step yields complete code. |
| Production code or an AI draft is too noisy to learn from safely | [`reference-core-impl-skill`](reference-core-impl-skill/SKILL.md) | Build a runnable minimal-complete reference sample that preserves the defining invariant and maps back to production. |
| AI draft or reference output needs to land on `main` under human control | [`human-led-main-landing-skill`](human-led-main-landing-skill/SKILL.md) | Plan one human-led, main-first wave with `Human-Owned` logic, AI reference boundaries, verification, and `commit_when` checkpoints. |

## Operating Order

Use the smallest skill that matches the current situation:

```text
$from-scratch-implementation-skill
```

Use this when the human mainly wants to learn or derive the implementation.

```text
$reference-core-impl-skill
$human-led-main-landing-skill
```

Use this when production code or an AI draft is too noisy, and a runnable core
sample should teach the invariant before landing.

```text
$from-scratch-implementation-skill
$reference-core-impl-skill
$human-led-main-landing-skill
```

Use the full path only when the work needs both first-principles derivation,
runnable reference proof, and controlled landing on `main`.

## Boundaries

- Use `from-scratch-implementation-skill` for tutorial-first reasoning, not
  production landing.
- Use `reference-core-impl-skill` for runnable core samples, not final
  production patches.
- Use `human-led-main-landing-skill` for one verified main-first landing wave,
  not broad multi-wave migration planning.
