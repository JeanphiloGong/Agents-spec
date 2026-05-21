---
name: split-pr-publish-skill
description: v0.1.3 - Analyze one source branch diff, split independent change slices into separate branches, and open one GitHub PR or GitLab MR per slice. Use when personal work was developed together on one branch and needs traceable review boundaries before merge or release.
---

# Split PR Publish Skill

## Overview

Turn one mixed personal-development branch into reviewable, auditable PRs or
MRs. This skill compares one explicit source branch to one explicit target
branch, proposes split slices by intent, verification, and rollback boundary,
then optionally creates one branch, commit, and PR/MR per accepted slice.

The core rule is conservative: a split is useful only when each slice is
independently reviewable, verifiable, and revertible. If shared files,
interleaved hunks, or unclear dependencies make the split unsafe, return a
blocker instead of manufacturing independence.

## When to Use

- One source branch contains independent changes that need separate PRs or MRs.
- A mixed branch needs review boundaries before a release.
- A human wants a split plan before branch creation.
- The operator wants branch creation and commit preparation per accepted slice.
- The operator wants one GitHub PR or GitLab MR per split slice.

**When NOT to use:** single-scope branches, release tag creation, hosted
release publication, final release notes, code review, issue planning,
repository-specific workflow dispatch, force-push workflows, or semantic
refactors only to make splitting easier. Use `tag-release-skill` after accepted
PRs/MRs land and a release tag or hosted release is needed.

## Reference Map

- `references/split-heuristics.md`
  Use for boundary order, bucket split challenges, shared-file policy, and
  large-diff handling.
- `references/publish-command-reference.md`
  Use when publishing PRs or MRs through platform CLIs.
- `references/acceptance-criteria.md`
  Use to validate candidate slices before execution or publication.

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

## The Operating Loop

1. Resolve the repository and diff boundary.
   - Confirm `source_branch`, `target_branch`, and merge base.
   - Inspect `target_branch...source_branch`, not only the working tree.
   - Stop if either branch is ambiguous.
2. Collect the candidate change set.
   - List changed files, directory roots, commit hints, and ownership signals.
   - Read `references/split-heuristics.md` before proposing boundaries.
3. Build the split plan.
   - Group changes by user or system intent first.
   - For each slice, name the verification check and rollback boundary.
   - Use module, package, feature path, and ownership signals only as
     supporting evidence.
   - Keep tests, docs, and generated files with their owning code slice when
     ownership is clear.
   - Detect shared files, overlapping hunks, and cross-slice dependencies.
   - Choose `parallel`, `stacked`, or `blocked`.
4. Validate the plan before changing branches.
   - Run the checks in `references/acceptance-criteria.md`.
   - Challenge broad buckets such as "all docs", "all chores", one top-level
     path, or generated-only changes.
   - Require each challenged slice to prove independent intent, verification,
     and rollback.
   - Block when unrelated changes are interleaved in one file and no safe hunk
     split is explicitly accepted.
5. Confirm execution path.
   - `plan_only`: return the split plan and stop.
   - `execute_split`: create branches and prepare commits, but do not publish
     PRs/MRs.
   - `publish`: create branches, prepare commits, and publish PRs/MRs.
6. Materialize each accepted slice.
   - For `parallel`, create each slice branch from `target_branch`.
   - For `stacked`, create each slice branch from the prior accepted slice
     branch.
   - Land only files or hunks assigned to that slice.
   - Use `git-commit-skill` for final commit wording and execution when a
     slice needs a commit.
7. Run traceability gates when required.
   - Use `issue-gate-skill` before each final commit when repository policy
     requires issue-backed work.
   - Carry the resulting traceability into commit and PR/MR bodies.
8. Publish when requested.
   - Read `references/publish-command-reference.md`.
   - Draft title and body from the slice intent, diff, verification, and
     traceability.
   - Publish one PR/MR per accepted slice using the correct platform CLI.
9. Report the result.
   - Return topology, slice mapping, blockers, branches, commits, push status,
     and PR/MR URLs when published.

## Decision Points

- If source or target branch is unclear, stop before diff analysis.
- If slices are independent by intent, verification, and rollback, use
  `parallel`.
- If one slice depends on another slice from the same source branch, use
  `stacked` and target later PRs/MRs at the prior split branch.
- If changes overlap in the same file or shared config with no safe ownership
  rule, use `blocked`.
- If a slice is only a broad bucket such as docs, chores, configs, generated
  files, or one path root, require explicit independent intent before keeping
  it.
- If repository policy requires issue traceability, run `issue-gate-skill`
  before committing or publishing that slice.
- If publication is not explicitly requested, stop at the plan or branch/commit
  result.

## Split Rules

- Prefer user or system intent over module boundaries and commit history when
  the source branch contains mixed work.
- Apply the boundary order in `references/split-heuristics.md` even when the
  source and target differ by many commits.
- A slice should be independently reviewable, verifiable, and revertible.
- Module or package roots are strong evidence only when they align with intent,
  verification, and rollback boundaries.
- Use change type such as feature, bugfix, documentation, or chore as PR label
  or title metadata, not as the primary split boundary.
- Treat docs-only, chore-only, config-only, generated-only, and path-only
  slices as suspect until they pass the bucket split challenge.
- Keep tests with the code they validate.
- Keep docs with the feature or module they describe when ownership is clear.
- Keep generated files with the source slice that regenerates them.
- Shared lockfiles, workspace manifests, or root configs may attach to one
  slice only when the dependency is clear; otherwise block or isolate them as a
  dedicated prerequisite slice.
- One file must not appear in multiple slices unless the plan explicitly says
  manual hunk split is required.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Different directories mean different PRs." | Paths are supporting evidence; intent, verification, and rollback define the split. |
| "Docs can always be one separate slice." | Docs belong with the feature or module they describe unless they have independent intent. |
| "A large branch must be split somehow." | Large size increases caution; it does not justify unsafe or artificial slices. |
| "Shared files can be copied into every slice." | Shared files need one clear owner, a prerequisite slice, or an explicit blocker. |
| "Publishing draft PRs will expose the problems for review." | Do not publish slices that fail the acceptance criteria or depend on unresolved blockers. |

## Red Flags

- The diff boundary is the working tree instead of `target_branch...source_branch`.
- A slice rationale says only "docs", "chore", "config", or a path name.
- The same file appears in multiple slices without a manual hunk-split note.
- Tests, docs, or generated files are separated from their owning code without
  evidence.
- Topology is `parallel` even though one slice depends on another.
- PR/MR URLs or issue links are reported before they exist.
- The plan uses forced history rewriting or force-push as the default path.

## Verification

- [ ] `source_branch`, `target_branch`, and merge base are explicit.
- [ ] Diff inspection uses `target_branch...source_branch`.
- [ ] Every proposed slice has intent, verification, rollback boundary, scope,
      and file list.
- [ ] Module or path boundaries are supporting evidence, not the only split
      rationale.
- [ ] No file is assigned to multiple slices without an explicit manual split
      note.
- [ ] `parallel`, `stacked`, or `blocked` topology is justified by dependency
      evidence.
- [ ] Blocked cases stay blocked instead of being guessed through.
- [ ] Each published PR/MR maps to exactly one accepted slice.

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
  - boundary_evidence:
    - primary_boundary:
    - verification_evidence:
    - rollback_evidence:
    - ownership_evidence:
    - change_type_metadata:
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
