# Acceptance Criteria & Review Standards

## Usage

Apply the universal criteria to every bootstrap run. Add the engineering and
planning checks when the scaffold will be used for active code work.

## Universal Acceptance Criteria

- **Repository preserved**: The canonical repository remains in place and is not
  moved, renamed, or scaffolded over.
- **External companion root**: The generated hub resolves outside the
  repository.
- **Minimum inputs enforced**: `repo_root` and `project_brief` are both
  required.
- **Default role pack present**: `coordinator`, `engineer`, and `advisor`
  workspaces are created.
- **Manifest written**: `bootstrap-manifest.json` records inputs, inferred
  profile, created paths, unchanged paths, and conflicts.
- **Engineer layout complete**: Engineer workspace includes `repos/` and
  `worktrees/`.
- **Idempotent rerun**: Re-running the scaffold does not rewrite unchanged
  template files.
- **Manifest update policy**: `bootstrap-manifest.json` may update on rerun to
  reflect the latest scaffold result, but template files remain unchanged unless
  explicitly customized.
- **Conflict-safe**: Existing user-edited files are skipped and reported, not
  overwritten.
- **Dry-run safe**: Dry-run mode produces a plan without writing files.

## Domain-Specific Criteria

### Engineering / Repo Operations

- Stack signals are inferred from the repository or brief and recorded in the
  manifest.
- Engineer instructions explicitly defer task isolation to the worktree skill.
- No task worktree is created during bootstrap.

### Product / Planning

- Shared project docs identify the project brief, primary workflows, and
  decision logs.
- Coordinator instructions clearly separate planning, integration, and code
  implementation responsibilities.
- Advisor instructions clearly separate assumption review from code ownership.

## Reviewer Challenge Checklist

- What path mistake would accidentally place the hub inside the repository?
- Which file is most likely to be user-customized and should therefore never be
  silently overwritten?
- What signal would show that the advisor flavor heuristic picked the wrong
  variant?
- What would make the engineer workspace unusable for worktree-based coding?
- What should be verified before declaring a bootstrap run safe for adoption?
