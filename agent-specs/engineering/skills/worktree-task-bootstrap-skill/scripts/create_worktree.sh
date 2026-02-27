#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  create_worktree.sh <repo_root> <task_kind> <task_slug> [base_branch] [worktree_root]

Arguments:
  repo_root     Absolute path to git repo root
  task_kind     feat|fix|refactor|chore
  task_slug     lowercase-kebab-case, e.g. user-login-flow
  base_branch   Optional, default: main
  worktree_root Optional, default: <repo_root>/../_worktrees

Env:
  WORKTREE_AUTO_TMUX_WINDOW   1/0, default: 1
  WORKTREE_TMUX_WINDOW_NAME   Optional override for tmux main window name
  WORKTREE_CURRENT_TASK       Optional task context; enables child-agent behavior
  WORKTREE_AUTO_SUBAGENT      1/0, default: 1
  WORKTREE_SUBAGENT_PROMPT    Optional child-agent prompt override
  WORKTREE_SUBAGENT_WINDOW_NAME Optional override for child-agent tmux window name
USAGE
}

if [[ $# -lt 3 || $# -gt 5 ]]; then
  usage
  exit 1
fi

repo_root="$1"
task_kind="$2"
task_slug="$3"
base_branch="${4:-main}"
worktree_root="${5:-}"

auto_tmux_window="${WORKTREE_AUTO_TMUX_WINDOW:-1}"
auto_subagent="${WORKTREE_AUTO_SUBAGENT:-1}"
current_task="${WORKTREE_CURRENT_TASK:-}"
subagent_prompt_override="${WORKTREE_SUBAGENT_PROMPT:-}"

case "$task_kind" in
  feat|fix|refactor|chore) ;;
  *)
    echo "ERROR: task_kind must be one of feat|fix|refactor|chore" >&2
    exit 1
    ;;
esac

if [[ ! "$task_slug" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "ERROR: task_slug must be lowercase kebab-case" >&2
  exit 1
fi

if [[ ! -d "$repo_root" ]]; then
  echo "ERROR: repo_root does not exist: $repo_root" >&2
  exit 1
fi

if ! git -C "$repo_root" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: repo_root is not a git repository: $repo_root" >&2
  exit 1
fi

if [[ -z "$worktree_root" ]]; then
  parent_dir="$(cd "$repo_root/.." && pwd)"
  worktree_root="$parent_dir/_worktrees"
fi

stamp="$(date +%Y%m%d)"
branch="task/$task_kind/$stamp-$task_slug"
worktree_path="$worktree_root/$task_kind-$task_slug"

if ! git -C "$repo_root" show-ref --verify --quiet "refs/heads/$base_branch"; then
  if git -C "$repo_root" show-ref --verify --quiet "refs/remotes/origin/$base_branch"; then
    git -C "$repo_root" branch "$base_branch" "origin/$base_branch" >/dev/null 2>&1 || true
  fi
fi

if ! git -C "$repo_root" show-ref --verify --quiet "refs/heads/$base_branch"; then
  echo "ERROR: base branch not found locally or on origin: $base_branch" >&2
  exit 1
fi

if git -C "$repo_root" show-ref --verify --quiet "refs/heads/$branch"; then
  echo "ERROR: target branch already exists: $branch" >&2
  exit 1
fi

if [[ -e "$worktree_path" ]]; then
  echo "ERROR: target worktree path already exists: $worktree_path" >&2
  exit 1
fi

mkdir -p "$worktree_root"

git -C "$repo_root" worktree add -b "$branch" "$worktree_path" "$base_branch"

tmux_env="not-detected"
tmux_window_opened="false"
tmux_window_name=""
next_cmd="cd $worktree_path"

if [[ -n "${TMUX:-}" ]] && command -v tmux >/dev/null 2>&1; then
  tmux_env="detected"
  if [[ "$auto_tmux_window" == "1" ]]; then
    tmux_window_name="${WORKTREE_TMUX_WINDOW_NAME:-$task_kind-$task_slug}"
    if tmux new-window -n "$tmux_window_name" -c "$worktree_path"; then
      tmux_window_opened="true"
      next_cmd="tmux select-window -t $tmux_window_name"
    else
      echo "WARN: tmux detected but failed to open new window" >&2
    fi
  fi
fi

task_context_present="false"
subagent_status="skipped-no-task-context"
subagent_window_name=""
subagent_command=""

if [[ -n "$current_task" ]]; then
  task_context_present="true"

  if [[ "$auto_subagent" != "1" ]]; then
    subagent_status="skipped-disabled"
  elif ! command -v codex >/dev/null 2>&1; then
    subagent_status="skipped-codex-missing"
  else
    if [[ -n "$subagent_prompt_override" ]]; then
      subagent_prompt="$subagent_prompt_override"
    else
      subagent_prompt="Continue task: $current_task. Work only in this worktree and report changed files, verification, and commit suggestions."
    fi

    subagent_shell_cmd="codex $(printf '%q' "$subagent_prompt")"
    subagent_command="cd $worktree_path && $subagent_shell_cmd"

    if [[ "$tmux_env" == "detected" ]]; then
      subagent_window_name="${WORKTREE_SUBAGENT_WINDOW_NAME:-agent-$task_kind-$task_slug}"
      if tmux new-window -n "$subagent_window_name" -c "$worktree_path" "$subagent_shell_cmd"; then
        subagent_status="started-tmux-window"
      else
        subagent_status="failed-tmux-launch"
        echo "WARN: failed to start child agent window" >&2
      fi
    else
      subagent_status="ready-manual"
    fi
  fi
fi

cat <<EOF_OUT
OK: worktree created
repo_root=$repo_root
base_branch=$base_branch
branch=$branch
worktree_path=$worktree_path
tmux_env=$tmux_env
tmux_window_opened=$tmux_window_opened
tmux_window_name=$tmux_window_name
task_context_present=$task_context_present
subagent_status=$subagent_status
subagent_window_name=$subagent_window_name
subagent_command=$subagent_command
next=$next_cmd
EOF_OUT
