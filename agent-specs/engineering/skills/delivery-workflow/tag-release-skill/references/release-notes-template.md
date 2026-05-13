# Codex-Style Release Notes Template

Use this template when the user says `release template` and means the public
release notes structure, not tag validation or version bump logic.

Default section order follows the style used in `codex`:

1. `## New Features`
2. `## Bug Fixes`
3. `## Documentation`
4. `## Chores`
5. `## Changelog`

Delete empty sections instead of emitting placeholders.

## Template

~~~md
## New Features
- <user-facing feature summary> (<refs>).
- <user-facing feature summary> (<refs>).

## Bug Fixes
- <behavioral fix summary> (<refs>).
- <behavioral fix summary> (<refs>).

## Documentation
- <docs change summary> (<refs>).
- <docs change summary> (<refs>).

## Chores
- <internal refactor, infra, or maintenance summary> (<refs>).
- <internal refactor, infra, or maintenance summary> (<refs>).

## Changelog
Full Changelog: <from-tag>...<to-tag>

- #<pr-number> <PR title> @<author>
- #<pr-number> <PR title> @<author>
~~~

## Style Rules

- Use second-level Markdown headings (`## <section>`) for every emitted
  section so GitHub, GitLab, and similar hosted release pages render the
  section names prominently.
- Use bullet lists for section summaries and changelog records.
- Summaries should be grouped for humans, not listed one PR per summary line by
  default.
- Prefer user-visible language in `New Features` and `Bug Fixes`.
- Put internal refactors, dependency work, CI stabilization, and code movement
  into `Chores` unless the repository uses a different label.
- Use `Documentation` only for release-note-worthy docs changes; otherwise omit
  the section.
- Keep each summary line to one sentence when possible.
- Include issue or PR references only when the operator asks for them or they
  are already available in the supplied input.
- In `Changelog`, list every PR included in the release range as one bullet per
  PR using `- #<pr-number> <PR title> @<author>`.
- Include author handles in `Changelog` when they are available from the PR
  records.
- For direct commits without PR records, use the same bullet form, for example
  `- <short_sha> <subject> @<author> (direct commit)`.
- If the operator supplies a compare link or changelog range, preserve that
  format exactly above the PR list.

## Optional Expansion Rules

- Split `New Features` into multiple summary lines only when one combined line
  would become unreadable.
- Merge related fixes into one summary line when they land one user-facing
  outcome.
- Add contributor or author appendices only when the operator explicitly asks
  for them.

## Non-Goals

- This template does not define semver rules.
- This template does not define tag creation rules.
- This template does not define publish automation or registry checks.
