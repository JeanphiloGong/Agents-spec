---
name: git-commit-skill
description: v0.2.0 - Draft, split, and execute scoped Git commits with issue traceability and structured Why/What/Impact/Tests/Refs bodies; use when preparing final commits, reviewing commit wording, or enforcing repo commit conventions.
---

# Git Commit Skill

## Trigger and Scope

Use this skill when the user needs help with commit-stage work, including:

- drafting a final commit message
- reviewing or correcting commit wording
- deciding whether changes should be split into multiple commits
- staging approved files and executing `git commit`
- enforcing repository commit conventions and traceability rules

In scope:
- commit wording and split advice
- final commit execution for approved in-scope files
- pre-commit traceability checks through `issue-gate-skill`
- commit body construction with structured `Why / What / Impact / Tests / Refs`

Out of scope:
- inventing task scope after implementation is already done
- auto-fixing code review findings or CI failures
- force-pushing, amending history, or rewriting published commits unless the
  user explicitly asks
- staging unrelated user changes by default

## Core Purpose

- Preserve traceability from task or issue to commit.
- Produce clear, reviewable commit messages that explain why the change exists.
- Keep staging scope explicit and conservative.
- Treat full commit execution as the default outcome for real commit-stage work,
  not as a separate opt-in after drafting.

## Bundled Resources

- `references/commit-message-standard.md`
  Read when writing the subject, body, or examples for the commit message.
- `references/commit-execution-policy.md`
  Read when deciding split boundaries, staging policy, issue-gate interaction,
  or worktree/sandbox handling.

## Concrete Trigger Examples

Use this skill for prompts such as:

- "帮我把这次改动提交掉"
- "先看一下这些修改要不要拆成两个 commit"
- "按仓库规范帮我写 commit message"
- "commit 前先确认 issue，然后直接帮我提交"
- "只给我 commit wording，不要真的执行 commit"

## Fixed Defaults

- commit standard: Conventional Commits unless the repository explicitly uses
  another convention
- commit body format: exact `Why / What / Impact / Tests / Refs`
- execution mode: full commit execution for normal commit-stage work
- traceability mode: run `issue-gate-skill` first when the repo requires issue
  tracking
- staging policy: stage only AI-authored, approved, in-scope files
- unrelated changes: ignore by default
- mixed authorship files: ask once before staging
- low-risk traceability fallback: `Refs: - n/a`

## Workflow

1. Clarify operating mode.
   - Distinguish between:
     - full commit-stage execution
     - wording-only review
     - split planning without execution
   - If the user asks for a normal commit-stage outcome, default to full
     execution.
2. Confirm upstream workflow state.
   - Treat the recommended order as:
     `worktree -> issue -> implement -> issue-gate -> commit`
   - This skill is the final commit-stage closer, not the place where task
     scope is first defined.
   - If implementation drifted materially from the issue or agreed scope,
     require that traceability to be repaired before finalizing the commit.
3. Run pre-commit traceability gate when required.
   - Use `issue-gate-skill` with `input_mode=auto-infer-first`.
   - If the gate returns `BLOCK`, stop commit output and surface the blocker.
   - If the gate returns `refs_line`, prefer that value in `Refs`.
4. Review the diff and propose split boundaries.
   - Separate logically independent changes.
   - Keep one commit focused on one coherent task or delivery slice.
   - Read `references/commit-execution-policy.md` when split or staging
     boundaries are ambiguous.
5. Resolve the subject line.
   - Choose the commit type and optional scope.
   - Write one sentence in imperative mood.
   - Read `references/commit-message-standard.md` when you need the detailed
     subject checklist, type hints, or examples.
6. Build the body.
   - Use the exact section order:
     `Why`, `What`, `Impact`, `Tests`, `Refs`.
   - Keep rationale and impact explicit.
   - Read `references/commit-message-standard.md` when you need the section
     quality bar or full examples.
7. Decide execution path.
   - wording-only or split-only request:
     - return the draft message and split advice without staging or committing
   - full execution:
     - stage only approved in-scope files
     - write the final message to a file
     - run `git commit -F <file>`
     - report commit hash, staged file scope, and traceability
8. Report the result.
   - Include the final message or draft preview.
   - Include whether execution happened.
   - Include traceability status and `Refs`.

## Output Contract

```text
## Commit Mode
- mode: execute | draft_only | split_only
- traceability_status:

## Split Decision
- split_required: yes | no
- rationale:
- staged_scope:

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
- Do not commit files that mix AI-authored and unrelated user changes without
  confirmation.
- Do not continue to commit execution when `issue-gate-skill` returns `BLOCK`.
- Do not write single-line commit messages.
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
