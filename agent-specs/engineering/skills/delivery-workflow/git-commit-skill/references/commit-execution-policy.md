# Commit Execution Policy

Use this reference for everything about commit execution except the final
message template.

This policy intentionally follows
`development-skill-pack/supporting-skills/git-workflow-and-versioning`.
`commit-message-standard.md` is only the source of truth for the final
`Why / What / Impact / Tests / Refs` message format.

## Default Execution Rule

- For normal commit-stage work, full commit execution is the default outcome.
- Do not require the human to run `git add` manually when the requested scope
  is clear and approved.
- Stop at draft-only output only when the user explicitly asks for wording-only
  help, split planning, or message review without execution.
- If the current diff contains multiple independent save points, stage and
  commit them one at a time.
- Do not accumulate verified increments into one giant end-of-task commit.

## Commit Early, Commit Often

Use the save point pattern from `git-workflow-and-versioning`:

```text
Implement slice -> Test -> Verify -> Commit -> Next slice
```

Commits are save points. A completed, verified increment should normally be
committed before starting the next independent increment. If the next change
breaks something, the last known-good commit should still be easy to return to.

This does not mean committing broken checkpoints. A save point must be coherent,
reviewable, and backed by an honest verification note.

## Recommended Upstream Order

Treat the preferred task order as:

```text
worktree -> issue -> implement verified slice -> issue-gate -> commit
```

Implications:

- `git-commit-skill` is the closer for each verified save point.
- If implementation drifted materially from the tracked issue or approved
  scope, repair traceability before commit execution.
- If a feature was built through `workflow-build`, preserve the slice boundary
  unless the slice is too small to review or revert on its own.

## Branch And Worktree Check

Before staging:

1. Run `git status --short --branch`.
2. Note the current branch and whether it tracks a remote.
3. Confirm whether the working tree is mixed.
4. If unrelated changes are present, stage only the explicitly in-scope paths.
5. If the user is on a default branch and the project expects feature branches,
   surface that before committing; do not create branches unless the user asked
   for branch setup or the repo policy requires it.

Prefer short-lived feature branches when branch setup is in scope. The commit
discipline still applies when a team uses another branching model.

## Issue Gate Interaction

- Run `issue-gate-skill` before commit execution when the repository requires
  issue tracking.
- Use `input_mode=auto-infer-first`.
- If the gate returns `BLOCK`, stop commit output and report the blocker.
- If the gate returns `refs_line`, use it in `Refs` unless the repository has a
  stricter traceability rule.
- If no issue requirement is found and the change is low risk, use
  `Refs: n/a`.

## Atomic Commit Boundary Rules

Each commit should be one coherent save point: independently understandable,
reviewable, and revertible.

Prefer one commit when all of these are true:

- The diff serves one user or system intent.
- Code, tests, docs, and generated files are tightly coupled to that intent.
- Reverting the commit as a unit would make sense.
- The staged diff is small enough to review without hiding unrelated behavior.

Split into multiple commits when any of these are true:

- Feature work and refactoring are mixed.
- Formatting-only churn is mixed with behavior changes.
- Dependency or build configuration changes are mixed with product logic.
- Tests cover a separate behavior slice from later implementation changes.
- Generated files can be regenerated from a prior source change and are large
  enough to obscure the human-authored diff.
- The diff contains independent UI, API, storage, or documentation intents.
- A partial revert would be likely during review or rollback.

Do not split when separation would produce commits that do not compile, do not
pass relevant tests, or cannot be understood without a later commit.

## Keep Concerns Separate

Do not mix these concerns in one commit unless they are structurally
inseparable:

- feature behavior and refactoring
- formatting-only churn and behavior changes
- dependency or build configuration changes and product logic
- generated files that obscure the human-authored source change
- unrelated UI, API, storage, or documentation intents

Small local cleanup can stay with a feature commit when it is directly needed
for the feature and does not distract from review.

## Size Your Changes

Use size as a warning signal, not as the only split rule.

Target about 100 changed lines per commit or PR. Changes over about 1000 lines
should be split. Use the splitting strategies from `workflow-review` when a
change is too large.

```text
~100 lines  -> Easy to review, easy to revert
~300 lines  -> Acceptable for a single logical change
~1000 lines -> Split into smaller changes
```

If a large commit remains intentionally unsplit, record the reason in the split
decision rationale.

## Splitting Strategies

Use the smallest strategy that preserves working, reviewable commits:

- Stack: submit one small change, then build the next change on top of it.
- By file group: separate changes that need different reviewers or ownership.
- Horizontal: land shared code, contracts, or stubs first, then consumers.
- Vertical: split a feature into smaller full-stack slices.

Large changes are acceptable when they are mostly complete file deletions,
generated output, or automated refactors where the reviewer verifies the intent
instead of every changed line.

## Staging Policy

- Stage only approved, in-scope files by default.
- Prefer explicit pathspecs over `git add -A`.
- Use `git add -A` only when the entire working tree is confirmed in scope.
- Ignore unrelated unstaged changes.
- If a file mixes in-scope changes with unrelated user edits, ask once before
  staging that file.
- Do not broaden scope silently just to make the diff look cleaner.

When partial staging is needed, prefer non-interactive commands where possible.
If interactive staging is the only safe path, stop and ask the user to confirm
or perform it manually.

## Pre-Commit Hygiene

Before every executed commit:

1. Inspect staged scope:
   `git diff --cached`, `git diff --cached --stat`, and
   `git diff --cached --name-status`.
2. Check the staged diff for obvious secrets or credentials.
3. Run the most relevant tests or checks for the staged change.
4. If tests/checks are not run, record the operational reason in the execution
   report and state the unverified behavior boundary honestly in `Tests`; do
   not invent a passing result.
5. Confirm generated files, lockfiles, snapshots, and schema outputs are
   expected by the repository before including them.

For documentation-only or metadata-only changes, `git diff --cached --check`
is usually the minimum useful check.

## Generated Files And Artifacts

- Commit generated files only when the repository expects them, such as
  lockfiles, generated schemas, checked-in fixtures, migrations, or approved
  snapshots.
- Do not commit build output, local environment files, editor state, cache
  directories, or machine-specific artifacts.
- If generated files are required but missing, stop and run the generation step
  before committing when feasible.

## Execution Steps

For each commit slice:

1. Select the in-scope files for that slice.
2. Confirm the slice is one logical change and satisfies the size guidance.
3. Stage only those files.
4. Run pre-commit hygiene.
5. Write the final commit message using `commit-message-standard.md`; keep
   routine commands and pass or fail results in the execution report.
6. Run `git commit -F <file>`.
7. Report commit hash, staged scope, tests, `Refs`, and remaining unstaged
   scope.

If multiple commits are required, repeat these steps one slice at a time and
show the remaining unstaged scope after each commit.

## Change Summary After Commit

After any executed commit, provide a concise summary in the spirit of
`git-workflow-and-versioning`:

```text
CHANGES COMMITTED:
- <path>: <what changed>

THINGS I DIDN'T TOUCH:
- <path or area>: <why out of scope>

POTENTIAL CONCERNS:
- <risk, follow-up, or verification gap>
```

Omit empty sections, but always make verification gaps explicit.

## Worktree And Sandbox Notes

- In git worktree environments, `git add` may require elevated capability
  because Git writes metadata under `.git/worktrees/...`.
- Treat that as a normal execution constraint, not an exceptional failure.
- If the environment blocks `git add` or `git commit`, surface the exact
  blocker and continue only after the required capability is available.

## Things This Skill Should Not Do

- It should not amend, rebase, squash, or force-push unless the user explicitly
  asks.
- It should not auto-stage unrelated files.
- It should not fabricate `Refs` data when traceability is missing.
- It should not convert wording-only requests into real commit execution.
- It should not turn a mixed working tree into one broad commit just because
  the user asked to "commit everything" unless the user confirms that scope.
- It should not use the message template as a substitute for commit discipline:
  the template explains the commit, but the workflow determines the commit
  boundary.
