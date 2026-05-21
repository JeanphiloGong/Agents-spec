---
name: reference-core-teaching-plan
description: v0.1.3 - Turn an already selected core chain into a standalone from-zero teaching promise, module lineage gate, and asset version checkpoint before planning the learning module. Use when the human wants the extracted chain to become a blog, nano project, tutorial, or personal knowledge asset, especially when the chain may depend on an earlier nano module version.
---

# Reference Core Teaching Plan

## Overview

Turn one already selected core chain into a concrete teaching asset target
before `reference-core-plan` designs the learning module. The output is the
promise the human should be able to make after mastering the chain:

```text
Today I will teach you how to implement <mini-system> from zero.
```

This skill does not choose which chain is worth studying and does not write the
tutorial. It defines the from-zero teaching angle, minimum publishable module,
knowledge-asset requirements, and constraints that `reference-core-plan` must
satisfy.

"From zero" does not mean every selected chain can start from an empty
directory. The skill first defines the zero point: the real-world situation
that creates the problem and the smallest engineering mechanism that addresses
it before the selected chain's special behavior is added. Then it separates
that zero point from the current-chain capability and places the chain on a
module lineage: standalone first module, inline `v0` setup, extension of an
existing asset, or blocked by missing prerequisite work. If a selected chain is
really `v1` or `v2`, the skill should surface that before producing a full
teaching plan.

The skill also names the asset version checkpoint. A completed checkpoint must
be traceable by commit. A tag is only recommended when the checkpoint is
runnable, review-passed, reusable, or publishable enough to be worth finding
again later.

The teaching asset should be understandable without source-project context.
Source projects may inspire the chain, but production mappings belong in
`reference-core-map-back`, not in the first explanation of this skill's output.

## When to Use

- The human already selected a chain and wants it to become a personal
  knowledge asset.
- The human wants motivation before doing the reference-core extraction.
- A chain should become a `nano-*` style project, blog post, tutorial, source
  reading note, or knowledge-base entry.
- The next plan should be shaped by what the human wants to teach after
  mastering the chain.
- The human needs to define what "from zero" means for this business scenario
  and logic chain.
- The selected chain may depend on a base module, previous article, or earlier
  runnable version that must exist before this chain is useful.
- The selected chain should become part of a versioned learning-asset line,
  such as `nano-pipeline-runner/v0`, `v1`, or `v2`.

**When NOT to use:** scanning for candidate chains, selecting which chain to
study, writing the final blog/tutorial, building the module, reviewing a built
module, or production landing.

## The Teaching Plan Loop

1. Confirm Selected Chain
   - Restate the selected chain as `entry input -> state/data -> decisions ->
     transitions -> output`.
   - State the human's learning purpose.
   - Verify: this is a chosen chain, not an inventory task.
2. Define The Zero Point
   - State the real-world situation that makes this chain necessary.
   - Phrase it without requiring source-project names, file paths, services, or
     production-only context.
   - State the smallest engineering mechanism that can address the situation
     before the selected chain's named capability is added.
   - List the current-chain capability separately from the zero mechanism.
   - Verify: `engineering_zero` does not already contain the selected chain's
     core behavior.
3. Split Base Mechanism From Current Capability
   - State what the base mechanism must do before this chain starts.
   - State what the selected chain adds on top of that base.
   - State which examples must begin from the base mechanism's final state.
   - Name where the selected chain sits relative to that zero point:
     first mechanism, inline setup, extension, or later production mapping.
   - Verify: the teaching path starts from a concrete problem and a minimal
     mechanism, not from a mid-system implementation detail or a zero point
     that already contains the current chain.
4. Run The Lineage Gate
   - Decide whether the chain is `standalone-first`, `inline-v0-then-current`,
     `extends-existing-asset`, or `blocked-by-missing-prerequisite`.
   - Use `standalone-first` only when the selected chain is the first useful
     mechanism, not when it adds gating, dedupe, fan-out, projection,
     retry/resume, caching, indexing, ranking, authorization, synchronization,
     or other behavior to a base mechanism.
   - Name the base asset, previous version, current version, and next extension
     when a lineage exists.
   - Ask whether the base asset has already been built, where it lives, and
     what evidence proves it is runnable or readable.
   - Verify: the selected chain is not a middle step disguised as a standalone
     "from zero" topic.
5. Stop On Missing Prerequisites
   - If the base module is required but not built, output blocking open
     questions and prerequisite work instead of a full teaching plan.
   - Redirect the next skill to the prerequisite asset's
     `reference-core-teaching-plan`, `reference-core-plan`, or
     `reference-core-build`.
   - Verify: current work cannot proceed until the prerequisite is explicit.
6. Define The Version Checkpoint
   - Name the asset line, version name, version role, starting point, and what
     this version adds.
   - Decide whether the checkpoint is `internal-learning`, `reusable`,
     `publishable`, or `map-back-ready`.
   - Set `commit_required: yes`.
   - Set `tag_recommended: yes` only for checkpoints that should be found later
     as reusable or publishable learning assets.
   - Verify: the version checkpoint matches the lineage gate and does not turn
     every small edit into a tag.
7. Define The Teaching Promise
   - Convert the chain into a sentence: "from zero implement a `<mini-system>`".
   - If the chain is an extension, phrase the promise as "start from
     `<base-asset>` and add `<capability>`".
   - Name possible `nano-*`, `mini-*`, or article title candidates.
   - Verify: the promise is teachable with its required setup visible.
8. Choose Asset Shape
   - Choose `nano-project`, `blog`, `tutorial`, `source-reading-note`,
     `personal-kb`, or a hybrid.
   - Explain why that shape fits the chain and the human's goal.
   - Verify: the shape produces motivation without forcing unnecessary polish.
9. Derive Module Constraints
   - List what the learning module must show, run, test, trace, and explain to
     support the promise.
   - Decide whether the module needs fixtures, traces, diagrams, or staged code
     versions.
   - State whether examples begin from an empty project, an inline `v0`, or the
     previous module's final result.
   - Verify: every required artifact supports the teaching promise.
10. Shape The Plan Handoff
   - Produce constraints for `reference-core-plan`: chain scope, module shape,
     zero point, lineage status, version checkpoint, base asset,
     `src_architecture` bias, required tests, required traces, README sections,
     exclusions, and done conditions.
   - Verify: `reference-core-plan` can design the module without re-deciding
     the asset goal.

## Decision Points

- If the chain is not selected yet, run `reference-core-scan` first.
- If the zero point starts with source-project names or production files,
  rewrite it as an ordinary real-world scenario before continuing.
- If the real-world zero or engineering zero is unknown, ask the smallest
  blocking question before producing a full teaching plan.
- If `engineering_zero` includes the selected chain's named behavior, rewrite
  it as a smaller base mechanism and move that behavior to
  `current_chain_adds`.
- If the selected chain adds behavior to a base mechanism, prefer
  `inline-v0-then-current` when the base can be built inside the same asset, or
  `blocked-by-missing-prerequisite` when the base should be its own asset.
- If the selected chain includes words like gate, dedupe, fan-out, resume,
  retry, projection, cache, index, rank, auth, sync, or migration, test whether
  those are current-chain additions rather than the engineering zero.
- If the chain requires a base asset and the base asset status is unknown, ask
  the blocking question before producing a full plan.
- If the chain requires a base asset that is not built, stop and output
  prerequisite work. Do not continue to `reference-core-plan` for the current
  chain.
- If the base asset exists, require its path, last known version, and runnable
  or readable evidence.
- If the current asset version is unknown, ask whether this chain is `v0`,
  `v1`, `v2`, or a named checkpoint before writing the full teaching plan.
- If the base asset is small enough to introduce inside the same module, mark
  it `inline-v0-then-current` and require staged examples.
- If the checkpoint is only an internal learning step, require a commit but do
  not recommend a tag.
- If the checkpoint is reusable, publishable, or map-back-ready, recommend a
  tag name candidate but leave actual tag creation to explicit operator action
  through `tag-release-skill`.
- If the human wants a full tutorial draft now, use
  `from-scratch-tutorial-build` after the teaching promise is clear.
- If the asset type is `nano-project`, require a runnable module and clear
  project name candidate.
- If the asset type is `blog` or `tutorial`, require narrative angle, reader,
  trace points, and code sections.
- If the asset type is `personal-kb`, require mental models, comparisons, and
  reusable notes rather than publication polish.
- If the teaching promise cannot be made without production-only complexity,
  narrow the promise until it can be taught from zero.

## Output Format

Use this blocking format when the lineage gate finds missing prerequisite work:

```markdown
# Reference Core Teaching Plan: <Topic>

## Selected Chain
- feature:
- chain_trace:
- human_learning_goal:

## Zero Point
- real_world_zero:
- standalone_scenario:
- engineering_zero:
- current_chain_position:
- current_chain_adds:
- base_current_split:
- why_this_zero_is_not_enough_for_current_chain:

## Lineage Gate
- extraction_verdict: blocked-by-missing-prerequisite
- standalone_teachable: no
- base_asset:
- base_asset_status: must_build_first | unknown
- current_asset_version:
- current_asset_role:
- starts_from:
- why_current_chain_cannot_start_from_zero:

## Blocking Open Questions
- ...

## Prerequisite Work
- prerequisite_asset:
- prerequisite_version:
- prerequisite_chain_trace:
- prerequisite_must_support:
- suggested_first_title_or_project:
- next_skill:

## Prerequisite Version Checkpoint
- version_name:
- version_role:
- commit_required: yes
- tag_recommended:
- tag_name_candidate:

## Stop Condition
- do_not_continue_to_reference_core_plan_until:
```

Use this full format only after the lineage gate passes:

```markdown
# Reference Core Teaching Plan: <Topic>

## Selected Chain
- feature:
- chain_trace:
- human_learning_goal:

## Zero Point
- real_world_zero:
- standalone_scenario:
- engineering_zero:
- current_chain_position:
- current_chain_adds:
- base_current_split:
- why_this_zero_is_enough:

## Lineage Gate
- extraction_verdict: standalone-first | inline-v0-then-current | extends-existing-asset
- standalone_teachable: yes | no
- base_asset:
- base_asset_status: none | exists | inline_as_v0
- base_asset_evidence:
- current_asset_version:
- current_asset_role:
- starts_from:
- example_should_begin_with:
- next_extension:

## Version Checkpoint
- asset_line:
- version_name:
- version_role:
- starts_from_version:
- adds:
- checkpoint_type: internal-learning | reusable | publishable | map-back-ready
- commit_required: yes
- tag_recommended: yes | no
- tag_name_candidate:
- tag_reason:
- tag_after_review: yes | no

## Teaching Promise
- from_zero_sentence: Today I will teach you how to implement <mini-system> from zero.
- title_or_project_name_candidates:
- reader_or_future_self:
- why_this_is_teachable:

## Asset Context
- prerequisite_knowledge:
- prerequisite_module:
- problem_before_this_chain:
- capability_added_by_this_chain:
- follow_up_capability:

## Asset Shape
- type: nano-project | blog | tutorial | source-reading-note | personal-kb | hybrid
- why_this_type:
- minimum_publishable_asset:
- what_to_exclude:

## Module Must Support This Promise
- must_show:
- must_run:
- must_test:
- must_trace:
- must_explain:
- optional_diagrams_or_notes:

## Constraints For reference-core-plan
- chain_scope:
- real_world_zero:
- standalone_scenario:
- engineering_zero:
- current_chain_position:
- current_chain_adds:
- base_current_split:
- version_checkpoint:
- tag_policy:
- module_lineage:
- base_asset:
- starts_from:
- module_shape:
- src_architecture_bias:
- required_fixtures:
- required_traces:
- README_sections:
- validation_requirements:
- exclusions:

## Done Means
- learning_done:
- module_done:
- publishable_or_kb_done:
- next_skill: reference-core-plan
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I can decide the blog angle after building." | The teaching promise should shape what the module makes visible. |
| "A serious asset needs production completeness." | A from-zero asset needs the learnable core, not all production constraints. |
| "Scan should decide the asset." | Scan inventories chains; this skill shapes a selected chain into a teaching target. |
| "From zero means starting from an empty repo." | The zero point is the real-world problem plus the smallest useful mechanism, which may require a prior module. |
| "The engineering zero can include all the mechanism I want to teach." | That hides the lineage decision. Put the base mechanism in `engineering_zero` and the selected-chain behavior in `current_chain_adds`. |
| "This chain can be called from zero if I explain enough background." | If the chain starts in the middle of a system, name the required base asset or make it an inline `v0`. |
| "The previous module probably exists somewhere." | Lineage needs evidence: a path, artifact, test, README, or explicit decision to build the prerequisite first. |
| "Every version should get a tag." | Every checkpoint needs a commit. Tags are for review-passed checkpoints worth retrieving as reusable or publishable assets. |
| "The production system context makes the asset more concrete." | The asset should first be concrete as a standalone real-world scenario; production mapping comes later. |

## Failure Case

If the selected chain is `trigger(mode) -> resolve run plan -> scope dedupe ->
ensure prepare -> downstream queued/running -> finalize prepare -> fan-out`,
do not set:

```markdown
- engineering_zero: mode, run_plan, run_record, prepare ready, pending downstream
- extraction_verdict: standalone-first
```

That answer already includes the selected chain inside the zero point. A better
split is:

```markdown
- engineering_zero: minimal pipeline runner: trigger -> plan -> run task -> record state
- current_chain_adds: run slot dedupe, prepare gate, downstream waiting, pending fan-out
- extraction_verdict: inline-v0-then-current | blocked-by-missing-prerequisite
```

Use `inline-v0-then-current` only when the minimal runner can be built as the
first stage inside the same asset. Use `blocked-by-missing-prerequisite` when
the minimal runner should be completed as its own asset before this chain.

## Red Flags

- The output ranks multiple chains instead of shaping one selected chain.
- No zero point appears before the lineage gate.
- The zero point is just a title, technology, or production component name
  rather than a real-world problem and minimal mechanism.
- The zero point requires source-project knowledge before explaining the
  standalone scenario.
- `engineering_zero` already contains the selected chain's special behavior,
  such as gating, dedupe, fan-out, resume, projection, indexing, caching, or
  synchronization.
- `current_chain_adds` is missing or duplicates `engineering_zero`.
- No lineage gate appears before the teaching promise.
- No version checkpoint appears after the lineage gate.
- `tag_recommended: yes` appears without a runnable/reviewable or publishable
  reason.
- A middle-layer chain is presented as standalone without a base asset, inline
  `v0`, or blocking open question.
- The output continues to a full teaching plan even though required
  prerequisite work is missing.
- No "from zero implement ..." sentence appears.
- The asset type is named but not tied to module constraints.
- The plan handoff lacks required tests, traces, README sections, or exclusions.
- The promise depends on production-only infrastructure that should be deferred.

## Verification

- [ ] Exactly one selected chain is in scope.
- [ ] The zero point names the real-world problem and smallest engineering
      mechanism.
- [ ] The standalone scenario is understandable without source-project context.
- [ ] The base mechanism and selected-chain capability are separated.
- [ ] `engineering_zero` does not already contain `current_chain_adds`.
- [ ] The lineage gate decides whether the chain is standalone, inline `v0`,
      extends an existing asset, or is blocked by missing prerequisite work.
- [ ] A version checkpoint names asset line, version, role, starts-from point,
      additions, commit requirement, and tag recommendation.
- [ ] Missing base work produces blocking open questions and prerequisite work,
      not a full current-chain plan.
- [ ] The teaching promise is explicit and from-zero teachable.
- [ ] Asset shape is chosen with a reason.
- [ ] Module constraints support the promise.
- [ ] Handoff constraints are ready for `reference-core-plan`.
- [ ] The output does not write the final tutorial or module code.

## Guardrails

- Do not choose the chain; use `reference-core-scan` for chain discovery.
- Do not write the final blog, tutorial, or knowledge-base entry.
- Do not add publication polish that does not affect module planning.
- Do not let production completeness replace from-zero teachability.
- Do not let "zero" mean an empty repo by default; define the business scenario
  and minimal logic mechanism first.
- Do not make production/source-project context the teaching asset's first
  explanation; save mapping for `reference-core-map-back`.
- Do not put the current chain's special behavior inside `engineering_zero`.
  Move it to `current_chain_adds` and decide whether the base is inline `v0` or
  prerequisite work.
- Do not pretend an extension chain is standalone. Name the base asset, inline
  it as `v0`, or block on prerequisite work.
- Do not recommend tags for every small edit. Recommend tags only for completed
  learning-asset checkpoints that pass review and are worth retrieving later.
