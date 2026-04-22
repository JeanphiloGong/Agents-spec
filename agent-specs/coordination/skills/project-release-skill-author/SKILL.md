---
name: project-release-skill-author
description: v0.1.1 - Create or update a repo-specific release skill package from repository release evidence, defaulting to a Codex-style release notes template without inventing versioning or publish rules.
---

# Project Release Skill Author

## Trigger and Scope

Use this skill when you must create or revise a reusable, repository-specific
release skill for one project.

In scope:
- inspecting repository release evidence before drafting
- creating a repo-specific release skill package for Codex
- reusing a Codex-like release notes template as structure only
- encoding release-note section rules and changelog presentation from
  repository evidence
- encoding tag, release, publish, and post-release rules that are backed by
  repository evidence when the repository actually needs them
- leaving explicit `TODO(repo-verify)` or `BLOCK` markers when release facts
  are missing

Out of scope:
- executing a release
- inventing version bump rules, semver policy, or tag formats
- creating a universal release engine shared across unrelated repositories
- copying `codex` Rust, npm, WinGet, or GitHub-specific details into another
  repository without evidence
- changing CI/CD workflows unless the user explicitly asks

## Mission and Audience

- Mission: produce a repo-specific release skill that an operator can use to
  draft or review that repository's release output safely.
- Audience: maintainers, release managers, and engineers who want a reusable
  Codex-native release skill rather than ad hoc release prompts.

## Codex Release Template Policy

- Treat the `codex` release page structure as the default release template.
- By default, `release template` means release notes sections such as:
  - `New Features`
  - `Bug Fixes`
  - `Documentation`
  - `Chores`
  - `Changelog`
- Use workflow, tag, publish, or post-release sections only when the target
  repository explicitly needs them and the evidence supports them.
- Never add version detection or bump logic unless the target repository
  already documents and automates that behavior.

## Bundled Resources

- `references/release-notes-template.md`
  Use when drafting the repo-specific release notes structure.
- `references/release-skill-template.md`
  Use when the generated skill also needs repo-specific workflow or publish
  steps.
- `references/release-evidence-checklist.md`
  Use when extracting release facts from workflows, scripts, and docs.
- `references/acceptance-criteria.md`
  Use when validating the generated release skill package.

## Workflow

1. Resolve the target repository and destination.
   - Confirm the project root, preferred skill root, and whether you are
     creating a new package or updating an existing release skill.
   - Reuse the repository's established skill layout when one already exists.
2. Inspect release evidence before drafting.
   - Read only the materials needed from
     `references/release-evidence-checklist.md`.
   - Prefer primary release evidence in this order:
     - repository release pages or prior release notes
     - release workflows
     - release scripts
     - repository release docs
     - version manifests used by the workflows
3. Extract release facts.
   - Record only evidenced facts such as:
     - release note section headings
     - grouping rules for user-visible changes
     - full changelog range or compare-link format
     - whether issue or PR references appear inline
     - release trigger mechanism
     - tag naming rule
     - version source
     - release notes source
     - artifact build or staging steps
     - publish targets
     - post-release side effects
     - immutability or retry constraints
4. Classify unknowns explicitly.
   - If a required release fact is missing, stop guessing.
   - Use `TODO(repo-verify)` for missing non-blocking detail.
   - Use `BLOCK` when a missing fact makes the generated skill unsafe to run.
5. Choose package name and placement.
   - Prefer a repo-specific name such as `<repo>-release-skill`.
   - Default placement is `.codex/skills/<repo>-release-skill` at the target
     repository root.
   - Use another skill directory only when the repository already requires it
     or the user explicitly asks.
6. Draft the repo-specific `SKILL.md`.
   - Start from `references/release-notes-template.md`.
   - Use `references/release-skill-template.md` only when the generated skill
     also needs evidenced workflow or publish steps.
   - Replace placeholders only with repository-backed facts.
   - Keep release-note sections user-facing and omit empty categories.
7. Add Codex metadata.
   - Create or update `agents/openai.yaml`.
   - Keep `display_name`, `short_description`, and `default_prompt` aligned
     with the repository-specific release scope.
8. Add supporting references only when they reduce repeated ambiguity.
   - Add local references for complex release matrices, channel rules, or
     manual approval gates only when the main `SKILL.md` would otherwise become
     bloated.
   - Do not create generic docs that the package does not use.
9. Validate the package.
   - Run the checks in `references/acceptance-criteria.md`.
   - Verify every executable step in the generated release skill traces back to
     repository evidence.
10. Return a strict result.
   - Report package path, evidence sources, unresolved items, and whether the
     output is safe to execute or still documentation-only.

## Required Inputs

- target repository root
- preferred output location, if it should differ from `.codex/skills/`
- repository or package name used for the final skill name
- release hosting platform when obvious from context if it is not local-only
- whether the task is create-new or update-existing

## Defaults

- runtime target: Codex
- package shape: `SKILL.md` plus `agents/openai.yaml`
- template mode: Codex release notes sections first
- workflow template mode: opt-in only when repo evidence requires it
- versioning behavior: no new version bump or detection logic
- evidence policy: repository facts only; unresolved details stay explicit
- fallback markers:
  - non-blocking unknown: `TODO(repo-verify)`
  - blocking unknown: `BLOCK`
- default placement: `.codex/skills/<repo>-release-skill`

## Output Format

```text
## Release Skill Package
- path:
- mode: create | update
- execution_status: executable | docs_only | blocked

## Evidence Sources
- workflows:
- scripts:
- docs:
- manifests:

## Encoded Release Facts
- notes_sections:
- changelog_format:
- trigger:
- tag_rule:
- version_source:
- publish_targets:
- post_release_actions:

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

- Do not invent tag formats, workflow names, version sources, or publish
  targets.
- Do not copy `codex` release content literally into another repository's
  skill; reuse only its section structure when it fits.
- Do not merge commit-stage and release-stage responsibilities into one skill
  unless the repository already does so explicitly.
- Do not add version bump helpers, release shims, or compatibility layers
  without explicit repository evidence.
- Do not encode secrets, tokens, credentials, or private registry values.
- Do not mark the generated skill executable when core release facts are still
  unknown.

## Verification Hooks

- Verify the generated release skill is repository-specific rather than generic.
- Verify the release notes section headings and changelog format are explicit.
- Verify every release phase in the final workflow is backed by at least one
  repository evidence source when such phases are included.
- Verify the tag rule and version source are explicit when the generated skill
  includes release execution logic.
- Verify downstream publish channels are either evidenced or omitted.
- Verify all unknowns are marked as `TODO(repo-verify)` or `BLOCK`.
- Verify `agents/openai.yaml` metadata matches the generated skill version and
  purpose.
