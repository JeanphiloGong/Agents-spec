---
name: agent-collab-skill
description: Set up and use an optional multi-agent collaboration workspace; use when initializing agent-collab templates, defining roles, or coordinating multi-agent plans, logs, and channels for a project.
---

# Agent Collab Skill (Optional Mode)

## Purpose

Provide a lightweight, optional workflow for multi-agent collaboration that can be enabled on demand without impacting single-agent projects.

## Core Principles

1. Docs allowed, code forbidden by default.
   - Only modify documentation files unless `WRITE_CODE` is explicitly granted.
2. Layered collaboration with representatives.
   - Personal: each agent maintains plan/log/inbox/outbox.
   - Department: discussions stay in department channels.
   - Global: cross-department via representatives.
   - Leadership: reps report to the primary owner.
3. Outcome-first reporting.
   - Report only deliverables, risks, next steps, and support needed.

## Workflow

1. Decide if multi-agent mode is needed.
   - Enable only when multiple agents must coordinate concurrently.
2. Initialize collaboration workspace.
   - Create `agent-collab/` with agents, channels, and coordination folders.
3. Define roles and ownership.
   - Create or reuse agent IDs and role folders.
4. Establish communication paths.
   - Use inbox/outbox for 1:1, dept channels for team, global/leadership for cross-team.
5. Maintain append-only records.
   - Log decisions, risks, and standups without rewriting history.
6. Report outcomes.
   - Summaries should focus on deliverables, risks, next steps, and support needed.

## Required Inputs

- Project name and primary owner
- Intended roles and agent IDs
- Whether to enable multi-agent mode now or keep single-agent

## Organization Structure

- Primary owner: `human/<owner>`
- Reps: `ai/tech-lead/rep-01`, `ai/backend/rep-01`, `ai/frontend/rep-01`

## Collaboration Workspace Layout

```
agent-collab/
  agents/          # plan/log/inbox/outbox per agent
  channels/        # dept, global, leadership
  coordination/    # requests/decisions/risks/roadmap/standups/org_chart
  templates/       # role templates if needed
```

## Onboarding Rules

1. If taking over a role, reuse the same agent ID and log the takeover.
2. If creating a new role, choose a unique ID and copy from templates.
3. Create an empty `AGENTS.md` for each new agent folder.
4. Announce new roles in the appropriate channels.

## Communication Paths

- 1:1: `agents/<id>/inbox.md` and `outbox.md`
- Department: `channels/dept-*.md`
- Cross-department: `channels/global.md` (representatives only)
- Leadership: `channels/leadership.md` or `agents/human/<owner>/inbox.md`

## Records and Decisions

- Decisions: `coordination/decisions.md`
- Requests: `coordination/requests.md`
- Risks: `coordination/risks.md`
- Progress: `coordination/standups.md`
- Org chart: `coordination/org_chart.md`
- All append-only; never rewrite history.

## Permission Boundaries

- Do not modify source code or configs without explicit `WRITE_CODE`.
- Do not run destructive system commands.

## Interaction Rules

- Default to documentation-only output; do not write files unless `WRITE_DOC` is granted.
- If requirements are unclear, ask for confirmation before writing.

## Override Commands

- `WRITE_DOC`: allow doc edits
- `WRITE_CODE`: allow code edits
- `APPLY_PATCH`: apply user-provided patch only
- `GENERATE_CODE`: output code without writing files
- Always announce “已进入特权模式” before executing.

## Output Format

```
## Enablement Decision
## Roles and Ownership
## Template Initialization Steps
## Communication Paths
## Record-Keeping Rules
## Next Actions
```

## Guardrails

- Do not enable multi-agent mode unless it is explicitly requested.
- Do not modify existing historical records (append-only).
- Do not write code or configs without explicit permission.
