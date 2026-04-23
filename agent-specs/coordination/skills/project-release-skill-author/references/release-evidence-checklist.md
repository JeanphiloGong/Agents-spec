# Release Input Checklist

Collect only the inputs needed to author a generic tag and hosted-release
skill. Do not inspect repository-specific release workflows, package publish
scripts, or post-release automation.

## Required Inputs

### Release Target

- What commit or branch should the release tag point to?
- Does the target ref resolve locally?
- Is the target expected to be pushed before release creation?

### Tag

- What exact tag should be created or reviewed?
- Does the tag already exist locally?
- Does the tag already exist on the remote when a remote is available?
- Is this a new tag creation or a review of an existing tag?

### Hosted Release

- Which hosting platform should be used?
- What release title should be used?
- Should the hosted release be draft, prerelease, or final?
- Should assets be attached, or is this a notes-only release?

### Release Notes

- Did the operator provide release notes, or should the skill draft them?
- What changelog range or compare link should be shown?
- Which PR records are included in the release range, including PR number,
  title, and author handle when available?
- Which release note sections are non-empty?
- Are issue numbers or additional author attributions requested outside the
  changelog PR list?

### Safety Checks

- Is there an explicit operator instruction to create the tag?
- Is there an explicit operator instruction to create the hosted release?
- Is any action blocked by a missing tag, target, title, notes, or platform?

## Output Discipline

- Convert only explicit inputs and direct local checks into release-skill steps.
- Mark non-critical gaps as `TODO(user-confirm)`.
- Mark safety-critical gaps as `BLOCK`.
- When an operator input is missing, say so directly instead of fabricating it.
- Do not add package publish, workflow dispatch, post-release automation, or
  version bump behavior.
