# Generic Release Skill Template

Use this template when the generated release skill needs generic tag and hosted
release guidance in addition to release notes.

The generated skill must rely on explicit operator inputs. Do not add
repository-specific workflow, package publish, version bump, or post-release
automation.

Replace every placeholder with an explicit input, a direct local check, or
`TODO(user-confirm)` / `BLOCK`.

## Frontmatter Template

```md
---
name: release-skill
description: v0.1.0 - Prepare and verify tag, release notes, and hosted release creation from explicit operator inputs.
---
```

## Required Section Shape

~~~md
# Release Skill

## Trigger and Scope

Use this skill when the operator wants to create or review a straightforward
tag and hosted release.

In scope:
- confirming release tag and target
- drafting release notes
- creating or reviewing a hosted release
- verifying the tag and hosted release exist after execution

Out of scope:
- version bump policy
- repository-specific workflow dispatch
- package-registry publishing
- post-release automation
- CI/CD changes

## Workflow

1. Collect release inputs.
   - Tag: `<operator-supplied tag>`
   - Target: `<operator-supplied commit or branch>`
   - Release title: `<operator-supplied title>`
   - Release notes: `<operator-supplied body or generated notes request>`
   - Hosting platform: `<GitHub / GitLab / other>`
2. Preflight local state.
   - Verify the target ref resolves.
   - Verify the tag does not already exist unless the operator is reviewing an
     existing release.
3. Draft release notes.
   - Use the release notes template.
   - Omit empty sections.
   - Include the changelog range when supplied.
4. Prepare tag creation.
   - Create only the explicit operator-supplied tag.
   - Do not infer a tag name from manifests or package files.
5. Prepare hosted release creation.
   - Use the explicit title, tag, target, notes, and prerelease/draft setting.
   - Do not publish packages or trigger repository-specific workflows.
6. Verify result.
   - Confirm the tag exists locally or remotely as applicable.
   - Confirm the hosted release exists when the platform supports verification.
7. Report result.
   - Include tag, target, release URL if available, unresolved inputs, and any
     blocked action.

## Required Inputs

- release tag
- target commit or branch
- release title
- release notes body or generated-notes request
- release hosting platform
- prerelease or draft status, when supported

## Defaults

- versioning behavior: no version bump or version detection
- publish behavior: no package-registry publishing
- workflow behavior: no repository-specific workflow dispatch
- unknown handling:
  - `TODO(user-confirm)` for non-blocking detail
  - `BLOCK` for missing safety-critical facts

## Output Format

```text
## Release Request
## Preflight
## Release Notes
## Tag
## Hosted Release
## Verification
## Unknowns
## Final Decision
```

## Guardrails

- Do not create, move, or overwrite tags unless the operator explicitly asks.
- Do not guess version numbers, tag formats, release targets, or prerelease
  status.
- Do not publish packages.
- Do not trigger repository-specific workflows.
- Do not report success until the tag and hosted release are verified or the
  missing verification is explicitly reported.

## Verification Hooks

- Tag and target are explicit.
- Tag existence or non-existence was checked.
- Release notes contain no empty template sections.
- Hosted release creation uses only explicit inputs.
- Package publish, workflow dispatch, and post-release automation are absent.
~~~
