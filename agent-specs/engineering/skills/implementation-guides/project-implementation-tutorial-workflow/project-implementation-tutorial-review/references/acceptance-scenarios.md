# Acceptance Scenarios

## Contents

- Version planning and direct build
- Integration, partial scope, dialect and dirty baseline review
- Standalone routing
- Local records, resumption, and public prose

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
