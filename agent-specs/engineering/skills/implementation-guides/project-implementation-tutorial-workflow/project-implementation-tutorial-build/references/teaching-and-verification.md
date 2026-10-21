# Teaching and Verification

Read before writing a non-trivial existing-project implementation tutorial.

## Contents

- [Teaching methods and baseline](#reuse-the-teaching-methods-change-the-baseline)
- [Connected steps](#one-connected-step)
- [Exact edits](#exact-edit-contract)
- [Code, checks, and example](#code-examples-first-test-guidance-second)
- [Required integration](#integration-is-part-of-the-promise)
- [Replay evidence](#replay-and-evidence)

## Reuse the Teaching Methods, Change the Baseline

Keep Nystrom's connected engineering chain, Karpathy's early executable code,
and Norvig's small understandable model. Here the model is a bounded slice of
the real project, not a replacement runtime. Reuse its ORM, session management,
authentication, fixtures, and conventions where they already fit.

Keep version lineage: each version starts from a named baseline, adds a clear
capability, preserves explicit invariants, and has a testable freeze. Distinguish
a version from the smaller teaching steps inside it. Do not invent several
versions for a one-method change or collapse a large roadmap into one tutorial.

## One Connected Step

Start with a real caller or input. For example, a retry currently creates a
second notification; show the observed write path before explaining deduplication.
State the invariant, then explain the smallest change that preserves it.

Use this sequence as an internal writing check, not mandatory public labels:

`real input -> existing behavior/gap -> requirement -> exact edit -> check -> next baseline`

The existing implementation need not be wrong. A new capability is sufficient
pressure. Do not make the reader temporarily remove a correct lock or transaction
just to demonstrate a naive design. Illustrative broken snippets must be clearly
labeled as explanations, not implementation steps.

Explain a helper through its caller, inputs, return value, and side effects.
Explain new field semantics, nullability, status transitions, and time handling
when relevant. Use a small example for non-obvious behavior instead of merely
restating the code line by line.

## Exact Edit Contract

Every implementation code block identifies a real relative file path, its
class/function when relevant, and one of these operations:

- `patch`: exact addition, deletion, or replacement against the previous
  visible state, with enough context to apply it unambiguously.
- `checkpoint`: the complete declared unit, such as a new file or a whole
  changed method, with explicit imports and caller edits. A complete method
  need not repeat unrelated methods in a large existing module.

Distinguish these code-unit checkpoints from the completed feature-version
checkpoint. Replacing one method is not by itself proof of feature completion.

New files must include full imports and definitions. Full method replacements
must show the signature and body, plus exact module-level import edits. Avoid
free-floating indented fragments. Refer to unchanged code by verified path and
symbol; every new helper must be implemented in the tutorial. A protocol stub
is acceptable only as a declared interface with its required concrete
implementation supplied before the runnable checkpoint.

The last connected step must leave the final implementation unambiguous. When
successive fragments changed the same method, show its assembled final method
in that step. Do not repeat every unaffected source file or add unexplained
logic in a detached final code section.

## Code Examples First, Test Guidance Second

The tutorial is an implementation lesson. For every required change, write a
numbered code step that the reader can apply in sequence:

```text
Step -> real path/symbol -> complete code -> why it fits the previous step
     -> reader check -> next step
```

The code block must contain enough context to apply the change safely: imports,
type/signature, surrounding method or insertion point, and the caller update
when the caller is part of the promised behavior. A short diff is acceptable
only when its location and unchanged context make the edit unambiguous. A
sentence such as "add a Repository method" is not an implementation example.

At every capability freeze include a runnable reader check, including its
minimal verification code when needed. Use an existing test only if it exists
at that point; a command for tests the reader must invent is not sufficient.
Broader tests can be described through paths, inputs, setup, expected results,
and boundaries. A full suite is needed in the prose only when requested or
when testing itself is the subject. Author-only sandbox tests provide additional
evidence, not a replacement for the reader's check.

Execute the reader check on the intermediate state. If it needs later code,
narrow or regroup the checkpoint. Repair code failures before drafting dependent
checkpoints. If the environment is unavailable, record the missing prerequisite;
independent checks and later writing may continue, but affected and dependent
checkpoints remain unverified drafts. Replay their intermediate states in order
when access is restored. Final-state success cannot verify earlier states.

### Example: First-Read Checkpoint

Illustrative fixture: the reader's project already has `messages.py:Message`
with `user_id` and `read_at`; the requested addition is first-read behavior.
The following is the complete replacement file for this small fixture, not a
required architecture for other projects.

`messages.py` — checkpoint:

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Message:
    user_id: str
    read_at: datetime | None = None

    def mark_read(self, now: datetime) -> None:
        if self.read_at is None:
            self.read_at = now
```

Previously a caller could overwrite the timestamp on every read. Callers now
use `mark_read(now)` to preserve the first read. This fixture has no existing
read caller; if the actual project has one, its exact update belongs in this
checkpoint too. Run from the directory containing `messages.py`:

```bash
python - <<'PY'
from datetime import datetime, timedelta, timezone
from messages import Message

first = datetime(2026, 1, 1, tzinfo=timezone.utc)
message = Message(user_id="user-A")
assert message.read_at is None
message.mark_read(first)
message.mark_read(first + timedelta(minutes=1))
assert message.read_at == first
print("first read preserved")
PY
```

Expected: `first read preserved`, exit code 0. This proves the model transition;
the next checkpoint persists this same state. It does not prove concurrent
database updates. Reject "implement the model, then write tests and run pytest"
as a replacement for this check. A persistence checkpoint must supply its own
database verification appropriate to its promise.

## Integration Is Part of the Promise

If the version promises an HTTP feature, cover its actual route, service,
repository, response schema, user scope, and required persistence changes.
If it promises a worker feature, cover the actual entrypoint, selection/claim,
state writes, and relevant retry/shutdown semantics. Cover only what is needed;
do not turn every tutorial into a deployment manual.

One business action requiring atomic writes must use the actual transaction
owner across its repositories. An ORM definition alone does not migrate an
existing database. Show the project's actual initialization/migration path and
a test on disposable data when persistence changes.

An agreed foundation-only version may stop before HTTP or delivery integration.
Say so at the start and in acceptance. Never narrow a complete-feature promise
after discovering the integration is difficult.

## Replay and Evidence

Record the source revision and relevant dirty baseline without copying secrets.
Use a disposable copy with isolated connection settings; merely copying a repo
does not isolate its external services. Check test configuration before running.

Apply the document's code edits in order. At each runnable checkpoint, run its
named reader check. Deliberately incomplete substeps must say which next step completes them
and must not be presented as runnable or ready to commit.

Test relevant positive and negative behavior: authorization boundaries,
idempotency, rollback, status transitions, time boundaries, pagination, or
concurrency as the feature requires. Do not add irrelevant test categories.
Final regression covers affected contracts, not automatically the whole repo.

Report commands and actual results separately from suggested user commands.
State exactly what mocks, dialect substitutions, or unavailable services leave
unproven. Inspect the verification diff for undocumented fixes. Remove only
the temporary artifacts created by this task. Never claim the production
feature was implemented because the tutorial replay passed.

Follow the writing progress guide loaded by the build skill: keep actual
step/check state and detailed results in local records, and retain them when
cleaning the sandbox. The lesson contains reader commands, expected outcomes,
and capability checkpoints, not author progress checklists. The handoff gives
a concise actual verification summary and important limits. Never remove
essential explanations or reader checks just because they also appear in records.
