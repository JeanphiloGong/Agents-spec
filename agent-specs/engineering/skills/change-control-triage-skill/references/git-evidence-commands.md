# Git Evidence Commands

Use these commands to collect evidence for classification. Prefer the smallest evidence set that is sufficient.

## A) Working Tree (Default)

1. Status
   - `git status --porcelain`
2. File inventory
   - `git diff --name-status`
   - `git diff --stat`
3. Spot-check important diffs (choose suspicious/high-risk files)
   - `git diff -- <path>`

## B) PR-style Range

If you have a base branch:
- `git diff --name-status origin/main...HEAD`
- `git diff --stat origin/main...HEAD`
- `git diff origin/main...HEAD -- <path>`

Fallbacks:
- replace `origin/main` with `main` if no remote exists

## C) Single Commit

To triage a single commit `<sha>`:
- `git show --name-status --stat <sha>`
- `git show <sha> -- <path>`

Or treat it as a range:
- `git diff --name-status <sha>^..<sha>`

## D) Optional Context

Helpful but optional:
- Identify what a file is referenced by:
  - `rg -n \"<symbol_or_path_fragment>\" -S .`
- Locate tests near a file:
  - `rg -n \"describe\\(|it\\(|Test\" -S <test_dir>`
