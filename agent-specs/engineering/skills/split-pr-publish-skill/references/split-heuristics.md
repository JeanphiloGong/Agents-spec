# Split Heuristics

Use these rules before proposing or executing any split plan.

## Primary Boundary Order

Prefer boundaries in this order:

1. user or system intent, such as "add X capability", "fix Y behavior", or
   "migrate Z storage path"
2. verification boundary, meaning the checks that prove the PR works
3. rollback boundary, meaning the changes that should be reverted together
4. module, package, service, feature path, or ownership boundary as supporting
   evidence
5. change type such as feature, bugfix, documentation, or chore only as label
   or title metadata

Do not use release-note categories as the primary PR split rule. They describe
what kind of change it is; they do not prove the PR is independently
reviewable, verifiable, or revertible.

## Master PR Boundary Standard

A strong PR represents one independently reviewable, independently verifiable,
and independently revertible intent unit.

Use these questions before accepting a slice:

- What user or system outcome does this PR deliver?
- How can a reviewer verify this PR is correct after it lands?
- If this PR fails, can it be reverted without reverting unrelated outcomes?
- Are module or path boundaries supporting the intent, or merely convenient?
- Is the change type only a label, or is it being misused as the split reason?

## Strong Signals for One Slice

- changed files together deliver one clear user or system intent
- the verification plan is coherent and does not require unrelated behavior
- the rollback unit is the same as the intent unit
- backend, frontend, docs, tests, or config changes all serve the same
  user-visible or system-visible outcome
- module or path ownership aligns with the intent boundary
- the behavior can be reviewed without another slice landing first

Examples:

- A feature PR such as "add OAuth login" may include backend API, frontend UI,
  docs, and tests when they form one verifiable login capability.
- A bugfix PR such as "fix token refresh" may include server handling, client
  retry behavior, and tests when they jointly fix the same behavior.
- A chore PR such as "upgrade build tooling" should not include an unrelated UI
  bugfix because verification and rollback differ.
- A docs update that documents a newly added capability may stay with the
  feature PR; an independent docs cleanup can be its own PR.

## Signals That Require `stacked`

- slice B imports or depends on new symbols introduced by slice A
- a shared base refactor is required before a feature slice compiles cleanly
- one root config or manifest change exists only to support a later slice
- the natural review order is prerequisite first, feature second

When these signals appear, make the prerequisite slice first and target later
PRs or MRs to that branch rather than directly to the final base.

## Signals That Require `blocked`

- the same file contains interleaved changes for multiple unrelated outcomes
- the same path contains changes with different verification or rollback needs
- the same hunk edits behavior for different modules at once
- a shared config or lockfile changed for multiple slices and ownership is not
  recoverable from the diff
- generated output changed but the generating source spans more than one slice
- the branch mixes refactor and feature logic in inseparable ways

When blocked:

- stop at the split plan
- explain exactly which files or hunks prevent safe automation
- recommend manual extraction or a narrower human-confirmed split

## Ownership Rules

- Tests move with the production code they validate.
- Docs move with the slice they describe.
- Generated files move with the source slice that would regenerate them.
- Backend and frontend changes can stay together when they are required for one
  user-facing workflow.
- Module ownership is an input to the split decision, not the decision itself.
- Shared config files may:
  - attach to one slice when clearly owned by that slice
  - become a dedicated prerequisite slice
  - block the split when ownership is ambiguous

## Branch Naming

Default branch naming:

- `split/<slug>` for parallel slices
- `split/<ordinal>-<slug>` when review order matters

The slug should reflect the module or outcome, not low-level file mechanics.

## Commit Guidance

- Prefer one commit per slice when the source branch mixed unrelated work.
- Use `git-commit-skill` for final commit wording and execution.
- If a slice already exists as one clean commit range, cherry-pick is allowed.
- If commit history is mixed, derive the slice from the diff rather than from
  raw commit boundaries.

## Minimal Evidence to Return

Each slice proposal should name:

- intent
- verification check
- rollback boundary
- scope
- owning paths
- change type as metadata only
- dependent slices, if any
- whether branch creation is safe now
- whether publication is safe now
