---
name: project-doc-record-skill
description: v0.1.1 - Record a concrete agreed project plan into repository documentation by following the project’s current documentation rules and choosing between root docs and module docs; use when a feature, module, frontend, or backend proposal has been discussed and now needs a formal RFC, ADR, architecture, or spec document.
---

# Project Documentation Record Skill

## Trigger and Scope

Use this skill when a concrete plan has already been discussed and must now be
recorded into the correct project documentation file.

In scope:
- inspecting the project’s existing documentation rules first
- classifying the content as `rfc`, `adr`, `architecture`, `spec`, or another
  formal doc type
- deciding the right level: `system`, `domain`, `module`, or `component`
- choosing the target path and whether to create or update a file
- generating front matter that matches the project’s current conventions
- writing the document body in a clean, decision-grade structure
- linking the new or updated doc back to the relevant issue or context

Out of scope:
- designing the project’s entire documentation governance model from scratch
- writing product copy, README prose, or informal notes
- recording a plan before the content has enough agreement to stand as a
  durable document
- migrating a whole docs tree in one pass

## Workflow

1. Inspect current repository doc rules first.
   - Look for root `docs/`, module-local `*/docs/`, existing RFC, ADR,
     architecture, and spec files, front matter patterns, naming rules, and
     indexing conventions.
   - If the project has no clear rules, fall back to a light default structure
     and note that `project-doc-governance-skill` should be used later to
     formalize the system.
2. Clarify the recording target.
   - Identify what is being recorded: proposal, decision, current
     architecture, stable contract, or operational procedure.
   - Confirm the scope level: `system`, `domain`, `module`, or `component`.
3. Classify the document type.
   - Use the project’s current categories first.
   - If the repo lacks categories, default to `rfc`, `adr`, `architecture`,
     `spec`, `guide`, `runbook`, `postmortem`, or `policy`.
4. Decide whether to create or update.
   - Reuse an existing authoritative doc when the new content clearly belongs
     in it.
   - Create a new file when reusing would blur scope, ownership, or lifecycle.
5. Choose the target path.
   - Follow the repo’s current folder conventions when they are coherent.
   - Decide whether the content belongs in:
     - root `docs/` for project-level or cross-module source-of-truth docs
     - module-local `*/docs/` for implementation and local operating notes
   - Otherwise place the doc in a minimal default path that matches the chosen
     type and scope.
6. Build front matter.
   - Reuse the project’s metadata pattern when one exists.
   - Otherwise apply a small default front matter set with owner, status, and
     dates.
7. Write the document body.
   - Record the agreed content in a durable structure.
   - Keep task tracking details in issues, not in the formal doc body.
8. Link the record.
   - Add relevant issue references, related docs, or replacement links when
     appropriate.
9. Verify fit.
   - Confirm the document type, level, path, and status all match the content.
   - Confirm the file can be found later by a developer who did not join the
     original discussion.

## Required Inputs

- Project or repository name
- The concrete plan, decision, or design content to record
- Any known related issue, task, or existing document

## Defaults

- Inspection mode: inspect repo docs first, then adapt
- Default type set: `rfc`, `adr`, `architecture`, `spec`, `guide`,
  `runbook`, `postmortem`, `policy`
- Default levels: `system`, `domain`, `module`, `component`
- Default front matter baseline: `id`, `title`, `type`, `level`, `domain`,
  `status`, `owner`, `created_at`, `updated_at`
- Default placement strategy: root `docs/` for decisions and shared contracts;
  module-local `*/docs/` for local implementation guidance
- Default create/update rule: update only when scope clearly matches; otherwise
  create a new file
- Default status choice:
  - proposal => `draft`
  - accepted proposal => `accepted`
  - current architecture/spec/runbook => `active`

## Bundled Resources

- `references/doc-type-classification.md`
- `references/path-selection-and-placement.md`
- `references/frontmatter-template-rules.md`
- `references/create-vs-update-rules.md`
- `references/example-output.md`

## Output Format

```text
## Recording Goal
## Current Repo Convention
## Selected Document Type and Level
## Target Path
## Create or Update Decision
## Front Matter Plan
## Body Structure
## Related Links
## Notes and Risks
```

## Guardrails

- Do not record a plan before its scope and purpose are clear enough to
  classify.
- Do not invent a new project rule when the repo already has a coherent one.
- Do not put durable design or contract knowledge only in issues or chat logs.
- Do not force new files when an existing authoritative document should be
  updated instead.
- Do not place project-level RFC, ADR, or cross-module spec records into
  module-local `*/docs/`.
- Do not place module-only implementation notes into root `docs/` unless they
  are intentionally being promoted to project-level visibility.
- Do not update an existing doc if it would mix unrelated scopes or ownership.
- Do not use front matter fields that the repo cannot realistically maintain.
- Do not turn a formal doc into a task checklist or sprint log.

## Verification Hooks

- Verify that the repo’s current documentation pattern was checked first.
- Verify that the chosen doc type matches the content’s primary job.
- Verify that the chosen level is the smallest level that still fits.
- Verify that the selected path follows repo conventions or a clear default.
- Verify that the selected docs root matches the document scope and
  source-of-truth role.
- Verify that the create-vs-update decision preserves source-of-truth clarity.
- Verify that front matter is coherent and not over-specified.
- Verify that the resulting document can be found and understood without the
  original chat context.
