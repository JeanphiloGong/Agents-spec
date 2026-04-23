---
name: project-release-skill-author
description: v0.1.2 - Create or update a generic release skill package for tagging, release notes, and hosted release creation without inventing project-specific publish rules.
---

# Project Release Skill Author

## Trigger and Scope

Use this skill when you must create or revise a reusable, generic release skill
for straightforward tag and hosted-release operations.

In scope:
- creating a generic release skill package for Codex
- reusing a Codex-like release notes template as structure only
- encoding operator-supplied tag, release title, release notes, and changelog
  range inputs
- creating basic preflight and verification rules for tag and hosted release
  creation
- leaving explicit `TODO(user-confirm)` or `BLOCK` markers when required inputs
  are missing

Out of scope:
- executing a release
- optimizing the skill for one repository's release process
- inspecting or encoding repository-specific workflow, publish, or post-release
  rules
- inventing version bump rules, semver policy, or tag formats
- creating a universal release engine with package-registry publishing logic
- copying `codex` Rust, npm, WinGet, or GitHub-specific implementation details
- changing CI/CD workflows

## Mission and Audience

- Mission: produce a generic release skill that an operator can use to prepare
  a tag, release notes, and a hosted release from explicit user inputs.
- Audience: maintainers, release managers, and engineers who want a reusable
  Codex-native release helper rather than ad hoc release prompts.

## Codex Release Template Policy

- Treat the `codex` release page structure as the default release template.
- By default, `release template` means release notes sections such as:
  - `New Features`
  - `Bug Fixes`
  - `Documentation`
  - `Chores`
  - `Changelog`
- Do not add workflow, package publish, or post-release sections.
- Do not add version detection or bump logic.
- Treat tag names and release targets as operator-supplied inputs.

## Bundled Resources

- `references/release-notes-template.md`
  Use when drafting the release notes structure.
- `references/release-skill-template.md`
  Use when the generated skill needs generic tag and hosted-release guidance.
- `references/release-evidence-checklist.md`
  Use when checking the minimal release inputs and local repository state.
- `references/acceptance-criteria.md`
  Use when validating the generated release skill package.

## Workflow

1. Resolve the destination.
   - Confirm the preferred skill root and whether you are creating a new
     package or updating an existing release skill.
2. Inspect only the inputs needed for generic release operation.
   - Read only the materials needed from
     `references/release-evidence-checklist.md`.
   - Do not inspect workflows, scripts, or publishing docs.
3. Extract required release inputs.
   - Record only generic inputs such as:
     - release tag supplied by the operator
     - release target commit or branch supplied by the operator
     - release title
     - release notes body or generated notes request
     - changelog range or compare-link format
     - prerelease or draft status when the hosting platform supports it
     - release hosting platform
4. Classify unknowns explicitly.
   - If a required input is missing, stop guessing.
   - Use `TODO(user-confirm)` for missing non-blocking detail.
   - Use `BLOCK` when a missing fact makes the generated skill unsafe to run.
5. Choose package name and placement.
   - Prefer a generic name such as `release-skill`.
   - Default placement is `.codex/skills/release-skill`.
   - Use another skill directory only when the user explicitly asks.
6. Draft the generic `SKILL.md`.
   - Start from `references/release-notes-template.md`.
   - Use `references/release-skill-template.md` for generic tag and release
     guidance.
   - Replace placeholders only with generic release inputs.
   - Keep release-note sections user-facing and omit empty categories.
7. Add Codex metadata.
   - Create or update `agents/openai.yaml`.
   - Keep `display_name`, `short_description`, and `default_prompt` aligned
     with the generic release scope.
8. Avoid supporting references.
   - Do not add local references for project-specific release processes.
9. Validate the package.
   - Run the checks in `references/acceptance-criteria.md`.
   - Verify every executable step depends on explicit operator input or direct
     local checks.
10. Return a strict result.
   - Report package path, required inputs, unresolved items, and whether the
     output is safe to execute or still documentation-only.

## Required Inputs

- preferred output location, if it should differ from `.codex/skills/`
- package name used for the final skill name
- release hosting platform when obvious from context
- whether the task is create-new or update-existing

## Defaults

- runtime target: Codex
- package shape: `SKILL.md` plus `agents/openai.yaml`
- template mode: Codex release notes sections first
- operation template mode: generic tag and hosted release only
- versioning behavior: no new version bump or detection logic
- evidence policy: explicit operator inputs and direct local checks only
- fallback markers:
  - non-blocking unknown: `TODO(user-confirm)`
  - blocking unknown: `BLOCK`
- default placement: `.codex/skills/release-skill`

## Output Format

```text
## Release Skill Package
- path:
- mode: create | update
- execution_status: executable | docs_only | blocked

## Required Inputs
- tag:
- target:
- title:
- notes:
- changelog_range:
- hosting_platform:

## Encoded Release Rules
- notes_sections:
- changelog_format:
- tag_creation:
- hosted_release_creation:
- prerelease_or_draft:

## Unknowns
- blocking:
- non_blocking:

## Files
- created:
- updated:

## Validation
- acceptance_status:
- notes:
```

## Guardrails

- Do not invent tag formats, version sources, workflow names, or publish
  targets.
- Do not copy `codex` release content literally; reuse only its section
  structure when it fits.
- Do not add package-registry publishing, workflow dispatch, post-release
  automation, version bump helpers, release shims, or compatibility layers.
- Do not encode secrets, tokens, credentials, or private registry values.
- Do not mark the generated skill executable when core release facts are still
  unknown.

## Verification Hooks

- Verify the generated release skill is generic rather than repository-specific.
- Verify the release notes section headings and changelog format are explicit.
- Verify every release step depends on explicit operator input or direct local
  checks.
- Verify the tag and release target are explicit before any executable release
  guidance is marked safe.
- Verify package publish, workflow dispatch, and post-release automation are
  omitted.
- Verify all unknowns are marked as `TODO(user-confirm)` or `BLOCK`.
- Verify `agents/openai.yaml` metadata matches the generated skill version and
  purpose.
