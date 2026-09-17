# Planning Record

## Purpose

Preserve version decisions and unresolved planning questions, not tutorial
writing progress or review findings. This record belongs to plan alone. No
build/review files, shared task ID, or sibling skill instructions are required.

## Recording Loop

1. Identify the feature, source baseline and latest agreed requirements.
2. Complete the version reasoning before translating conclusions into YAML.
   An unfinished decision stays an open question, not an invented agreement.
3. Write or update `planning.yaml` for this planning task. Reuse a supplied
   matching record, or default to `.agent-runs/tutorial-plan/<topic>/planning.yaml`
   in the tutorial workspace. Announce the location; distinguish unrelated
   planning tasks instead of overwriting them.
4. Update after a material decision or before handoff. On resume compare the
   source baseline and requirement changes before reusing version decisions.
5. Verify version IDs are unique, dependencies exist and are acyclic, the
   selected version exists, and acceptance conditions match the public plan.

## Template

Populate with observed facts and concise conclusions. Null means unknown;
`proposed` does not mean the user has agreed. Do not retain placeholder values.

```yaml
feature: "Capability being planned"
requirements_source: "Decision document or conversation summary"
source_baseline:
  repository: "/path/to/project"
  revision: null
  relevant_changes: []
decisions:
  - rule: "Confirmed behavior or proposed design choice"
    status: "agreed"
    reason: "Concise tradeoff, not a reasoning transcript"
versions:
  - id: "V1"
    starts_from: "Observed prerequisite capability"
    depends_on: []
    outcome: "Observable addition"
    includes: []
    excludes: []
    targets: []
    acceptance: []
    commit_when: []
selected_version: "V1"
open_questions: []
next_planning_action: "Confirm the outstanding scope choice"
```

Use `agreed` or `proposed` for decision status. Targets name actual files and
symbols; acceptance names observable conditions. `commit_when` is a proposed
freeze condition, never permission to commit. No test-pass flags belong here.

## Boundaries

Keep the public plan readable: scenario, version rationale, scope and acceptance
remain visible. Local planning bookkeeping must not be its only source of
essential decisions. Report the record path separately. Record decisions and
evidence, not raw deliberation, credentials or private data.

Use the tutorial workspace, not an unrelated production repository. Keep the
record uncommitted. In Git resolve `git rev-parse --git-path info/exclude`,
preserve existing entries and add a local ignore rule only if needed; verify
with `git check-ignore` and `git ls-files`. Report already-tracked records rather
than untracking them. For an explicitly read-only request do not persist; report
that limit. Retain the planning record across sessions and report save failures.

Handoff is optional: provide this record or the public plan to build when the
user wants to continue. Build need not adopt its file format, location or IDs.
