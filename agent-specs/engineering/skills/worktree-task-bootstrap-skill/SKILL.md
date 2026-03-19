---
name: worktree-task-bootstrap-skill
description: v0.1.10 - Create a dedicated git worktree for every code task before implementation, auto-open tmux windows, optionally fork current Codex session into the new window, optionally start a child agent asynchronously, provide a portable launcher, block unsafe/in-ws worktree paths, and enforce parent-agent stop-after-fork handoff.
---

# Worktree Task Bootstrap Skill

## Trigger and Scope

Use this skill before any code task (`feat`, `fix`, `refactor`, `chore`).

This skill is required when a task will modify source code, configs, or tests.
Do not use it for discussion-only or docs-only work unless a branch workspace is still desired.

## Core Purpose

- Force isolation: every code task starts in a new worktree.
- Keep current workspace clean for review and integration.
- Use the operator's current branch as the default baseline unless `base_branch` is explicitly overridden.
- Reduce accidental cross-task contamination.
- If inside tmux, open a new tmux window in the new worktree path.
- If task context exists, optionally launch a child agent in a separate tmux window so the primary flow stays unblocked.

## Required Inputs

- `repo_root`: absolute repository root path.
- `task_kind`: one of `feat|fix|refactor|chore`.
- `task_slug`: lowercase kebab-case task id.

## Optional Inputs

- `base_branch`: default current checked out branch at `repo_root`; if `HEAD` is detached, require an explicit value.
- `worktree_root`: default `<repo_root>/../_worktrees`.

## Optional Environment Inputs

- `WORKTREE_AUTO_TMUX_WINDOW`: `1|0`, default `1`.
- `WORKTREE_TMUX_WINDOW_NAME`: optional primary worktree window name.
- `WORKTREE_FORK_CODEX`: `1|0`, default `0`; fork current Codex session into the new primary tmux window.
- `WORKTREE_FORK_PROMPT`: optional fork prompt override.
- `WORKTREE_CURRENT_TASK`: task context text; when present, enables child-agent preparation.
- `WORKTREE_AUTO_SUBAGENT`: `1|0`, default `1`.
- `WORKTREE_SUBAGENT_PROMPT`: optional child-agent prompt override.
- `WORKTREE_SUBAGENT_WINDOW_NAME`: optional child-agent tmux window name.

## Fixed Defaults

- `isolation_policy=always-new-worktree`
- `base_branch_policy=current-branch-unless-overridden`
- `cleanup_policy=manual-retain`
- `bootstrap_method=manual-commands`
- `tmux_auto_window=enabled`
- `codex_fork_mode=optional-primary-window`
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
- If `fork_status=started-primary-window`, parent agent must stop this turn after reporting handoff.

## Common Failure Modes and Fixes

### 1. tmux window was created but "disappears"

Cause:
- Using `tmux new-window ... "<one-shot command>"` will close the window as soon as that command exits.
- This is easy to hit when running `codex fork ...` directly as the window command.

Fix:
- Prefer opening a plain shell window first, then inject the fork command with `tmux send-keys`.
- If a one-shot command must be used, keep the shell alive afterward with `; exec bash`.

Recommended pattern:

```bash
tmux new-window -d -t <session> -n <window_name> -c <worktree_path>
tmux send-keys -t <session>:<window_name> \
  "codex fork <session_id> \"<prompt>\" --cd \"<worktree_path>\" --full-auto --no-alt-screen" C-m
```

Fallback one-shot pattern:

```bash
tmux new-window -d -t <session> -n <window_name> -c <worktree_path> \
  "bash -lc 'codex fork <session_id> \"<prompt>\" --cd \"<worktree_path>\" --full-auto --no-alt-screen; exec bash'"
```

### 2. Nested shell quoting breaks the fork command

Cause:
- Deeply nested quoting such as `bash -lc "tmux new-window ... 'codex fork ...'"` is brittle.
- Prompts with spaces, quotes, or punctuation can produce `unexpected EOF while looking for matching` errors.

Fix:
- Avoid composing the entire bootstrap in one nested shell string when tmux + prompt text are both involved.
- Prefer the two-step `new-window` + `send-keys` flow.
- If a single command is unavoidable, store prompt and paths in variables first and expand them in one shell layer only.

Best practice:
- Treat `tmux new-window` as window creation only.
- Treat `tmux send-keys` as command dispatch only.
- Do not mix multiple quoting layers unless you have no alternative.

### 3. Sandboxed tmux inspection fails

Cause:
- In restricted environments, tmux socket access may fail with errors such as `Operation not permitted`.

Fix:
- If available, rerun tmux inspection with the required escalation/approval path.
- If escalation is not appropriate, report that window creation could not be verified from the sandbox and provide manual verification commands.

Manual verification commands:

```bash
tmux list-windows -a
tmux capture-pane -pt <session>:<window_index> -S -30
```

## Best Practices

- Prefer `new-window` + `send-keys` over a one-shot window command for any interactive tool.
- Verify success explicitly after bootstrap with `tmux list-windows -a` and confirm the pane path matches `<worktree_path>`.
- Use stable, predictable tmux window names so retries can detect and replace stale windows safely.
- When re-running bootstrap, kill or rename conflicting windows before recreating them.
- If the forked session is expected to continue unattended, use `--no-alt-screen` so scrollback and captured output remain visible.
- Report both the worktree path and the exact `tmux select-window` fallback command in the handoff.

## Recommended Task Sequence

For tracked engineering work, the default sequence is:

1. bootstrap worktree
2. confirm or create the issue before meaningful implementation starts
3. implement in the new worktree
4. rerun `issue-gate-skill` before commit preparation to verify traceability and emit `refs_line`
5. finalize the commit with `git-commit-skill`

Interpretation:
- This skill owns the first boundary only: no code edits before the new worktree exists.
- Issue creation is not meant to be deferred by default until after implementation.
- Retroactive issue creation is a recovery path for missing traceability, not the preferred operating mode.
- Small `docs|chore|test` tasks or short exploratory spikes may follow repository policy exceptions, but they still must pass the final commit gate.

## Workflow

1. Validate inputs (`repo_root`, `task_kind`, `task_slug`).
2. Resolve `base_branch`, then compute branch name and worktree path from fixed patterns.
3. Run preflight checks:
   - repo exists and is a git worktree
   - if `base_branch` is omitted, the current branch resolves from `repo_root`
   - if `HEAD` is detached and `base_branch` is omitted, block and require an explicit `base_branch`
   - resolved base branch exists locally or on `origin`
   - target branch does not exist
   - target path does not exist
   - `worktree_root` is outside `repo_root`
   - worktree root is writable (if not writable, block and show permission/rerun hint)
4. Create the worktree branch:
   - `git -C <repo_root> worktree add -b <branch> <worktree_path> <base_branch>`
5. Detect tmux environment:
   - if `TMUX` is set and `tmux` exists, open a persistent shell window at `<worktree_path>`
6. Optional codex fork into the primary tmux window:
   - if `WORKTREE_FORK_CODEX=1` and codex session id is available (`CODEX_SESSION_ID` or `CODEX_THREAD_ID`):
     - dispatch `codex fork <session_id> <prompt> --cd <worktree_path> --no-alt-screen` into the new primary window with `tmux send-keys`
     - verify the target window exists before reporting handoff
7. Optional child-agent launch:
   - if `WORKTREE_CURRENT_TASK` exists and `WORKTREE_AUTO_SUBAGENT=1`:
     - in tmux: open a second window and run `codex <prompt>` asynchronously
     - outside tmux: output a ready-to-run child-agent command (manual)
8. Print handoff commands:
   - `cd <worktree_path>` (non-tmux fallback)
   - `tmux select-window -t <window_name>` (tmux primary window)
9. If fork started in the primary window:
   - parent agent reports "fork done" and stops immediately
   - parent agent must not continue implementation in this turn
10. Keep worktree after delivery; cleanup is manual.

## Standard Manual Flow (Recommended)

This skill's source of truth is a manual command flow.
Do not rely on repository-local helper scripts as the default path.
This skill no longer provides helper bootstrap scripts; remove or ignore any old local copies.

Recommended sequence:

```bash
repo_root="/repo"
task_kind="refactor"
task_slug="kg-enum-types"
base_branch="${BASE_BRANCH_OVERRIDE:-$(git -C "$repo_root" symbolic-ref --quiet --short HEAD)}"
if [ -z "$base_branch" ]; then
  echo "error: detached HEAD; set BASE_BRANCH_OVERRIDE explicitly" >&2
  exit 1
fi
worktree_root="$(dirname "$repo_root")/_worktrees"
branch="task/${task_kind}/$(date +%Y%m%d)-${task_slug}"
worktree_path="${worktree_root}/${task_kind}-${task_slug}"

git -C "$repo_root" worktree add -b "$branch" "$worktree_path" "$base_branch"
```

If tmux is available, create a persistent window first:

```bash
session_name="$(tmux display-message -p '#S')"
window_name="wt-${task_slug}"

tmux new-window -d -t "$session_name" -n "$window_name" -c "$worktree_path"
```

If Codex fork is required, inject it into that window instead of using a one-shot tmux command:

```bash
session_id="${CODEX_SESSION_ID:-${CODEX_THREAD_ID}}"
prompt='Continue in this new worktree and complete the assigned task. First inspect repo state, respect existing user changes, run focused verification, and report changed files and remaining risks.'

tmux send-keys -t "${session_name}:${window_name}" \
  "codex fork ${session_id} \"${prompt}\" --cd \"${worktree_path}\" --full-auto --no-alt-screen" C-m
```

Verify the window exists before reporting success:

```bash
tmux list-windows -t "$session_name" -F '#S:#I:#W:#{pane_current_path}'
```

Optional pane output check:

```bash
tmux capture-pane -pt "${session_name}:${window_name}" -S -30
```

### Worked Example: Successful Sibling Worktree Bootstrap

Use this pattern when the current repository already lives under a `_worktrees/` directory and you want the new worktree as a sibling of the current one instead of nesting another `_worktrees` directory under it.

```bash
repo_root="/repo-parent/_worktrees/feat-current-task"
base_branch="feature/current-base-branch"
task_kind="refactor"
task_slug="sample-task"
worktree_root="$(dirname "$repo_root")"
branch="task/${task_kind}/$(date +%Y%m%d)-${task_slug}"
worktree_path="${worktree_root}/${task_kind}-${task_slug}"
session_name="$(tmux display-message -p '#S')"
window_name="wt-${task_slug}"
session_id="${CODEX_SESSION_ID:-${CODEX_THREAD_ID}}"
prompt='Continue in this new worktree and complete the assigned task. First inspect repo state, respect existing user changes, run focused verification, and report changed files plus remaining risks.'

if git -C "$repo_root" show-ref --verify --quiet "refs/heads/$branch"; then
  echo "error: target branch already exists: $branch" >&2
  exit 1
fi

if [ -e "$worktree_path" ]; then
  echo "error: target worktree path already exists: $worktree_path" >&2
  exit 1
fi

git -C "$repo_root" worktree add -b "$branch" "$worktree_path" "$base_branch"
tmux new-window -d -t "$session_name" -n "$window_name" -c "$worktree_path"
printf -v fork_cmd 'codex fork %q %q --cd %q --full-auto --no-alt-screen' "$session_id" "$prompt" "$worktree_path"
tmux send-keys -t "${session_name}:${window_name}" "$fork_cmd" C-m
sleep 2
tmux list-windows -t "$session_name" -F '#S:#I:#W:#{pane_current_path}'
tmux capture-pane -pt "${session_name}:${window_name}" -S -30
```

This pattern works because it keeps tmux window creation and command dispatch separate, uses `printf -v ... %q` to avoid prompt quoting breakage, and verifies both the window path and pane output after the fork command is injected.

## Output Format

```
## Worktree Plan
- repo_root:
- base_branch:
- base_branch_source:
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
- tmux send-keys ... (when forking codex)
- cd ... (fallback)

## Task Handoff
- implement_in:
- integration_note:

## Cleanup Notes
- policy: manual-retain
- cleanup_cmd: git -C <repo_root> worktree remove <worktree_path>
```
