# Skeleton Gate

Use this reference when `workflow-build` touches non-trivial implementation
targets. The goal is not to add more comments; the goal is to force the agent
to expose its understanding before it writes code.

## Gate Sequence

For each non-trivial slice:

```text
inspect task and relevant code
slice scope
-> coverage map
-> target skeleton gate
-> direct implementation
-> coverage drift check
-> test
-> helper audit
```

Do not skip from `coverage map` to a full method body when the target is
non-trivial.

The first code edit for every non-trivial task or slice must be skeleton-only
across the whole slice. A spoken plan, checklist, or coverage map is required
context, but it does not count as the skeleton edit. The skeleton-only edit must
not include final fields, final implementation-only imports, constants or enums
that finalize the contract, full method bodies, assertions, fixtures, route
registrations, persistence logic, hash or checksum calculations, external
calls, or completed error handling.

This global first-edit rule applies even to simple coverage-map targets. A
field declaration, import, test assertion, route registration, or one-line
caller may not need its own method-level skeleton, but it still cannot be fully
implemented in the first skeleton-only edit for a non-trivial slice. In that
first edit, cover simple targets through the coverage map or a short code-local
comment that describes the intended contract. Add the final code in the next
implementation edit.

## Non-Trivial Targets

A target needs a skeleton before implementation when it adds or changes any of
these:

- file writes, cache writes, locks, transactions, or migrations
- request handlers, routes, service methods, workers, or graph nodes
- external API calls, LLM calls, queues, or background jobs
- loops with state changes, multi-step validation, or branching error handling
- cross-file data flow, model persistence, or status synchronization
- multiple fields that must be updated together to preserve one invariant

These usually do not need a method-level skeleton:

- field declarations with no behavior
- simple getters or pure formatting one-liners
- thin forwarding code with no new state or error boundary
- tests that only assert an already-skeletoned behavior

This exception only means "no method-level skeleton required." It does not
override the global first-edit rule.

## Coverage Map

Before implementation, list every target the slice expects to change.

Good:

```text
coverage_map:
- models/import_record.py::ImportRecord fields: persist import status and source version.
- services/import_cache.py::write_import_snapshot_with_lock: write one import snapshot under file lock.
- tests/import_cache_test.py::test_write_import_snapshot_marks_ready: prove the saved snapshot is ready.
```

Bad:

```text
coverage_map:
- cache layer
```

The bad version is too broad. It does not prove which methods, models, or tests
the agent understands.

## Method-Level Skeleton

When adding a non-trivial function or method, first add a skeleton-only edit
with the signature and ordered steps. The skeleton can be short, but it must
name the state boundary and the invariant.

Use labels such as `invariants`, `boundaries`, and `helper_gate` in the
checkpoint output. Do not put process labels such as `invariant:` or
`boundary:` inside code comments. Code-local skeleton comments should read like
normal engineering comments.

Good:

```python
async def write_import_snapshot_with_lock(import_id, record_id, snapshot, source_version):
    # Resolve the import job and snapshot file before entering the file lock.
    # Inside the lock, read the latest file state and validate that the record exists.
    # Write snapshot, status, source version, checksum, timestamp, and error
    # together so readers never observe a partial record version.
    # Persist an existing snapshot only; snapshot construction happens upstream.
    pass
```

Bad:

```python
async def write_import_snapshot_with_lock(import_id, record_id, snapshot, source_version):
    import_job = await import_table.get_by_id(import_id)
    ...
```

The bad version jumps straight to implementation. It may be correct by chance,
but the ordering and invariant were never exposed before code generation.

## Simple Target Coverage

When a non-trivial slice also needs simple declarations, keep the first edit
non-final.

Good first edit:

```python
class ImportRecord(BaseModel):
    # Snapshot metadata will be stored on the record and must load safely from
    # older files that do not have those fields yet.
    pass
```

Bad first edit:

```python
import hashlib

class ImportRecord(BaseModel):
    snapshot_status: Literal["missing", "ready", "stale"] = "missing"
    snapshot_checksum: str = ""
```

The bad version finalizes schema and implementation-only imports before the
skeleton checkpoint has separated structure from implementation.

## Direct Implementation Rule

After the skeleton-only edit is shown, fill in the body directly. Do not turn
the skeleton steps into new helpers unless the helper gate has evidence from
the current slice.

Good:

```text
helper_gate: no new helper; the logic appears once in one method.
```

Good when evidence exists:

```text
helper_gate: allow one checksum method; the same snapshot invariant is used by
save, read, stale detection, and downstream consumption.
```

## Coverage Drift Check

After direct implementation and before tests, compare the diff to the coverage
map.

Fail the gate when:

- a new file, function, method, route, test, or generated artifact appears
  without coverage-map entry
- a method body grows beyond the skeleton's stated responsibility
- implementation creates a new helper that was not allowed by `helper_gate`
- code starts handling a different behavior than the slice scope named

If drift appears, do not keep coding. Add a new skeleton-only checkpoint for
the new target or split it into the next slice.

## Anti-Patterns

| Anti-pattern | Why it fails |
|---|---|
| One invariant comment in a cache method, then model, router, graph, and tests change. | The skeleton did not cover the implementation surface. |
| A new locked write method appears fully implemented in one edit. | The method's ordering and state invariant were not reviewed before generation. |
| Final schema fields, imports, test assertions, route registrations, or hash calls appear in the first skeleton edit. | The first edit is no longer skeleton-only across the whole slice. |
| Coverage map says "service layer" or "API changes". | The target is too vague to constrain implementation. |
| Skeleton comments say `load data`, `validate`, `process`, `return`. | They name generic chores instead of real ordering or invariants. |
| Helper names appear in the skeleton before repetition exists. | The skeleton is decomposing prematurely instead of guiding direct implementation. |
