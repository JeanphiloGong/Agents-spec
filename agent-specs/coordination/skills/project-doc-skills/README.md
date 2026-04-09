# Project Doc Skills

This package contains three related Codex skills for project documentation
work. Together they separate repository docs architecture, one-off recording,
and lifecycle progression instead of forcing all three jobs into one workflow.

## Skills

### `project-doc-architecture-skill`
- Purpose: inspect or redesign a repository's documentation information
  architecture.
- Use when:
  - the docs feel siloed
  - there is no useful system overview
  - there is no clear current-state or manual entrypoint
  - you need active-vs-reserved doc types, navigation rules, or overview
    bootstrapping

### `project-doc-record-skill`
- Purpose: record or promote one concrete documentation artifact with the right
  local updates for a single documentation wave.
- Use when:
  - a feature, module, or system change needs to become durable documentation
  - you need to decide the primary file, path, front matter, lineage, and
    immediate companion updates
  - the job is one recording wave rather than full lifecycle management

### `project-doc-lifecycle-skill`
- Purpose: manage lifecycle progression for one proposal or doc cluster.
- Use when:
  - an RFC has been accepted or implemented and you need promotion decisions
  - docs overlap, go stale, or need supersede/archive handling
  - you need to decide whether to extract ADR, add current-state, or repair
    lineage across a doc family

## Recommended Workflow

1. Use `project-doc-architecture-skill` when the repository lacks a clear
   reader-first documentation system or a usable system overview.
2. Use `project-doc-record-skill` for day-to-day document landing work:
   proposals, current-state pages, guides, contracts, and one-off decisions.
3. Use `project-doc-lifecycle-skill` when a proposal or doc cluster needs
   promotion, reconciliation, or status progression.
4. If the repository already has coherent docs architecture, most day-to-day
   work can go directly through `project-doc-record-skill`.

## Package Roles

- `project-doc-architecture-skill`
  - defines reader entry model
  - bootstraps system overview when missing
  - defines active and reserved doc types
  - assigns current-state or manual ownership
- `project-doc-record-skill`
  - locates one change in the system
  - chooses the lifecycle role and primary artifact
  - decides immediate local updates for one recording wave
  - records the resulting docs
- `project-doc-lifecycle-skill`
  - decides lifecycle progression for one proposal or doc cluster
  - determines promotion, supersede, and archive actions
  - hands concrete doc-writing work back to `project-doc-record-skill`

## Example Prompts

### Governance

```text
Use $project-doc-architecture-skill to inspect this repository's docs and
codebase, redesign its documentation information architecture, and bootstrap a
system overview because the current docs are hard to navigate.
```

### Record

```text
Use $project-doc-record-skill to inspect this repository's current doc rules,
locate this feature change in the system, and record the right documentation
artifact plus any immediate local companion updates for this recording wave.
```

### Lifecycle

```text
Use $project-doc-lifecycle-skill to inspect this implemented RFC, decide which
current-state, ADR, guide, or archive actions are needed, and hand concrete
doc-writing work to $project-doc-record-skill.
```

## Package Layout

```text
project-doc-skills/
  README.md
  project-doc-architecture-skill/
    SKILL.md
    agents/openai.yaml
    references/
  project-doc-record-skill/
    SKILL.md
    agents/openai.yaml
    references/
  project-doc-lifecycle-skill/
    SKILL.md
    agents/openai.yaml
    references/
```

## Notes

- Each skill is self-contained and keeps its own `references/`.
- This README is only a package-level entry point; operational details stay in
  each skill's own `SKILL.md`.
