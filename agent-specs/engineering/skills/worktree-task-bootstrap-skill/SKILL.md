---
name: worktree-task-bootstrap-skill
description: v0.1.8 - Create a dedicated git worktree for every code task before implementation, auto-open tmux windows, optionally fork current Codex session into the new window, optionally start a child agent asynchronously, provide a portable launcher, block unsafe/in-ws worktree paths, and enforce parent-agent stop-after-fork handoff.
---

# Worktree Task Bootstrap Skill

## Trigger and Scope

Use this skill before any code task (`feat`, `fix`, `refactor`, `chore`).

This skill is required when a task will modify source code, configs, or tests.
Do not use it for discussion-only or docs-only work unless a branch workspace is still desired.

## Core Purpose

- Force isolation: every code task starts in a new worktree.
- Keep current workspace clean for review and integration.
- Keep `main` as the human-controlled source of truth.
- Reduce accidental cross-task contamination.
- If inside tmux, open a new tmux window in the new worktree path.
- If task context exists, optionally launch a child agent in a separate tmux window so main flow stays unblocked.

## Required Inputs

- `repo_root`: absolute repository root path.
- `task_kind`: one of `feat|fix|refactor|chore`.
- `task_slug`: lowercase kebab-case task id.

## Optional Inputs

- `base_branch`: default `main`.
- `worktree_root`: default `<repo_root>/../_worktrees`.

## Optional Environment Inputs

- `WORKTREE_AUTO_TMUX_WINDOW`: `1|0`, default `1`.
- `WORKTREE_TMUX_WINDOW_NAME`: optional main worktree window name.
- `WORKTREE_FORK_CODEX`: `1|0`, default `0`; fork current Codex session into the new main tmux window.
- `WORKTREE_FORK_PROMPT`: optional fork prompt override.
- `WORKTREE_CURRENT_TASK`: task context text; when present, enables child-agent preparation.
- `WORKTREE_AUTO_SUBAGENT`: `1|0`, default `1`.
- `WORKTREE_SUBAGENT_PROMPT`: optional child-agent prompt override.
- `WORKTREE_SUBAGENT_WINDOW_NAME`: optional child-agent tmux window name.

## Fixed Defaults

- `isolation_policy=always-new-worktree`
- `cleanup_policy=manual-retain`
- `tmux_auto_window=enabled`
- `codex_fork_mode=optional-main-window`
- `subagent_mode=optional-async`
- `branch_pattern=task/<task_kind>/<yyyymmdd>-<task_slug>`
- `path_pattern=<worktree_root>/<task_kind>-<task_slug>`

## Guardrails

- Never start code edits in the current workspace when this skill is triggered.
- Never create worktree directories inside `repo_root`.
- Block if target branch already exists.
- Block if target worktree path already exists.
- Do not auto-delete worktrees after completion.
- Do not rewrite history.
- Child-agent auto-start requires explicit task context (`WORKTREE_CURRENT_TASK`).
- Do not auto-modify shell `PATH` on each run.
- If `fork_status=started-main-window`, parent agent must stop this turn after reporting handoff.

## Workflow

1. Validate inputs (`repo_root`, `task_kind`, `task_slug`).
2. Compute branch name and worktree path from fixed patterns.
3. Run preflight checks:
   - repo exists and is a git worktree
   - base branch exists locally or on `origin`
   - target branch does not exist
   - target path does not exist
   - `worktree_root` is outside `repo_root`
   - worktree root is writable (if not writable, block and show permission/rerun hint)
4. Create the worktree branch:
   - `git -C <repo_root> worktree add -b <branch> <worktree_path> <base_branch>`
5. Detect tmux environment:
   - if `TMUX` is set and `tmux` exists, auto-open a main window at `<worktree_path>`
6. Optional codex fork into main tmux window:
   - if `WORKTREE_FORK_CODEX=1` and codex session id is available (`CODEX_SESSION_ID` or `CODEX_THREAD_ID`):
     - run `codex fork <session_id> <prompt> --cd <worktree_path>` in the new main window
7. Optional child-agent launch:
   - if `WORKTREE_CURRENT_TASK` exists and `WORKTREE_AUTO_SUBAGENT=1`:
     - in tmux: open a second window and run `codex <prompt>` asynchronously
     - outside tmux: output a ready-to-run child-agent command (manual)
8. Print handoff commands:
   - `cd <worktree_path>` (non-tmux fallback)
   - `tmux select-window -t <window_name>` (tmux main window)
9. If fork started in main window:
   - parent agent reports "fork done" and stops immediately
   - parent agent must not continue implementation in this turn
10. Keep worktree after delivery; cleanup is manual.

## Recommended Script

Use `scripts/create_worktree.sh` for deterministic execution.

Example:

```bash
WORKTREE_CURRENT_TASK='Implement login happy path' \
  bash scripts/create_worktree.sh /repo feat user-login
```

With custom child-agent prompt:

```bash
WORKTREE_CURRENT_TASK='Implement login happy path' \
WORKTREE_SUBAGENT_PROMPT='Implement login happy path in this worktree and report changed files + tests.' \
  bash scripts/create_worktree.sh /repo feat user-login
```

## Portable Launcher (Recommended)

Use `scripts/wt-bootstrap` when you want path-independent usage.

- It auto-detects repo root (`git rev-parse --show-toplevel`).
- It forwards arguments to `create_worktree.sh`.
- It avoids requiring hard-coded repository paths on different devices.

Example:

```bash
bash scripts/wt-bootstrap feat user-login
```

Optional one-time install helper:

```bash
bash scripts/install-wt-bootstrap.sh
```

After install (if `~/.local/bin` is in `PATH`):

```bash
wt-bootstrap feat user-login
```

## Output Format

```
## Worktree Plan
- repo_root:
- base_branch:
- branch:
- worktree_path:

## Preflight Checks
- repo:
- base_branch:
- branch_conflict:
- path_conflict:

## Environment Detection
- tmux_env:
- tmux_window_opened:
- tmux_window_name:

## Child Agent
- task_context_present:
- subagent_status:
- subagent_window_name:
- subagent_command:

## Codex Fork
- fork_enabled:
- fork_status:
- fork_session_source:
- fork_command:
- parent_should_stop:
- parent_stop_reason:

## Execution Commands
- git worktree add ...
- tmux new-window ... (when tmux)
- cd ... (fallback)

## Task Handoff
- implement_in:
- integration_note:

## Cleanup Notes
- policy: manual-retain
- cleanup_cmd: git -C <repo_root> worktree remove <worktree_path>
```
