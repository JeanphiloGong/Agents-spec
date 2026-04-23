# Acceptance Criteria for Project Release Skill Author

Use these checks after generating or revising a generic release skill.

## Core Checks

- The generated release skill is generic rather than repository-specific.
- The package includes `SKILL.md` and `agents/openai.yaml`.
- The final skill names the required operator inputs explicitly.
- The final skill distinguishes executable steps from unresolved unknowns.
- No secrets, tokens, credentials, or private values appear in the output.

## Release Logic Checks

- The skill uses the `codex` release notes section shape only as structure, not
  as copied implementation detail.
- Release notes categories, summary-line style, and changelog PR record format
  are explicit.
- Changelog includes the compare range followed by every PR record as
  `#<pr-number> <PR title> @<author>` when author handles are available.
- Tag creation depends on an explicit operator-supplied tag.
- Hosted release creation depends on explicit operator-supplied title, notes,
  target, and platform.
- Version bump or detection logic is absent.
- Package publish, workflow dispatch, and post-release automation are absent.

## Unknown Handling Checks

- Missing non-critical facts are marked `TODO(user-confirm)`.
- Missing safety-critical facts are marked `BLOCK`.
- The final skill is not presented as executable when blocking unknowns remain.

## Metadata Checks

- `agents/openai.yaml` metadata matches the generated skill name and version.
- The default prompt describes generic release-skill authoring rather than
  repository-specific release workflow design.

## Reviewer Challenge

- Which release action still depends on an unstated operator input?
- Which tag or hosted release action would be unsafe if guessed incorrectly?
- Which release-notes section is still empty and should be omitted?
- Did package publish, workflow dispatch, or post-release automation appear
  anywhere in the generated skill?
