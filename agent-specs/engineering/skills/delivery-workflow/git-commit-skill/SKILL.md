---
name: git-commit-skill
description: v0.2.3 - Draft, split, and execute atomic scoped Git commits with issue traceability and structured Why/What/Impact/Tests/Refs bodies. Use when preparing final commits, reviewing commit wording, staging approved files, or enforcing repository commit conventions.
---

# Git Commit Skill

## Overview

Prepare commit-stage work as a verified, traceable save point. This skill
decides whether the current diff should be committed, split, or only drafted;
then it stages only approved in-scope files and writes a repository-quality
commit message with `Why / What / Impact / Tests / Refs`.

Use the existing commit-message and execution references for details. The
always-loaded behavior is: inspect first, preserve unrelated changes, verify
traceability, commit one logical slice at a time, and report exactly what
happened.

## When to Use

- The user asks to commit, stage, or prepare final commit wording.
- The current work needs a Conventional Commit subject and structured body.
- A mixed diff needs split advice before staging.
- A repository requires issue traceability before commit.
- The user wants wording-only review without executing `git commit`.

**When NOT to use:** implementation work, CI repair, code review fixes,
force-pushes, rebases, published-history rewrites, or issue creation that is
not part of commit traceability. Use `issue-gate-skill` directly for standalone
issue mapping, and use review or CI skills for review/CI failures.

## Reference Map

- `references/commit-message-standard.md`
  Read when writing the subject, body, examples, or section quality checks.
- `references/commit-execution-policy.md`
  Read when deciding atomic boundaries, save-point cadence, staging policy,
  pre-commit hygiene, issue-gate interaction, or worktree handling.

## Trigger Examples

- "帮我把这次改动提交掉"
- "先看一下这些修改要不要拆成两个 commit"
- "按仓库规范帮我写 commit message"
- "commit 前先确认 issue，然后直接帮我提交"
- "只给我 commit wording，不要真的执行 commit"

## Fixed Defaults

- commit standard: Conventional Commits unless the repository explicitly uses
  another convention
- commit body format: exact `Why / What / Impact / Tests / Refs`
- section rule: each required body section appears exactly once; multiple
  checks are bullets under the single `Tests` section
- execution mode: full commit execution for normal commit-stage work
- split policy: atomic save-point commits, based on
  `commit-execution-policy.md`
- size policy: target about 100 changed lines, accept about 300 for one
  logical change, split around 1000 or more unless generated or inseparable
- traceability mode: run `issue-gate-skill` first when the repo requires issue
  tracking
- staging policy: stage only approved, in-scope files
- unrelated changes: ignore by default
- mixed authorship files: ask once before staging
- low-risk traceability fallback: `Refs: - n/a`

## The Operating Loop

1. Classify the requested commit mode.
   - Use `execute` for normal commit-stage requests.
   - Use `draft_only` when the user only wants wording.
   - Use `split_only` when the user only wants commit boundary advice.
2. Inspect branch, worktree, and diff before staging.
   - Read `references/commit-execution-policy.md`.
   - Run the branch/worktree checks described there.
   - Identify in-scope files, unrelated dirty files, generated files, and
     mixed-authorship files.
   - Treat the save-point order as:
     `worktree -> issue -> verified slice -> issue-gate -> commit`.
3. Run traceability gate when required.
   - Use `issue-gate-skill` with `input_mode=auto-infer-first`.
   - If the gate returns `BLOCK`, stop before staging or committing.
   - If the gate returns `refs_line`, use that value in `Refs`.
4. Decide whether the diff must split.
   - Separate feature work, refactors, formatting, dependencies, generated
     artifacts, and unrelated docs unless the execution policy says they are
     inseparable.
   - Keep tightly coupled code, tests, and docs together when they form one
     reviewable and revertible save point.
   - Use stack, file-group, horizontal, or vertical splitting when the diff is
     too large or mixed by intent.
5. Write the subject and body.
   - Choose the commit type and optional scope.
   - Keep the subject imperative and one sentence.
   - Use the exact body section order: `Why`, `What`, `Impact`, `Tests`,
     `Refs`.
   - Put multiple commands or checks as bullets under the single `Tests`
     section.
6. Execute the selected path.
   - For `draft_only` or `split_only`, return the draft or split plan without
     staging.
   - For `execute`, stage only approved in-scope files for one slice, run the
     required hygiene checks, write the final message to a file, and run
     `git commit -F <file>`.
7. Report the save point.
   - Include commit hash when committed.
   - Include staged scope, traceability status, tests status, and any remaining
     unstaged scope.

## Decision Points

- If the worktree contains unrelated dirty files, keep them unstaged and name
  them in the result.
- If one file mixes in-scope and unrelated edits, ask once before staging that
  file or require a narrower patch.
- If `issue-gate-skill` returns `BLOCK`, stop commit execution and report the
  blocker.
- If traceability is optional and no canonical issue applies, use
  `Refs: - n/a`; do not invent an issue.
- If the diff is one logical change around 300 changed lines, one commit is
  acceptable when the verification and rollback boundary are still clear.
- If the diff is around 1000 changed lines or mixes unrelated concerns, split
  unless the content is generated or structurally inseparable.
- If the user asked for wording-only output, do not stage files even when the
  message is ready.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "All the files are already dirty, so staging everything is fastest." | Dirty is not the same as in scope. Stage only approved files for the current save point. |
| "The issue is obvious, so I can write a plausible Refs line." | Traceability must come from `issue-gate-skill`, repository evidence, or `n/a`; never invent issue links. |
| "This is just docs, so a one-line commit is fine." | Repository history still needs Why, What, Impact, Tests, and Refs. |
| "The diff is large but it is easier to review as one commit." | Large mixed commits hide intent and rollback boundaries; split unless the change is one inseparable unit. |
| "I can add another Tests section for the second command." | The body has one `Tests` section with multiple bullets. |

## Red Flags

- `git add .` or broad staging appears while unrelated dirty files exist.
- The commit body lacks one of `Why`, `What`, `Impact`, `Tests`, or `Refs`.
- The same required section appears more than once.
- The subject explains cause and effect instead of the action.
- `Refs` names an issue that was not verified or supplied.
- Independent feature, refactor, formatting, dependency, or generated-file
  changes are bundled together for speed.
- Tests are marked as "not requested" instead of giving a real operational
  reason.

## Verification

- [ ] Branch, worktree, and diff were inspected before staging.
- [ ] Staged files are limited to the approved in-scope slice.
- [ ] Split decision is recorded with size and concern rationale.
- [ ] Traceability is verified through `issue-gate-skill`, repository evidence,
      explicit user input, or `Refs: - n/a`.
- [ ] Commit message has exactly one `Why`, `What`, `Impact`, `Tests`, and
      `Refs` section in that order.
- [ ] Required pre-commit hygiene checks from
      `references/commit-execution-policy.md` were run or explicitly blocked.
- [ ] Execution result reports commit hash, test status, and remaining
      unstaged scope.

## Output Format

```text
## Commit Mode
- mode: execute | draft_only | split_only
- traceability_status:

## Split Decision
- split_required: yes | no
- rationale:
- staged_scope:
- size_assessment:
- split_strategy:

## Commit Message
- subject:
- refs:
- preview:

## Execution Result
- committed: yes | no
- commit_hash:
- tests_status:
- notes:
```

## Guardrails

- Do not stage unrelated changes by default.
- Do not commit files that mix in-scope work and unrelated user changes without
  confirmation.
- Do not continue to commit execution when `issue-gate-skill` returns `BLOCK`.
- Do not write single-line commit messages.
- Do not duplicate body sections; `Why`, `What`, `Impact`, `Tests`, and `Refs`
  must each appear exactly once.
- Do not create a second `Tests` section for another command; add another
  bullet under the existing `Tests` section.
- Do not squash independent save points into one broad commit merely for speed.
- Do not accumulate verified increments into a giant end-of-task commit.
- Do not split tightly coupled code, tests, and docs when they form one
  reviewable and revertible slice.
- Do not mix feature work, refactors, formatting-only changes, generated
  artifacts, or dependency changes unless the execution policy says they are
  inseparable.
- Do not treat size limits as hard math; use them as review and rollback risk
  signals.
- Do not use `"not requested"` as the explanation for missing tests; use a real
  operational reason.
- Do not require an AI session identifier unless the repository explicitly
  requires it.
- Do not amend, rebase, or force-push unless the user explicitly asks.
- Do not turn commit subjects into cause-and-effect sentences; keep reasons in
  `Why` and `Impact`.
- If worktree or sandbox constraints block `git add` or `git commit`, surface
  the exact blocker and continue only after the required capability is
  available.
