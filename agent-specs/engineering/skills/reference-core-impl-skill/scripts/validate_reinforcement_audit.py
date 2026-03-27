#!/usr/bin/env python3
import json
import sys


REQUIRED_TOP_LEVEL = [
    "round_id",
    "date",
    "owner",
    "skill",
    "git_commit",
    "plan",
    "change",
    "verify",
    "reflect",
]

REQUIRED_PLAN = [
    "objective",
    "scope_in",
    "scope_out",
    "acceptance_criteria",
    "evidence_inputs",
    "exit_condition",
]

REQUIRED_CHANGE = [
    "files_changed",
    "guardrail_ids",
    "expected_behavior_shift",
    "rollback_plan",
]

REQUIRED_VERIFY = [
    "checks_run",
    "evidence",
    "negative_tests",
    "decision",
]

REQUIRED_REFLECT = [
    "improvements",
    "tradeoffs_risks",
    "next_highest_impact_refinement",
    "next_action",
]

REQUIRED_NEXT_ACTION = [
    "owner",
    "date",
]


def _is_list_of_strings(value):
    return isinstance(value, list) and all(isinstance(item, str) for item in value)


def _error(line_no, message):
    return f"Line {line_no}: {message}"


def _check_required_keys(line_no, obj, keys, context):
    errors = []
    for key in keys:
        if key not in obj:
            errors.append(_error(line_no, f"missing {context}.{key}"))
    return errors


def _check_types(line_no, obj):
    errors = []
    for key in REQUIRED_TOP_LEVEL:
        if key not in obj:
            continue
        if key in ("plan", "change", "verify", "reflect"):
            if not isinstance(obj[key], dict):
                errors.append(_error(line_no, f"{key} must be object"))
        else:
            if not isinstance(obj[key], str):
                errors.append(_error(line_no, f"{key} must be string"))
    return errors


def _check_nested(line_no, obj):
    errors = []
    plan = obj.get("plan", {})
    change = obj.get("change", {})
    verify = obj.get("verify", {})
    reflect = obj.get("reflect", {})

    errors.extend(_check_required_keys(line_no, plan, REQUIRED_PLAN, "plan"))
    errors.extend(_check_required_keys(line_no, change, REQUIRED_CHANGE, "change"))
    errors.extend(_check_required_keys(line_no, verify, REQUIRED_VERIFY, "verify"))
    errors.extend(_check_required_keys(line_no, reflect, REQUIRED_REFLECT, "reflect"))

    if "evidence_inputs" in plan and not _is_list_of_strings(plan["evidence_inputs"]):
        errors.append(_error(line_no, "plan.evidence_inputs must be array of strings"))
    if "files_changed" in change and not _is_list_of_strings(change["files_changed"]):
        errors.append(_error(line_no, "change.files_changed must be array of strings"))
    if "guardrail_ids" in change and not _is_list_of_strings(change["guardrail_ids"]):
        errors.append(_error(line_no, "change.guardrail_ids must be array of strings"))
    if "checks_run" in verify and not _is_list_of_strings(verify["checks_run"]):
        errors.append(_error(line_no, "verify.checks_run must be array of strings"))
    if "negative_tests" in verify and not _is_list_of_strings(verify["negative_tests"]):
        errors.append(_error(line_no, "verify.negative_tests must be array of strings"))

    if "next_action" in reflect:
        next_action = reflect.get("next_action")
        if not isinstance(next_action, dict):
            errors.append(_error(line_no, "reflect.next_action must be object"))
        else:
            errors.extend(
                _check_required_keys(line_no, next_action, REQUIRED_NEXT_ACTION, "reflect.next_action")
            )
            for key in REQUIRED_NEXT_ACTION:
                if key in next_action and not isinstance(next_action[key], str):
                    errors.append(_error(line_no, f"reflect.next_action.{key} must be string"))
    return errors


def validate_file(path):
    errors = []
    with open(path, "r", encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, start=1):
            stripped = line.strip()
            if not stripped:
                continue
            try:
                obj = json.loads(stripped)
            except json.JSONDecodeError as exc:
                errors.append(_error(line_no, f"invalid JSON: {exc.msg}"))
                continue

            if not isinstance(obj, dict):
                errors.append(_error(line_no, "root must be object"))
                continue

            if obj.get("template") is True:
                continue

            errors.extend(_check_required_keys(line_no, obj, REQUIRED_TOP_LEVEL, "root"))
            errors.extend(_check_types(line_no, obj))
            errors.extend(_check_nested(line_no, obj))

    return errors


def main():
    if len(sys.argv) != 2:
        print("Usage: validate_reinforcement_audit.py <path-to-jsonl>", file=sys.stderr)
        return 2

    errors = validate_file(sys.argv[1])
    if errors:
        for message in errors:
            print(message, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
