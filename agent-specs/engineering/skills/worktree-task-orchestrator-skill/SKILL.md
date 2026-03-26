---
name: worktree-task-orchestrator-skill
description: v0.1.1 - Create a dedicated git worktree and bootstrap a tmux task window where a forked orchestrator agent manages coder, issue, and review lanes.
---

# Worktree Task Orchestrator Skill

## Trigger and Scope

Use this skill when a code task should start in a new worktree and then move
immediately into a multi-lane execution window inside tmux.

This skill is for tracked engineering work where one tmux window should
represent one task and one worktree, while multiple pane roles may collaborate
inside that window.

In scope:
- create a new worktree for the task
- open one tmux window for that worktree
- create titled panes inside that window
- fork the current Codex session into an orchestrator pane
- let the orchestrator assign roles such as `coder`, `issue-draft`, and
  `reviewer`

Out of scope:
- docs-only tasks
- direct implementation in the current workspace
- uncontrolled multi-writer execution
- always-on independent audit claims

## Core Purpose

- Keep the isolation guarantee of worktree-per-task.
- Model one task as one tmux window with visible role lanes.
- Make the first fork a control-plane agent, not a direct implementer.
- Allow traceability and review work to stay near the coding lane without
  turning every task into a full committee.
- Preserve operator control with explicit pane titles and role ownership.

## Required Inputs

- `repo_root`: absolute repository root path.
- `task_kind`: one of `feat|fix|refactor|chore`.
- `task_slug`: lowercase kebab-case task id.

## Optional Inputs

- `base_branch`: default current checked out branch at `repo_root`; if `HEAD`
  is detached, require an explicit value.
- `worktree_root`: default `<repo_root>/../_worktrees`.
- `task_context`: concise task statement used by the orchestrator.

## Optional Environment Inputs

- `WORKTREE_AUTO_TMUX_WINDOW`: `1|0`, default `1`.
- `WORKTREE_ORCH_LAYOUT`: `dual-pane|three-pane`, default `dual-pane`.
- `WORKTREE_ORCH_INITIAL_ROLES`: comma-separated roles, default
  `orchestrator,coder`.
- `WORKTREE_ORCH_SECONDARY_ROLE`: `issue-draft|reviewer|none`, default `none`.
- `WORKTREE_ORCH_REVIEW_START`: `post-plan|post-diff`, default `post-diff`.
- `WORKTREE_PANE_TITLE_ORCH`: default `orchestrator`.
- `WORKTREE_PANE_TITLE_CODER`: default `coder`.
- `WORKTREE_PANE_TITLE_SECONDARY`: default derived from secondary role.
- `WORKTREE_FORK_CODEX`: `1|0`, default `1`.
- `WORKTREE_FORK_PROMPT`: optional orchestrator prompt override.
- `WORKTREE_PANE_MESSAGE_MODE`: `literal-enter`, default `literal-enter`.

## Fixed Defaults

- `isolation_policy=always-new-worktree`
- `window_policy=one-task-one-window`
- `execution_mode=orchestrated`
- `primary_role=orchestrator`
- `writer_policy=single-writer-by-default`
- `secondary_role_policy=phase-bound`
- `tmux_layout_policy=explicit-pane-titles`
- `cleanup_policy=manual-retain`
- `branch_pattern=task/<task_kind>/<yyyymmdd>-<task_slug>`
- `path_pattern=<worktree_root>/<task_kind>-<task_slug>`

## Role Model

### Orchestrator
- Owns the task window and pane map.
- Decides whether `issue-draft` or `reviewer` is needed.
- Keeps the active plan, role boundaries, and handoff state visible.
- Does not become the default long-running code writer.

### Coder
- Default implementation lane.
- Owns edits unless the orchestrator explicitly assigns disjoint write scopes.
- Reports changed files, verification, and remaining risks.

### Issue-Draft
- Pre-implementation lane only.
- Drafts or refines the canonical issue/problem statement.
- Must not drift into implementation.
- Should exit or go idle after issue framing is complete.

### Reviewer
- Post-plan or post-diff lane only.
- Reviews for correctness, risk, regressions, and missing validation.
- Must not be presented as independent audit unless its prompt and scope are
  explicitly review-only.

## Pane Communication Protocol

Pane-to-pane communication must be treated as Codex TUI input, not shell
command injection.

Required pattern:

1. send literal text
2. send `Enter` separately

Use:

```bash
tmux send-keys -t "<pane_target>" -l "<message>"
tmux send-keys -t "<pane_target>" Enter
```

Do not use:

```bash
tmux send-keys -t "<pane_target>" "<message>" C-m
```

Reason:
- `-l` sends raw text without tmux key-name interpretation
- a separate `Enter` is closer to human interaction with the Codex TUI
- this reduces cases where the input is interpreted as plain inserted text
  instead of a submitted message

### Required Status Messages

The orchestrator owns the canonical pane state and should require explicit lane
notifications.

Minimum status protocol:
- `coder -> orchestrator` when implementation starts
- `coder -> orchestrator` when a reviewable diff or verification result exists
- `orchestrator -> reviewer` when review should begin
- `reviewer -> orchestrator` when findings are ready
- `orchestrator -> coder` when fixes or follow-up are required

### Suggested Message Templates

Coder ready for review:

```text
[handoff][coder->orchestrator]
status: review-ready
changed_files: <paths>
checks_run: <commands or none>
risks: <top risks>
request: dispatch reviewer
```

Orchestrator dispatches reviewer:

```text
[handoff][orchestrator->reviewer]
task: review current implementation
focus: correctness, regressions, missing validation
artifacts: <changed files / diff summary / checks>
response_format: findings-first
```

Reviewer returns findings:

```text
[handoff][reviewer->orchestrator]
status: review-complete
findings: <top findings or none>
open_risks: <remaining risks>
recommendation: <fix-now | acceptable-with-risk | needs-human-decision>
```

## Guardrails

- Do not use this skill unless tmux is available or the operator accepts manual
  non-tmux fallback commands.
- Do not modify the current workspace.
- Do not create worktree directories inside `repo_root`.
- Do not launch more than three panes by default.
- Do not assign two writing lanes to the same files unless the operator
  explicitly approves disjoint write scopes.
- Do not run `issue-draft` and `reviewer` as one undifferentiated long-lived
  pane role.
- Do not claim independent review when all panes inherit the same starting
  context unless the reviewer lane is tightly constrained.
- Pane titles are mandatory.
- Inter-pane Codex messages must use `tmux send-keys -l ...` followed by a
  separate `Enter`.
- If the orchestrator fork starts successfully, the parent agent stops after
  reporting handoff.

## Recommended Task Sequence

1. bootstrap the new worktree
2. open one tmux task window
3. create and title the initial pane layout
4. fork the current Codex session into the `orchestrator` pane
5. let the orchestrator inspect task context and choose minimal active roles
6. if needed, dispatch the `coder` lane
7. if needed, run `issue-draft` before implementation starts
8. if needed, run `reviewer` only after a plan or diff exists
9. finalize with issue traceability checks and commit preparation

Interpretation:
- This skill owns both the isolation boundary and the initial execution
  topology.
- The orchestrator chooses the smallest useful role set for the task.
- `issue-draft` is a phase, not a permanent companion pane.
- `reviewer` is late-bound by default.

## Workflow

1. Validate inputs (`repo_root`, `task_kind`, `task_slug`).
2. Resolve `base_branch`, then compute branch name and worktree path.
3. Run preflight checks:
   - repo exists and is a git worktree
   - base branch resolves
   - target branch does not exist
   - target path does not exist
   - `worktree_root` is outside `repo_root`
4. Create the worktree branch:
   - `git -C <repo_root> worktree add -b <branch> <worktree_path> <base_branch>`
5. Detect tmux environment:
   - if `TMUX` is set and `tmux` exists, open one persistent shell window at
     `<worktree_path>`
6. Build the pane layout:
   - `dual-pane`: `orchestrator` + `coder`
   - `three-pane`: `orchestrator` + `coder` + one phase-bound secondary pane
7. Set pane titles immediately after creation.
8. Fork the current Codex session into the `orchestrator` pane:
   - the fork prompt must instruct the agent to act as a task orchestrator,
     assign roles conservatively, and keep one canonical pane map
9. Optional secondary lane startup:
   - `issue-draft` may start only before coding begins
   - `reviewer` may start only after a plan or diff exists unless explicitly
     overridden
10. When panes need to communicate, send messages with literal-text plus
    separate-Enter protocol.
11. Print handoff commands:
   - `cd <worktree_path>`
   - `tmux select-window -t <window_name>`
   - pane titles and current role plan
12. If the orchestrator fork started:
   - parent agent reports handoff and stops

## Standard Manual Flow (Recommended)

```bash
repo_root="/repo"
task_kind="refactor"
task_slug="sample-task"
base_branch="${BASE_BRANCH_OVERRIDE:-$(git -C "$repo_root" symbolic-ref --quiet --short HEAD)}"
if [ -z "$base_branch" ]; then
  echo "error: detached HEAD; set BASE_BRANCH_OVERRIDE explicitly" >&2
  exit 1
fi

worktree_root="$(dirname "$repo_root")/_worktrees"
branch="task/${task_kind}/$(date +%Y%m%d)-${task_slug}"
worktree_path="${worktree_root}/${task_kind}-${task_slug}"
session_name="$(tmux display-message -p '#S')"
window_name="wt-${task_slug}"

git -C "$repo_root" worktree add -b "$branch" "$worktree_path" "$base_branch"
tmux new-window -d -t "$session_name" -n "$window_name" -c "$worktree_path"
tmux split-window -h -t "${session_name}:${window_name}" -c "$worktree_path"
tmux select-pane -t "${session_name}:${window_name}.0" -T "orchestrator"
tmux select-pane -t "${session_name}:${window_name}.1" -T "coder"
```

Fork the current session into the orchestrator pane:

```bash
session_id="${CODEX_SESSION_ID:-${CODEX_THREAD_ID}}"
prompt='Act as the task orchestrator in this worktree window. First inspect repo state and task context. Keep one canonical role plan. Dispatch the coder lane conservatively. Use issue-draft only before coding starts. Use reviewer only after a plan or diff exists unless explicitly required earlier. Keep pane ownership explicit and avoid multi-writer overlap.'

printf -v fork_cmd 'codex fork %q %q --cd %q --full-auto --no-alt-screen' \
  "$session_id" "$prompt" "$worktree_path"
tmux send-keys -t "${session_name}:${window_name}.0" "$fork_cmd" C-m
```

Optional third pane for a phase-bound secondary role:

```bash
tmux split-window -v -t "${session_name}:${window_name}.1" -c "$worktree_path"
tmux select-pane -t "${session_name}:${window_name}.2" -T "issue-draft"
```

Recommended pane-message pattern after forks are live:

```bash
tmux send-keys -t "${session_name}:${window_name}.0" -l "[handoff][coder->orchestrator]
status: review-ready
changed_files: app/service.py tests/test_service.py
checks_run: pytest tests/test_service.py -q
risks: none
request: dispatch reviewer"
tmux send-keys -t "${session_name}:${window_name}.0" Enter
```

Verify window and pane titles:

```bash
tmux list-panes -t "${session_name}:${window_name}" -F '#S:#I.#P #{pane_title} #{pane_current_path}'
tmux capture-pane -pt "${session_name}:${window_name}.0" -S -30
```

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
- layout:

## Pane Map
- pane_titles:
- orchestrator_pane:
- coder_pane:
- secondary_pane:
- secondary_role:

## Codex Fork
- fork_enabled:
- fork_status:
- fork_session_source:
- fork_command:
- parent_should_stop:
- parent_stop_reason:

## Role Plan
- active_roles:
- writer_lane:
- issue_lane_phase:
- review_lane_phase:

## Messaging Protocol
- pane_message_mode:
- handoff_rules:
- review_trigger:

## Execution Commands
- git worktree add ...
- tmux new-window ...
- tmux split-window ...
- tmux select-pane -T ...
- tmux send-keys ...

## Task Handoff
- task_window:
- implement_in:
- orchestrate_in:
- pane_selection_hint:
- integration_note:

## Cleanup Notes
- policy: manual-retain
- cleanup_cmd: git -C <repo_root> worktree remove <worktree_path>
```
