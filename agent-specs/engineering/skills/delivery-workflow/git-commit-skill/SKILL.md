---
name: git-commit-skill
description: v0.2.7 - Draft, split, and execute atomic scoped Git commits with behavior-first Why/What/Impact/Tests bodies, distinct effect and verification evidence, and Refs only for verified references. Use when preparing final commits, reviewing commit wording, staging approved files, or enforcing repository commit conventions.
---

# Git Commit Skill

## Overview

Prepare commit-stage work as a verified, traceable save point. This skill
decides whether the current diff should be committed, split, or only drafted;
then it stages only approved in-scope files and writes a repository-quality
commit message with concrete `Why / What / Impact / Tests` evidence and a
`Refs` section only when a real, verified reference exists.
The sections must tell one causal story without replacing observable changes
with intent summaries such as "clarify responsibility" or "improve
consistency." Each supporting detail appears once, in the section that owns
it; repeat the core behavior only when needed to connect the causal chain.
Describe background conditions, behavior changes, visible results, and tested
boundaries in project language. Leave routine internal fields, file lists,
helper names, commands, and pass markers to the diff or execution report.

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
- commit body format: exact `Why / What / Impact / Tests`, followed by `Refs`
  only when a real, verified reference exists
- section rule: each required body section appears exactly once; optional
  `Refs` appears at most once; multiple independent tested boundaries are
  bullets under the single `Tests` section
- evidence rule: derive the subject and every section from the user request,
  issue, staged diff, or verification results
- density rule: use one bullet with one sentence per section by default; add a
  second bullet only for a separate fact required to understand the commit
- language rule: default every section to behavior-level prose; keep an
  internal identifier only when it is a public contract, the direct change
  object, or necessary to distinguish a state transition
- impact rule: state the post-merge observable effect, compatibility result,
  or explicitly preserved boundary; do not describe how the change was
  verified
- tests rule: state the condition, scenario, or boundary actually verified
  and its expected result when material; do not repeat `Impact`, claim
  unverified behavior, or replace evidence with a command
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
- optional traceability fallback: omit the entire `Refs` section

## Impact And Tests Boundary

| Section | Write | Do not write |
|---|---|---|
| `Impact` | Post-merge observable effects, compatibility, and explicitly preserved boundaries | Test commands, test files, or verification steps |
| `Tests` | Conditions, scenarios, and expected results actually verified | Generic "tested" claims, change benefits, repeated `Impact`, or command-only lists |

Read the two sections independently before accepting them. `Impact` must still
explain who or what is affected when `Tests` is hidden. `Tests` must still show
what condition was exercised and what result was expected when `Impact` is
hidden. If one sentence could fill both sections unchanged, rewrite it.

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
   - When repository language is unclear, sample recent non-merge commits for
     concrete verbs, background phrasing, behavior vocabulary, and testing
     language. Do not replace this skill's required four-section core or its
     conditional `Refs` rule.
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
5. Build the evidence card before writing prose.
   - Read `references/commit-message-standard.md`.
   - Record the concrete primary action and object from the staged diff.
   - Record the previous behavior or pressure, the resulting behavior or
     structure, the material impact boundary, the behavior exercised by tests,
     the checks that actually ran, and verified references.
   - Keep tested behavior separate from execution evidence: `Tests` explains
     coverage, while commands and pass or fail results belong in the execution
     report.
   - Select the smallest useful fact for each message section; do not render
     every fact collected in the evidence card.
6. Write and challenge the subject and body.
   - Choose the commit type and optional scope.
   - Write the shortest natural subject that still names the concrete action
     and recognizable object.
   - If the subject only states a goal or quality, replace it with the actual
     rename, extraction, move, removal, behavior correction, or other staged
     action.
   - Omit internal fields, files, helper names, and call-site counts that the
     diff already shows. Keep an identifier only when it materially improves
     recognition under the language rule.
   - Render the exact core section order: `Why`, `What`, `Impact`, `Tests`.
     Append `Refs` only when verified traceability exists.
   - Give each rendered section one job: reason, change, effect, proof, or
     reference.
     Do not repeat tests, call-site counts, assertions, or state tables across
     sections.
   - In `Tests`, name the behavior or boundary covered. Add the expected result
     or prevented failure when that is the important regression signal. Do not
     write a command, `PASS`, or "added a test" there.
   - Make the sections read as one chain: previous problem -> implemented
     change -> observable result or preserved boundary -> proof, followed by a
     reference only when one exists.
7. Execute the selected path.
   - For `draft_only` or `split_only`, return the draft or split plan without
     staging.
   - For `execute`, stage only approved in-scope files for one slice, run the
     required hygiene checks, write the final message to a file, and run
     `git commit -F <file>`.
8. Report the save point.
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
- If traceability is optional and no verified issue, spec, incident, or PR
  applies, omit the entire `Refs` section; do not invent a reference or render
  a placeholder.
- If the primary action or object cannot be named from the staged diff, inspect
  again instead of substituting an intent phrase.
- If a precise identifier makes the subject long or hard to read, use the
  established project noun in the subject and leave the identifier to `What`
  or the diff.
- If a test fact appears in `Why`, `What`, or `Impact`, move the covered
  behavior to `Tests` unless the test itself is the primary change. Keep the
  command and result in the execution report.
- If call-site counts or individual assertions do not change the reader's
  understanding, omit them.
- If the reason or impact cannot be supported, state the narrow verified
  boundary; do not invent a benefit or failure mode.
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
| "The issue is obvious, so I can write a plausible Refs line." | Traceability must come from `issue-gate-skill`, repository evidence, or explicit user input. If it is optional and absent, omit `Refs`. |
| "A fixed template is easier to validate, so an empty Refs needs n/a." | A placeholder records template administration, not project knowledge. Keep the traceability check, but omit the section when no reference exists. |
| "This is just docs, so a one-line commit is fine." | Repository history still needs Why, What, Impact, and Tests; add Refs only for a real reference. |
| "Clarify responsibility summarizes a rename." | Intent is not an observable change. Name the renamed object, and use the real identifier when it improves recognition. |
| "The body can report that the change improves consistency." | Broad quality claims hide behavior. State the previous and resulting behavior or the exact boundary that stayed unchanged. |
| "More identifiers and state values make the message more concrete." | Detail is useful only in its owning section. Prefer the shortest established project terms that preserve meaning. |
| "Every discovered fact should appear in the body." | The evidence card is an input filter, not an output checklist. Keep only what a future reader needs. |
| "The diff is large but it is easier to review as one commit." | Large mixed commits hide intent and rollback boundaries; split unless the change is one inseparable unit. |
| "Tests are already in the execution report." | The repository requires durable verification evidence in the single Tests section. |
| "I can add another Tests section for the second command." | Commands stay in the execution report. The body has one Tests section for covered behavior. |
| "Tests should list the command that passed." | Commands prove execution elsewhere. Commit prose should state the behavior covered and the result when it matters. |
| "Tests should say that I added regression coverage." | That narrates the test diff. Name the behavior or boundary the coverage protects. |
| "Internal names make every section more concrete." | Internal inventory is already visible in the diff. Keep only names that carry contract or state-transition meaning. |

## Red Flags

- `git add .` or broad staging appears while unrelated dirty files exist.
- The commit body lacks one of `Why`, `What`, `Impact`, or `Tests`.
- The same required section appears more than once.
- The subject names an intention or quality such as "明确职责", "优化逻辑",
  "提升一致性", or "clarify behavior" without naming the staged action.
- The subject coins a dense noun phrase such as "完成态缓存恢复函数" instead
  of using an established project term or a natural verb phrase.
- The subject cannot answer "what did this commit do?" without reading the
  body.
- `Why` restates the subject instead of naming the previous problem or trigger.
- `Why` explains why a test was added or speculates about a future regression.
- `What` avoids the actual behavior, structure, identifier, or state value.
- `What` reports call-site counts or test assertions that belong in the diff or
  `Tests`.
- `Impact` claims a generic benefit instead of an observable result or
  preserved boundary.
- `Impact` repeats a state-by-state result table for a behavior-preserving
  refactor.
- `Refs` is empty, contains `n/a` or `none`, or names a reference that was not
  verified or supplied.
- Independent feature, refactor, formatting, dependency, or generated-file
  changes are bundled together for speed.
- Tests are marked as "not requested" instead of giving a real operational
  reason.
- `Tests` lists commands, `PASS`, test file names, or "added coverage" without
  naming the behavior or boundary exercised.
- Internal fields, helpers, paths, or call-site counts appear without explaining
  their behavior-level significance.

## Verification

- [ ] Branch, worktree, and diff were inspected before staging.
- [ ] Staged files are limited to the approved in-scope slice.
- [ ] Split decision is recorded with size and concern rationale.
- [ ] The subject names the primary staged action and object rather than its
      intended quality.
- [ ] The subject uses natural project language and contains no coined noun
      stack.
- [ ] `Why -> What -> Impact` forms a factual cause-and-result chain.
- [ ] Commit message has exactly one `Why`, `What`, `Impact`, and `Tests`
      section in that order; `Refs` appears after `Tests` only when verified
      traceability exists.
- [ ] Every claim is grounded in the request, issue, staged diff, or tests.
- [ ] Each supporting detail appears in only one owning section, with one
      bullet per section unless a second independent fact is necessary.
- [ ] `Tests` states the behavior or boundary exercised and includes the
      expected result when it is material; commands and results stay in the
      execution report.
- [ ] `Impact` remains meaningful without test context, while `Tests` remains
      meaningful without impact context by naming an exercised condition and
      expected result.
- [ ] Internal identifiers appear only when they carry public contract,
      change-object, or state-transition meaning.
- [ ] Traceability is verified through `issue-gate-skill`, repository evidence,
      or explicit user input; when optional and absent, the message omits
      `Refs` entirely.
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
- refs: <omit this line when no verified reference exists>
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
- Do not duplicate body sections; `Why`, `What`, `Impact`, and `Tests` must each
  appear exactly once, while `Refs` appears at most once when a verified
  reference exists.
- Do not render an empty `Refs` section or use `n/a`, `none`, or another
  placeholder as traceability.
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
- Do not put routine commands, `PASS` markers, or test-file inventory in the
  commit message; report them after execution.
- Do not use the same sentence or claim for `Impact` and `Tests`; effect and
  verification are separate evidence.
- Do not require an AI session identifier unless the repository explicitly
  requires it.
- Do not amend, rebase, or force-push unless the user explicitly asks.
- Do not use an intention, benefit, or quality claim as a substitute for the
  concrete action and object in the subject.
- Do not treat specificity as permission to pack identifiers, state values,
  call-site counts, and assertions into every section.
- Do not invent Chinese domain labels by stacking translated technical nouns;
  reuse established repository terms or leave code values unchanged.
- Do not turn commit subjects into cause-and-effect sentences; keep reasons in
  `Why` and consequences in `Impact`.
- Do not invent a story unsupported by the staged change and its available
  evidence.
- If worktree or sandbox constraints block `git add` or `git commit`, surface
  the exact blocker and continue only after the required capability is
  available.
