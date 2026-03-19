# {{PROJECT_NAME}} Project Hub

This companion root organizes AI role workspaces around the canonical
repository `{{REPO_NAME}}` without moving or recloning that repository.

## Canonical repository

- Repository name: `{{REPO_NAME}}`
- Relative path from this hub: `{{REPO_RELATIVE_FROM_HUB}}`

## Default role pack

- `roles/coordinator/`: planning, routing, integration, and shared records
- `roles/engineer/`: implementation planning and worktree-oriented coding flow
- `roles/advisor/`: assumption review and evidence quality checks

## Shared records

- `shared/PROJECT.md`: project intent and operating context
- `shared/DECISIONS.md`: append-only decision log
- `shared/RESEARCH.md`: experiments, evidence, and open findings

## Operating rules

- Keep the repository canonical and external to this hub.
- Use the engineer workspace for code-facing work.
- Create task worktrees only when needed for implementation.
- Treat this hub as coordination and role memory, not as a replacement for the
  repository.
