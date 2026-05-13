---
name: tag-release-skill
description: v0.1.2 - Prepare, execute, and verify straightforward tag and hosted release operations from explicit operator inputs.
---

# Tag Release Skill

## Trigger and Scope

Use this skill when you must create, review, or complete a straightforward
release that consists of:

- creating or validating a release tag
- preparing release notes
- creating or reviewing a hosted release
- verifying that the final release output exists

In scope:
- collecting the required release inputs
- checking tag, target, and hosted-release preconditions
- drafting release notes from explicit operator inputs
- creating the requested tag when the operator explicitly asks
- creating the hosted release when the operator explicitly asks
- verifying the resulting tag and hosted release
- leaving explicit `TODO(user-confirm)` or `BLOCK` markers when required facts
  are missing

Out of scope:
- splitting mixed development branches into PRs or MRs
- creating review branches for unrelated change slices
- inventing version bump rules, semver policy, or tag formats
- inspecting or encoding repository-specific workflow, publish, or post-release
  rules
- publishing packages to registries
- triggering repository-specific workflows
- changing CI/CD workflows

## Mission and Audience

- Mission: execute a narrow, explicit release workflow safely from the
  operator's supplied tag, target, notes, and hosting-platform inputs.
- Audience: maintainers, release managers, and engineers who need a direct
  Codex-native helper for tag and hosted-release execution.

## PR Split Handoff

- Use `split-pr-publish-skill` first when the release candidate still lives on
  a mixed development branch and needs to become multiple traceable PRs or MRs.
- Use this skill after the intended changes have landed in the release target
  branch or after the operator supplies an explicit release target and PR record
  list.
- This skill may consume PR records for the release notes `Changelog`, but it
  does not infer split boundaries, create review branches, or publish PRs or
  MRs.

## Release Notes Policy

- Treat the `codex` release page structure as the default release-notes shape.
- By default, release notes use these sections when non-empty:
  - `New Features`
  - `Bug Fixes`
  - `Documentation`
  - `Chores`
  - `Changelog`
- Format release-note sections as second-level Markdown headings
  (`## Bug Fixes`) so hosted release pages render them as real sections.
- Format summary items as bullets under each section heading.
- Keep the summary sections human-readable rather than one PR per line.
- In `Changelog`, list every PR record in the release range after the compare
  range.
- Format every `Changelog` record as a Markdown bullet with `- ` so hosted
  release pages render commit, PR, or MR records as a readable list.
- Do not add package publish or post-release sections.
- Do not add version detection or version bump logic.

## Bundled Resources

- `references/release-notes-template.md`
  Use when drafting release notes and changelog output.
- `references/release-evidence-checklist.md`
  Use when checking required release inputs and local repository state.
- `references/acceptance-criteria.md`
  Use when validating that the release request is safe and complete.

## Workflow

1. Collect the release request.
   - Confirm:
     - release tag
     - target commit or branch
     - release title
     - release notes body or generated-notes request
     - changelog range or compare link
     - hosting platform
     - draft or prerelease status when supported
     - whether the operator wants tag creation, hosted release creation, or
       review-only output
2. Run preflight checks.
   - Read only the materials needed from
     `references/release-evidence-checklist.md`.
   - Verify the target ref resolves.
   - Verify whether the tag already exists locally.
   - Verify whether the tag already exists on the remote when a remote is
     available.
   - Stop on any missing safety-critical input.
3. Draft release notes.
   - Use `references/release-notes-template.md`.
   - Omit empty sections.
   - Keep summary sections grouped for humans.
   - Keep `Changelog` as compare range plus one `- ` bullet per PR, MR, or
     direct commit record.
4. Create or validate the tag.
   - Create only the explicit operator-supplied tag.
   - Do not infer a tag from manifests or package files.
   - If the operator asked for review-only, report the tag action without
     executing it.
5. Create or validate the hosted release.
   - Use the explicit title, tag, target, notes, and prerelease or draft
     status.
   - If the operator asked for review-only, return the prepared release
     payload without executing it.
6. Verify the result.
   - Confirm the tag exists locally or remotely as applicable.
   - Confirm the hosted release exists when the platform supports verification.
   - Surface missing verification explicitly instead of guessing success.
7. Return a strict result.
   - Report the release request, the actions taken, verification status,
     unknowns, and final decision.

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

## Defaults

- runtime target: Codex
- execution mode: execute when the operator clearly asks to create the release
- release-notes shape: Codex-style section summary plus PR changelog
- versioning behavior: no version bump or version detection
- publish behavior: no package-registry publishing
- workflow behavior: no repository-specific workflow dispatch
- fallback markers:
  - non-blocking unknown: `TODO(user-confirm)`
  - blocking unknown: `BLOCK`

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

## Verification Hooks

- Verify the tag, target, title, notes, and hosting platform are explicit.
- Verify the release notes section headings and changelog format are explicit.
- Verify `Changelog` includes the compare range plus every PR record supplied
  for the release, with each record formatted as a `- ` Markdown bullet.
- Verify every executed action depends on explicit operator input or direct
  local checks.
- Verify package publish, workflow dispatch, and post-release automation are
  absent.
- Verify all unknowns are marked as `TODO(user-confirm)` or `BLOCK`.
- Verify `agents/openai.yaml` metadata matches the skill version and purpose.
