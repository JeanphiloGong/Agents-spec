---
name: project-role-bootstrap-skill
description: v0.1.0 - Bootstrap a companion project hub with coordinator, engineer, and advisor workspaces around an existing local repository without moving the repo.
---

# Project Role Bootstrap Skill

## Trigger and Scope

Use this skill when a repository-backed project needs a reusable multi-role hub
with separate workspaces for coordination, engineering, and advisory work.

In scope: companion-root scaffolding, role workspace templates, shared project
docs, manifest generation, and deterministic bootstrap scripts.
Out of scope: moving or cloning repositories, creating task worktrees,
automatic external memory setup, or repo-internal role scaffolding by default.

## Core Purpose

- Keep the canonical repository in place.
- Create a stable companion root beside the repository.
- Separate coordination, engineering, and advisory instructions.
- Make engineer worktree usage explicit without auto-creating task worktrees.
- Produce audit-friendly bootstrap output and conflict reporting.

## Workflow

1. Resolve the local repository root.
   - Require `repo_root` and confirm it is a local git repository.
2. Capture the minimum project brief.
   - Require `project_brief`; use it to infer project focus, advisor flavor,
     and risk signals.
3. Pick the companion root.
   - Default to `<repo_root>/../<repo_name>-hub`.
   - Reject targets inside the repository or equal to the repository root.
4. Infer the default role pack.
   - Always scaffold `coordinator`, `engineer`, and `advisor`.
   - Add extra roles only when explicitly requested.
5. Infer project profile.
   - Extract stack hints from the repository and brief.
   - Classify advisor flavor as `advisor` or `science-advisor`.
   - Record risk signals and workflow hints in the manifest.
6. Scaffold the hub from templates.
   - Create shared docs plus per-role `AGENTS.md`, `SOUL.md`, `TOOLS.md`, and
     `memory/`.
   - Create engineer `repos/` and `worktrees/` folders without cloning or
     branching the repository.
7. Respect idempotency.
   - If a target file is missing, create it.
   - If a target file already matches the template render, mark it unchanged.
   - If a target file exists with different content, report a conflict and do
     not overwrite it.
   - `bootstrap-manifest.json` is the one machine-generated exception: it may
     update on safe reruns to record the latest scaffold status.
8. Write the bootstrap manifest.
   - Record inputs, inferred profile, created paths, unchanged paths, and
     conflicts in `bootstrap-manifest.json`.
9. Verify boundaries.
   - Confirm the repository was not moved or modified.
   - Confirm the scaffold lives outside the repository.
10. Hand off follow-on work.
   - Use `worktree-task-bootstrap-skill` before any engineer code task.
   - Use `project-memory-skill` only if the operator explicitly wants external
     memory outside the hub.

## Required Inputs

- `repo_root`: absolute or user-resolved path to the canonical local repository
- `project_brief`: 3-5 sentence project summary covering purpose and primary
  workflows

## Optional Inputs

- `project_name`
- `target_root`
- `extra_roles[]`
- `dry_run`
- `json`

## Defaults

- Companion root: `<repo_root>/../<repo_name>-hub`
- Default roles: `coordinator`, `engineer`, `advisor`
- Advisor flavor:
  - `science-advisor` when the brief includes research, experiment, hypothesis,
    evaluation, simulation, optics, or paper-review signals
  - otherwise `advisor`
- Engineer workspace extras: `repos/` and `worktrees/`
- Overwrite policy: create missing, preserve matching, skip conflicting
- External memory: off by default
- Output mode: JSON when the script is invoked by automation; text is allowed
  for manual use

## Script Interface

Use `scripts/bootstrap_project_roles.py` for deterministic scaffolding.

```bash
python3 scripts/bootstrap_project_roles.py \
  --repo-root /path/to/repo \
  --project-brief "Short project summary." \
  --json
```

Dry-run:

```bash
python3 scripts/bootstrap_project_roles.py \
  --repo-root /path/to/repo \
  --project-brief "Short project summary." \
  --dry-run \
  --json
```

## Output Format

```text
## Bootstrap Intent
## Inferred Profile
## Target Layout
## Files Created
## Files Unchanged
## Conflicts / Skipped
## Verification
## Next Actions
```

## Guardrails

- Do not move, rename, reclone, or re-root the canonical repository.
- Do not scaffold inside the repository by default.
- Do not create git worktrees during project bootstrap.
- Do not overwrite user-modified files; report conflicts instead.
- Do not invent roles beyond the default pack unless explicitly requested.
- Do not auto-enable external memory or multi-agent routing.
- Do not write secrets, tokens, credentials, or PII into templates or the
  manifest.

## Verification Hooks

- Confirm `repo_root` is a git repository.
- Confirm `target_root` is outside `repo_root`.
- Confirm `bootstrap-manifest.json` lists inferred stack tags, advisor flavor,
  and risk signals.
- Confirm the default three role workspaces exist.
- Confirm engineer workspace includes `repos/` and `worktrees/`.
- Confirm dry-run mode writes nothing.
- Confirm reruns are idempotent and surface conflicts instead of overwriting.

## References

- `references/acceptance-criteria.md`
- `references/reinforcement-audit.jsonl`
- `scripts/validate_reinforcement_audit.py`
- `assets/project-role-bootstrap.template/`

## Iteration Loop (Required)

- Run acceptance review using `references/acceptance-criteria.md` and record
  pass/fail evidence.
- Capture gaps with scope impact and ownership.
- Define a next-iteration checklist that targets the highest-impact gap first.
- Explicitly name the highest-risk gap and the concrete verification step to
  close it.

## Reinforcement Plan (Required)

### Goals

- Reduce failed project bootstrap attempts caused by weak inputs or unsafe path
  choices.
- Improve first-pass usability by standardizing the default role pack and
  scaffold layout.
- Preserve trust by keeping repository mutation out of the bootstrap path.

### Operating Rules

- Reinforcement mode is off by default and must be explicitly enabled.
- Each round must be localized, auditable, and reversible.
- Each round must emit plan, change, verify, and reflect artifacts.

### Audit Baseline

Each reinforcement round must produce:

- A Git commit containing only that round's skill changes.
- An audit record in `references/reinforcement-audit.jsonl`.
- Validation via `scripts/validate_reinforcement_audit.py`.

### Four-Step Reinforcement Cycle

1. Plan
   - State the bootstrap failure or usability problem being targeted.
2. Change
   - Update a single workflow, template set, or validation rule per round when
     feasible.
3. Verify
   - Run reproducible dry-run and live-run checks against throwaway repositories.
4. Reflect
   - Record what improved, what remained brittle, and the next highest-impact
     refinement.
