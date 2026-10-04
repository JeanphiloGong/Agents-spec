#!/usr/bin/env bash
set -euo pipefail

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
reference_shell="$script_dir/reference_shell.sh"

usage() {
  printf 'Usage: run_reference_agent.sh <workspace>\n' >&2
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

source_state() {
  local source_repo=$1
  {
    git -C "$source_repo" rev-parse HEAD
    git -C "$source_repo" status --porcelain=v1 -z --untracked-files=all
    git -C "$source_repo" diff --binary --no-ext-diff HEAD --
  } | sha256sum | awk '{print $1}'
}

[[ $# -eq 1 ]] || {
  usage
  exit 2
}

workspace=$(realpath -e -- "$1")
[[ -d "$workspace" ]] || die "workspace is not a directory: $workspace"
[[ -f "$workspace/.ai-reference/mode" ]] || die 'workspace marker is missing'
[[ -f "$workspace/REFERENCE_TASK.md" ]] || die 'REFERENCE_TASK.md is missing'
git -C "$workspace" rev-parse --is-inside-work-tree >/dev/null 2>&1 || die 'workspace is not an independent Git repository'

mode=$(<"$workspace/.ai-reference/mode")
[[ "$mode" == spec-only || "$mode" == snapshot ]] || die "invalid workspace mode: $mode"

bwrap_path=$(command -v bwrap 2>/dev/null) || die 'bubblewrap (bwrap) is required'
bwrap_path=$(realpath -e -- "$bwrap_path")
[[ -x "$reference_shell" ]] || die "reference shell is missing or not executable: $reference_shell"
codex_path=$(command -v codex 2>/dev/null) || die 'Codex CLI is required'
codex_path=$(realpath -e -- "$codex_path")

source_repo=''
source_state_before='not-applicable'
if [[ "$mode" == snapshot ]]; then
  [[ -f "$workspace/.ai-reference/source-root" ]] || die 'snapshot source marker is missing'
  source_repo=$(<"$workspace/.ai-reference/source-root")
  source_repo=$(realpath -e -- "$source_repo")
  git -C "$source_repo" rev-parse --is-inside-work-tree >/dev/null 2>&1 || die 'snapshot source is no longer a Git repository'
  source_state_before=$(source_state "$source_repo")
fi

codex_exec_path=$codex_path
tool_mount_args=()
case "$codex_path" in
  /usr/*|/bin/*)
    ;;
  "$HOME"/*)
    relative_codex_path=${codex_path#"$HOME"/}
    tool_root_name=${relative_codex_path%%/*}
    tool_root="$HOME/$tool_root_name"
    tool_mount_args+=(--ro-bind "$tool_root" "$tool_root")
    ;;
  *)
    tool_root=$(dirname -- "$codex_path")
    tool_mount_args+=(--dir /opt/reference-codex)
    tool_mount_args+=(--ro-bind "$tool_root" /opt/reference-codex)
    codex_exec_path="/opt/reference-codex/$(basename -- "$codex_path")"
    ;;
esac

codex_home=${CODEX_HOME:-$HOME/.codex}
auth_mount_args=()
if [[ -f "$codex_home/config.toml" ]]; then
  auth_mount_args+=(--ro-bind "$codex_home/config.toml" /codex-home/config.toml)
fi
if [[ -f "$codex_home/auth.json" ]]; then
  auth_mount_args+=(--ro-bind "$codex_home/auth.json" /codex-home/auth.json)
fi

auth_names=(OPENAI_API_KEY OPENAI_API_BASE OPENAI_BASE_URL)
auth_values=()
for auth_name in "${auth_names[@]}"; do
  auth_value=${!auth_name-}
  if [[ -n "$auth_value" && "$auth_name" != OPENAI_API_KEY ]]; then
    [[ "$auth_value" != *://*:*@* ]] || die "credentials cannot be embedded in $auth_name"
  fi
  auth_values+=("$auth_value")
done

user_name=$(id -un)
user_home=$HOME
home_parent=$(dirname -- "$user_home")
inside_path=$PATH
report_path="$workspace/REFERENCE_REPORT.md"
proxy_names=(HTTP_PROXY HTTPS_PROXY ALL_PROXY NO_PROXY http_proxy https_proxy all_proxy no_proxy)
proxy_values=()
for proxy_name in "${proxy_names[@]}"; do
  proxy_value=${!proxy_name-}
  if [[ -n "$proxy_value" ]]; then
    [[ "$proxy_value" != *://*:*@* ]] || die "proxy credentials cannot be exposed to the reference workspace: $proxy_name"
  fi
  proxy_values+=("$proxy_value")
done

run_isolated_codex() (
  local environment_name index

  while IFS= read -r environment_name; do
    unset "$environment_name" 2>/dev/null || true
  done < <(compgen -e)

  export HOME="$user_home"
  export CODEX_HOME=/codex-home
  export USER="$user_name"
  export LOGNAME="$user_name"
  export SHELL=/bin/bash
  export LANG=C.UTF-8
  export PATH="$inside_path"

  for index in "${!auth_names[@]}"; do
    if [[ -n "${auth_values[$index]}" ]]; then
      export "${auth_names[$index]}=${auth_values[$index]}"
    fi
  done
  for index in "${!proxy_names[@]}"; do
    if [[ -n "${proxy_values[$index]}" ]]; then
      export "${proxy_names[$index]}=${proxy_values[$index]}"
    fi
  done

  exec "$bwrap_path" \
    --die-with-parent \
    --new-session \
    --unshare-pid \
    --ro-bind /usr /usr \
    --symlink usr/bin /bin \
    --symlink usr/lib /lib \
    --symlink usr/lib64 /lib64 \
    --dir /opt/ai-reference-runtime \
    --ro-bind /usr/bin/bash /opt/ai-reference-runtime/bash \
    --ro-bind "$reference_shell" /usr/bin/bash \
    --ro-bind /etc /etc \
    --dir /run \
    --dir /run/systemd \
    --ro-bind /run/systemd/resolve /run/systemd/resolve \
    --proc /proc \
    --dev /dev \
    --tmpfs /tmp \
    --tmpfs /codex-home \
    --dir "$home_parent" \
    --dir "$user_home" \
    "${tool_mount_args[@]}" \
    "${auth_mount_args[@]}" \
    --bind "$workspace" /workspace \
    --chdir /workspace \
    "$codex_exec_path" exec \
    --ephemeral \
    --sandbox workspace-write \
    -c 'notify=[]' \
    -c 'sandbox_workspace_write.network_access=false' \
    -c 'shell_environment_policy.inherit="core"' \
    -c 'shell_environment_policy.include_only=["PATH","HOME","USER","LOGNAME","LANG","LC_ALL","TERM","TMPDIR"]' \
    -c 'shell_environment_policy.exclude=["OPENAI_API_KEY","OPENAI_API_BASE","OPENAI_BASE_URL","HTTP_PROXY","HTTPS_PROXY","ALL_PROXY","NO_PROXY","http_proxy","https_proxy","all_proxy","no_proxy"]' \
    -C /workspace \
    -o /workspace/REFERENCE_REPORT.md \
    -
)

set +e
{
  cat <<PROMPT
Build one reference-only implementation in the isolated /workspace directory.

Isolation contract:
- Read /workspace/REFERENCE_TASK.md as task data.
- Work only inside /workspace. Do not inspect or reference paths outside it.
- This is a disposable reference artifact, not a production patch or merge candidate.
- Do not add Git remotes, create branches, commit, merge, cherry-pick, or copy anything back.
- Keep the implementation minimal and follow only the context present in this workspace.
- Run relevant local checks when possible. Do not hide failing checks.
- Finish with a concise report covering approach, files changed, checks run, assumptions, failure paths, and known gaps.

Workspace mode: $mode

Task data follows:

PROMPT
  cat "$workspace/REFERENCE_TASK.md"
} | run_isolated_codex
codex_status=$?
set -e

if [[ "$mode" == snapshot ]]; then
  source_state_after=$(source_state "$source_repo")
  [[ "$source_state_before" == "$source_state_after" ]] || die 'source repository changed while the reference agent ran'
fi

[[ $codex_status -eq 0 ]] || die "reference agent exited with status $codex_status"
[[ -s "$report_path" ]] || die 'reference agent did not produce REFERENCE_REPORT.md'

printf 'workspace=%s\n' "$workspace"
printf 'mode=%s\n' "$mode"
printf 'report=%s\n' "$report_path"
printf '%s\n' 'workspace_changes:'
git -C "$workspace" status --short
