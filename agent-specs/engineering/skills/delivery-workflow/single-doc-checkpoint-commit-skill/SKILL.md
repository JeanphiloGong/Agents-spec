---
name: single-doc-checkpoint-commit-skill
description: v0.1.1 - Commit exactly one tutorial or learning document checkpoint with structured freeze metadata. Use when a single Markdown learning document has reached one verified Freeze/Checkpoint and the document body should stay reader-friendly while Pressure/Naive/Break/Change/Check/Freeze/Still-lacks/Next are recorded in the Git commit message.
---

# Single Doc Checkpoint Commit Skill

## Overview

Commit one learning document checkpoint as a traceable Git save point. This
skill is for tutorial and learning-asset documents whose public body should
read naturally, while the structured teaching fields live in the commit
message.

The commit is not a normal code commit. Its job is to make the learning ladder
recoverable from Git history: what pressure this checkpoint answered, what the
previous baseline could do, what broke, what changed, how it was checked, what
is now frozen, what still lacks, and what comes next.

## When to Use

- A single Markdown tutorial document has completed one `Freeze This Checkpoint`,
  `Checkpoint`, or equivalent reader-facing freeze.
- A from-scratch tutorial step should be saved as a document-history
  checkpoint.
- A learning asset document needs a Git save point after one coherent teaching
  checkpoint.
- The document body should stay natural and human-readable, while structured
  teaching metadata should be captured in the commit message.

**When NOT to use:** code commits, multi-file documentation changes, generated
docs, broad README updates, issue traceability commits, release tags,
formatting-only sweeps, or mixed worktrees where the target document cannot be
isolated. Use `git-commit-skill` for normal code or multi-file delivery
commits.

## Checkpoint Commit Contract

One checkpoint commit must satisfy all of these:

- exactly one document file is staged
- the staged diff represents one learning checkpoint
- the document body remains reader-facing, not a template-field dump
- the commit body records the internal teaching fields
- validation is honest and specific to the document checkpoint
- unrelated dirty files remain unstaged

The required commit-message fields are:

- `Pressure`
- `Naive`
- `Break`
- `Change`
- `Check`
- `Freeze`
- `Still lacks`
- `Next`

Optional fields are allowed only when useful:

- `Can now`
- `Validation`
- `Notes`

## The Operating Loop

1. Classify the request.
   - Use `execute` when the user asks to stage and commit the document
     checkpoint.
   - Use `draft_only` when the user asks only for the checkpoint commit
     message.
   - Use `review_only` when the user wants to know whether a document is ready
     for a checkpoint commit.
2. Identify the single target document.
   - Prefer the explicit path supplied by the user.
   - If no path is supplied, inspect the dirty worktree and choose only when
     exactly one Markdown or documentation file is in scope.
   - Stop if multiple candidate documents exist.
3. Inspect the worktree and diff.
   - Run `git status --short`.
   - Inspect the target diff.
   - Confirm the diff is only one checkpoint and does not include unrelated
     edits.
   - Do not stage or commit code files, cache files, generated output, or
     unrelated documents.
4. Check document-body hygiene.
   - Confirm the public body does not leak internal scaffolding such as
     `Step Self-Review` or yes/no compliance bullets.
   - For from-scratch tutorial documents, prefer natural paragraphs, code
     blocks, `Checkpoint`, `Try This`, or `Before Moving On` over repeated
     field labels.
   - If structured fields intentionally appear in the public body, require
     explicit user intent or a structured-audit audience.
5. Extract checkpoint fields.
   - Derive `Pressure`, `Naive`, `Break`, `Change`, `Check`, `Freeze`,
     `Still lacks`, and `Next` from the document diff, the visible checkpoint
     text, or explicit user input.
   - If any required field cannot be supported by the document or user input,
     stop and ask for the missing checkpoint fact.
6. Validate the checkpoint.
   - Run `git diff --check -- <target-document>` for unstaged review.
   - After staging, run `git diff --cached --check`.
   - Run any document-specific check the repository makes obvious.
   - If no runnable check applies, record a real docs-only validation reason.
7. Stage only the target document.
   - Use an explicit pathspec.
   - Never use `git add .` for this skill.
   - If the file mixes checkpoint and unrelated edits, stop and ask for a
     narrower patch or user confirmation.
8. Commit or return the draft.
   - Write the commit message using the checkpoint message format.
   - In `draft_only` or `review_only`, do not stage or commit.
   - In `execute`, commit with `git commit -F <message-file>`.
9. Report the result.
   - Include commit hash when committed.
   - Name the target document, frozen checkpoint, validation performed, and any
     remaining unstaged files.

## Decision Points

- If the diff includes more than one document, split the checkpoint commits.
- If the diff includes code or runnable project files, use `git-commit-skill`
  or split code and document work first.
- If the document has no clear checkpoint result, do not invent one; ask for
  the freeze statement.
- If the document body contains internal template fields only because the
  tutorial was generated mechanically, fix or request a body cleanup before
  committing.
- If the user wants a normal repository commit with issue traceability, use
  `git-commit-skill`.
- If the user wants a tag for a reusable checkpoint after review, use
  `tag-release-skill` after the checkpoint commit exists.

## Commit Message Format

Use this subject shape:

```text
docs(tutorial): freeze <checkpoint-name>
```

Use `docs(asset)` when the document is a learning asset but not a tutorial.

Use this body shape:

```text
Pressure:
- ...

Naive:
- ...

Break:
- ...

Change:
- ...

Check:
- ...

Freeze:
- ...

Still lacks:
- ...

Next:
- ...
```

Do not use the normal `git-commit-skill` body for this skill. The checkpoint
body is the source of truth for learning-history traceability.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "It is just a doc, so a one-line commit is enough." | The point is to preserve the learning checkpoint, not just the file diff. |
| "The fields should stay in the tutorial so reviewers can see them." | The public document should teach readers; the commit message can carry the internal structure. |
| "I can include the matching code files too." | This skill is single-document only. Use a normal commit skill for code. |
| "Two tutorial steps changed, but they are in one file." | One checkpoint commit should record one freeze. Split or revise the diff. |
| "The checkpoint is obvious from the title." | Git history needs explicit Pressure, Break, Check, Freeze, and Next fields. |

## Red Flags

- More than one document is staged.
- A code, cache, generated, or binary file is staged.
- The diff contains multiple tutorial checkpoints.
- The commit message lacks one of the required checkpoint fields.
- The document body contains `Step Self-Review` or yes/no compliance bullets.
- The public tutorial reads like a checklist while the commit body is empty.
- `git add .` appears in the execution path.
- The checkpoint fields are invented from the final desired tutorial rather
  than supported by the document diff.

## Verification

- [ ] Exactly one target document was identified.
- [ ] Worktree status and target diff were inspected before staging.
- [ ] The target diff represents one checkpoint.
- [ ] The document body is reader-facing and does not leak internal
      self-review scaffolding unless explicitly intended.
- [ ] Required checkpoint fields were extracted from the document or supplied
      by the user.
- [ ] Only the target document was staged.
- [ ] `git diff --cached --check` ran or the blocker was reported.
- [ ] The commit message uses the checkpoint body format.
- [ ] Execution result reports commit hash, validation, target document, and
      remaining dirty files.

## Output Format

```markdown
## Checkpoint Commit Mode
- mode: execute | draft_only | review_only
- target_document:

## Checkpoint Fields
- pressure:
- naive:
- break:
- change:
- check:
- freeze:
- still_lacks:
- next:

## Commit Message
- subject:
- preview:

## Execution Result
- committed: yes | no
- commit_hash:
- validation:
- remaining_worktree:
```

## Guardrails

- Do not stage more than one document.
- Do not stage code or generated files.
- Do not use `git add .`.
- Do not write a one-line checkpoint commit.
- Do not use the normal `git-commit-skill` body for this skill.
- Do not commit when required checkpoint fields are missing.
- Do not let internal tutorial fields leak into public prose as a workaround
  for a weak commit message.
- Do not commit unrelated edits in the same document without explicit user
  confirmation.
- Do not amend, rebase, tag, or push unless the user explicitly asks for that
  separate operation.
