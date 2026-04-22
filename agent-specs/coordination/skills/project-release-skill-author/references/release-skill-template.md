# Repo-Specific Release Workflow Template

Use this template only when the generated release skill needs workflow, tag,
publish, or post-release execution guidance in addition to release notes.

If the user asks for a `release template` without further qualification,
default to `release-notes-template.md`, not this file.

Replace every placeholder with repository evidence or leave an explicit
`TODO(repo-verify)` / `BLOCK`.

Do not add a version bump engine, semver policy, or publish path the
repository does not already document.

## Frontmatter Template

```md
---
name: <repo>-release-skill
description: v0.1.0 - Execute and verify the <repo> release flow from
repository evidence, including tag, release, publish, and post-release checks.
---
```

## Required Section Shape

~~~md
# <Repo> Release Skill

## Trigger and Scope

Use this skill when <when to use>.

In scope:
- <repo-specific release operations>

Out of scope:
- version bump policy not evidenced by the repository
- unrelated CI refactors
- <other explicit exclusions>

## Workflow

1. Preflight repository state.
   - Verify <clean worktree / branch / permissions / manual gate>.
2. Resolve release version and tag.
   - Version source: `<file or workflow output>`
   - Tag rule: `<tag rule>`
3. Trigger the release path.
   - Execute `<tag push / workflow dispatch / release script>`.
4. Watch release execution.
   - Track `<workflow names / jobs / URLs>`.
5. Verify hosted release output.
   - Confirm `<GitHub Release / GitLab Release / artifact store>` result.
6. Verify downstream publishes.
   - Confirm `<npm / PyPI / container / package manager>` if applicable.
7. Verify post-release actions.
   - Confirm `<branch update / docs deploy / website hook / package mirror>`.
8. Report result.
   - Include release identifier, evidence links, failures, and next action.

## Required Inputs

- release target version or tag: <if operator supplies it>
- repository root: <default>
- release mode: <stable / prerelease / alpha> or `TODO(repo-verify)`

## Defaults

- trigger path: <default trigger>
- release evidence sources: <default evidence sources>
- unknown handling:
  - `TODO(repo-verify)` for non-blocking detail
  - `BLOCK` for missing safety-critical facts

## Output Format

```text
## Release Request
## Preflight
## Trigger
## Verification
## Publish Status
## Post-Release Status
## Unknowns
## Final Decision
```

## Guardrails

- Do not execute when version source or tag rule is unknown.
- Do not publish twice to immutable channels.
- Do not guess manual approval steps or secrets.
- Do not report success until all required publish targets are checked or
  explicitly waived by repository policy.

## Verification Hooks

- Tag and version agreement verified against `<source>`.
- Release workflow or script completion verified.
- Downstream publish targets verified or omitted with reason.
- Post-release side effects verified or omitted with reason.
~~~

## Codex Phase Mapping

Use the following lifecycle only as a structural reference:

1. Preflight and tag gate
2. Build or artifact staging
3. Hosted release creation
4. Downstream registry publication
5. Post-release updates

Delete phases the repository does not use. Do not keep empty sections just to
match `codex`.
