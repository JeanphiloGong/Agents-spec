# Acceptance Criteria for Project Release Skill Author

Use these checks after generating or revising a repo-specific release skill.

## Core Checks

- The generated release skill is repository-specific rather than generic.
- The package includes `SKILL.md` and `agents/openai.yaml`.
- The final skill names the repository's release notes sections explicitly.
- The final skill distinguishes executable steps from unresolved unknowns.
- No secrets, tokens, credentials, or private values appear in the output.

## Release Logic Checks

- The skill uses the `codex` release notes section shape only as structure, not
  as copied implementation detail.
- Release notes categories, bullet style, and changelog line are explicit.
- Every optional release phase in the generated workflow traces back to
  repository evidence.
- Omitted release phases are omitted intentionally because the repository does
  not use them or the user did not ask for them.
- Version bump or detection logic is absent unless the repository already
  defines it.
- Publish targets are explicit, omitted, or blocked with a reason.

## Unknown Handling Checks

- Missing non-critical facts are marked `TODO(repo-verify)`.
- Missing safety-critical facts are marked `BLOCK`.
- The final skill is not presented as executable when blocking unknowns remain.

## Metadata Checks

- `agents/openai.yaml` metadata matches the generated skill name and version.
- The default prompt describes repo-specific release-skill authoring rather
  than generic Git help.

## Reviewer Challenge

- Which release step in the generated skill still depends on an unstated fact?
- Which publish target would be most dangerous if guessed incorrectly?
- Which release-notes section still looks copied from `codex` rather than
  adapted to the target repository?
- What evidence would you inspect first before trusting the generated skill to
  execute a real release?
