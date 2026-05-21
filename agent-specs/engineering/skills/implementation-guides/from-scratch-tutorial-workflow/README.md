# From-Scratch Tutorial Workflow

This package contains workflow skills for producing implementation tutorials
from first principles. Use it when the deliverable is a teaching artifact, not
a production patch, runnable reference sample, or landing plan.

The package standard is:

```text
Nystrom complete engineering chain
+ Karpathy runnable from-zero coding
+ Norvig small complete problem compression
```

That means:

- **Nystrom chain** - the guide grows as a connected project, one working
  checkpoint at a time. Every meaningful step leaves behind a usable system
  piece.
- **Karpathy coding** - code appears early, stays runnable, and every new line
  is justified by behavior it unlocks.
- **Norvig compression** - the real problem is reduced to a small complete
  model that can be understood in one sitting without production noise.

The execution mechanism for that standard is the tutorial increment cycle:
build one complete teaching task, check it, freeze it, then continue from that
frozen checkpoint.

```text
+------------------------------------------------+
|                                                |
|  Pressure -> Naive baseline -> Break -> Change |
|      ^                                |        |
|      +------ Freeze <- Check <--------+        |
|                 |                              |
|                 v                              |
|             Next step                          |
|                                                |
+------------------------------------------------+
```

For each step:

1. **Pressure** - show the tiny input, trace, call site, or extension that
   makes the problem visible.
2. **Naive baseline** - show what the reader currently has.
3. **Break** - name exactly what the current baseline cannot do.
4. **Change** - add or replace one thing, marked as `patch` or `checkpoint`.
5. **Check** - prove this step's change works.
6. **Freeze** - make this checkpoint the baseline for the next step.

Internal self-review is required during generation, but public tutorial output
must use reader-facing checkpoints instead of `Step Self-Review` compliance
sections.

Before the step ladder starts, every non-trivial tutorial must define:

- the real scenario: who calls this thing, why they need it, and what they see
- the compressed problem: the smallest model that still teaches the core idea
- the core model: the few concepts the implementation manipulates
- the invariants: rules every checkpoint must protect
- the verification matrix: happy path, invalid input, failure path, boundary
  case, and one representative trace when relevant

## Layout

| Workflow step | Skill | Purpose |
| --- | --- |
| Plan the teaching route | [`from-scratch-tutorial-plan`](from-scratch-tutorial-plan/SKILL.md) | Define reader, real scenario, problem compression, core model, invariants, dependency graph, task acceptance criteria, verification, and checkpoint commit handoff before writing. |
| Build the tutorial | [`from-scratch-tutorial-build`](from-scratch-tutorial-build/SKILL.md) | Execute the Tutorial Build Task List one task at a time, preserving the Nystrom/Karpathy/Norvig standard while avoiding public checklist prose. |
| Review tutorial quality | [`from-scratch-tutorial-review`](from-scratch-tutorial-review/SKILL.md) | Check for missing scenario, weak problem compression, template prose, skipped reasoning, disconnected task/checkpoint continuity, unclear code-change roles, unexplained helpers, weak checks, and final-code drift. |
| Simplify the guide | [`from-scratch-tutorial-simplify`](from-scratch-tutorial-simplify/SKILL.md) | Reduce repetition and prose weight without deleting scenario, problem compression, pressure examples, the teaching chain, or final checkpoint. |

## Codex Usage

Use the smallest skill that matches the task:

```text
$from-scratch-tutorial-plan
$from-scratch-tutorial-build
$from-scratch-tutorial-review
$from-scratch-tutorial-simplify
```

Use `$from-scratch-tutorial-build` directly when the human only needs the guide
body and the teaching route is already clear.

## Boundaries

- This package is for tutorial-writing workflows, not production landing.
- This package does not depend on the separate `leetcode-tutorial-builder`
  skill from another repository.
- Keep source facts explicit; do not invent constraints, examples, or code
  behavior to make a tutorial smoother.
- The final complete code must be the last connected step's assembled
  checkpoint; do not add a detached final implementation section.
- Public output should read like a tutorial, not a compliance checklist. The
  step fields are internal obligations unless the human asks for a structured
  audit format.
- Publishing concerns such as blog front matter, taxonomy, SEO, and site paths
  belong to a separate publishing skill if needed later.
