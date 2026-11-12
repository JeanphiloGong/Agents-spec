---
name: project-implementation-tutorial-plan
description: v0.3.0 - Plan frontend or backend module tutorials against real source, delivering V0 business logic and contract documents before V1–Vn implementation and verification planning. Use when behavior, contracts, dependencies or coding checkpoints need clarification. Preserve agreed implementation-first tutorials.
---

# Project Implementation Tutorial Plan

## Overview

Turn a feature discussion into a learning and implementation path through the
actual project. The zero point is the current code without the requested
capability, not a new standalone application. Select frontend or backend mode,
bound the module, and plan its design and implementation versions.

Preserve reference-core's useful version lineage and checkpoint discipline
without requiring extraction. Preserve from-scratch's connected teaching steps
without replacing the real project with a toy model. Neither package is a
prerequisite or a runtime dependency.

Read [the planning record guide](references/planning-record.md)
before writing local records. Keep version decisions in `planning.yaml`, not
execution bookkeeping in the public plan. No extra record skill is needed.

## Modes and Module Versions

Choose the mode from the requested work and actual source; state it without
asking again when clear. Read only the applicable mode reference:

- **frontend:** [Frontend planning](references/frontend.md). Start from the
  user's task, design or incumbent UI, interaction states, and API data needs.
- **backend:** [Backend planning](references/backend.md). Start from the real
  business process, invariants, data ownership, and interface/effect boundaries.

A feature spanning both sides can have linked frontend and backend modules.
Keep one authoritative shared API contract and name its owner; do not invent a
third mode or copy the contract into competing documents.

For a new module series, use **V0 for design discussion, the module design and
applicable contract documents**, then **V1–Vn for incremental implementation
tutorials**. Each module has its own version line; dependencies identify the other module and version,
not just an ambiguous V0. Split by coherent user or business capability, not
one module per screen, component, database table, or code layer.

V0 has three ordered parts: complete business logic, contracts and constraints,
then the implementation and verification plan. Explain actors, intent, real
objects, prerequisites, state changes, ownership, failure paths and subsequent
use before deriving schemas, APIs or version increments. The main design
document connects that flow to complete, reader-usable contract documents.
Their scope follows the module: data/storage and HTTP/RPC when applicable,
interaction/state contracts for frontend behavior. Reuse sufficient existing
authority; do not invent a fixed document count or duplicate shared contracts.

When asked to complete V0, write or update both the design and required
contracts with actual decisions. A file list, empty template or promise to
write them in V1 does not complete V0. Keep contracts with the tutorial's
reference project, using its document ownership and version/checkpoint rules
so the V0 state remains recoverable after later changes. The lesson links and
explains them without repeating their full contents or requiring per-file
patches, copy instructions or reader document-check commands. Production
writes still require explicit authorization.

Resolve consequential decisions through discussion; distinguish proposals
from user decisions. Blocking questions leave V0 a draft and dependent
implementation unready. Plan can finish this design delivery without another
build invocation; build can also author a separately requested design.

Do not restart a completed discussion. Reuse an already sufficient design and
check drift. Preserve an existing implementation-first series or an explicit
request to start coding at V0; label that version `implementation` rather than
renumbering it or inserting a mandatory design exercise. Design completion
proves a reviewable specification, not executable or production behavior.

## When to Use

- The user asks how to divide a real feature into tutorial versions.
- A discussed solution needs a concrete path from current code to completion.
- A tutorial has grown too broad, or later capabilities need explicit placement.

**When NOT to use:** standalone experiments, production implementation, or
writing a tutorial body when the version and solution are already agreed. In
the last case, use `project-implementation-tutorial-build` directly.

## The Operating Loop

1. Recover the agreed outcome.
   Read the latest decisions, API examples, and requested tutorial destination.
   Identify frontend/backend mode, module boundary, and whether the selected
   deliverable is a design document or an implementation tutorial.
   Separate confirmed rules, observed code, assumptions, and missing choices.
   Ask only about gaps that change behavior, contracts, or scope. Do not restart
   an already completed design discussion.
2. Inspect the real baseline.
   Read applicable project rules and the mode's relevant entrypoints, state,
   contracts, callers, and tests; inspect persistence and migrations when the
   scope needs them. Record repository path, revision, relevant uncommitted
   changes, runtime, and database dialect when applicable.
   Trace input -> decisions -> state changes -> output. Cite file paths and
   symbols for existing behavior; label proposed files as new.
3. Identify the capability gap and invariants.
   Start from a concrete user action or worker event. Explain what currently
   happens and what must change. Name contracts to preserve and rules that
   tests can falsify, such as user isolation or atomic state-and-event writes.
   Reuse current infrastructure; do not design another app to explain it.
4. Complete the selected module's logic and contracts.
   For design V0, trace the full bounded business process before deriving its
   interface and data constraints. Produce or sufficiently reuse the required
   contract documents, with examples and failure semantics actual consumers
   can implement. Check that each object, field and operation has a role in
   that process. Settle shared dependencies without requiring every future
   module's design. Do not leave contract creation as a later coding task.
   When design is already sufficient, inspect drift and reuse it.
5. Derive the version line and teaching steps.
   For each module separate V0 design acceptance from V1–Vn runtime acceptance.
   For each version name its prerequisite baseline, observable addition,
   included integration, explicit exclusions, and acceptance evidence. Inspect
   prerequisite code instead of trusting an earlier claim that it is complete.
   Choose the smallest useful capability before expanding its integration.
   For each implementation checkpoint state the before/after behavior, an
   immediate executable check, and what the next checkpoint reuses. Prefer
   behavioral names over file-layer names. A core-model foundation can verify
   a business rule without HTTP or persistence; do not invent a domain layer
   solely to fill a version. A requested V0 design document is a valid design
   checkpoint. Setup alone or a contract summary is not an implementation gain.
   Select the current version. End design V0 with implementation exercises and
   verification scenarios derived from the completed logic and contracts;
   do not silently choose unresolved product rules to fill a version table.
   For an implementation version, use the agreed design as the starting contract.
   For implementation, map each step to exact files/symbols, the previous
   step's gap, the change, and a check. Include migrations, callers, configuration, and test
   guidance needed for this version's promise. The plan names test scenarios,
   expected outcomes, and boundaries. Specify how the reader can check the
   checkpoint without first authoring missing tests; full test source remains
   optional. Put dependency installation and configuration in brief prerequisites
   or at first use, not ahead of every business change.
   Multiple files may implement one coherent behavior. Future versions remain
   a roadmap, not hidden current tasks.
6. Define the freeze and handoff.
   Name the baseline needed to reproduce the tutorial, design-review evidence
   or executable checks as appropriate, and a `commit_when` condition. Separate
   tutorial verification from production completion. Pass this compact plan to
   `project-implementation-tutorial-build`; do not require a second plan format.
   After the plan is settled, update this planning task's `planning.yaml`
   with version dependencies, acceptance conditions, decisions and open questions.
   Preserve the source plan's meaning; YAML is a handoff record, not a second
   planning exercise. Verify parsing, references, and local Git exclusion.

## Decision Points

- If the solution and current version are already complete in conversation,
  confirm only baseline drift and hand off directly to build.
- If the user requests V0 discussion, keep discussing decisions that determine
  behavior or contracts; a polished document cannot substitute for agreement.
  A discussion-only or outline request does not authorize writing artifacts;
  report the remaining deliverables without declaring V0 complete.
- If mode or module boundaries change, reconcile the affected design and
  dependencies before reusing a version's readiness; preserve unrelated work.
- If the source is unavailable, request access or the relevant files. An
  explicitly requested provisional outline is not a verified implementation plan.
- If a prerequisite is unfinished, show the smallest prerequisite checkpoint
  and ask when changing the selected version would change agreed scope.
- If a new requirement expands the current version, make the tradeoff explicit;
  do not silently add it or silently defer required integration.
- If the user wants a standalone learning asset, use reference-core instead.

## Output Format

Use the user's language. Prefer a short scenario, a version table when useful,
and ordered current-version tasks, not a large mandatory schema.

Include:

- Mode and module: frontend/backend, owned capability, selected version kind,
  design document, and any cross-module contract/dependency.
- Baseline: repository, revision and relevant dirty files, observed capability.
- Goal and contracts: complete business flow, confirmed rules, delivered or
  reused contract documents, invariants and unresolved blockers.
- Versions: module-local name, design/implementation kind, starts from,
  includes/excludes, acceptance evidence, and next-step reuse or completion.
  Implementation versions also name before/after runtime behavior and an
  immediate reader check with expected result.
- Current version: selected scope and why it is independently verifiable.
- Steps: V0 logic, contract documents, then implementation/verification
  planning; or implementation file/symbol, reason, change, dependency, check
  and expected result.
- Freeze: design/document evidence or implementation reader checks as
  appropriate, broader verification scope, `commit_when`, limits and next version.

Keep record IDs and bookkeeping out of the public plan. Briefly report the
record path and unresolved decisions separately in the handoff.

## Example: Plan One Executable Foundation

Illustrative fixture, not a prescribed project layout. Input: "Our existing
`messages.py:Message` has `user_id` and optional `read_at`. Teach first-read
behavior before persistence, starting implementation at V0; the API and design
are agreed and the Python environment already works."

A suitable compact plan:

- Baseline: `Message` holds a timestamp but has no read transition.
- Current version: V0 adds `Message.mark_read(now)`; reading twice preserves
  the first timestamp. Includes the transition; excludes persistence and HTTP.
- Step: patch that class in `messages.py`, preserve unrelated fields, and update
  any affected callers; no new architectural layer is needed.
- Freeze: the builder supplies a runnable invocation with fixed UTC times
  `t1 < t2`; mark read at each time and assert `read_at == t1`. It must pass
  before V0 is verified. Broader test guidance can remain prose.
- Next reuse: V1 loads and saves this same message state.

Reject that sequence as an implementation-first plan: "V0 confirms contracts;
V1 installs dependencies; write some tests." A new module's explicitly named
design V0 is valid, but cannot be counted as implemented first-read behavior.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "A separate demo will be easier." | The requested outcome is implementation in this project; explain a smaller slice of its real behavior. |
| "V1 is done because the models exist." | A feature promise includes its callers and persistence path unless a foundation-only scope was agreed. |
| "The builder can work out the missing rules." | Rules that change schemas, authorization, timing, or API semantics must be settled first. |
| "Every version needs a tag and commit now." | Plan a verifiable freeze; Git operations require a separate user request. |

## Red Flags

- Versions are merely file layers with no observable acceptance condition.
- A later version is required for the current version's advertised behavior.
- Targets are invented or copied from an old tutorial without checking source.
- A complete discussion is turned into another mandatory planning ceremony.
- A design V0 has unresolved blocking decisions presented as agreed, or an
  implementation version has no executable delta or immediate reader check.
- Frontend mode plans only database/model layers, or backend mode assumes
  screen artwork supplies domain invariants and transaction semantics.
- Unrequested compatibility layers, configuration, or deployment work appear.

## Verification

- [ ] Each observed source fact has a real path/symbol and a known baseline.
- [ ] Mode, module, version kind, and shared contract ownership are explicit.
- [ ] Design versions have their artifact and decision acceptance; implementation
      versions have executable capability acceptance.
- [ ] Every version has prerequisites, additions, exclusions, and acceptance.
- [ ] The selected version includes all integration required by its promise.
- [ ] Current tasks have concrete checks, including a boundary or failure case.
- [ ] Test expectations are described as scenarios and outcomes; test source
      examples are not required by the plan.
- [ ] Existing decisions are reused; blocking choices are explicit.
- [ ] Design V0 supplies coherent end-to-end logic and complete applicable
      contract documents before its implementation/verification plan.
- [ ] Contract artifacts are available with the reference project or existing
      authority, with their V0 state recoverable; no required documents are
      deferred to coding or hidden only in local records.
- [ ] Tutorial writing and production implementation are separate permissions.
- [ ] The planning record matches the plan; no build/review record is required.

## Guardrails

- Default writes are limited to requested documents, local task records, and
  their necessary local Git exclusion entry. Never stage task records.
- Do not edit production, install services, change shared databases, or commit.
- Preserve relevant uncommitted work; never reset the source to fit the plan.
- Do not force use of reference-core or from-scratch before this package.
- Do not claim planned tests have run or that an unverified prerequisite is done.
