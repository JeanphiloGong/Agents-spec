#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat >&2 <<'USAGE'
Usage:
  create_reference_workspace.sh spec-only <workspace> <task-file>
  create_reference_workspace.sh snapshot <workspace> <task-file> <source-repo> [base-ref]
USAGE
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

is_within() {
  local candidate=$1
  local parent=$2
  [[ "$candidate" == "$parent" || "$candidate" == "$parent/"* ]]
}

source_state() {
  local source_repo=$1
  {
    git -C "$source_repo" rev-parse HEAD
    git -C "$source_repo" status --porcelain=v1 -z --untracked-files=all
    git -C "$source_repo" diff --binary --no-ext-diff HEAD --
  } | sha256sum | awk '{print $1}'
}

[[ $# -ge 1 ]] || {
  usage
  exit 2
}

mode=$1
case "$mode" in
  spec-only)
    [[ $# -eq 3 ]] || {
      usage
      exit 2
    }
    ;;
  snapshot)
    [[ $# -eq 4 || $# -eq 5 ]] || {
      usage
      exit 2
    }
    ;;
  *)
    usage
    die "unsupported mode: $mode"
    ;;
esac

workspace=$(realpath -m -- "$2")
task_file=$(realpath -e -- "$3")

[[ -f "$task_file" ]] || die "task file is not a regular file: $task_file"
[[ ! -e "$workspace" ]] || die "workspace already exists: $workspace"
[[ "$workspace" != / ]] || die 'workspace cannot be the filesystem root'
[[ "$workspace" != *$'\n'* ]] || die 'workspace path cannot contain a newline'

caller_repo=$(git -C "$PWD" rev-parse --show-toplevel 2>/dev/null || true)
if [[ -n "$caller_repo" ]]; then
  caller_repo=$(realpath -e -- "$caller_repo")
  is_within "$workspace" "$caller_repo" && die "workspace must be outside the current repository: $caller_repo"
fi

source_repo=''
base_commit=''
source_state_before='not-applicable'

if [[ "$mode" == snapshot ]]; then
  source_repo=$(git -C "$4" rev-parse --show-toplevel 2>/dev/null) || die "not a Git repository: $4"
  source_repo=$(realpath -e -- "$source_repo")
  base_ref=${5:-HEAD}
  base_commit=$(git -C "$source_repo" rev-parse --verify "$base_ref^{commit}" 2>/dev/null) || die "not a commit: $base_ref"

  is_within "$workspace" "$source_repo" && die "workspace must be outside the source repository: $source_repo"
  [[ "$source_repo" != *$'\n'* ]] || die 'source path cannot contain a newline'
  source_state_before=$(source_state "$source_repo")
fi

created='no'
cleanup_on_failure() {
  local status=$?
  if [[ $status -ne 0 && "$created" == yes && -d "$workspace" ]]; then
    rm -rf -- "$workspace"
  fi
  exit "$status"
}
trap cleanup_on_failure EXIT

mkdir -p "$workspace/.ai-reference"
created='yes'

if [[ "$mode" == snapshot ]]; then
  git -C "$source_repo" archive --format=tar "$base_commit" | tar -xf - -C "$workspace"
fi

cp -- "$task_file" "$workspace/REFERENCE_TASK.md"
printf '%s\n' "$mode" > "$workspace/.ai-reference/mode"
printf '%s\n' "$base_commit" > "$workspace/.ai-reference/base-commit"
printf '%s\n' "$source_state_before" > "$workspace/.ai-reference/source-state-at-create"

if [[ "$mode" == snapshot ]]; then
  printf '%s\n' "$source_repo" > "$workspace/.ai-reference/source-root"
fi

git -C "$workspace" init -q -b reference
git -C "$workspace" add -A
git -C "$workspace" \
  -c user.name='AI Reference Workspace' \
  -c user.email='ai-reference@example.invalid' \
  commit -q -m 'chore: record reference workspace baseline'

if [[ "$mode" == snapshot ]]; then
  source_state_after=$(source_state "$source_repo")
  [[ "$source_state_before" == "$source_state_after" ]] || die 'source repository changed while the workspace was created'
fi

trap - EXIT
printf 'workspace=%s\n' "$workspace"
printf 'mode=%s\n' "$mode"
[[ -n "$base_commit" ]] && printf 'base_commit=%s\n' "$base_commit"
printf 'run_command=bash %s/run_reference_agent.sh %q\n' "$(dirname -- "$0")" "$workspace"
