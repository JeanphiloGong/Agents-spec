#!/usr/bin/env bash
set -euo pipefail

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
create_script="$script_dir/create_reference_workspace.sh"
run_script="$script_dir/run_reference_agent.sh"

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

assert_file() {
  [[ -f "$1" ]] || fail "expected file: $1"
}

assert_not_file() {
  [[ ! -e "$1" ]] || fail "unexpected file: $1"
}

assert_contains() {
  local file=$1
  local expected=$2
  grep -Fq -- "$expected" "$file" || fail "expected '$expected' in $file"
}

[[ -f "$create_script" ]] || fail "missing create script"
[[ -f "$run_script" ]] || fail "missing run script"

tmp_dir=$(mktemp -d)
trap 'rm -rf -- "$tmp_dir"' EXIT

source_repo="$tmp_dir/source"
task_file="$tmp_dir/task.md"
spec_workspace="$tmp_dir/spec-workspace"
snapshot_workspace="$tmp_dir/snapshot-workspace"

mkdir -p "$source_repo"
git -C "$source_repo" init -q -b main
printf 'committed source\n' > "$source_repo/tracked.txt"
git -C "$source_repo" add tracked.txt
git -C "$source_repo" \
  -c user.name='Reference Test' \
  -c user.email='reference-test@example.invalid' \
  commit -q -m 'test: create source baseline'

printf 'local source change\n' > "$source_repo/tracked.txt"
printf 'untracked source file\n' > "$source_repo/local-only.txt"
printf '# Reference task\n\nImplement a tiny example and report the checks.\n' > "$task_file"

source_status_before=$(git -C "$source_repo" status --short)

bash "$create_script" spec-only "$spec_workspace" "$task_file"
assert_file "$spec_workspace/REFERENCE_TASK.md"
assert_not_file "$spec_workspace/tracked.txt"
assert_contains "$spec_workspace/.ai-reference/mode" 'spec-only'
[[ -z "$(git -C "$spec_workspace" remote)" ]] || fail 'spec workspace has a git remote'

bash "$create_script" snapshot "$snapshot_workspace" "$task_file" "$source_repo" HEAD
assert_file "$snapshot_workspace/tracked.txt"
assert_not_file "$snapshot_workspace/local-only.txt"
assert_contains "$snapshot_workspace/tracked.txt" 'committed source'
assert_contains "$snapshot_workspace/.ai-reference/mode" 'snapshot'
[[ -z "$(git -C "$snapshot_workspace" remote)" ]] || fail 'snapshot workspace has a git remote'

source_status_after_create=$(git -C "$source_repo" status --short)
[[ "$source_status_before" == "$source_status_after_create" ]] || fail 'source changed during workspace creation'

if bash "$create_script" snapshot "$source_repo/forbidden-workspace" "$task_file" "$source_repo" HEAD >/dev/null 2>&1; then
  fail 'workspace creation inside the source repository should fail'
fi

fake_bin="$tmp_dir/fake-bin"
mkdir -p "$fake_bin"
cat > "$fake_bin/codex" <<'FAKE_CODEX'
#!/usr/bin/env bash
set -euo pipefail

[[ -z "${OPENAI_API_KEY+x}" ]]

workspace=''
report=''
sandbox=''
ephemeral='no'
network_off='no'

while (($#)); do
  case "$1" in
    exec)
      shift
      ;;
    -C|--cd)
      workspace=$2
      shift 2
      ;;
    -o|--output-last-message)
      report=$2
      shift 2
      ;;
    -s|--sandbox)
      sandbox=$2
      shift 2
      ;;
    --ephemeral)
      ephemeral='yes'
      shift
      ;;
    -c|--config)
      if [[ "$2" == 'sandbox_workspace_write.network_access=false' ]]; then
        network_off='yes'
      fi
      shift 2
      ;;
    -)
      cat >/dev/null
      shift
      ;;
    *)
      shift
      ;;
  esac
done

[[ "$workspace" == '/workspace' ]]
[[ "$sandbox" == 'workspace-write' ]]
[[ "$ephemeral" == 'yes' ]]
[[ "$network_off" == 'yes' ]]
printf 'reference output\n' > "$workspace/reference-output.txt"
printf '# Reference Report\n\nChecks passed in the isolated workspace.\n' > "$report"
FAKE_CODEX
chmod +x "$fake_bin/codex"

PATH="$fake_bin:$PATH" bash "$run_script" "$spec_workspace"
assert_file "$spec_workspace/reference-output.txt"
assert_file "$spec_workspace/REFERENCE_REPORT.md"

PATH="$fake_bin:$PATH" bash "$run_script" "$snapshot_workspace"
assert_file "$snapshot_workspace/reference-output.txt"
assert_file "$snapshot_workspace/REFERENCE_REPORT.md"

source_status_after_run=$(git -C "$source_repo" status --short)
[[ "$source_status_before" == "$source_status_after_run" ]] || fail 'source changed while the reference agent ran'

printf 'PASS: ai reference workspace scripts\n'
