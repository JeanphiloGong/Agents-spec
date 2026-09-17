# Writing Progress

## Purpose

Resume tutorial authoring from the last trustworthy chapter/checkpoint. Track
what was written and what was actually tested. This is not a version-planning
database. An agreed conversation is sufficient input; do not create a plan
record or require a sibling skill before writing.

## Recording Loop

1. Identify the target tutorial, selected scope and real source baseline. Read
   an upstream plan or review only when provided or explicitly designated as
   input; validate it against current decisions rather than scanning other runs.
2. Reuse this document's supplied progress record, or default to
   `.agent-runs/tutorial-build/<document-topic>/progress.yaml` in the tutorial
   workspace. Announce the path and avoid collisions with unrelated guides.
3. Record chapter state after each writing/checking increment, including missing
   code and the next exact edit. Use chapter-local IDs, not required plan IDs.
4. Before resuming, compare current source and document identities with each
   check's evidence. Mark affected chapters drafted or blocked and rerun their
   checks and affected later chapters; never relabel stale evidence as current.
5. At handoff verify unique chapter IDs, actual evidence for verified chapters,
   and that the document contains all instructions needed without this record.

## Template

Replace illustrative values with actual locations, identities and outcomes.
Omit `input_reference` when no upstream artifact exists.

```yaml
tutorial: "/path/to/guide.md"
scope: "The agreed capability this guide delivers"
input_reference: "/optional/path/to/agreed-plan.md"
baseline:
  repository: "/path/to/project"
  revision: null
  relevant_dirty_fingerprint: null
current_chapter: "step-1"
chapters:
  - id: "step-1"
    section: "Exact document heading"
    status: "drafted"
    missing_content: []
    checks:
      - command: "Actual verification command"
        cwd: "/path/to/isolated/replay"
        document_fingerprint: null
        baseline_fingerprint: null
        status: "not-run"
        result: null
        checked_at: null
    blocker: null
next_edit: "Specific file/section and unfinished action"
```

Chapter status is `pending`, `drafted`, `verified`, or `blocked`; check status is
`not-run`, `passed`, `failed`, or `blocked`. Verified requires all checks needed
by the chapter's promise to pass. Explain blocked checks and do not count
mocked or substituted environments as proof of untested production behavior.
Keep concise durable results, not only pointers to logs in a deleted sandbox.

## Boundaries

The lesson retains reasons, exact code, reader commands, expected results and
scope limits. Local state holds author progress and execution evidence. Keep
self-review repair notes as missing content/blockers; do not fabricate a separate
review artifact. A user-requested formal review is a distinct activity.

Keep progress local and uncommitted in the tutorial workspace. Resolve the Git
exclude file with `git rev-parse --git-path info/exclude`, preserve its entries,
and add a local ignore rule if needed. Verify with `git check-ignore` and
`git ls-files`; report tracked-file conflicts, never silently untrack. An
explicit no-write request overrides persistence. Keep records after sandbox
cleanup, exclude credentials/private data, and report failures to save.

This record requires neither a shared task ID nor plan/review record files.
Handoff reports the guide, actual verification summary and remaining limits;
another skill can read it when explicitly supplied, without adopting its schema.
