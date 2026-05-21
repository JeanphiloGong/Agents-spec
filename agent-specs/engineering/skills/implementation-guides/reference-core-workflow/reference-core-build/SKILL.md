---
name: reference-core-build
description: v0.1.7 - Build one standalone runnable reference-core nano asset checkpoint from a plan or explicit core inputs. Use when turning a selected core logic chain, AI draft, source-independent real-world scenario, invariant, scenario-fit src architecture, module layout, version checkpoint, included/deferred learning boundary, placement, validation plan, and from-scratch handoff into a git-reviewable executable nano module.
---

# Reference Core Build

## Overview

Turn a reference-core plan into a runnable nano learning asset. The module must
teach one chain the human wants to master, preserve the defining invariant,
replace non-core source boundaries with small fakes, include one happy path and
one boundary or failure check, and read like a standalone `nano-*` project by
default.

When the plan contains a version checkpoint, the module should record it in the
artifact and output. A completed checkpoint must be committed through the normal
git workflow. Tags are not created by this skill; it only carries a
`tag_recommended` handoff for review or explicit `tag-release-skill` use.

One build may contain several implementation slices, but those slices must all
serve one asset checkpoint. Do not build a prerequisite version and an extension
version in the same build output unless the prerequisite is explicitly marked
as inline setup and not a standalone checkpoint.

Use this skill when code should be written as a learning and design artifact,
not as a production patch, source-project explanation, or tutorial body. Blog
or tutorial framing may shape the README and validation, but the deliverable is
the final target artifact that `from-scratch-tutorial-workflow` can later teach
from zero.

## When to Use

- A `reference-core-plan` output is ready to implement.
- The human provides enough explicit core inputs to build without a separate
  planning pass.
- The human wants a runnable standalone learning module.
- The module needs explicit happy-path and boundary validation.
- The plan includes a learning-asset version checkpoint that should be recorded
  in the module.
- Production code is too noisy, but the core invariant is known.

**When NOT to use:** planning the module, reviewing a completed module,
mapping a module back to production, tutorial-only writing, or production
integration edits.

## The Build Loop

```text
Build module -> Run happy path -> Add boundary check -> Freeze module
```

1. Load the Plan
   - Read core slice, invariant, included/deferred lists, placement, and
     validation plan.
   - If no formal plan exists, reconstruct only the missing build inputs:
     real-world scenario, engineering zero, chain mastery goal, chain trace,
     invariant, included/deferred learning boundary, module layout, `src/`
     architecture, version checkpoint, safe placement, happy path, boundary or
     failure check, nano asset readiness, and from-scratch handoff.
   - Confirm the plan targets one checkpoint; if it contains multiple
     standalone asset versions, return to `reference-core-plan`.
   - Verify: no missing input would change the code shape.
2. Create Module Directory
   - Use the planned path, defaulting to
     `examples/reference-core/<feature-slug>/`.
   - Create a reviewable module directory, not a loose snippet. Default shape:
     `README.md`, `src/`, `tests/`, and optional `fixtures/` or `traces/`.
   - Add minimal language/runtime config only when needed to run the module
     independently.
   - Verify: the module is outside production-imported paths and can be
     reviewed as one git directory.
3. Implement The Extracted Chain
   - Follow the planned `src_architecture`; write only the entrypoint,
     state/data movement, decisions, transitions, helpers, and fakes needed to
     expose the chain and invariant.
   - Use multiple implement/test/verify slices when useful, but keep every
     slice inside the same checkpoint target.
   - Keep the simplest chain-first layout unless the plan names concrete
     pressure for DDD-inspired, ports/adapters, projections, or a custom layout.
   - Use real domain names for real concepts.
   - Verify: the module stays inside the planned layout and dependency budget.
4. Run Happy Path
   - Add or run the planned happy-path command, inline test, or script.
   - Verify: one meaningful end-to-end path executes.
5. Add Boundary or Failure Check
   - Add the planned invariant-breaking, boundary, or failure case.
   - Verify: the check fails visibly if the defining invariant breaks.
6. Freeze the Module
   - State what the module proves, what it does not prove, and which learning
     boundaries remain deferred.
   - Include a README that starts from the real-world scenario, explains the
     problem, engineering zero, current version, chain, how to run it, and
     validations.
   - Record the version checkpoint, commit requirement, and tag recommendation
     in the README or build output.
   - Record the from-scratch handoff: final target artifact, core behavior to
     teach, naive starting pressure, required final checkpoint, and exclusions.
   - Verify: `reference-core-review` can assess the artifact without reopening
     the planning discussion.

## Reference Map

- `references/what-counts-as-minimal-complete.md`
  Read when the line budget or boundary feels contested and you need to recheck
  what must survive compression.
- `references/project-placement-policy.md`
  Read when project placement is unclear or the module might accidentally land
  in a production-imported path.
- `references/worked-example-mini-langgraph.md`
  Read when the feature is graph-runner, orchestration, or scheduler shaped.
- `references/worked-example-mini-viim.md`
  Read when the feature is editor-loop, command-dispatch, or state-machine
  shaped.
- `assets/reference-core-readme-template.md`
  Read when the module will persist in the target project repository and needs a
  colocated `README.md`.

## Fixed Defaults

- `mode=reference-core-build`
- `artifact_type=learning-module`
- `line_budget=150-700-total-module-lines`
- `layout_policy=module-directory-first`
- `required_files=README.md,src,tests`
- `src_architecture_policy=scenario-fit-simplest-first`
- `dependency_policy=stdlib-or-existing-lightweight-deps`
- `runtime_policy=in-memory-first`
- `validation_policy=example-first`
- `module_repository_policy=target-project-repo-preferred`
- `module_path_policy=examples/reference-core/<feature-slug>`
- `module_readme=required`
- `standalone_readme_policy=real_world_scenario_first`
- `production_import_barrier=required_when_written_in_source_repo`
- `checkpoint_commit_policy=commit_required_for_completed_checkpoint`
- `checkpoint_scope_policy=one_checkpoint_per_build`
- `tag_policy=recommend_only_after_review_or_explicit_operator_request`
- `from_scratch_handoff_policy=record_for_review_passed_assets`

## Decision Points

- If the plan lacks a defining invariant, return to `reference-core-plan`.
- If the plan lacks a clear learning chain or module layout, return to
  `reference-core-plan`.
- If the plan lacks a scenario-fit `src_architecture`, return to
  `reference-core-plan` instead of inventing one during build.
- If the module cannot be runnable without hiding the invariant, stop and
  produce a design-only blocker with the missing validation step.
- If the plan lacks version checkpoint data, default to
  `commit_required: yes` and `tag_recommended: no` for the build output rather
  than inventing a tag name.
- If the plan or requested work includes multiple standalone checkpoints, stop
  and build only the first unfinished checkpoint.
- If placement could make source-project code depend on the learning module,
  keep the module ephemeral or outside imported paths and ask before writing
  files.
- If source-project mapping is now needed, hand off to
  `reference-core-map-back` after the standalone module is built.
- If the human asks for the step-by-step tutorial while building the module,
  finish and review the nano asset first, then hand off to
  `from-scratch-tutorial-workflow`.

## Output Format

```markdown
## Built Learning Module
- path:
- layout:
- src_architecture:
- run_command:

## Standalone Learning Entry
- real_world_scenario:
- problem:
- engineering_zero:
- this_version_adds:

## Extracted Chain
- entrypoint:
- steps:
- output:

## Included In Module
- ...

## Deferred Learning Boundaries
- ...

## Validation
- happy_path:
- boundary_or_failure_check:

## Version Checkpoint
- asset_line:
- version_name:
- version_role:
- checkpoint_scope:
- implementation_slices:
- excluded_future_checkpoints:
- commit_required:
- tag_recommended:
- tag_name_candidate:
- tag_reason:

## Nano Asset Readiness
- project_name:
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
- suggested_tutorial_scope:
- tutorial_should_not_cover:

## What This Proves
- ...

## What This Does Not Prove
- ...

## Next Step
- review_with: reference-core-review
- map_back_with: reference-core-map-back
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "A non-runnable sketch is enough." | A reference core must execute one meaningful path unless a blocker is explicit. |
| "The fastest module is copied production code." | Copying keeps incidental production complexity and weakens the invariant proof. |
| "The failure check can wait." | Without a boundary check, the module may not protect the defining behavior. |
| "A DDD layout will make it more complete." | Completeness comes from chain mastery; architecture must be justified by scenario pressure. |
| "The build can create a tag when it finishes." | This skill builds and records the checkpoint; tag execution needs explicit operator input through release/tag workflow. |
| "The README should start from the production system because that is where the chain came from." | The README should start from the standalone scenario and logic; production mapping belongs in map-back. |
| "It is fine to build v0 and v1 together because they are related." | Related versions are still separate checkpoints when each can stand alone. Build the first unfinished checkpoint, review it, commit it, then continue. |
| "A runnable module is enough even if no one could teach from it." | A reference-core asset should be strong enough to become the final target of a later from-scratch tutorial. |
| "Since the asset is blog-ready, I should write the article here." | This skill records tutorial handoff and README constraints only; tutorial prose belongs to the from-scratch workflow. |

## Red Flags

- No run command or inline executable check exists.
- The module is a loose single file without a stated reason.
- The `src/` layout ignores or overcomplicates the planned `src_architecture`.
- The module imports production modules by default.
- Production concerns appear despite being deferred.
- The README starts with the source project instead of the standalone scenario,
  problem, and engineering zero.
- The module lacks a boundary or failure check.
- Helpers exist without preserving the invariant.
- The README explains the topic but not the chain.
- Version checkpoint or tag recommendation is missing from the build output.
- The build output contains multiple standalone asset versions.
- A tag is created without explicit operator request.
- The module is runnable but not nameable as a nano asset with a clear future
  tutorial target.
- From-scratch handoff is missing for a reusable, publishable, or personal
  knowledge asset.

## Verification

- [ ] The module path is safe or explicitly ephemeral.
- [ ] The module is a git-reviewable directory or has a justified single-file
      exception.
- [ ] The `src/` layout follows the planned scenario-fit architecture.
- [ ] The module runs one meaningful happy path.
- [ ] A boundary or failure check is executable or directly testable.
- [ ] Included and deferred learning boundaries match the plan.
- [ ] The README explains the extracted chain and what the module proves and
      does not prove.
- [ ] The README starts from the standalone real-world scenario, not the source
      project.
- [ ] Version checkpoint and tag recommendation are recorded.
- [ ] Nano asset readiness is recorded.
- [ ] From-scratch handoff is recorded when the asset is intended for future
      learning or publication.
- [ ] The build output contains exactly one asset checkpoint, even if multiple
      implementation slices were used.
- [ ] A persisted module has a colocated README or an explicit exception.
- [ ] No production patch was written.

## Skill Maintenance Mode

This section applies only when improving the skill package itself. It does not
apply to ordinary learning-module generation.

- Default: off.
- Enable only with an explicit signal such as `reinforcement=on`.
- If enabled, keep the change to one failure mode and validate audit records
  with `python scripts/validate_reinforcement_audit.py references/reinforcement-audit.jsonl`.

## Guardrails

- Do not build production integration code.
- Do not copy and trim a full production module.
- Do not omit the boundary or failure check to stay small.
- Do not place the module inside production-imported paths by default.
- Do not leave a persisted module without a colocated `README.md`.
- Do not make source-project mapping the README's primary story. Use
  `reference-core-map-back` for that.
- Do not create git tags. Record tag recommendations for review or explicit
  `tag-release-skill` execution.
- Do not build multiple asset checkpoints in one reference-core-build. Finish,
  review, and commit the current checkpoint before starting the next.
- Do not add blog polish, long narrative, or publishing structure unless the
  human explicitly asks for a publishable article.
- Do not write the from-scratch tutorial; record the handoff for the next
  workflow.
