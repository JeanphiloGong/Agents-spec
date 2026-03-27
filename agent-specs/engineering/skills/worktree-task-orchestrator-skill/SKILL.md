---
name: worktree-task-orchestrator-skill
description: v0.1.5 - Orchestrate pane layout, role ownership, and phased execution after a bootstrapped worktree session is forked into tmux.
---

# Worktree Task Orchestrator Skill

## Trigger and Scope

Use this skill after `worktree-task-bootstrap-skill` has created a new
worktree, opened a tmux window, and forked the current session into that
workspace.

This skill is the normal next step once the forked session has landed in the
new worktree and should decide how execution is organized before direct
implementation begins.

This skill is for tracked engineering work where one tmux window should
represent one task and one worktree, while multiple pane roles may collaborate
inside that window.

In scope:
- create titled panes inside that window
- let the orchestrator assign roles such as `coder`, `issue-gate`, and
  `reviewer`
- realize the already-agreed task plan through explicit execution lanes

Out of scope:
- creating the worktree itself
- opening the initial tmux task window
- performing the initial worktree fork
- docs-only tasks
- direct implementation in the current workspace
- uncontrolled multi-writer execution
- always-on independent audit claims

## Core Purpose

- Start from the already-bootstrapped worktree boundary.
- Model one task as one tmux window with visible role lanes.
- Turn the forked session into a control-plane agent, not a direct implementer.
- Allow traceability and review work to stay near the coding lane without
  turning every task into a full committee.
- Preserve operator control with explicit pane titles and role ownership.
- Reflect the default tracked-work expectation that issue existence is checked
  before meaningful implementation proceeds.

## Required Inputs

- `task_context`: concise task statement used by the orchestrator.

## Optional Inputs

- `repo_root`: inferred from current git root when needed.
- `task_kind`: inferred when needed.
- `task_slug`: inferred when needed.

## Optional Environment Inputs

- `WORKTREE_ORCH_LAYOUT`: `dual-pane|three-pane`, default `three-pane`.
- `WORKTREE_ORCH_INITIAL_ROLES`: comma-separated roles, default
  `orchestrator,coder`.
- `WORKTREE_ORCH_SECONDARY_ROLE`: `issue-gate|reviewer|none`, default `issue-gate`.
- `WORKTREE_ORCH_REVIEW_START`: `post-plan|post-diff`, default `post-diff`.
- `WORKTREE_PANE_TITLE_ORCH`: default `orchestrator`.
- `WORKTREE_PANE_TITLE_CODER`: default `coder`.
- `WORKTREE_PANE_TITLE_SECONDARY`: default derived from secondary role.
- `WORKTREE_PANE_MESSAGE_MODE`: `literal-enter`, default `literal-enter`.

## Fixed Defaults

- `isolation_policy=always-new-worktree`
- `window_policy=one-task-one-window`
- `execution_mode=orchestrated`
- `primary_role=orchestrator`
- `writer_policy=single-writer-by-default`
- `secondary_role_policy=phase-bound`
- `default_issue_lane=enabled`
- `tmux_layout_policy=explicit-pane-titles`
- `entry_policy=post-bootstrap-only`

## Role Model

### Orchestrator
- Owns the task window and pane map.
- Decides whether `issue-gate` or `reviewer` is needed.
- Keeps the agreed task plan, role boundaries, and handoff state visible.
- Does not become the default long-running code writer.

### Coder
- Default implementation lane.
- Owns edits unless the orchestrator explicitly assigns disjoint write scopes.
- Reports changed files, verification, and remaining risks.

### Issue-Gate
- Pre-implementation lane only.
- Checks whether the canonical issue already exists.
- Creates the issue only when missing, preferably by invoking `issue-gate-skill`.
- Must not re-plan the task or drift into implementation.
- Should exit or go idle after issue status and commit bridge are clear.

### Reviewer
- Post-plan or post-diff lane only.
- Reviews for correctness, risk, regressions, and missing validation.
- Must not be presented as independent audit unless its prompt and scope are
  explicitly review-only.

## Pane Communication Protocol

Pane-to-pane communication must be treated as Codex TUI input, not shell
command injection.

### Role-First Prompt Rule

Every newly created non-orchestrator pane must receive a first message that
starts by naming the lane identity before any task instructions.

Required first-line pattern:

```text
You are the <role> lane for this task window.
```

This is mandatory for:
- `coder`
- `issue-gate`
- `reviewer`

Purpose:
- prevent a new pane from assuming it is the orchestrator
- prevent accidental replanning or role drift
- make ownership explicit from the first line of execution

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
- `issue-gate -> orchestrator` when issue status is known
- `coder -> orchestrator` when implementation starts
- `coder -> orchestrator` when a reviewable diff or verification result exists
- `orchestrator -> reviewer` when review should begin
- `reviewer -> orchestrator` when findings are ready
- `orchestrator -> coder` when fixes or follow-up are required

### Suggested Message Templates

Issue gate result:

```text
[handoff][issue-gate->orchestrator]
status: issue-checked
issue_result: <reused | created | blocked>
issue_ref: <ISSUE: #id | none>
notes: <short note>
```

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

## Role Prompt Templates

In the normal bootstrap path, the current session is already the orchestrator.
Do not inject a second "become orchestrator" prompt into the same pane.

### Coder Prompt Template

Use when dispatching the coder lane:

```text
You are the coder lane for this task window. The task plan is already decided; do not redesign scope. Execute the assigned changes conservatively, respect existing user edits, and keep to the agreed file scope. Report changed files, checks run, and remaining risks back to the orchestrator. When a reviewable diff exists, send a handoff message to the orchestrator instead of self-approving.
```

### Issue-Gate Prompt Template

Use when dispatching the issue lane:

```text
You are the issue-gate lane for this task window. Do not plan the task and do not write production code. Check whether the canonical tracking issue already exists for the agreed task. If it exists, return the issue reference. If it does not exist, create it using `issue-gate-skill` with a concise, execution-ready task framing. After issue status is clear, report the result and commit bridge back to the orchestrator, then go idle.
```

### Reviewer Prompt Template

Use when dispatching the reviewer lane:

```text
You are the reviewer lane for this task window. Review the coder's output against the already-agreed task plan. Focus on correctness, regressions, missing validation, and scope drift. Do not rewrite the plan and do not become an implementation lane. Return findings-first feedback to the orchestrator.
```

## Guardrails

- Do not use this skill unless tmux is available or the operator accepts manual
  non-tmux fallback commands.
- Do not modify the current workspace.
- Do not create worktree directories inside `repo_root`.
- Do not launch more than three panes by default.
- Do not assign two writing lanes to the same files unless the operator
  explicitly approves disjoint write scopes.
- Do not run `issue-gate` and `reviewer` as one undifferentiated long-lived
  pane role.
- Do not use the issue lane for planning; the plan should already be decided
  before this skill starts execution.
- Every newly created non-orchestrator pane must receive a role-first prompt as
  its first message.
- Do not claim independent review when all panes inherit the same starting
  context unless the reviewer lane is tightly constrained.
- Pane titles are mandatory.
- Inter-pane Codex messages must use `tmux send-keys -l ...` followed by a
  separate `Enter`.

## Recommended Task Sequence

1. start from the bootstrapped worktree window
2. inspect task context and current repo state
3. create and title the initial pane layout
4. let the orchestrator choose minimal active roles
5. if needed, dispatch the `coder` lane
6. run `issue-gate` before implementation starts unless the operator explicitly
   selects `secondary_role=none`
7. if needed, run `reviewer` only after a plan or diff exists
8. finalize with issue traceability checks and commit preparation

Interpretation:
- This skill owns both the isolation boundary and the initial execution
  topology.
- The orchestrator chooses the smallest useful role set for the task while
  treating the task plan as already decided.
- `issue-gate` is enabled by default because tracked work should confirm issue
  existence before implementation.
- `reviewer` is late-bound by default.
- This skill should be entered by the forked bootstrap session before any
  implementation-heavy lane starts.

## Workflow

1. Validate inputs and confirm the session is already inside the intended
   worktree.
2. Inspect repo state and task context.
3. Detect tmux environment:
   - this skill assumes the bootstrap flow has already opened the task window
4. Build the pane layout:
   - `dual-pane`: `orchestrator` + `coder`
   - `three-pane`: `orchestrator` + `coder` + one phase-bound secondary pane
   - default layout is `three-pane` with `issue-gate` as the secondary role
5. Set pane titles immediately after creation.
6. Immediately send a role-first prompt to each newly created non-orchestrator
   pane.
7. Establish one canonical pane map and role plan:
   - the current session is already the orchestrator
   - assign roles conservatively and avoid multi-writer overlap
8. Optional secondary lane startup:
   - `issue-gate` starts by default and may run only before coding begins
   - `reviewer` may start only after a plan or diff exists unless explicitly
     overridden
9. When panes need to communicate, send messages with literal-text plus
    separate-Enter protocol.
10. Print handoff commands:
   - `tmux select-window -t <window_name>`
   - pane titles and current role plan
11. Dispatch downstream roles and monitor phase changes.

## Standard Manual Flow (Recommended)

```bash
session_name="$(tmux display-message -p '#S')"
window_name="$(tmux display-message -p '#W')"
worktree_path="$(pwd)"

tmux split-window -h -t "${session_name}:${window_name}" -c "$worktree_path"
tmux select-pane -t "${session_name}:${window_name}.0" -T "orchestrator"
tmux select-pane -t "${session_name}:${window_name}.1" -T "coder"
tmux split-window -v -t "${session_name}:${window_name}.1" -c "$worktree_path"
tmux select-pane -t "${session_name}:${window_name}.2" -T "issue-gate"
```

Default third pane for the issue lane:

```bash
tmux select-pane -t "${session_name}:${window_name}.2" -T "issue-gate"
```

Suggested issue-gate lane startup message:

```bash
tmux send-keys -t "${session_name}:${window_name}.2" -l "You are the issue-gate lane for this task window. Do not plan the task and do not write production code. Check whether the canonical tracking issue already exists for the agreed task. If it exists, return the issue reference. If it does not exist, create it using `issue-gate-skill` with a concise, execution-ready task framing. After issue status is clear, report the result and commit bridge back to the orchestrator, then go idle."
tmux send-keys -t "${session_name}:${window_name}.2" Enter
```

Suggested coder lane startup message:

```bash
tmux send-keys -t "${session_name}:${window_name}.1" -l "You are the coder lane for this task window. The task plan is already decided; do not redesign scope. Execute the assigned changes conservatively, respect existing user edits, and keep to the agreed file scope. Report changed files, checks run, and remaining risks back to the orchestrator. When a reviewable diff exists, send a handoff message to the orchestrator instead of self-approving."
tmux send-keys -t "${session_name}:${window_name}.1" Enter
```

Suggested reviewer lane startup message:

```bash
tmux send-keys -t "${session_name}:${window_name}.2" -l "You are the reviewer lane for this task window. Review the coder's output against the already-agreed task plan. Focus on correctness, regressions, missing validation, and scope drift. Do not rewrite the plan and do not become an implementation lane. Return findings-first feedback to the orchestrator."
tmux send-keys -t "${session_name}:${window_name}.2" Enter
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
## Task Window
- repo_root:
- worktree_path:
- tmux_window_name:

## Session Checks
- repo:
- in_worktree:
- tmux_ready:

## Pane Map
- layout:
- pane_titles:
- orchestrator_pane:
- coder_pane:
- secondary_pane:
- secondary_role:

## Role Plan
- active_roles:
- writer_lane:
- issue_lane_status:
- review_lane_phase:

## Messaging Protocol
- pane_message_mode:
- handoff_rules:
- review_trigger:

## Execution Commands
- tmux split-window ...
- tmux select-pane -T ...
- tmux send-keys ...

## Task Handoff
- task_window:
- coder_in:
- orchestrator_in:
- pane_selection_hint:
- integration_note:
```
