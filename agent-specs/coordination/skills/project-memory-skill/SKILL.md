---
name: project-memory-skill
description: v0.1.1 - Create and operate an explicit external memory system under ~/.agents for any project; first detect and reuse an existing project memory root when available to avoid fragmentation across branches and worktrees.
---

# Project Memory Skill

## Trigger and Scope

Use this skill when you need a durable, project-scoped memory system that is
written explicitly by the operator and stored outside the repository by
default.

In scope: bootstrapping an external memory root, capturing discussion notes,
recording accepted decisions, maintaining system-direction documents, tracking
open questions, and promoting accepted conclusions into repository docs when
explicitly requested.

Out of scope: implicit background memory, raw transcript dumps, secret storage,
vector databases, automatic repo-local note taking, or branch-specific memory by
default.

## Workflow

1. Confirm explicit write intent.
   - Write only after a direct instruction such as `record this`, `capture as decision`,
     `update system direction`, `log open question`, or `promote to project docs`.
2. Detect whether the current project already has a memory root.
   - Check `~/.agents/memories/projects/` for an existing root that clearly matches the
     current repository or previously recorded project slug before minting a new one.
   - Prefer reusing the existing root when found.
   - Only continue to a new root when no suitable existing root is discoverable or the
     operator explicitly overrides reuse.
3. Resolve the project slug and memory root.
   - Default root: `~/.agents/memories/projects/<project-slug>/`.
   - If step 2 found an existing root, treat that root and slug as authoritative.
   - Only use a different root if the operator explicitly requests it.
4. Classify the record type.
   - `session`: discussion or solution exploration.
   - `decision`: accepted choice or constraint.
   - `evolution`: long-lived direction or roadmap.
   - `open-question`: unresolved issue requiring follow-up.
5. Pick the topic and filename.
   - Session files: `YYYY-MM-DD--<topic>--<slug>.md`.
   - Decision files: `YYYY-MM-DD--decision--<slug>.md`.
   - Stable docs: `index.md`, `open-questions.md`, `evolution/system-direction.md`,
     `evolution/roadmap.md`.
6. Create or update the target file using the template assets.
   - Keep session and decision files append-only where possible.
   - Prefer `status: superseded` over deleting or rewriting history.
7. Update navigation files.
   - Refresh `index.md`.
   - Add topic or timeline pointers when they materially improve retrieval.
8. Verify the write.
   - Confirm the write was explicit, the path is external by default, the filename
     follows the convention, required fields are present, and no secrets or PII
     were recorded.
9. Report the outcome.
   - State the root path, files written, verification status, and next actions.
10. Promote to repository docs only on explicit request.
   - If the operator asks to formalize the result, convert an accepted memory item
     into an ADR, spec, README update, or issue note inside the repo.

## Required Inputs

- Project slug when no existing memory root is found or when the operator overrides the existing root
- One-sentence project purpose
- Explicit write intent
- Record type: `session`, `decision`, `evolution`, or `open-question`
- Topic token
- Short slug for the filename

## Defaults

- Storage root: `~/.agents/memories/projects/<project-slug>/`
- Root reuse policy: prefer an existing matching root over creating a new project slug
- Topic taxonomy: `architecture`, `product`, `infra`, `ux`, `data`, `process`, `research`
- Session filename: `YYYY-MM-DD--<topic>--<slug>.md`
- Decision filename: `YYYY-MM-DD--decision--<slug>.md`
- Stable overview docs: `index.md`, `open-questions.md`, `evolution/system-direction.md`,
  `evolution/roadmap.md`
- Filenames: ASCII only, lowercase, words separated with `-`
- Slug length: 3 to 6 words unless the operator asks for a shorter identifier
- Promotion mode: off by default; memory stays outside the repo until explicitly promoted

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
- Do not use repo-local storage by default; call out branch and worktree fragmentation risk
  before using project-root memory.
- Do not create a second memory root for the same project when an existing root is discoverable;
  reuse the existing root unless the operator explicitly requests a split.
- Do not let memory become the source of truth for released behavior; once promoted, the
  repository document is authoritative.
- Do not delete accepted history; mark it `superseded` and link the replacing record.
- Do not invent topics or filenames that break the naming rules when a standard token fits.

## Verification Hooks

- Confirm the write instruction is explicit and quoted in the result if needed.
- Confirm an existing project memory root was checked before initializing a new one.
- Confirm the path resolves outside the repository unless the operator overrides it.
- Confirm an existing matching root was reused, or the override reason is documented.
- Confirm filenames match the documented pattern.
- Confirm session and decision records contain the required metadata fields.
- Confirm stable overview docs retain a dated update section.
- Confirm no secrets or PII were written.

## Iteration Loop (Required)

- Run acceptance review using `references/acceptance-criteria.md` and record pass or fail evidence.
- Capture gaps with scope impact and ownership.
- Define a next-iteration checklist that targets the highest-impact gap first.
- Explicitly name the highest-risk gap and the concrete verification step to close it.

## Reinforcement Plan (Required)

### Goals
- Reduce memory fragmentation across branches and worktrees.
- Improve first-pass usability by standardizing file names, paths, and write triggers.
- Keep memory auditable by preferring explicit writes, stable docs, and reversible updates.

### Operating Rules
- Reinforcement runs only when explicitly enabled by the operator.
- Each round must be localized, reversible, and auditable.
- Each round produces a plan note, change record, verification note, and reflection entry.

### Audit Baseline
Each reinforcement round must produce:
- A Git commit containing only that round's skill changes.
- An audit record in `references/reinforcement-audit.jsonl`.
- Validation via `scripts/validate_reinforcement_audit.py`.

### Four-Step Reinforcement Cycle
1. Plan
   - State the user outcome, acceptance criteria, scope in, scope out, evidence inputs, and exit condition.
2. Change
   - Keep changes small, name the guardrail or workflow affected, and define rollback.
3. Verify
   - Run reproducible checks, including at least one negative test for accidental repo-local writes.
4. Reflect
   - Record improvements, tradeoffs, next refinement, and the next accountable action.

## References

- `references/acceptance-criteria.md`
- `references/reinforcement-audit.jsonl`
- `scripts/validate_reinforcement_audit.py`
- `assets/project-memory.template/`
