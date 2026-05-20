---
name: reference-core-teaching-plan
description: v0.1.0 - Turn an already selected core chain into a from-zero teaching promise and module lineage gate before planning the learning module. Use when the human wants the extracted chain to become a blog, nano project, tutorial, or personal knowledge asset, especially when the chain may depend on an earlier nano module version.
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
it. Then it places the chain on a module lineage: standalone first module,
inline `v0` setup, extension of an existing asset, or blocked by missing
prerequisite work. If a selected chain is really `v1` or `v2`, the skill should
surface that before producing a full teaching plan.

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
   - State the smallest engineering mechanism that can address the situation.
   - Name where the selected chain sits relative to that zero point:
     first mechanism, inline setup, extension, or later production mapping.
   - Verify: the teaching path starts from a concrete problem and a minimal
     mechanism, not from a mid-system implementation detail.
3. Run The Lineage Gate
   - Decide whether the chain is `standalone-first`, `inline-v0-then-current`,
     `extends-existing-asset`, or `blocked-by-missing-prerequisite`.
   - Name the base asset, previous version, current version, and next extension
     when a lineage exists.
   - Ask whether the base asset has already been built, where it lives, and
     what evidence proves it is runnable or readable.
   - Verify: the selected chain is not a middle step disguised as a standalone
     "from zero" topic.
4. Stop On Missing Prerequisites
   - If the base module is required but not built, output blocking open
     questions and prerequisite work instead of a full teaching plan.
   - Redirect the next skill to the prerequisite asset's
     `reference-core-teaching-plan`, `reference-core-plan`, or
     `reference-core-build`.
   - Verify: current work cannot proceed until the prerequisite is explicit.
5. Define The Teaching Promise
   - Convert the chain into a sentence: "from zero implement a `<mini-system>`".
   - If the chain is an extension, phrase the promise as "start from
     `<base-asset>` and add `<capability>`".
   - Name possible `nano-*`, `mini-*`, or article title candidates.
   - Verify: the promise is teachable with its required setup visible.
6. Choose Asset Shape
   - Choose `nano-project`, `blog`, `tutorial`, `source-reading-note`,
     `personal-kb`, or a hybrid.
   - Explain why that shape fits the chain and the human's goal.
   - Verify: the shape produces motivation without forcing unnecessary polish.
7. Derive Module Constraints
   - List what the learning module must show, run, test, trace, and explain to
     support the promise.
   - Decide whether the module needs fixtures, traces, diagrams, or staged code
     versions.
   - State whether examples begin from an empty project, an inline `v0`, or the
     previous module's final result.
   - Verify: every required artifact supports the teaching promise.
8. Shape The Plan Handoff
   - Produce constraints for `reference-core-plan`: chain scope, module shape,
     zero point, lineage status, base asset, `src_architecture` bias, required
     tests, required traces, README sections, exclusions, and done conditions.
   - Verify: `reference-core-plan` can design the module without re-deciding
     the asset goal.

## Decision Points

- If the chain is not selected yet, run `reference-core-scan` first.
- If the real-world zero or engineering zero is unknown, ask the smallest
  blocking question before producing a full teaching plan.
- If the chain requires a base asset and the base asset status is unknown, ask
  the blocking question before producing a full plan.
- If the chain requires a base asset that is not built, stop and output
  prerequisite work. Do not continue to `reference-core-plan` for the current
  chain.
- If the base asset exists, require its path, last known version, and runnable
  or readable evidence.
- If the base asset is small enough to introduce inside the same module, mark
  it `inline-v0-then-current` and require staged examples.
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
- engineering_zero:
- current_chain_position:
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
- engineering_zero:
- current_chain_position:
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
- engineering_zero:
- current_chain_position:
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
| "This chain can be called from zero if I explain enough background." | If the chain starts in the middle of a system, name the required base asset or make it an inline `v0`. |
| "The previous module probably exists somewhere." | Lineage needs evidence: a path, artifact, test, README, or explicit decision to build the prerequisite first. |

## Red Flags

- The output ranks multiple chains instead of shaping one selected chain.
- No zero point appears before the lineage gate.
- The zero point is just a title, technology, or production component name
  rather than a real-world problem and minimal mechanism.
- No lineage gate appears before the teaching promise.
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
- [ ] The lineage gate decides whether the chain is standalone, inline `v0`,
      extends an existing asset, or is blocked by missing prerequisite work.
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
- Do not pretend an extension chain is standalone. Name the base asset, inline
  it as `v0`, or block on prerequisite work.
