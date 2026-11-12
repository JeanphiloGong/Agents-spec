# Acceptance Scenarios

## Contents

- Version planning and direct build
- Integration, partial scope, dialect and dirty baseline review
- Standalone routing
- Local records, resumption, and public prose
- Executable checkpoints and reader verification
- Verification failures versus unavailable environments
- Frontend/backend modes and module-local design versions

Use these cases when evaluating the package. They specify expected behavior,
not recorded successful model runs. For a live evaluation supply a real source
fixture, record the chosen skill and output, then compare with these criteria.

## Plan: Versions in a Real Project

Prompt: "Plan tutorial versions for deadline reminders in our existing app.
Reminders follow the existing notification switch; missed reminders are not
sent. Delivery channels are out of scope."

Expected: inspect current favorite, deadline, status, notification, and worker
paths; distinguish observed and missing capabilities; plan prerequisite and
current versions with exact file targets and tests. Keep confirmed switch and
missed-reminder semantics. Local scheduling and external delivery are separate
scope decisions. No source edits or invented default opt-in.

Reject: a standalone scheduler app, automatic delivery integration, or an
ORM-only version advertised as complete reminders.

## Build: Agreed Solution Without a Plan Document

Prompt: "We have agreed on the three list response fields. Write the tutorial
against the actual routes and repositories. Do not implement it for me."

Expected: recover the agreed fields, inspect current code and dirty changes,
write complete targeted edits plus caller/tests in the user's language, replay
in isolation, and state evidence limits. No mandatory new planning round.

Reject: `mock_api/` replacing the real app, invented tables/authentication,
unidentified function-body fragments, or modifications to the source worktree.

## Review: Missing Integration

Prompt: "Review this tutorial, which promises atomic status updates and queued
notifications. Its repository code compiles, but the status route still calls
the old write method."

Expected: source-backed high-severity finding on the unconnected entrypoint;
`needs-revision` even if isolated repository tests pass. Give the minimal
caller correction without applying it during review.

Reject: acceptance based on compilation or silently fixing the source.

## Review: Explicit Partial Scope

Prompt: "Review this foundation-only notification-schema tutorial. We explicitly
deferred delivery; the migration and persistence tests are supplied."

Expected: check the agreed schema/persistence promise; do not demand a gateway
or mobile app. Check migration evidence and clearly limit the verdict.

Reject: a missing-delivery blocker solely because a future version needs it.

## Review: Dialect and Evidence

Prompt: "This PostgreSQL task-claim tutorial was tested only with SQLite. Is
the concurrent-claim guarantee verified?"

Expected: separate local functional evidence from unverified PostgreSQL
concurrency. Require the relevant database check before accepting that claim;
do not access the user's production database as a substitute.

## Build: Dirty Baseline and Hidden Fix

Prompt: "The tutorial targets my uncommitted ORM rename. The replay uses HEAD
and then adds an undocumented import fix to pass tests. Is it ready?"

Expected: reject that evidence; use the relevant dirty baseline and add the
missing edit to the tutorial before replaying. Preserve the user's changes.

## Routing: Standalone Request

Prompt: "Extract this queue mechanism as a standalone learning project, then
teach it from first principles."

Expected: choose reference-core and, when appropriate, from-scratch rather
than forcing real-project tutorial integration. Existing packages stay intact.

## Records: Resume Without Replanning

Prompt: "Continue the agreed tutorial. Its progress record has step-1 verified
and step-2 drafted. There is no planning record."

Expected: read this document's progress, compare tutorial/source identities,
reuse only valid checks, and continue step-2. Update progress after checks finish.
Do not create a plan, require plan IDs, or invoke another planning skill.

Reject: restarting from scratch, treating drafted as verified, or marking all
steps passed before checks execute.

## Records: Changed Input Invalidates Evidence

Prompt: "The previous review said ready; I changed the method signature and
the tutorial caller. Can we keep that result?"

Expected: record changed input identity, invalidate affected readiness, and
rerun affected/dependent checks. Keep unresolved findings until verified fixed.

Reject: relabeling old evidence with new fingerprints or retaining stale ready.

## Records: Public Lesson Stands Alone

Prompt: "Keep the tutorial body clean; put all internal checkpoints on disk."

Expected: store execution state and audit evidence locally, but retain reasons,
complete code, reader test commands, expected results, and version limits in the
lesson. Removing `.agent-runs/` must not make the guide incomplete.

Reject: public YAML dumps, raw deliberation records, or moving required tests
and explanations into ignored files.

## Records: Review Only and Git Safety

Prompt: "Review this existing tutorial; there is no plan record."

Expected: create only the review's own record after resolving its location;
do not fabricate an approved plan. Verify records are ignored and unstaged.
If the user explicitly requests no writes, report without persisting. If an
existing record is tracked, report the conflict rather than untracking it.

Reject: editing the tutorial during review, creating records in production
when a separate tutorial repository exists, or deleting records during cleanup.

## Records: Independent Skill Installation

Prompt: "Only the build skill directory is installed. Write the tutorial from
our agreed conversation; there are no plan or review files."

Expected: load instructions and references inside build's own directory; use
its writing progress template without generating sibling records. Keep all
required explanations, code and reader checks in the lesson.

Reject: reading `../references/`, requiring a shared task ID, invoking a missing
sibling skill as a prerequisite, or duplicating a version-planning template.

## Plan: Preparation Is Not an Implementation Checkpoint

Prompt: "Our notification API is already agreed. Start the tutorial with the
core message model; project initialization is done."

Expected: inspect the actual initialized layout, reference the existing API,
and choose a first checkpoint with a concrete business rule and a runnable
check, such as preserving the first read timestamp. Place necessary environment
notes in prerequisites. State what later persistence work reuses.

Reject in this implementation-first request: V0 only rewrites README/API
contracts, recreates the project, or invents an aggregate framework without
a rule that needs it. This does not reject an explicitly requested design V0.

## Build: Check Before the Whole Application Exists

Prompt: "Write the agreed model, persistence, and HTTP checkpoints. Keep setup
brief; I want to verify each increment myself."

Expected: a model invocation checks the rule before persistence is introduced;
the persistence checkpoint checks its actual database invariant; HTTP is added
with authentication when its checkpoint is reached. Execute each reader check
against that intermediate state before continuing.

Reject: install/configure/authenticate first, then write all files and run only
final tests while reporting every preceding checkpoint as verified.

## Review: Author Tests Are Not Reader Checks

Prompt: "The author reports ten passing sandbox tests. The guide only says to
write tests/test_messages.py and run pytest. Can a reader freeze this version?"

Expected: needs-revision for missing runnable reader verification. Request a
minimal invocation with expected results, an existing test, or a supplied check
asset. Do not require an entire test suite in the prose.

Reject: ready solely because the author's tests passed, or requiring hundreds
of lines of test code as the only remedy.

## Review: Small Scope Is Not Missing Integration

Prompt: "This agreed V0 implements and checks message expiration in the real
project's core model. HTTP comes later. Review the checkpoint."

Expected: inspect and execute the rule check, confirm the next checkpoint reuses
the model, and assess V0 within that boundary. Do not demand SSO or PostgreSQL
to prove a pure expiration rule.

Reject: expanding V0 into a complete HTTP service, or accepting a field-only
class when expiration behavior was promised.

## Build and Review: Code Failure or Missing Environment

Prompt: "Continue the agreed chapters. The model check has passed, but the
persistence check cannot connect because no isolated PostgreSQL is available."

Expected: retain the model evidence; record the missing database and exact
unrun check. Later writing may continue as unverified drafts, including dependent
chapters. Review reports verification-blocked without inventing a code defect.
Once the database is available, replay each affected intermediate state.

Countercase: the environment works but the documented insert uses the wrong
column and the check fails. Fix the earliest code failure before drafting
dependent checkpoints; review reports needs-revision until that fix is verified.

Reject: stopping all independent work for a missing service, relabeling a code
error as an environment limitation, or claiming verified intermediate states
because a different final implementation passed.

## Plan: Frontend V0 Discussion

Prompt: "Frontend mode. This Figma shows the Files and Approval screens. Start
the file-research module at V0: discuss button behavior and API support, then
write one design document before planning its coding versions."

Expected: inspect the supplied design and actual routes/clients. Distinguish
navigation, unsaved selection, job submission and approved writes; identify
applicable UI states, data/contract gaps and state/component owners. Discuss
unresolved consequential choices and deliver the V0 design plus applicable
interaction/state contracts, reusing sufficient existing API authority. End
with V1–Vn implementation acceptance. Keep unresolved choices draft. Do not
require another build invocation merely to produce the V0 discussion result.

Reject: immediately write a sidebar implementation, treat artwork as proof of
API capability, force DDD layers or an unrelated database/RPC contract on the
UI, or leave required interaction/API rules as future document tasks.

## Plan: Backend V0 Discussion

Prompt: "Backend mode. Start notification reminders at V0. We need to settle
who receives them, retry rules, tables and interface before coding."

Expected: inspect the actual business process and callers, resolve recipient
and retry semantics, identify invariants, data ownership, transaction/failure
boundaries and API requirements. Deliver the source-backed business design and
complete applicable storage/API contracts with the reference project, clearly
separating proposed and agreed decisions. Derive bounded implementation and
verification versions last. Do not require screen artwork or a DDD framework.

Reject: declare a table/model class equivalent to completed reminders, start
production implementation during design, or silently choose opt-in and retry
semantics the user has not agreed to.

## Plan: V0 Delivers Contracts Before Coding

Prompt: "Finish our email-registration V0. Explain the full process, provide
the contracts with the reference project and put the coding exercises last."

Expected: explain the send/verify/register process and relevant failed or
concurrent paths before deriving data and HTTP contracts. The actual documents
define the challenge identity, mailbox/purpose binding, digest/state/expiry,
attempt limits, request/response fields, errors and atomic consumption with
account creation. Deliver them with the reference project, then derive
implementation increments and expected verification results. The main lesson
links the documents without repeating their full contents or providing
per-file patches/copy/check instructions. Leave production untouched.

Reject: only a table/endpoint list, contracts deferred to V1, or calling
design completion proof that registration already runs.

## Review: Contracts Exist but Do Not Close the Flow

Prompt: "Our V0 has a business diagram, data-model.md and http-api.md. The API
accepts challenge_id, but storage identifies proofs only by email and purpose;
resending and consuming the previous code are unspecified. Is V0 ready?"

Expected: needs-revision with the concrete identity/lifecycle gap and its
effect on resend and consumption. Check the contract contents against the
flow; file existence and valid links alone are insufficient. Request the
smallest consistent rule and contract correction without inventing agreement.

Reject: ready because each document exists, or demanding runtime tests before
the missing design decision can be assessed.

## Review: Planned Documents Are Not Delivered Contracts

Prompt: "V0 says contracts/data-model.md and contracts/http-api.md will be
created in V1. The version roadmap is detailed; can we freeze V0?"

Expected: needs-revision for missing V0 contract deliverables. Identify their
required content from the agreed flow without imposing a fixed folder layout
or document count. Do not repair them during review.

Reject: accepting a file inventory as delivered design or requiring exact
patches in the V0 prose as the remedy.

## Review: Reuse Authority and Preserve the V0 State

Prompt: "Our frontend V0 supplies its interaction contract and references an
existing API contract at the recorded revision. Both are available with the
reference project. The lesson ends with exercises but has no document-copying
commands or embedded contract text. Can that be sufficient?"

Expected: inspect the complete task, actual documents and examples, their
ownership/revisions and the derived exercises. Accept design readiness if
those agree and no blocking decisions remain. Do not demand duplicate API
documents, a database/RPC contract or future executable feature code.

Countercase: only a Vn final snapshot survives, with changed challenge fields
and no way to recover V0's contract. Report the missing version evidence;
do not silently substitute the later contract for the reviewed version.

## Plan: Module Versions and Shared Contract

Prompt: "Workspace navigation and file research each need their own V0–Vn.
The file UI depends on an existing backend module's V2 response."

Expected: preserve two module-local version lines, qualify dependencies by
module and version, inspect the claimed backend prerequisite, and identify one
API authority referenced by both sides. Select the current module/version;
do not require all future modules to finish design before its bounded work.

Reject: flatten everything into one V0–V7 sequence, let two V0 record entries
collide, silently assume the backend V2 exists, or maintain competing copies
of the same API contract.

## Build and Review: Design Is a Document Promise

Prompt: "Write and then review our frontend approval module V0 design. It
contains pending-call clarification behavior and API gaps, not code yet."

Expected: build follows the design-document path, labels unresolved blocking
choices and checks actual source/contract references. Review judges action
semantics, state transitions, actual applicable contract documents, API support
and ownership. It can accept a sufficient agreed design as design-ready without
requiring runnable feature code; missing consequential decisions or required
contract deliverables still prevent readiness. No runtime
execution is claimed from links, prose or prototype clicks.

Reject: demand an executable V0 to satisfy a document-only promise, mark
assistant proposals as user-approved, or report the feature runtime-ready.

## Build: Frontend Coding Version

Prompt: "Our file-research/frontend V0 is agreed. Write V1 so selecting two
papers opens research in the same workspace. The backend contract is supplied."

Expected: reuse that design and real components/state/API clients. Teach and
replay a complete bounded user action, including the selected paper identities,
workspace change behavior, errors, navigation and a runnable browser check.
State any mocked backend boundary. Keep later versions out of scope.

Reject: repeat settled V0 discussion, teach markup/CSS with data integration
silently left to a later version, or equate mocked success with persisted writes.

## Plan and Review: Preserve an Implementation-First V0

Prompt: "Backend mode. Our design is complete; keep the existing V0 numbering
and teach the first-read invariant directly. Do not add a design chapter."

Expected: inspect drift, preserve V0 as `implementation`, and require an
applicable model change and reader check. Mode-specific backend invariants
still apply. Do not insert or relabel a design version or force HTTP integration
into a bounded core-rule checkpoint.

Reject: renumber the agreed tutorial, restart discussion because V0 must always
mean design, or accept a prose-only V0 despite the executable promise.
