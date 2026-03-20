---
name: pr-mr-review-publish-skill
description: v0.1.0 - Evaluate GitHub PRs or GitLab MRs, normalize review findings, and optionally publish review comments or verdicts via gh/glab.
---

# PR/MR Review Publish Skill

## Trigger and Scope

Use this skill when you need to:
- evaluate a GitHub PR or GitLab MR after manual review or AI review
- turn review findings into a standard merge recommendation
- publish the final review comment or verdict without manual copy/paste

In scope:
- PR/MR summary review
- findings normalization and severity ranking
- merge recommendation (`approve`, `comment`, `block`)
- direct publishing through `gh` or `glab`

Out of scope:
- deep exploratory code review with no defined target or diff boundary
- auto-fixing code
- issue creation or commit drafting

## Core Purpose

- Separate review judgment from comment formatting.
- Produce one auditable review artifact with evidence, verdict, and next action.
- Keep GitHub and GitLab publication flows consistent.
- Avoid manual copy/paste when the operator wants the review published.

## Fixed Defaults

- `platform=auto`
- `mode=draft-only`
- `decision=auto`
- `target_preference=url-first`
- `findings_source=provided-first`
- `review_scope=changed-files-only`
- `publication_style=summary-review`
- `inline_comment_mode=off`
- `evidence_required=on`

## Required Inputs

Provide one target form:
- `pr_url` or `mr_url`
- `pr_number` or `mr_number` plus `repo`
- `base_ref...head_ref` when only a local diff review is needed

Provide one execution mode:
- `draft-only`
- `publish`

Optional but strongly recommended:
- `decision` (`approve`, `comment`, `block`, or `auto`)
- `findings` from a prior review pass
- `summary_context` such as PR title, intent, or scope

## Decision Model

Use these platform-neutral decisions:

- `approve`
  - no blocking findings remain
  - remaining comments are informational or minor follow-ups
- `comment`
  - no blocking findings remain
  - review still contains non-blocking concerns, questions, or follow-ups
- `block`
  - one or more findings materially affect correctness, safety, contract behavior, or merge readiness

Platform mapping:
- GitHub:
  - `approve` => `gh pr review --approve`
  - `comment` => `gh pr review --comment`
  - `block` => `gh pr review --request-changes`
- GitLab:
  - `approve` => `glab mr approve` and optionally `glab mr note`
  - `comment` => `glab mr note`
  - `block` => `glab mr note`
  - GitLab does not have a direct `request changes` CLI equivalent; blocking feedback is expressed through the note body, and `glab mr revoke` may be used when approval must be removed

## Workflow

1. Resolve target and platform.
   - Prefer PR/MR URL when available.
   - If only a number is provided, require or infer `repo`.
   - If no remote target exists, operate on the explicit local diff boundary only.
2. Resolve review source.
   - Use provided findings first when the operator already reviewed the code.
   - If findings are not provided and code inspection is requested, inspect the target diff and extract findings before drafting the review.
3. Normalize findings.
   - Classify each item as `blocking`, `non-blocking`, `question`, or `follow-up`.
   - Attach evidence: file, behavior, contract, test gap, or uncertainty note.
4. Decide the verdict.
   - Default to `block` when any blocking finding exists.
   - Default to `comment` when only non-blocking items or questions exist.
   - Use `approve` only when no blocking findings remain and the review is merge-safe.
5. Draft one standard review artifact.
   - Keep findings ordered by severity.
   - Keep the merge recommendation explicit.
   - Keep open questions and follow-ups separate from blocking findings.
6. Run acceptance review.
   - Check the draft against `references/acceptance-criteria.md`.
   - If the draft fails acceptance, revise before publishing.
7. Publish when `mode=publish`.
   - Write the final body to a file.
   - Use the platform-specific command from `references/publish-command-reference.md`.
   - If network or sandbox restrictions block `gh` or `glab`, request escalation and rerun the same command.
8. Report result.
   - Always return the final verdict, whether publication happened, the command family used, and the highest-risk remaining gap.

## Review Comment Template

Use this structure for the review body:

```md
## Findings
- [severity] <file or area> - <problem and impact>

## Merge Recommendation
- decision: <approve | comment | block>
- rationale: <why this verdict is correct now>

## Open Questions
- <question or `none`>

## Follow-up Actions
- <action or `none`>
```

Rules:
- If there are no findings, say that explicitly.
- Findings must come before summary or praise.
- Do not hide a blocking issue inside `Open Questions`.

## Output Format

```text
## Review Scope
- target:
- platform:
- mode:
- source:

## Findings
- ...

## Verdict
- decision:
- rationale:

## Review Comment Draft
- <full markdown review body>

## Publish Result
- status:
- command_family:
- target:

## Acceptance Check
- result:
- highest_risk_gap:

## Next Step
- ...
```

## Acceptance and Iteration Loop

- Before finalizing, review the artifact against `references/acceptance-criteria.md`.
- If acceptance fails, revise the draft before publishing or returning it.
- Always name the highest-risk remaining gap in the final output, even when the review is publishable.
- Always include one next-step action:
  - publish the review
  - answer an open question
  - rerun review on a narrower diff
  - follow up after code changes land

## References

- `references/acceptance-criteria.md`
- `references/publish-command-reference.md`

## Guardrails

- Do not publish anything until the target PR/MR is resolved unambiguously.
- Do not approve when a blocking finding remains unresolved.
- Do not fabricate PR/MR metadata, diff status, or CI state.
- Do not present stylistic preferences as blocking unless they affect correctness, safety, or a repository rule.
- Do not assume GitLab has a first-class `request changes` CLI action; use `note` and optional `revoke` semantics instead.
- Do not default to inline line comments; use summary review comments unless the operator explicitly asks for line-level review behavior.
- Do not discard operator-provided findings just because a local diff inspection found fewer issues.
