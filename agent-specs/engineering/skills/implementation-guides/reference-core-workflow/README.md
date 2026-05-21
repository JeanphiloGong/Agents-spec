# Reference Core Workflow

This package holds skills for turning one important core logic chain into a
runnable, standalone learning module. The source may be a production system,
AI draft, architecture-heavy behavior, or an idea, but the module's first job
is to teach the logic itself as a nano project.

The goal is chain mastery, not a smaller demo. The module should make the
real-world scenario, entrypoint, state/data movement, decisions, invariants,
boundary cases, and version lineage visible enough that another engineer can
run it, review it in git, and explain the chain back without knowing the source
project.

Each completed learning-asset checkpoint should be traceable by commit. Tags
are optional retrieval markers for review-passed checkpoints that are reusable,
publishable, or important to map back later; do not tag every small edit.

## Layout

| Workflow step | Skill | Purpose |
| --- | --- | --- |
| Scan for core chains | [`reference-core-scan`](reference-core-scan/SKILL.md) | Inventory candidate chains in a project, module, subsystem, or AI draft before choosing one to extract. |
| Shape the teaching asset | [`reference-core-teaching-plan`](reference-core-teaching-plan/SKILL.md) | Gate the selected chain against missing prerequisite assets, then turn it into a "from zero implement X" teaching promise and module constraints. |
| Plan the core chain | [`reference-core-plan`](reference-core-plan/SKILL.md) | Identify the standalone logic chain, defining invariant, module layout, included vs deferred learning boundaries, version checkpoint, and validation targets before writing code. |
| Build the module | [`reference-core-build`](reference-core-build/SKILL.md) | Turn the plan into a git-reviewable nano learning module with runnable code, README, happy-path check, and boundary check. |
| Review the module | [`reference-core-review`](reference-core-review/SKILL.md) | Check that the module is runnable, chain-complete, invariant-preserving, readable, and useful without source-project context. |
| Map back to production | [`reference-core-map-back`](reference-core-map-back/SKILL.md) | Optionally convert the learned chain into concrete production modules, first landing tests, and handoff guidance after the standalone module is understood. |

## Operating Order

Use the full workflow when the chain needs explicit gates:

```text
$reference-core-scan
$reference-core-teaching-plan
$reference-core-plan
$reference-core-build
$reference-core-review
$reference-core-map-back
```

Stop after `reference-core-review` when the goal is only a personal knowledge
asset or reusable nano project. Use `reference-core-map-back` only when the
validated module needs to inform production work.

Skip scan when the chain is already selected:

```text
$reference-core-teaching-plan
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

- Use this package for runnable standalone learning modules, not production
  patches.
- Use `reference-core-scan` for inventory and prioritization, not detailed
  single-chain planning.
- Use `reference-core-teaching-plan` when the selected chain should become a
  blog, nano project, tutorial, or personal knowledge asset.
- Treat "from zero" as the real-world problem plus the smallest useful
  engineering mechanism, not automatically as an empty repository.
- Let `reference-core-teaching-plan` stop the current chain when it is really a
  later version that depends on a missing base module.
- Require commits for completed learning-asset checkpoints; recommend tags
  only when review shows the checkpoint is worth retrieving later.
- Use `from-scratch-tutorial-workflow` when the output is a teaching guide
  rather than a runnable module artifact.
- Keep production mapping and source-project file references in
  `reference-core-map-back`; earlier skills should focus on the core logic,
  real-world scenario, module version line, and runnable proof.
- Keep learning modules out of production-imported paths unless the human
  explicitly approves a different placement.
