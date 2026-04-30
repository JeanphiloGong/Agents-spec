# Split PR Publish Skill Acceptance Criteria

## Universal Acceptance Criteria

- The result names an explicit `source_branch` and `target_branch`.
- The split topology is one of `parallel`, `stacked`, or `blocked`.
- Every proposed slice has a clear intent, verification check, rollback
  boundary, scope, branch name, and file set.
- The split rationale follows the required order: intent, verification,
  rollback, ownership evidence, then change type metadata.
- Module, package, or path boundaries are treated as supporting evidence rather
  than the only split rationale.
- The result states whether it stopped at plan, executed branches, or
  published PRs or MRs.
- Blockers are listed explicitly instead of being hidden inside a vague risk
  note.
- Release tagging, hosted release creation, and release notes publication are
  absent and left to `tag-release-skill` after PRs or MRs land.

## Split Safety Criteria

- No file appears in multiple slices unless the result explicitly marks a
  manual hunk split or blocker.
- `parallel` is not used when one slice depends on another slice from the same
  source diff.
- `parallel` is not used when slices have hidden verification or rollback
  coupling.
- Shared config, lockfiles, tests, and generated files are either assigned with
  justification or surfaced as blockers.
- The result does not claim automation is safe when changes are interleaved in
  the same file.
- Change type labels such as feature, bugfix, documentation, or chore do not
  replace the required intent, verification, and rollback rationale.
- Large commit gaps or noisy history do not justify grouping changes by broad
  buckets such as all docs, all chores, or one top-level path.

## Publish Safety Criteria

- No PR or MR is published until its branch and base target are unambiguous.
- Draft mode is used by default unless the operator explicitly wants ready PRs
  or MRs.
- In stacked mode, each PR or MR base matches the actual prerequisite branch.
- The result states whether publication actually happened and includes the
  resulting URLs when available.
- Published targets are PRs or MRs only, not release tags or hosted releases.

## Reviewer Challenge Checklist

- Would another maintainer understand why these slice boundaries were chosen?
- Does each slice represent one independently reviewable, verifiable, and
  revertible intent unit?
- Is any supposedly independent slice still coupled through a hidden shared
  file?
- Should one of the slices really be a prerequisite stacked PR instead of a
  parallel PR?
- Did the result stop when automation became unsafe?
- Did release work get incorrectly included instead of handed off to
  `tag-release-skill`?

## Highest-Risk Failure Modes

- Publishing multiple PRs that still depend on unseen code left only on the
  source branch.
- Assigning a shared config or mixed file to the wrong slice.
- Splitting by module or change type while ignoring intent, verification, or
  rollback coupling.
- Using `parallel` when the real review order should be stacked.
- Creating a release from unmerged split branches before the intended PRs or
  MRs land in the release target.
- Claiming publication succeeded when branch push or CLI publish actually
  failed.
