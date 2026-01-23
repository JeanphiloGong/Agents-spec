#!/usr/bin/env python3
import json
import sys


REQUIRED_KEYS = [
    "round_id",
    "date",
    "objective",
    "scope_in",
    "scope_out",
    "evidence_refs",
    "acceptance_criteria",
    "change_summary",
    "verification",
    "decision",
    "next_action",
    "owner",
]


def validate_line(line, line_no):
    try:
        obj = json.loads(line)
    except json.JSONDecodeError as exc:
        return False, f"Line {line_no}: invalid JSON ({exc})"

    missing = [key for key in REQUIRED_KEYS if key not in obj]
    if missing:
        return False, f"Line {line_no}: missing keys {missing}"

    if not isinstance(obj.get("evidence_refs"), list):
        return False, f"Line {line_no}: evidence_refs must be a list"
    if not isinstance(obj.get("acceptance_criteria"), list):
        return False, f"Line {line_no}: acceptance_criteria must be a list"

    decision = obj.get("decision")
    if decision not in {"promote", "hold", "rollback"}:
        return False, f"Line {line_no}: decision must be promote|hold|rollback"

    return True, ""


def main():
    if len(sys.argv) != 2:
        print("Usage: validate_reinforcement_audit.py <path>", file=sys.stderr)
        return 2

    path = sys.argv[1]
    ok = True
    with open(path, "r", encoding="utf-8") as handle:
        for i, line in enumerate(handle, start=1):
            line = line.strip()
            if not line:
                continue
            valid, message = validate_line(line, i)
            if not valid:
                ok = False
                print(message, file=sys.stderr)

    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
