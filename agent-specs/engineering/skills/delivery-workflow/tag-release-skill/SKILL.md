---
name: tag-release-skill
description: v0.1.3 - Prepare, execute, and verify straightforward tag and hosted release operations from explicit operator inputs. Use when creating or reviewing a release tag, release notes, hosted release, or final release verification.
---

# Tag Release Skill

## Overview

Execute a narrow release workflow only from explicit operator inputs. This
skill collects the tag, target, title, notes, changelog range, hosting platform,
and execution mode; then it either returns a review-only release payload or
creates and verifies the requested tag and hosted release.

The skill is intentionally not a versioning, publishing, or CI/CD automation
system. It protects release operations by stopping on missing safety-critical
facts instead of guessing tag formats, targets, notes, or platform behavior.

## When to Use

- A release tag needs to be created, validated, or reviewed.
- Release notes need to be drafted from explicit operator inputs.
- A hosted GitHub or GitLab release needs to be created or checked.
- A completed release needs verification that the tag and hosted release exist.
- A release request needs a strict `execute` versus `review_only` decision.

**When NOT to use:** mixed branch splitting, PR/MR creation, package registry
publishing, repository-specific workflow dispatch, semver policy design,
version bump detection, CI/CD changes, or post-release automation. Use
`split-pr-publish-skill` first when release candidate changes still need
PR-level traceability.

## Reference Map

- `references/release-notes-template.md`
  Use when drafting release notes and changelog output.
- `references/release-evidence-checklist.md`
  Use when checking required release inputs and local repository state.
- `references/acceptance-criteria.md`
  Use when validating that the release request is safe and complete.

## Release Notes Policy

- Treat the `codex` release page structure as the default release-notes shape.
- Use these sections when non-empty:
  - `New Features`
  - `Bug Fixes`
  - `Documentation`
  - `Chores`
  - `Changelog`
- Format release-note sections as second-level Markdown headings
  (`## Bug Fixes`) so hosted release pages render them as real sections.
- Format summary items as bullets under each section heading.
- Keep summary sections human-readable rather than one PR per line.
- In `Changelog`, list every PR record in the release range after the compare
  range.
- Format every `Changelog` record as a Markdown bullet with `- ` so hosted
  release pages render commit, PR, or MR records as a readable list.
- Do not add package publish, workflow-dispatch, or post-release sections.
- Do not add version detection or version bump logic.

## Required Inputs

- release tag
- target commit or branch
- release title
- release notes body or generated-notes request
- changelog range or compare link
- PR records for the changelog, when release notes are generated
- release hosting platform
- draft or prerelease status when supported
- execution mode: `execute` or `review_only`

## Fixed Defaults

- runtime target: Codex
- execution mode: execute when the operator clearly asks to create the release
- release-notes shape: Codex-style section summary plus PR changelog
- versioning behavior: no version bump or version detection
- publish behavior: no package-registry publishing
- workflow behavior: no repository-specific workflow dispatch
- fallback markers:
  - non-blocking unknown: `TODO(user-confirm)`
  - blocking unknown: `BLOCK`

## The Operating Loop

1. Classify the release request.
   - Confirm whether the operator wants `execute` or `review_only`.
   - Confirm whether the work is tag creation, hosted release creation,
     release-note drafting, or verification.
   - Hand off to `split-pr-publish-skill` if the release candidate still lives
     on a mixed development branch.
2. Collect required release facts.
   - Gather tag, target, title, notes source, changelog range, hosting
     platform, PR/MR records when generating notes, and draft/prerelease
     status.
   - Mark non-blocking unknowns as `TODO(user-confirm)`.
   - Mark safety-critical missing facts as `BLOCK`.
3. Run preflight checks.
   - Read only the needed parts of
     `references/release-evidence-checklist.md`.
   - Verify the target ref resolves.
   - Check whether the tag exists locally.
   - Check whether the tag exists remotely when a remote is available.
   - Stop before execution if an existing tag, unknown target, or missing
     hosting platform makes the request unsafe.
4. Draft release notes.
   - Use `references/release-notes-template.md`.
   - Omit empty sections.
   - Keep summary sections grouped for humans.
   - Keep `Changelog` as compare range plus one `- ` bullet per supplied PR,
     MR, or direct commit record.
5. Execute or prepare the tag action.
   - Create only the explicit operator-supplied tag.
   - Do not infer a tag from manifests or package files.
   - In `review_only`, report the tag action without executing it.
6. Execute or prepare the hosted release action.
   - Use the explicit title, tag, target, notes, and prerelease/draft status.
   - In `review_only`, return the prepared release payload without executing.
7. Verify and report the final state.
   - Confirm the tag exists locally or remotely as applicable.
   - Confirm the hosted release exists when the platform supports verification.
   - Surface missing verification explicitly instead of guessing success.

## Decision Points

- If any required safety-critical input is missing, return `BLOCK` instead of
  drafting commands from assumptions.
- If the operator asks to "prepare" or "review" a release, use `review_only`
  and do not create tags or hosted releases.
- If the operator clearly asks to create the release and all preflight checks
  pass, use `execute`.
- If a tag already exists, verify whether it points to the requested target;
  do not move or overwrite it unless the operator explicitly asks.
- If release notes are generated but PR/MR records are missing, block or mark
  the changelog gap according to whether the operator requires a complete
  changelog.
- If hosted-release verification is unavailable, report the missing
  verification instead of treating command success as release success.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The next version is obvious from the last tag." | This skill does not infer versions or tag formats. Use the operator-supplied tag. |
| "The branch name probably tells us the release target." | Release targets must be explicit and resolvable before execution. |
| "Command success means the hosted release exists." | Verify the hosted release or report that verification is unavailable. |
| "Package publishing belongs in the release notes workflow." | Package registry publishing and workflow dispatch are out of scope. |
| "Missing PR records are fine because the summary looks complete." | Generated changelogs need the supplied release range records or an explicit gap marker. |

## Red Flags

- Tag, target, hosting platform, or execution mode is inferred rather than
  supplied.
- A tag is moved, overwritten, or recreated without explicit operator request.
- Release notes include package publish or workflow-dispatch sections.
- The `Changelog` lacks the compare range or supplied PR/MR records.
- The result says "released" before tag and hosted-release verification.
- Unknowns are described in prose instead of marked as `TODO(user-confirm)` or
  `BLOCK`.

## Verification

- [ ] Tag, target, title, notes source, hosting platform, and execution mode
      are explicit.
- [ ] Target ref resolves before execution.
- [ ] Existing local and remote tag state is checked when applicable.
- [ ] Release notes use the required section headings and changelog bullet
      format.
- [ ] Every executed action depends on explicit operator input or direct local
      evidence.
- [ ] Package publishing, workflow dispatch, version detection, and
      post-release automation are absent.
- [ ] Executed tag and hosted release are verified, or missing verification is
      reported explicitly.
- [ ] `agents/openai.yaml` metadata matches the skill version and purpose.

## Output Format

```text
## Release Mode
- mode: execute | review_only
- execution_status: executable | blocked

## Release Request
- tag:
- target:
- title:
- notes:
- changelog_range:
- hosting_platform:
- prerelease_or_draft:

## Preflight
- target_status:
- local_tag_status:
- remote_tag_status:

## Release Notes
- sections:
- changelog_records:

## Tag
- requested:
- executed:
- result:

## Hosted Release
- requested:
- executed:
- result:
- url:

## Unknowns
- blocking:
- non_blocking:

## Final Decision
- safe_to_execute:
- notes:
```

## Guardrails

- Do not create, move, or overwrite tags unless the operator explicitly asks.
- Do not guess version numbers, tag formats, release targets, or prerelease
  status.
- Do not publish packages.
- Do not trigger repository-specific workflows.
- Do not report success until the tag and hosted release are verified or the
  missing verification is explicitly reported.
- Do not encode secrets, tokens, credentials, or private registry values.
