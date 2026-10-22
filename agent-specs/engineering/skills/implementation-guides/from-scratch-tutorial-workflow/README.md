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

## Versioned Documents

The package uses one document structure throughout plan, build, review, and
simplify. There is no `document_mode` setting or alternate combined-body path.

```text
<external-tutorial-root>/
  plan.md
  from-scratch-tutorial.md  # navigation: goal, prerequisites, version route
  v0-baseline.md           # V0: smallest runnable baseline
  v1-<capability>.md        # V1: next meaningful capability, when needed
  v2-<capability>.md        # V2: further capability, when needed
```

- `V0` through `Vn` describe capability evolution, not product release numbers
  or arbitrary length splits. A small topic may end at V0.
- `V1.C0`, `V1.C1`, and so on identify verified increments inside a version.
  They remain sections in the version document; reset C0 for each version.
- The entry only navigates. Each version document states its scope, exact
  entry baseline, required files, setup/check commands, and exit capability.
- Later versions continue from a named verified final checkpoint of an earlier
  version. They never silently start from the latest accompanying example.
- Every version's last meaningful code step yields its own assembled runnable
  checkpoint. List inherited files explicitly and verify the entire version.
- Replay from an empty directory through all checkpoints, freezing each
  version before starting the next. Final-example tests alone are insufficient.

An accompanying example is supporting code, not the tutorial or its replay
evidence. Production integration remains outside this package's scope.

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

The first naive baseline must start from caller-visible input or behavior, not
from a future internal abstraction. For example, introduce a run-level
`context`, registry, node, store, adapter, state machine, or final class only
after the tutorial has shown the pressure that makes it necessary.

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
| Plan the teaching route | [`from-scratch-tutorial-plan`](from-scratch-tutorial-plan/SKILL.md) | Define capability versions, document targets, entry baselines, checkpoint tasks, verification, and build handoff. |
| Build the tutorial | [`from-scratch-tutorial-build`](from-scratch-tutorial-build/SKILL.md) | Build and replay one checkpoint at a time; freeze each version's assembled code before advancing. |
| Review tutorial quality | [`from-scratch-tutorial-review`](from-scratch-tutorial-review/SKILL.md) | Check teaching depth, version files, entry/exit contracts, checkpoint continuity, replay evidence, and code drift. |
| Simplify the guide | [`from-scratch-tutorial-simplify`](from-scratch-tutorial-simplify/SKILL.md) | Reduce repetition while preserving navigation, version boundaries, pressure, checks, and every version's final checkpoint. |

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
- Each version's final code must be its last connected step's assembled
  checkpoint; do not add a detached final implementation section.
- Public output should read like a tutorial, not a compliance checklist. The
  step fields are internal obligations unless the human asks for a structured
  audit format.
- Publishing concerns such as blog front matter, taxonomy, SEO, and site paths
  belong to a separate publishing skill if needed later.
