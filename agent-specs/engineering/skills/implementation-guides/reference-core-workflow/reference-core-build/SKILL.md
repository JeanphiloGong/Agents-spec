---
name: reference-core-build
description: v0.1.2 - Build a runnable reference-core learning module from a plan or explicit core inputs. Use when turning a noisy production feature, AI draft, extracted chain, invariant, scenario-fit src architecture, module layout, included/deferred boundary, placement, and validation plan into a git-reviewable executable module.
---

# Reference Core Build

## Overview

Turn a reference-core plan into a runnable learning module. The module must
extract one chain the human wants to master, preserve the defining invariant,
replace non-core production boundaries with small fakes, include one happy path
and one boundary or failure check, and stay outside production-imported paths by
default.

Use this skill when code should be written as a learning and design artifact,
not as a production patch.

## When to Use

- A `reference-core-plan` output is ready to implement.
- The human provides enough explicit core inputs to build without a separate
  planning pass.
- The human wants a runnable learning module before production landing.
- The module needs explicit happy-path and boundary validation.
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
     chain mastery goal, chain trace, invariant, included/deferred boundary,
     module layout, `src/` architecture, safe placement, happy path, and
     boundary or failure check.
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
   - State what the module proves, what it does not prove, and which
     production constraints remain deferred.
   - Include a README that explains the chain, how to run it, validations, and
     map-back starting points.
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
- `production_import_barrier=required`

## Decision Points

- If the plan lacks a defining invariant, return to `reference-core-plan`.
- If the plan lacks a clear learning chain or module layout, return to
  `reference-core-plan`.
- If the plan lacks a scenario-fit `src_architecture`, return to
  `reference-core-plan` instead of inventing one during build.
- If the module cannot be runnable without hiding the invariant, stop and
  produce a design-only blocker with the missing validation step.
- If production placement is unsafe, keep the module ephemeral and ask before
  writing files.
- If map-back is now needed, hand off to `reference-core-map-back`.

## Output Format

```markdown
## Built Learning Module
- path:
- layout:
- src_architecture:
- run_command:

## Extracted Chain
- entrypoint:
- steps:
- output:

## Included In Reference
- ...

## Deferred To Production
- ...

## Validation
- happy_path:
- boundary_or_failure_check:

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

## Red Flags

- No run command or inline executable check exists.
- The module is a loose single file without a stated reason.
- The `src/` layout ignores or overcomplicates the planned `src_architecture`.
- The module imports production modules by default.
- Production concerns appear despite being deferred.
- The module lacks a boundary or failure check.
- Helpers exist without preserving the invariant.
- The README explains the topic but not the chain.

## Verification

- [ ] The module path is safe or explicitly ephemeral.
- [ ] The module is a git-reviewable directory or has a justified single-file
      exception.
- [ ] The `src/` layout follows the planned scenario-fit architecture.
- [ ] The module runs one meaningful happy path.
- [ ] A boundary or failure check is executable or directly testable.
- [ ] Included and deferred concerns match the plan.
- [ ] The README explains the extracted chain and what the module proves and
      does not prove.
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
- Do not add blog polish, long narrative, or publishing structure unless the
  human explicitly asks for a publishable article.
