# From-Scratch Tutorial Workflow

This package contains workflow skills for producing implementation tutorials
from first principles. Use it when the deliverable is a teaching artifact, not
a production patch, runnable reference sample, or landing plan.

## Layout

| Workflow step | Skill | Purpose |
| --- | --- |
| Plan the teaching route | [`from-scratch-tutorial-plan`](from-scratch-tutorial-plan/SKILL.md) | Define reader, goal, teaching pressures, code-version checkpoints, and verification before writing. |
| Build the tutorial | [`from-scratch-tutorial-build`](from-scratch-tutorial-build/SKILL.md) | Execute the tutorial step loop and call the core implementation builder when needed. |
| Review tutorial quality | [`from-scratch-tutorial-review`](from-scratch-tutorial-review/SKILL.md) | Check for skipped reasoning, disconnected code versions, unexplained helpers, weak checks, and final-code drift. |
| Simplify the guide | [`from-scratch-tutorial-simplify`](from-scratch-tutorial-simplify/SKILL.md) | Reduce repetition and prose weight without breaking the teaching chain. |
| Core implementation builder | [`from-scratch-implementation-skill`](from-scratch-implementation-skill/SKILL.md) | Derive one feature or method through connected code versions until the final step yields complete code. |

## Codex Usage

Use the smallest skill that matches the task:

```text
$from-scratch-tutorial-plan
$from-scratch-tutorial-build
$from-scratch-tutorial-review
$from-scratch-tutorial-simplify
```

Use `$from-scratch-implementation-skill` directly when the human only needs the
guide body and the teaching route is already clear.

## Boundaries

- This package is for tutorial-writing workflows, not production landing.
- This package does not depend on the separate `leetcode-tutorial-builder`
  skill from another repository.
- Keep source facts explicit; do not invent constraints, examples, or code
  behavior to make a tutorial smoother.
- The final complete code must grow from connected steps; do not add a detached
  final implementation section.
- Publishing concerns such as blog front matter, taxonomy, SEO, and site paths
  belong to a separate publishing skill if needed later.
