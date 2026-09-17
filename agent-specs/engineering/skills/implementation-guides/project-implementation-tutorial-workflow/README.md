# Project Implementation Tutorial Workflow

Create tutorials that teach a feature inside an existing project. The reader
implements the changes; the agent writes and verifies the guide without
modifying the production worktree by default.

## Choose a Skill

| Situation | Skill | Deliverable |
| --- | --- | --- |
| Requirements need versions and checkpoints | [plan](project-implementation-tutorial-plan/SKILL.md) | Source-backed version line, selected scope, ordered edits and acceptance checks |
| The solution is agreed; write the tutorial | [build](project-implementation-tutorial-build/SKILL.md) | Complete real-file changes, connected explanations, integration and tests |
| Check whether the tutorial is ready to follow | [review](project-implementation-tutorial-review/SKILL.md) | Evidence-backed findings and scoped readiness verdict |

Typical path: discussion and source inspection -> version plan when needed ->
tutorial build -> review -> human implementation. A separate plan document is
not required when conversation already supplies the solution and version scope.

## Usage

```text
$project-implementation-tutorial-plan
Plan versions for this agreed feature against the current project. Identify
the next version, real files, prerequisites, exclusions, and commit_when checks.

$project-implementation-tutorial-build
Turn our agreed version into a tutorial against the actual code. Give exact
file/method edits, complete implementations and tests. Verify in isolation;
do not modify the source worktree.

$project-implementation-tutorial-review
Review this tutorial against its baseline and promised version. Check missing
callers, migrations, explanations, and executable verification evidence.
```

Supply the source repository and document destination when they are not already
clear. Tutorials use the reader's language and the project's existing structure.

## Relationship to Existing Packages

`reference-core-workflow` still extracts standalone runnable learning assets.
`from-scratch-tutorial-workflow` still teaches mechanisms from a compressed
model. Neither is changed or required by this package.

This package carries forward version lineage, invariants, verifiable freezes,
and the pressure/change/check teaching cycle. Its baseline is the actual
project, so required persistence, authentication, migrations, and callers remain
in the guide. An isolated verification copy is a test environment, not a second
application delivered to the reader.

Three skills are warranted because version planning, full tutorial authoring,
and acceptance review have distinct triggers and outputs. No forwarding skill,
standalone extraction stage, or mandatory extra planning step is added.

## Local Records and Public Prose

Each skill includes its own recording instructions and template:

| Skill | Local resource | Records |
| --- | --- | --- |
| plan | [Planning record](project-implementation-tutorial-plan/references/planning-record.md) | Version decisions, dependencies, acceptance and open questions |
| build | [Writing progress](project-implementation-tutorial-build/references/writing-progress.md) | Chapters, missing content, actual checks and next edit |
| review | [Review record](project-implementation-tutorial-review/references/review-record.md) | Reviewed inputs, findings, resolution evidence and verdict |

These are independent formats, not copies of one lifecycle schema. No common
task ID, directory, or complete set of three records is required. Each skill
can run with its own inputs; explicitly supplied upstream artifacts are optional
handoff evidence. Keep generated records local and uncommitted in the tutorial
workspace. No fourth record skill or extra user invocation is required.

Tutorial prose retains explanations, exact code changes, reader checks and
expected results. Internal checklists, execution logs and review history stay
in the workbench. Record conclusions and evidence, not raw thinking transcripts.
The lesson must remain usable without these files. Resume from recorded state,
but revalidate affected checks when the source or tutorial changes.

## Completion Boundary

A tutorial is complete only for its agreed version. A foundation checkpoint
may be intentionally partial, but the boundary must be stated before writing.
Required integration cannot be replaced by "implement it later in Service."

Verification claims must identify the actual baseline and checks run. Passing
a tutorial replay is not the same as implementing production. Commit, push,
external sending, and production migration are not automatic steps.
