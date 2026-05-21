---
name: reference-core-plan
description: v0.1.9 - Plan one standalone runnable nano/reference learning asset checkpoint before building it. Use when a selected core logic chain, AI draft, architecture-heavy flow, or teaching-plan handoff needs one source-independent real-world scenario, invariant, scenario-fit src architecture, version checkpoint, included/deferred learning boundary, placement, validation plan, and future from-scratch tutorial handoff.
---

# Reference Core Plan

## Overview

Plan one runnable reference-core nano asset before writing code. The plan
identifies the exact chain to learn, defining invariant, visible steps,
scenario-fit `src/` architecture, included learning behavior, deferred learning
boundaries, git-reviewable module layout, safe project placement, knowledge
asset constraints when provided, version checkpoint policy, validation targets,
and future from-scratch handoff that `reference-core-build` will implement.

Use this skill to turn the logic into a standalone nano/reference module. A
source project can motivate the chain, and blog/tutorial framing may sharpen
the asset boundary, but production mapping belongs in `reference-core-map-back`
and step-by-step teaching belongs in `from-scratch-tutorial-workflow` after the
module is understood.

One plan produces one asset version checkpoint. The later build may use several
implementation slices inside that checkpoint, but it must not deliver multiple
asset versions in one plan/build/review/commit cycle.

## When to Use

- A core logic chain needs to become a standalone runnable learning module.
- Production code, an AI draft, or source notes are too noisy to learn from
  directly.
- The human wants to extract one chain before code is written.
- The chain entrypoint, invariant, `src/` architecture, module layout, or
  placement is not yet explicit.
- A `reference-core-teaching-plan` output should shape the module plan.
- The module needs a named version checkpoint for commit and optional tag
  traceability.

**When NOT to use:** writing the module, reviewing a completed module,
production landing, tutorial-only derivation, or final integration patches.

## The Planning Loop

1. Identify Learning Chain
   - Name the feature, system slice, and one-sentence chain mastery goal.
   - If a `reference-core-teaching-plan` handoff exists, carry forward its
     zero point, lineage gate, from-zero promise, and asset constraints.
   - If the handoff says the selected chain is blocked by missing prerequisite
     work, plan the prerequisite asset instead or stop for the blocking open
     question.
   - State the chain as `entry input -> key state/data -> decisions ->
     transitions -> output`.
   - Mark required inputs as `provided`, `inferred`, or `missing`.
   - Verify: no missing input would change the chain boundary.
2. Name the Defining Invariant
   - State the ordering rule, state transition, data invariant, or core loop
     the module must preserve.
   - Verify: a module that breaks this rule would visibly fail.
3. Split Included vs Deferred Learning Boundaries
   - List what belongs in the standalone module and what should remain outside
     this learning checkpoint.
   - Verify: source-project storage, network, auth, logging, rollout, and
     integration concerns stay out unless they define the core logic.
4. Choose Module Layout and Placement
   - Pick runtime, directory layout, dependency policy, and module path.
   - Include README sections, traces, fixtures, or staged examples required by
     the teaching promise when one exists.
   - Prefer `examples/reference-core/<feature-slug>/` unless context proves a
     safer alternative.
   - Verify: the path is outside production-imported code by default.
5. Choose Scenario-Fit `src/` Architecture
   - Choose the simplest internal `src/` layout that keeps the extracted chain
     understandable for this scenario.
   - Prefer chain-first files for small algorithms, state machines, schedulers,
     parsers, caches, editor loops, and graph runners.
   - Use DDD-inspired `domain/` and `application/` only when business entities,
     rules, and invariants would otherwise blur together.
   - Add `ports/`, `adapters/`, or `projections/` only when external
     boundaries, fake gateways, or read/write views are part of understanding
     the chain.
   - Verify: every proposed `src/` directory has a job in the learning chain;
     no directory exists just to resemble production architecture.
6. Plan Validation
   - Define one happy path and one boundary or failure check.
   - State what the module will prove and not prove.
   - Verify: `reference-core-build` can execute or directly test both checks.
7. Plan Version Checkpoint
   - Carry forward or define asset line, version name, version role, starting
     version, additions, and checkpoint type.
   - State `checkpoint_scope: exactly-one`.
   - List prerequisite checkpoints and future checkpoints outside the current
     build scope.
   - Require a commit for every completed learning-asset checkpoint.
   - Recommend a tag only when the checkpoint should be retrievable later as a
     reusable, publishable, or map-back-ready asset.
   - Verify: tag recommendation has a concrete reason and does not replace the
     required commit, and the planned build does not cross checkpoint
     boundaries.
8. Plan From-Scratch Handoff
   - Name the final target artifact the tutorial should eventually teach.
   - State the core behavior to derive, the likely naive starting pressure, and
     the required final checkpoint.
   - Verify: the handoff points to `from-scratch-tutorial-plan` without asking
     this workflow to write the tutorial body.
9. Prepare Optional Source Notes
   - If source-project context is known, record it as optional evidence for
     later `reference-core-map-back`.
   - Verify: source notes do not become the README's first explanation or the
     module's main structure.

## Decision Points

- If the defining invariant is unknown, ask before planning the module unless
  repository evidence makes it explicit.
- If a production boundary is part of the core behavior, keep the smallest
  faithful version in the reference and explain why.
- If safe placement is unclear, choose an ephemeral module and ask for
  confirmation before persisting files.
- If the user wants a teaching guide instead of a runnable module, use
  `from-scratch-tutorial-workflow`.
- If a teaching-plan handoff includes blog/tutorial/personal-kb language,
  preserve it as knowledge-asset framing for boundary and validation choices;
  do not turn the plan into article prose.
- If `reference-core-teaching-plan` marks the chain
  `blocked-by-missing-prerequisite`, do not plan the current chain as if it can
  start from zero. Switch to the prerequisite asset or ask for the missing base
  evidence.
- If a teaching-plan handoff lacks `real_world_zero` or `engineering_zero`,
  ask for the missing zero point before planning the module shape.
- If a teaching-plan handoff puts the current-chain behavior inside
  `engineering_zero`, split the base mechanism from `current_chain_adds` before
  planning the module layout.
- If version checkpoint data is missing, define it before build handoff instead
  of letting `reference-core-build` infer tag names.
- If the requested module would build more than one asset checkpoint, split the
  plan and target only the first unfinished checkpoint.
- If `tag_recommended: yes`, include `tag_name_candidate` and `tag_reason`, but
  do not treat tag creation as automatic build behavior.
- If the plan starts by naming production files instead of a real-world
  scenario and minimal mechanism, rewrite the opening around the standalone
  logic before build handoff.

## Reference Map

- `references/source-architecture-selection.md`
  Read when choosing `src_architecture`, especially if the chain could be
  chain-first, state-machine, pipeline, DDD-inspired, ports/adapters,
  event-sourced, projection-based, or custom.
- `reference-core-teaching-plan` output
  Read when the human wants the learning module to support a blog, nano
  project, tutorial, source-reading note, or personal knowledge-base entry.

## Output Format

```markdown
# Reference Core Plan: <Feature>

## Learning Chain
- Feature:
- Chain mastery goal:
- Chain trace:
- Inputs:

## Teaching Asset Constraints
- real_world_zero:
- standalone_scenario:
- engineering_zero:
- current_chain_position:
- current_chain_adds:
- base_current_split:
- lineage_verdict:
- base_asset:
- base_asset_status:
- starts_from:
- example_should_begin_with:
- from_zero_sentence:
- knowledge_asset_lens:
- reader_value:
- prerequisite_split_pressure:
- version_boundary_pressure:
- asset_type:
- must_show:
- must_run:
- must_test:
- must_trace:
- must_explain:
- exclusions:

## Version Checkpoint
- asset_line:
- version_name:
- version_role:
- checkpoint_scope: exactly-one
- starts_from_version:
- adds:
- prerequisite_checkpoints:
- implementation_slices_allowed:
- excluded_future_checkpoints:
- checkpoint_type: internal-learning | reusable | publishable | map-back-ready
- commit_required: yes
- tag_recommended: yes | no
- tag_name_candidate:
- tag_reason:
- tag_after_review: yes | no

## Defining Invariant
- ...

## Included In Module
- ...

## Deferred Learning Boundaries
- ...

## Module Layout and Placement
- runtime:
- directory_layout:
- required_files:
- src_architecture:
  - style: chain-first | ddd-inspired | ports-and-adapters | custom
  - src_layout:
  - why_this_fits:
  - upgrade_triggers_not_used:
- dependency_policy:
- suggested_path:
- production_import_barrier:
- git_review_boundary:

## Validation Plan
- happy_path:
- boundary_or_failure_check:
- proves:
- does_not_prove:

## Nano Asset Readiness
- project_name_candidate:
- final_target_artifact:
- why_this_is_not_just_a_demo:
- reader_can_explain:
- future_tutorial_value:

## From-Scratch Handoff
- next_skill: from-scratch-tutorial-plan
- final_target_artifact:
- core_behavior_to_teach:
- naive_starting_pressure:
- required_final_checkpoint:
- likely_tutorial_steps:
- tutorial_should_not_cover:

## Optional Source Notes
- source_context:
- later_map_back_targets:
- map_back_required_now: yes | no

## Build Handoff
- recommended_builder: reference-core-build
- version_checkpoint:
- checkpoint_scope:
- commit_required:
- tag_recommended:
- tag_handoff:
- standalone_readme_first:
- from_scratch_handoff:
- notes:
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The module can discover the invariant while being built." | If the invariant is unclear, the module may prove the wrong thing. |
| "Copying production code is the fastest plan." | Copying preserves incidental complexity instead of isolating the core. |
| "Placement can be decided later." | Placement determines whether the module can accidentally become production-importable. |
| "DDD is a good default." | Architecture should follow the chain pressure; full DDD can hide small mechanisms. |
| "The builder can decide the version tag later." | The plan should define checkpoint intent; the builder should execute and record it without inventing release semantics. |
| "The README can start from the source project because that is where the idea came from." | The module is a standalone learning asset; source mapping belongs in optional notes or map-back. |
| "We can include v0 and v1 because both are needed for the example." | A build may have multiple slices, but the plan should complete one asset checkpoint. Finish the prerequisite checkpoint first when it can stand alone. |
| "The tutorial value can be decided after the module exists." | The module boundary should already be strong enough to become a future from-scratch target. |
| "Blog framing means writing blog sections now." | Blog framing is only an asset-shaping lens in this workflow. |

## Red Flags

- The plan lacks a chain trace or defining invariant.
- A provided teaching promise is ignored or not reflected in module
  requirements.
- A provided lineage gate is ignored, especially when it blocks on missing
  prerequisite work.
- Included and deferred learning boundaries overlap.
- The plan begins with production/project files instead of the real-world
  scenario and minimal mechanism.
- No boundary or failure check is planned.
- The suggested path is inside production-imported code.
- The layout is a loose file instead of a reviewable module directory without
  justification.
- `src_architecture` is missing, generic, or copied from production without
  explaining why it fits the chain.
- Version checkpoint is missing or says to tag every edit without a retrieval
  reason.
- The plan includes multiple asset versions in one build target.
- DDD, adapters, or projections appear without business-rule or boundary
  pressure.
- Optional source notes are treated as the main learning-module structure.
- No nano asset readiness statement explains why the module is more than a
  runnable demo.
- No from-scratch handoff is planned for review-passed assets that are intended
  to teach future self or readers.

## Verification

- [ ] Required inputs are marked as `provided`, `inferred`, or `missing`.
- [ ] The learning chain is explicit as entry, state/data, decisions,
      transitions, and output.
- [ ] Teaching asset constraints are carried forward when provided.
- [ ] Lineage constraints are carried forward when provided, including base
      asset, starts-from point, and prerequisite status.
- [ ] The defining invariant is explicit.
- [ ] Included and deferred learning boundaries are concrete and
      non-overlapping.
- [ ] Module layout is git-reviewable and has a production-import barrier.
- [ ] `src_architecture` names a scenario-fit style, concrete `src/` layout,
      rationale, and rejected upgrade triggers.
- [ ] Version checkpoint names commit requirement and tag recommendation.
- [ ] The plan targets exactly one asset checkpoint and excludes prerequisite
      or future checkpoints from the current build.
- [ ] Happy-path and boundary/failure validation are planned.
- [ ] Nano asset readiness explains project name, target artifact, reader
      explanation value, and future tutorial value.
- [ ] From-scratch handoff names final target artifact, core behavior, naive
      pressure, required final checkpoint, and exclusions.
- [ ] Map-back starting points are named.

## Guardrails

- Do not write module code during planning.
- Do not invent invariants or source-project targets without evidence; keep
  source targets in optional notes for later map-back.
- Do not make tag creation automatic; plan the recommendation and hand off tag
  execution only after review or explicit operator request.
- Do not plan multiple asset checkpoints in one build handoff.
- Do not plan production patches.
- Do not make production/source-project mapping the main output; save it for
  optional notes or `reference-core-map-back`.
- Do not place modules in production-imported paths by default.
- Do not write the from-scratch tutorial in this plan; only prepare the
  handoff.
