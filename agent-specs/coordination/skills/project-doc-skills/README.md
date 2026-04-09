# Project Doc Skills

This package contains two related Codex skills for project documentation work.
Together they are meant to prevent proposal-only documentation and make project
docs easier to read from the top down.

## Skills

### `project-doc-governance-skill`
- Purpose: inspect or redesign a repository's documentation information
  architecture.
- Use when:
  - the docs feel siloed
  - RFCs are overloaded and other types are barely used
  - there is no clear current-state or manual entrypoint
  - you need active-vs-reserved doc types, promotion rules, lineage rules, or
    navigation guidance

### `project-doc-record-skill`
- Purpose: record or promote one concrete documentation artifact with the right
  companion updates.
- Use when:
  - a feature, module, or system change needs to become durable documentation
  - an RFC has been implemented and may need current-state, ADR, contract,
    guide, or runbook follow-up
  - you need to choose whether this should stay single-doc or update multiple
    related docs

## Recommended Workflow

1. Use `project-doc-governance-skill` first when the repository lacks a clear
   reader-first documentation system.
2. Use `project-doc-record-skill` to record a proposal, current-state update,
   contract, guide, or operational doc under those rules.
3. Use `project-doc-record-skill` in `promote-rfc` style work whenever an
   implemented RFC must be projected back into current-state and other related
   docs.
4. If the repository already has coherent governance, most day-to-day work can
   go directly through `project-doc-record-skill`.

## Package Roles

- `project-doc-governance-skill`
  - defines reader entry model
  - defines active and reserved doc types
  - assigns current-state or manual ownership
  - defines promotion and lineage rules
- `project-doc-record-skill`
  - locates one change in the system
  - chooses the lifecycle role and primary artifact
  - decides whether companion docs must update
  - records or promotes the resulting docs

## Example Prompts

### Governance

```text
Use $project-doc-governance-skill to inspect this repository's actual docs
usage and redesign its documentation information architecture because RFCs are
overloaded and the docs feel siloed.
```

### Record

```text
Use $project-doc-record-skill to inspect this repository's current doc rules,
locate this feature change in the system, and record the right documentation
artifact plus any required current-state or companion doc updates.
```

### Promote RFC

```text
Use $project-doc-record-skill to promote this implemented RFC into the right
current-state, ADR, guide, and index updates for the repository.
```

## Package Layout

```text
project-doc-skills/
  README.md
  project-doc-governance-skill/
    SKILL.md
    agents/openai.yaml
    references/
  project-doc-record-skill/
    SKILL.md
    agents/openai.yaml
    references/
```

## Notes

- Each skill is self-contained and keeps its own `references/`.
- This README is only a package-level entry point; operational details stay in
  each skill's own `SKILL.md`.
