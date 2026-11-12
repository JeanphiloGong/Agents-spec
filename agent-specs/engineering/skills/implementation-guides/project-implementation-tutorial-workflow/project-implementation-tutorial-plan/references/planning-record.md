# Planning Record

## Purpose

Preserve version decisions and unresolved planning questions, not tutorial
writing progress or review findings. This record belongs to plan alone. No
build/review files, shared task ID, or sibling skill instructions are required.

## Recording Loop

1. Identify the feature, frontend/backend mode, module boundaries, source
   baseline and latest agreed requirements.
2. Complete the version reasoning before translating conclusions into YAML.
   An unfinished decision stays an open question, not an invented agreement.
3. Write or update `planning.yaml` for this planning task. Reuse a supplied
   matching record, or default to `.agent-runs/tutorial-plan/<topic>/planning.yaml`
   in the tutorial workspace. Announce the location; distinguish unrelated
   planning tasks instead of overwriting them.
4. Update after a material decision or before handoff. On resume compare the
   source baseline and requirement changes before reusing version decisions.
5. Verify module IDs are unique and each has a frontend/backend mode. Qualify
   version IDs and cross-module dependencies, for example `files/V0` and
   `workspace/V1`; local V0 labels can repeat across modules. Verify IDs are
   unique, dependencies exist and are acyclic, the selected version exists,
   and acceptance matches its design/implementation kind and public plan.
   External prerequisites name their source and promised version.

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
modules:
  - id: "files"
    mode: "frontend"
    design_document: "/path/to/tutorials/files/V0-design.md"
    contract_documents:
      - "/path/to/reference/docs/contracts/file-selection.md"
decisions:
  - rule: "Confirmed behavior or proposed design choice"
    status: "agreed"
    reason: "Concise tradeoff, not a reasoning transcript"
versions:
  - id: "files/V0"
    kind: "design"
    starts_from: "Observed file UI, design sources and existing API"
    depends_on: []
    outcome: "Complete logic and contract documents ready for the bounded V1 implementation"
    includes: ["Complete user flow", "Delivered or reused interaction/API contracts", "Implementation and verification plan"]
    excludes: ["Production implementation"]
    targets: []
    acceptance: ["Source facts checked; blocking behavior/API choices resolved"]
    commit_when: ["Design document matches agreed decisions and V1 acceptance"]
selected_version: "files/V0"
open_questions: []
next_planning_action: "Confirm the outstanding scope choice"
```

Use `agreed` or `proposed` for decision status. Targets name actual files and
symbols; acceptance names observable conditions. `commit_when` is a proposed
freeze condition, never permission to commit. No test-pass flags belong here.
For design V0, `contract_documents` lists actual delivered or reused authorities;
record the applicable reference checkpoint/revision when it is separate from
the source baseline. This list records delivery, not a substitute for writing
the documents. Keep their contents and explanations outside local records.

For implementation use `kind: implementation`, supply before/after runtime
behavior, executable reader checks and prerequisites. Do not relabel an
existing implementation-first V0 as design. Reuse supplied records without
bulk rewriting unrelated numbering. Design acceptance means decision/document
readiness, not successful execution. Keep proposed API changes and unresolved
user choices visibly unagreed.

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
