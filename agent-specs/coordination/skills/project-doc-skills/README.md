# Project Doc Skills

This package contains two related Codex skills for project documentation work.

## Skills

### `project-doc-governance-skill`
- Purpose: inspect or design the documentation governance model for one
  repository.
- Use when:
  - the project has no clear doc organization rules
  - RFC, ADR, architecture, and spec docs are drifting
  - you need to define front matter, lifecycle, placement, and ownership rules

### `project-doc-record-skill`
- Purpose: record one concrete agreed plan into the correct repository document.
- Use when:
  - a feature or module plan has already been discussed
  - you need to decide whether it should be an RFC, ADR, architecture, or spec
  - you need to choose the path and create or update the file

## Recommended Workflow

1. Use `project-doc-governance-skill` first when the repository does not have a
   coherent documentation system.
2. Use `project-doc-record-skill` after a specific plan is agreed and ready to
   become a durable document.
3. If the repository already has stable doc rules, most day-to-day work should
   go directly through `project-doc-record-skill`.

## Placement Model

- Use root `docs/` for project-level decisions and formal source-of-truth
  documents such as RFCs, ADRs, cross-module architecture docs, and shared
  specs.
- Use module-local docs such as `app/docs/` or `frontend/docs/` for local
  implementation notes, local guides, and module-owned runbooks.
- If a module-local doc becomes shared across modules, promote it to root
  `docs/` and keep a pointer locally if needed.

## Example Prompts

### Governance

```text
Use $project-doc-governance-skill to inspect this repository's current
documentation rules and propose a project-specific documentation governance
model for RFC, ADR, architecture, and spec docs.
```

### Record

```text
Use $project-doc-record-skill to inspect this repository's current
documentation rules and record the agreed Graph Plan V2 design into the
correct project document.
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
