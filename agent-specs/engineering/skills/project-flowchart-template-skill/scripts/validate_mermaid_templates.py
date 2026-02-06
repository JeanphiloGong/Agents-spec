#!/usr/bin/env python3
import os
import sys

REQUIRED_FILES = {
    "system-overview.mmd": ["flowchart", "ENTRYPOINT", "TODO(verify)"],
    "request-flow.mmd": ["flowchart", "REQUEST_ENTRY", "AUTH_GUARD"],
    "processing-pipeline.mmd": ["flowchart", "PIPELINE_START", "FAILURE_BRANCH"],
    "data-flow.mmd": ["flowchart", "DATA_READ", "DATA_WRITE"],
}


def _read(path):
    with open(path, "r", encoding="utf-8") as handle:
        return handle.read()


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate_mermaid_templates.py <template-dir>", file=sys.stderr)
        return 2

    root = sys.argv[1]
    if not os.path.isdir(root):
        print(f"template dir not found: {root}", file=sys.stderr)
        return 1

    errors = []
    for filename, markers in REQUIRED_FILES.items():
        path = os.path.join(root, filename)
        if not os.path.exists(path):
            errors.append(f"missing template: {filename}")
            continue

        content = _read(path)
        for marker in markers:
            if marker not in content:
                errors.append(f"{filename}: missing marker: {marker}")

    if errors:
        for item in errors:
            print(item, file=sys.stderr)
        return 1

    print("ok: mermaid templates complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
