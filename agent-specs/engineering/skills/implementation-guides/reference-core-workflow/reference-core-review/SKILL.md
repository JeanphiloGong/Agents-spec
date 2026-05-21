---
name: reference-core-review
description: v0.1.7 - Review one standalone runnable reference-core nano asset checkpoint. Use when checking whether a module is independently understandable without source-project context, chain-complete for one version checkpoint, invariant-preserving, scenario-fit in src architecture, executable, git-reviewable, safely placed, version-checkpoint ready, strong enough to become a from-scratch tutorial target, and optionally ready for map-back.
---

# Reference Core Review

## Overview

Review a reference-core nano learning asset as a runnable proof artifact.
Findings come first and focus on whether the module teaches the extracted
chain, proves the intended invariant, avoids smuggling in production
complexity, and is strong enough to become the final target of a later
from-scratch tutorial.

The module should stand on its own as a nano/reference learning asset. The
README should start from the real-world scenario, problem, engineering zero,
and current version, not from source-project files or production mapping. Blog,
tutorial, and personal-knowledge-base framing is accepted only as asset-shaping
evidence, not as a substitute for runnable code or validation.

When the module represents a learning-asset version checkpoint, review whether
the checkpoint is commit-ready and whether a tag is justified. Tags should be
recommended only for review-passed checkpoints that are reusable, publishable,
or important for map-back traceability.

The review target should contain one asset checkpoint. If the module combines
multiple standalone versions, such as a teachable `v0` and a teachable `v1`,
the verdict should require splitting the work before checkpoint acceptance.

Use this skill before trusting a module as a learning asset. Run
`reference-core-map-back` separately when production mapping is needed.

## When to Use

- A reference-core learning module has been built and needs acceptance review.
- A module may be too large, too abstract, or not actually runnable.
- The production-import barrier needs checking.
- A version checkpoint needs a commit/tag recommendation before map-back or
  publication.
- A module should be checked for whether it can support a future
  `from-scratch-tutorial-plan` handoff.
- Map-back should not start until the standalone module quality is clear.

**When NOT to use:** planning or building the module, production code review,
tutorial review, or writing map-back guidance.

## The Review Loop

1. Read the Plan and Artifact
   - Identify intended learning chain, invariant, included/deferred boundaries,
     and module files.
   - Verify: the review target is clear.
2. Check Chain Completeness
   - Confirm the module exposes entry input, state/data movement, decisions,
     transitions, output, and defining invariant.
   - Verify: the module is neither a vague sketch nor a copied production
     module.
3. Check Validation Evidence
   - Inspect happy path and boundary or failure check.
   - Verify: the boundary check would fail visibly if the invariant broke.
4. Check Placement and Imports
   - Confirm the module is outside production-imported paths by default.
   - Verify: no production module depends on the module.
5. Check Module Shape
   - Confirm the artifact is a git-reviewable directory with README, source,
     checks, and optional fixtures/traces, or a justified single-file exception.
   - Confirm the README starts from standalone scenario/problem/engineering
     zero/current version instead of source-project mapping.
   - Verify: another engineer can run and review the module without reopening
     the production draft.
6. Check `src/` Architecture Fit
   - Confirm the internal `src/` layout matches the planned style and the
     chain pressure.
   - Verify: chain-first modules are not over-layered, and DDD-inspired or
     ports/adapters modules name the business or boundary pressure that earns
     those directories.
7. Check Deferred Constraints
   - Confirm production concerns are deferred unless they define the core.
   - Verify: included and deferred lists are concrete and non-overlapping.
8. Check Version Checkpoint
   - Confirm asset line, version name, version role, and starts-from point are
     recorded in the module or build output.
   - Confirm the artifact contains exactly one asset checkpoint.
   - Allow multiple implementation slices only when they all serve the same
     checkpoint.
   - Confirm `commit_required` is present for completed checkpoints.
   - Recommend a tag only when verdict is not `block` and the checkpoint is
     reusable, publishable, or map-back-ready.
   - Verify: tag recommendation has a concrete retrieval reason and does not
     replace the required commit.
9. Check Nano Asset And From-Scratch Readiness
   - Confirm the module is nameable as a `nano-*` or similar small complete
     asset, not merely a runnable demo.
   - Confirm another engineer could say, "Today I will teach you how to
     implement <this> from zero" after studying it.
   - Confirm the review or artifact names the final target artifact, core
     behavior to teach, naive starting pressure, required final checkpoint, and
     tutorial exclusions.
   - Verify: the handoff points to `from-scratch-tutorial-plan` without asking
     this review to write the tutorial.
10. Produce Verdict
   - Use `pass`, `revise`, or `block`.
   - Lead with findings, then residual risks.

## Severity

- `block`: module cannot be trusted as a reference proof.
- `revise`: module is useful but needs concrete fixes before map-back.
- `suggestion`: optional improvement that does not block map-back.

## Output Format

```markdown
## Findings
- [severity] [file/section]: [issue]
  Evidence: ...
  Required change: ...

## Verdict
- pass | revise | block

## Version Checkpoint Readiness
- commit_ready: yes | no
- checkpoint_scope: exactly-one | multiple-found
- tag_recommended: yes | no
- tag_name_candidate:
- tag_reason:
- tag_next_skill: tag-release-skill | n/a

## Nano Asset Readiness
- ready: yes | no
- project_name:
- final_target_artifact:
- why_this_is_not_just_a_demo:
- reader_can_explain:

## From-Scratch Handoff Readiness
- ready: yes | no
- next_skill: from-scratch-tutorial-plan | n/a
- final_target_artifact:
- core_behavior_to_teach:
- naive_starting_pressure:
- required_final_checkpoint:
- tutorial_should_not_cover:

## Optional Map-Back Readiness
- needed: yes | no
- ready: yes | no
- reason:

## Verification Notes
- ...
```

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It is small, so it must be minimal." | Minimal means preserving and explaining the chain, not just having few lines. |
| "The happy path proves enough." | Boundary or failure evidence protects the defining behavior. |
| "It lives in examples, so placement is safe." | Imports and repository conventions still need checking. |
| "A single file is simpler." | A learning module needs reviewable structure unless the chain is genuinely tiny. |
| "More layers means more complete." | More layers can hide the extracted chain unless the scenario needs them. |
| "A runnable checkpoint should always be tagged." | Tags are for retrieval value after review, not for every successful build. |
| "The README can be production-oriented because map-back is next." | Review first accepts the standalone learning asset; map-back is a separate optional handoff. |
| "A combined v0/v1 module is still one module." | A module can be one directory and still contain multiple asset checkpoints. Review the checkpoint boundary, not just the folder boundary. |
| "It runs, so it is a good nano asset." | A nano asset also needs a clear scenario, nameable mechanism, invariant proof, and future teaching target. |
| "Blog-ready means review should judge prose polish." | Review the asset boundary and future tutorial handoff, not publication styling. |

## Red Flags

- No runnable happy path exists.
- No boundary or failure check exists.
- The module does not expose the chain steps.
- The `src/` architecture is generic, production-shaped, or over-layered for
  the chain.
- The module copies broad production structure.
- The module lives in or is imported by production code.
- Deferred production constraints are missing or vague.
- The invariant is not named in the artifact.
- The README reads like a topic note instead of a runnable module guide.
- The README starts with source-project extraction or production file mapping
  instead of standalone scenario, problem, engineering zero, and version.
- Version checkpoint metadata is absent from a versioned learning asset.
- Multiple standalone asset versions are completed in one review target.
- Tag recommendation lacks a retrieval or publication reason.
- The module is too thin to support a "from zero implement X" promise.
- Nano asset readiness is missing or only says the module is runnable.
- From-scratch handoff is missing for an asset intended as a future tutorial or
  knowledge-base source.

## Verification

- [ ] Findings are ordered by severity.
- [ ] Chain completeness was checked.
- [ ] Happy-path and boundary/failure validation were checked.
- [ ] Module directory shape and README were checked.
- [ ] README standalone narrative was checked.
- [ ] `src/` architecture fit was checked against the plan and chain pressure.
- [ ] Placement and imports were checked.
- [ ] Included/deferred boundaries were checked.
- [ ] Version checkpoint and tag recommendation were checked.
- [ ] Nano asset readiness was checked.
- [ ] From-scratch handoff readiness was checked when the asset is intended for
      future learning, publication, or personal knowledge capture.
- [ ] The artifact contains exactly one asset checkpoint.
- [ ] Verdict is `pass`, `revise`, or `block`.

## Guardrails

- Do not rewrite the module during review unless the user asks for fixes.
- Do not approve a module only because it is short.
- Do not start production map-back when verdict is `block`.
- Do not treat production integration code as a reference module.
- Do not recommend a tag for a blocked module or a checkpoint that is not worth
  retrieving later.
- Do not approve a module whose main explanation requires source-project
  context before explaining the standalone logic.
- Do not approve a combined multi-checkpoint module as one checkpoint.
- Do not write the from-scratch tutorial during review; only check whether the
  handoff is ready.
