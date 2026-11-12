# Project Implementation Tutorial Workflow

Versions: **v0.3.0** (plan and review); **v0.2.0** (build).

Create tutorials that teach a feature inside an existing project. The reader
implements the changes; the agent writes and verifies the guide without
modifying the production worktree by default.

## Choose a Skill

| Situation | Skill | Deliverable |
| --- | --- | --- |
| A module needs design discussion or implementation versions | [plan](project-implementation-tutorial-plan/SKILL.md) | Complete module logic, contract documents and an implementation/verification plan |
| Write the selected design or coding version | [build](project-implementation-tutorial-build/SKILL.md) | A module design document, or complete real-file implementation lessons and reader checks |
| Check whether the selected version is ready | [review](project-implementation-tutorial-review/SKILL.md) | Mode-appropriate findings and design or implementation readiness verdict |

Typical path: discussion and source inspection -> version plan when needed ->
tutorial build -> review -> human implementation. A separate plan document is
not required when conversation already supplies the solution and version scope.

## Frontend and Backend Modes

Select `frontend` or `backend` for each module; infer the mode from clear user
intent and actual source rather than asking redundantly. The choice affects
what to discuss, how to teach the change, and what evidence establishes readiness.

| Mode | Design focus | Implementation acceptance |
| --- | --- | --- |
| frontend | User tasks, design/Figma, interactions, UI states, routes, required API data and state/component ownership | Working user actions through real routes/clients, feedback and relevant keyboard/viewport/failure behavior |
| backend | Real business process, invariants, models/responsibilities, interfaces, storage/transactions and failure effects | Executable rules and the actual caller, auth, persistence and response/effect required by the scope |

For a new module series, V0 delivers the module design and its applicable
contract documents; V1–Vn incrementally implement that design. Each module has
its own version line. Cross-module dependencies name the module and version, and both
sides reference one authoritative API contract. Do not split every screen or
architectural layer into a separate module.

```text
workspace-ui (frontend)
  V0: agree switching behavior, UI states, API needs and ownership
  V1: implement navigation in existing workspaces
  V2: implement switching and state isolation

file-research (frontend)
  V0: agree selection, preparation states and API handoff
  V1: implement the bounded file-to-research action

finding-publication (backend)
  V0: agree preview/publish rules, data contract and failure boundaries
  V1: implement and check a bounded preview capability
```

V0 stays a draft while blocking decisions are unresolved. A consistent design
is not executable behavior or automatic user agreement. Reuse sufficient
existing design and contract authorities without repeating discussion or
creating competing copies. Preserve an explicitly agreed implementation-first
V0; version kind, not number, determines acceptance.

## V0 Deliverables

Present the design in this order:

1. **Complete business logic:** actors, intent, real objects, prerequisites,
   ordered actions, state changes, ownership, failure paths and the next use of
   the result. Explain these before choosing tables, endpoints or helpers.
2. **Contracts and constraints:** deliver the complete documents required by
   that flow, such as data/storage, HTTP/RPC, or frontend interaction/state
   contracts. Explain fields, rules and boundaries using the actual consumers.
3. **Implementation and verification plan:** derive V1–Vn capabilities,
   prerequisites and concrete acceptance scenarios from those decisions.

The V0 lesson explains and links the contracts; the documents themselves are
reader-usable deliverables, not an inventory of files to write later. Keep them
with the tutorial's reference project under the project's document ownership
rules. Existing sufficient authority can satisfy a deliverable by reference.
No fixed folder, document count or schema tool is required, and a frontend-only
module does not acquire an unrelated database design.

Keep the V0 contract state recoverable through the existing checkpoint or
version mechanism; a later final reference snapshot alone is insufficient when
contracts evolve. Later agreed changes update the contract and affected code,
tests and examples together. V0 prose need not repeat full contract contents,
provide per-file patches or teach document-copying/check commands.

## Usage

```text
$project-implementation-tutorial-plan
Frontend mode. Plan the workspace module's V0 design discussion and V1–Vn
implementation against the current project and Figma. Separate existing API
support, unresolved behavior and cross-module prerequisites.

$project-implementation-tutorial-plan
Backend mode. Plan this module from V0 business/interface design to bounded
implementation versions using our existing architecture and database.

$project-implementation-tutorial-build
Turn our agreed frontend module V1 into a tutorial against the actual code. Give exact
file/method edits and complete implementations that can be applied step by
step. Include minimal runnable reader checks; describe broader test scenarios
without expanding a full suite unless requested. Verify in isolation; do not
modify the source worktree.

$project-implementation-tutorial-review
Review this module's V0 design or implementation version against its mode,
baseline and promise. Use document/decision acceptance for design, complete
edits and executable evidence for implementation.
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

Tutorial prose retains explanations, ordered code changes, reader checks,
expected results, and concise test guidance. Internal checklists, execution logs and review history stay
in the workbench. Record conclusions and evidence, not raw thinking transcripts.
The lesson must remain usable without these files. Resume from recorded state,
but revalidate affected checks when the source or tutorial changes.

## Completion Boundary

A design V0 is complete when the bounded business flow is coherent, its
required contract documents are supplied or sufficiently reused, and the final
implementation/verification plan follows them. Review checks this alignment;
headings, endpoint lists and future document tasks alone do not establish it.
Design acceptance uses source and document evidence without requiring the
future feature to run. A useful implementation checkpoint changes an
executable capability: what the
reader could not do before, what now works, an immediate check with expected
results, and what the next checkpoint reuses. Contract summaries, setup, and
record updates are not implementation progress. Design and coding versions
have distinct promises and evidence; neither should be accepted using the
other's criteria.

Choose the smallest useful capability before requiring its full integration.
A core-model checkpoint can verify a business rule without HTTP or a database;
an HTTP checkpoint must include its real authentication and persistence path.
Do not force a domain layer or a model-first chapter onto every feature.
Keep environment setup brief and separate from the teaching spine. Supply a
reader-runnable check at each freeze, even when full test source is omitted.

A tutorial is complete only for its agreed version. A foundation checkpoint
may be intentionally partial, but the boundary must be stated before writing.
Required integration cannot be replaced by "implement it later in Service."

Verification claims must identify the actual baseline and checks run. Passing
a tutorial replay is not the same as implementing production. Commit, push,
external sending, and production migration are not automatic steps.
