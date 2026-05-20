---
name: pr-mr-review-publish-skill
description: v0.1.1 - Evaluate GitHub PRs or GitLab MRs, normalize evidence-backed review findings, and optionally publish review comments or verdicts via gh/glab. Use when a target PR/MR needs a merge recommendation, review body, or publish-safe review action.
---

# PR/MR Review Publish Skill

## Overview

Convert PR/MR review judgment into one auditable review artifact and optionally
publish it. This skill resolves the target, normalizes findings by severity,
decides `approve`, `comment`, or `block`, checks the draft against acceptance
criteria, and publishes through `gh` or `glab` only when the target and verdict
are safe.

The skill separates review evidence from publication mechanics. It does not
auto-fix code, invent metadata, or turn style preferences into blocking
findings.

## When to Use

- A GitHub PR or GitLab MR needs a normalized review summary.
- Prior manual or AI findings need a consistent merge recommendation.
- The operator wants to publish a final review comment or verdict.
- A local diff review needs the same output shape without a remote target.
- GitHub/GitLab review commands need to be chosen safely by platform.

**When NOT to use:** broad exploratory review with no target or diff boundary,
auto-fixing code, issue creation, commit drafting, CI debugging, line-level
inline review workflows, or publishing comments before the target is resolved.
Use code review or CI skills for deeper investigation and fixes.

## Reference Map

- `references/acceptance-criteria.md`
  Use before returning or publishing the review artifact.
- `references/publish-command-reference.md`
  Use when selecting `gh` or `glab` commands and file-backed review bodies.

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

## The Operating Loop

1. Resolve target and platform.
   - Prefer PR/MR URL when available.
   - If only a number is provided, require or infer `repo`.
   - If no remote target exists, operate only on the explicit local diff
     boundary.
   - Keep mode as `draft-only` while target resolution is ambiguous.
2. Resolve the review source.
   - Use provided findings first when the operator already reviewed the code.
   - If findings are not provided and code inspection is requested, inspect the
     target diff and extract findings before drafting the review.
   - Do not discard operator-provided findings just because local inspection
     found fewer issues.
3. Normalize findings.
   - Classify each item as `blocking`, `non-blocking`, `question`, or
     `follow-up`.
   - Attach concrete evidence: file, behavior, contract, test gap, or
     uncertainty note.
   - Keep findings ordered by severity.
4. Decide the verdict.
   - Use `block` when any blocking finding materially affects correctness,
     safety, contract behavior, or merge readiness.
   - Use `comment` when only non-blocking concerns, questions, or follow-ups
     remain.
   - Use `approve` only when no blocking findings remain and the review is
     merge-safe.
5. Draft one standard review artifact.
   - Put findings before the merge recommendation.
   - Keep open questions and follow-up actions separate from blocking
     findings.
   - Say explicitly when there are no findings.
6. Run acceptance review.
   - Check the draft against `references/acceptance-criteria.md`.
   - Revise before publishing or returning when acceptance fails.
   - Name the highest-risk remaining gap.
7. Publish only when safe and requested.
   - Read `references/publish-command-reference.md`.
   - Write the final body to a file.
   - Use the selected platform command family.
   - For GitLab blocking feedback, use a note and optional approval revoke;
     do not pretend `request changes` exists as a native CLI state.
8. Report the result.
   - Include target, platform, mode, findings, verdict, publication status,
     acceptance result, highest-risk gap, and next step.

## Decision Points

- If the target PR/MR or local diff boundary is ambiguous, stay in
  `draft-only` and report the missing target fact.
- If any blocking finding remains, verdict is `block`; never publish it as an
  approval.
- If all findings are non-blocking or questions, verdict is `comment`.
- If there are no findings and no material unknowns, verdict may be `approve`.
- If CI state is unknown, do not fabricate it; decide whether the code review
  verdict can stand without CI.
- If the platform is GitLab, map blocking feedback to `glab mr note` and use
  `glab mr revoke` only when removing a prior approval is required.
- If the operator requested inline comments, confirm a line-level workflow;
  otherwise publish a summary review.

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

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The target number is probably in this repo." | Publishing to the wrong PR/MR is worse than returning a draft. Resolve the target first. |
| "This style preference bothers me, so it should block." | Blocking findings require correctness, safety, contract, test, or repository-rule impact. |
| "GitLab can request changes like GitHub." | GitLab CLI does not expose that review state; use notes and optional approval revoke. |
| "The operator provided findings, but my quick scan did not see them." | Preserve provided findings unless you can disprove them with evidence. |
| "Publishing a draft review is harmless." | Published comments affect collaborators; run acceptance checks first. |

## Red Flags

- The target PR/MR or repo is unresolved while `mode=publish`.
- A blocking finding has no file, behavior, contract, test-gap, or uncertainty
  evidence.
- The artifact starts with praise or summary before findings.
- `approve` appears while any blocking finding remains.
- GitHub `request-changes` semantics are described as native GitLab CLI
  behavior.
- CI status, PR metadata, or diff status is invented.
- Operator-provided findings disappear without explicit evidence.

## Verification

- [ ] Target PR/MR or local diff boundary is explicit, or result remains
      `draft-only`.
- [ ] Platform is resolved to GitHub, GitLab, or local-only.
- [ ] Every blocking finding has concrete evidence.
- [ ] Findings appear before merge recommendation.
- [ ] Verdict uses exactly `approve`, `comment`, or `block`.
- [ ] `approve` is not used while blocking findings remain.
- [ ] Draft passes `references/acceptance-criteria.md`.
- [ ] Publish command family matches the selected platform when publication is
      requested.
- [ ] Output states whether publication happened.

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

## Guardrails

- Do not publish anything until the target PR/MR is resolved unambiguously.
- Do not approve when a blocking finding remains unresolved.
- Do not fabricate PR/MR metadata, diff status, or CI state.
- Do not present stylistic preferences as blocking unless they affect
  correctness, safety, or a repository rule.
- Do not assume GitLab has a first-class `request changes` CLI action; use
  `note` and optional `revoke` semantics instead.
- Do not default to inline line comments; use summary review comments unless
  the operator explicitly asks for line-level review behavior.
- Do not discard operator-provided findings just because a local diff
  inspection found fewer issues.
