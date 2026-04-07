---
name: project-memory-skill
description: v0.1.2 - Create and operate an explicit external memory system under ~/.agents for one project, reusing an existing project memory root when available to avoid fragmentation across branches and worktrees.
---

# Project Memory Skill

## Trigger and Scope

Use this skill when you need a durable, project-scoped memory system that is
written explicitly by the operator and stored outside the repository by
default.

In scope:
- detecting and reusing an existing project memory root
- initializing a new external memory root when none exists
- recording `session`, `decision`, `evolution`, and `open-question` entries
- updating stable navigation docs while preserving superseded history
- promoting accepted memory into repository docs only on explicit request

Out of scope:
- implicit background memory or transcript dumps
- secret or PII storage
- vector databases or automatic indexing systems
- repo-local memory by default
- treating external memory as the source of truth for released behavior

## Workflow

1. Confirm explicit write intent.
   - Write only after a direct instruction such as `record this`,
     `capture as decision`, `update system direction`, `log open question`, or
     `promote to project docs`.
2. Detect an existing project memory root.
   - Check `~/.agents/memories/projects/` for a matching project slug or
     previously recorded root before creating anything new.
3. Resolve the authoritative root and slug.
   - Reuse the existing root when found.
   - Default new root: `~/.agents/memories/projects/<project-slug>/`.
4. Classify the record type.
   - Use `session`, `decision`, `evolution`, or `open-question`.
5. Choose the topic and filename.
   - Follow the documented naming rules and keep filenames ASCII, lowercase,
     and stable.
6. Create or update the record from the bundled templates.
   - Prefer append-only history.
   - Mark replaced items `superseded` instead of deleting them.
7. Update navigation and stable docs.
   - Refresh `index.md` and any affected overview file when retrieval would
     otherwise get worse.
8. Verify the write.
   - Confirm explicit intent, external storage, correct filename pattern,
     required fields, and absence of secrets or PII.
9. Report the outcome.
   - State the root path, files written, verification status, and any next
     action.
10. Promote to repository docs only on explicit request.
   - If promotion is requested, convert the accepted memory into the
     appropriate repo artifact and treat the repo doc as authoritative
     afterward.

## Required Inputs

- one-sentence project purpose
- explicit write intent
- record type: `session`, `decision`, `evolution`, or `open-question`
- topic token
- short filename slug
- project slug only when no matching memory root exists or when the operator
  overrides reuse

## Defaults

- storage root: `~/.agents/memories/projects/<project-slug>/`
- root reuse policy: prefer an existing matching root over creating a new one
- topic taxonomy: `architecture`, `product`, `infra`, `ux`, `data`, `process`,
  `research`
- stable overview docs: `index.md`, `open-questions.md`,
  `evolution/system-direction.md`, `evolution/roadmap.md`
- filename style: ASCII, lowercase, `-` separated
- slug length: 3 to 6 words unless a shorter identifier is explicitly
  requested
- promotion mode: off by default

## Bundled Resources

- `assets/project-memory.template/`
- `references/acceptance-criteria.md`
- `references/skill-maintenance.md`
- `references/reinforcement-audit.jsonl`
- `scripts/validate_reinforcement_audit.py`

## Output Format

```text
## Memory Intent
## Root Path
## Files Written
## Verification
## Risks
## Next Actions
```

## Guardrails

- Do not write memory files unless the operator explicitly asks for it.
- Do not store secrets, tokens, credentials, or PII.
- Do not use repo-local storage by default; call out branch and worktree
  fragmentation risk before overriding this.
- Do not create a second memory root for the same project when a matching root
  is discoverable unless the operator explicitly requests a split.
- Do not delete accepted history; mark it `superseded` and link the
  replacement.
- Do not let external memory become the authoritative source for released
  behavior after promotion.
- Do not break the filename or directory conventions when a standard token
  fits.

## Verification Hooks

- Verify the write instruction is explicit.
- Verify an existing project memory root was checked before initializing a new
  one.
- Verify the chosen path resolves outside the repository unless the operator
  explicitly overrides it.
- Verify filenames match the documented pattern.
- Verify the selected template contains the required metadata fields.
- Verify navigation docs were updated when the new record would otherwise be
  hard to retrieve.
- Verify no secrets or PII were written.
- Verify promotion boundaries remain explicit when repository docs are updated.
