#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  install-wt-bootstrap.sh [target_dir]

Arguments:
  target_dir  Optional install directory, default: $HOME/.local/bin

Behavior:
  - installs a symlink named wt-bootstrap to scripts/wt-bootstrap
  - does not auto-edit shell rc files
USAGE
}

if [[ $# -gt 1 ]]; then
  usage
  exit 1
fi

target_dir="${1:-$HOME/.local/bin}"
target_name="wt-bootstrap"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source_script="$script_dir/wt-bootstrap"
target_path="$target_dir/$target_name"

if [[ ! -f "$source_script" ]]; then
  echo "ERROR: source launcher not found: $source_script" >&2
  exit 1
fi

mkdir -p "$target_dir"
ln -sfn "$source_script" "$target_path"

echo "OK: installed $target_name -> $source_script"
echo "PATH check:"

case ":${PATH:-}:" in
  *":$target_dir:"*)
    echo "- $target_dir is already in PATH"
    ;;
  *)
    echo "- $target_dir is not in PATH"
    echo "- add this to your shell rc:"
    echo "  export PATH=\"$target_dir:\$PATH\""
    ;;
esac

if command -v "$target_name" >/dev/null 2>&1; then
  echo "- command available: $(command -v "$target_name")"
else
  echo "- command not currently resolvable in this shell"
fi
