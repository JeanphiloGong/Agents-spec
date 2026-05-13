# Development Skill Pack

This directory contains a project-local copy of the development lifecycle
skills adapted from Addy Osmani's `agent-skills` project:

- Upstream project: https://github.com/addyosmani/agent-skills
- Local source used for this import:
  `/home/gong/date/2026/may/week3/13,Wed/agent-skills`
- Upstream license at import time: MIT License

The copied skills are kept here as a curated reference pack for this repository.
They are not generated files.

## Layout

`workflow-lifecycle/` contains the seven primary development workflow skills:

| Workflow step | Skill | Purpose |
| --- | --- | --- |
| Define what to build | `spec-driven-development` | Clarify goals, scope, boundaries, and acceptance criteria before coding. |
| Plan how to build it | `planning-and-task-breakdown` | Break a spec into small, ordered, verifiable tasks. |
| Build incrementally | `incremental-implementation` | Implement one coherent slice at a time. |
| Prove it works | `test-driven-development` | Use tests as evidence for behavior changes and bug fixes. |
| Simplify the code | `code-simplification` | Reduce complexity without changing behavior. |
| Review before merge | `code-review-and-quality` | Review bugs, risks, maintainability, and test coverage before merge. |
| Ship to production | `shipping-and-launch` | Prepare launch checks, rollout, monitoring, and rollback planning. |

`supporting-skills/` contains the remaining supporting skills from the same
pack. Use those when a task needs a specialized workflow, such as frontend UI,
security hardening, API design, debugging, performance work, CI/CD, or
documentation.

## Codex Usage

Codex invokes skills by skill name, for example:

```text
$spec-driven-development
$planning-and-task-breakdown
$incremental-implementation $test-driven-development
$code-simplification
$code-review-and-quality
$shipping-and-launch
```

This directory is a source location for project curation. If Codex needs to
auto-discover these skills, expose the desired skill directories through the
project's `.agents/skills/` path or another supported skill root.

## Maintenance Notes

When refreshing this pack from upstream, keep the lifecycle/supporting split so
readers can distinguish the primary workflow from task-specific supporting
skills. Preserve bundled resources next to their owning `SKILL.md` files.
