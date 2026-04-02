# Commit Execution Policy

Use this reference when deciding staging scope, split boundaries, traceability,
or whether the skill should execute the commit directly.

## Default Execution Rule

- For normal commit-stage work, full commit execution is the default outcome.
- Do not require the human to run `git add` manually when the requested scope
  is clear and approved.
- Stop at draft-only output only when the user explicitly asks for wording-only
  help, split planning, or message review without execution.

## Recommended Upstream Order

Treat the preferred task order as:

```text
worktree -> issue -> implement -> issue-gate -> commit
```

Implications:

- `git-commit-skill` is the closer of commit-stage work.
- If implementation drifted materially from the tracked issue or approved
  scope, repair traceability before commit execution.

## Issue Gate Interaction

- Run `issue-gate-skill` before commit execution when the repository requires
  issue tracking.
- Use `input_mode=auto-infer-first`.
- If the gate returns `BLOCK`, stop commit output and report the blocker.
- If the gate returns `refs_line`, use it in `Refs` unless the repository has a
  stricter traceability rule.

## Split Guidance

- Use one commit per coherent task, fix, or delivery slice.
- Split when one diff contains independently reviewable or revertible changes.
- Keep tightly coupled code, tests, and docs together when they serve the same
  task.
- Avoid splitting so aggressively that traceability becomes fragmented.

## Staging Policy

- Stage only approved, in-scope, AI-authored files by default.
- Ignore unrelated unstaged changes.
- If a file mixes AI-authored changes with unrelated user edits, ask once
  before staging that file.
- Do not broaden scope silently just to make the diff look cleaner.

## Execution Steps

1. Select the in-scope files.
2. Stage only those files.
3. Write the final commit message to a file.
4. Run `git commit -F <file>`.
5. Report the commit hash, staged scope, and `Refs`.

## Worktree and Sandbox Notes

- In git worktree environments, `git add` may require elevated capability
  because Git writes metadata under `.git/worktrees/...`.
- Treat that as a normal execution constraint, not an exceptional failure.
- If the environment blocks `git add` or `git commit`, surface the exact
  blocker and continue only after the required capability is available.

## Things This Skill Should Not Do

- It should not amend, rebase, or force-push unless the user explicitly asks.
- It should not auto-stage unrelated files.
- It should not fabricate `Refs` data when traceability is missing.
- It should not convert wording-only requests into real commit execution.
