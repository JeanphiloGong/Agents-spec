---
name: split-pr-publish-skill
description: v0.1.0 - Analyze one source branch diff, split independent change slices into separate branches, and open one GitHub PR or GitLab MR per slice when personal work was developed together on one branch.
---

# Split PR Publish Skill

## Trigger and Scope

Use this skill when you need to:

- compare one source branch against one target branch
- infer separate delivery slices from one mixed personal-development branch
- create one branch and one PR or MR per independent slice
- restore traceability when unrelated module work landed together on one branch

In scope:
- diff inspection between explicit source and target branches
- split planning by user or system intent, verification boundary, rollback
  boundary, and supporting module ownership evidence
- branch creation for each accepted split slice
- selective change landing onto those branches
- commit preparation for each slice
- PR or MR draft or publication for each slice
- explicit blockers when changes are too interleaved to split safely

Out of scope:
- rewriting published history
- force-pushing by default
- auto-refactoring code solely to make splitting easier
- pretending that interleaved file hunks are independent when they are not
- creating release tags or hosted releases
- drafting release notes for a final version
- replacing code review, issue planning, or release management

## Core Purpose

- Turn one mixed development branch into reviewable, auditable PRs or MRs.
- Prefer safe split plans over aggressive automation.
- Preserve intent-level traceability without asking the operator to manually
  replay every change.
- Keep branch creation, commit creation, and PR publication aligned to the same
  slice boundaries.

## Release Handoff

- Use this skill before `tag-release-skill` when a mixed development branch
  needs PR-level traceability before a release.
- This skill ends after split branches, commits, and PRs or MRs are created or
  reported.
- After the accepted PRs or MRs land in the release target branch, use
  `tag-release-skill` to create the tag, hosted release, and release notes.
- Do not use this skill to choose release tags, create hosted releases, or
  publish final release notes.

## Fixed Defaults

- `mode=plan_then_confirm`
- `platform=auto`
- `split_basis=intent-verification-rollback-first`
- `pr_topology=auto`
- `commit_policy=one-commit-per-slice-default`
- `traceability_policy=issue-gate-when-required`
- `publication_mode=draft`
- `mixed_hunk_policy=block`
- `shared_file_policy=attach-or-block`
- `branch_naming=split/<slug>`

## Required Inputs

- `source_branch`
- `target_branch`
- one execution mode:
  - `plan_only`
  - `execute_split`
  - `publish`

Optional but strongly recommended:

- `platform` (`github`, `gitlab`, or `auto`)
- `repo`
- `pr_topology` (`parallel`, `stacked`, or `auto`)
- `slice_hints` when the operator already knows likely boundaries
- `publication_mode` (`draft` or `ready`)

## Decision Model

Use this split model:

- `parallel`
  - every slice can target the same `target_branch`
  - no slice depends on another slice's code landing first
- `stacked`
  - one slice depends on another slice from the same source branch
  - later PRs or MRs should target the prior split branch, not the final base
- `blocked`
  - the diff cannot be separated safely without manual hunk surgery, conflict
    resolution, or semantic refactoring

Default policy:

1. Prefer `parallel` when slices are independent by intent, verification, and
   rollback boundary.
2. Use module, package, or path ownership as supporting evidence, not as the
   primary split rule.
3. Use `stacked` only when one slice is a clear prerequisite for another.
4. Return `blocked` when changes overlap in the same file or shared config with
   no safe automatic ownership rule.

## Workflow

1. Resolve repository boundary and diff target.
   - Confirm `source_branch`, `target_branch`, and merge base.
   - Inspect `target_branch...source_branch`, not only the working tree.
2. Collect the candidate change set.
   - List changed files, directory roots, and ownership signals.
   - Read `references/split-heuristics.md` before proposing boundaries.
3. Build a split plan.
   - Group changes by user or system intent first.
   - For each candidate slice, name the verification check and rollback
     boundary.
   - Use module, package, feature path, and ownership signals to support the
     intent boundary.
   - Keep tests, docs, and generated files with their owning code slice when
     ownership is clear.
   - Detect shared files, overlapping hunks, or cross-slice dependencies.
   - Choose `parallel`, `stacked`, or `blocked`.
4. Validate the split plan.
   - Run the checks in `references/acceptance-criteria.md`.
   - If any slice mixes unrelated changes in one file, stop and surface the
     blocker instead of guessing.
5. Confirm execution path.
   - `plan_only`: return the split plan and stop.
   - `execute_split`: create branches and prepare commits, but do not publish
     PRs or MRs.
   - `publish`: create branches, prepare commits, and publish PRs or MRs.
6. Materialize each slice branch.
   - Create each slice branch from the correct base:
     - `parallel` => from `target_branch`
     - `stacked` => from the prior accepted slice branch
   - Land only the files or hunks assigned to that slice.
   - If a slice requires new commits, use `git-commit-skill` for the final
     commit wording and execution.
7. Run traceability gate when required.
   - If repository policy requires issue-backed work, run
     `issue-gate-skill` before each final commit.
   - Carry the resulting traceability into each slice commit or PR body.
8. Publish PRs or MRs when requested.
   - Read `references/publish-command-reference.md`.
   - Draft titles and bodies from the slice scope and diff.
   - Publish one PR or MR per slice using the correct platform CLI.
9. Report the result.
   - Return split topology, slice mapping, blockers, executed branches,
     commit hashes, and PR or MR URLs when published.

## Split Rules

- Prefer user or system intent over module boundaries and commit history when
  the source branch contains mixed work.
- A slice should be independently reviewable, verifiable, and revertible.
- Module or package roots are strong evidence only when they align with intent,
  verification, and rollback boundaries.
- Use change type such as feature, bugfix, documentation, or chore as PR label
  or title metadata, not as the primary split boundary.
- Keep tests with the code they validate.
- Keep docs with the feature or module they describe when ownership is clear.
- Keep generated files with the source slice that regenerates them.
- Shared lockfiles, workspace manifests, or root configs may attach to one
  slice only when the dependency is clear; otherwise block or isolate them as a
  dedicated prerequisite slice.
- One file must not appear in multiple slices unless the plan explicitly says
  manual hunk split is required.

## Output Format

```text
## Split Mode
- mode: plan_only | execute_split | publish
- topology: parallel | stacked | blocked
- platform:

## Diff Boundary
- source_branch:
- target_branch:
- merge_base:

## Slice Plan
- slice_id:
  - branch:
  - base:
  - scope:
  - intent:
  - verification:
  - rollback_boundary:
  - files:
  - dependencies:
  - change_type:
  - commit_needed: yes | no
  - pr_title:

## Blockers
- ...

## Execution Result
- branches_created:
- commits_created:
- push_status:

## Publish Result
- published: yes | no
- targets:
- urls:

## Next Step
- ...
```

## References

- `references/split-heuristics.md`
- `references/publish-command-reference.md`
- `references/acceptance-criteria.md`

## Guardrails

- Do not split or publish until `source_branch` and `target_branch` are
  unambiguous.
- Do not force independence when the same file contains interleaved unrelated
  changes.
- Do not force-push, rewrite history, or delete the source branch unless the
  operator explicitly asks.
- Do not silently drop shared files, generated outputs, or tests from a slice.
- Do not publish PRs or MRs that still depend on unresolved blockers.
- Do not claim a slice is reviewable if its real prerequisite code remains only
  on the mixed source branch.
- Do not invent issue links, commit hashes, branch names, or PR URLs.

## Verification Hooks

- Verify the diff boundary uses explicit `source_branch` and `target_branch`.
- Verify every proposed slice has a clear intent, verification check, rollback
  boundary, scope, and file list.
- Verify module or path boundaries are used as supporting evidence rather than
  the only split rationale.
- Verify no file is assigned to multiple slices without an explicit manual
  split note.
- Verify `parallel` versus `stacked` topology is justified by dependencies.
- Verify blocked cases stay blocked instead of being auto-resolved by guesswork.
- Verify each published PR or MR maps to exactly one accepted slice.
