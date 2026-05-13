#!/usr/bin/env python3
import os
import re
import sys

REQUIRED_FILES = {
    "system-overview.mmd": [
        "flowchart",
        "entry_receive_system_bootstrap",
        "branch_verify_integration_required",
        "result_return_system_ready",
        "TODO(verify)",
    ],
    "request-flow.mmd": [
        "flowchart",
        "entry_receive_request_create",
        "branch_verify_permission_granted",
        "result_return_http_200_success",
    ],
    "processing-pipeline.mmd": [
        "flowchart",
        "entry_receive_task_pipeline",
        "branch_verify_retry_required",
        "result_return_pipeline_done",
    ],
    "data-flow.mmd": [
        "flowchart",
        "entry_receive_data_request",
        "branch_verify_cache_hit",
        "result_return_data_write_ok",
    ],
}

ALLOWED_TYPES = {
    "entry",
    "gate",
    "route",
    "usecase",
    "service",
    "repo",
    "store",
    "branch",
    "event",
    "result",
}
ALLOWED_ACTIONS = {
    "receive",
    "verify",
    "parse",
    "map",
    "list",
    "get",
    "create",
    "update",
    "delete",
    "upsert",
    "assemble",
    "emit",
    "return",
}
NODE_ID_DEF = re.compile(r"\b([A-Za-z][A-Za-z0-9_]*)\s*(?=\[|\{|\()")
EDGE_SRC = re.compile(r"^\s*([A-Za-z][A-Za-z0-9_]*)\s*--")
EDGE_DST = re.compile(r"--(?:>|o|x)?(?:\|[^|]*\|)?\s*([A-Za-z][A-Za-z0-9_]*)")
DECISION_DEF = re.compile(r"\b([A-Za-z][A-Za-z0-9_]*)\s*(?=\{)")
GENERIC_ID = re.compile(r"^[A-Za-z][0-9]+$")
LABEL_TEXT = re.compile(r'"[^"]*"')


def _read(path):
    with open(path, "r", encoding="utf-8") as handle:
        return handle.read()


def _extract_node_ids(content):
    node_ids = set()
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("%%"):
            continue
        sanitized = LABEL_TEXT.sub("", line)

        for match in NODE_ID_DEF.finditer(sanitized):
            node_ids.add(match.group(1))

        src_match = EDGE_SRC.search(sanitized)
        if src_match:
            node_ids.add(src_match.group(1))

        for match in EDGE_DST.finditer(sanitized):
            node_ids.add(match.group(1))

    return node_ids


def _extract_decision_ids(content):
    decision_ids = set()
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("%%"):
            continue
        sanitized = LABEL_TEXT.sub("", line)
        for match in DECISION_DEF.finditer(sanitized):
            decision_ids.add(match.group(1))
    return decision_ids


def _validate_node_id(node_id):
    issues = []

    if not re.fullmatch(r"[a-z0-9_]+", node_id):
        issues.append("must use lower-case snake_case only")
        return issues

    if GENERIC_ID.fullmatch(node_id):
        issues.append("non-semantic node ID is not allowed")
        return issues

    parts = node_id.split("_")
    if len(parts) < 3:
        issues.append("must follow <type>_<action>_<object>[_<context>][_n]")
        return issues

    node_type, action = parts[0], parts[1]
    if node_type not in ALLOWED_TYPES:
        issues.append(f"unsupported type: {node_type}")
    if action not in ALLOWED_ACTIONS:
        issues.append(f"unsupported action: {action}")

    if not re.fullmatch(r"[a-z0-9]+", parts[2]):
        issues.append("object token must be a singular business noun token")

    tail = parts[3:]
    if tail and tail[-1].isdigit():
        tail = tail[:-1]

    for token in tail:
        if not re.fullmatch(r"[a-z0-9]+", token):
            issues.append(f"invalid context token: {token}")

    return issues


def _validate_naming(filename, content):
    errors = []
    node_ids = sorted(_extract_node_ids(content))
    decision_ids = _extract_decision_ids(content)

    if not node_ids:
        errors.append(f"{filename}: no node IDs found")
        return errors

    for node_id in node_ids:
        if node_id.upper() in {"Q1", "B1", "C1"}:
            errors.append(f"{filename}: {node_id}: non-semantic node ID is not allowed")
            continue
        for issue in _validate_node_id(node_id):
            errors.append(f"{filename}: {node_id}: {issue}")

    for node_id in sorted(decision_ids):
        if not node_id.startswith("branch_"):
            errors.append(f"{filename}: decision node must use branch_*: {node_id}")

    if not any(node_id.startswith("branch_") for node_id in node_ids):
        errors.append(f"{filename}: missing branch_* node")

    if not any(node_id.startswith("result_") for node_id in node_ids):
        errors.append(f"{filename}: missing result_* node")

    return errors


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
        errors.extend(_validate_naming(filename, content))

    if errors:
        for item in errors:
            print(item, file=sys.stderr)
        return 1

    print("ok: mermaid templates complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
