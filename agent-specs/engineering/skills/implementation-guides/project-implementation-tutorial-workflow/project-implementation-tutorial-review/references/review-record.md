# Review Record

## Purpose

Preserve a review's evidence, findings and scoped verdict. The input is a
tutorial and its promised baseline; plan/build records are not prerequisites.
Do not invent authoring progress or an approved plan to populate this record.

## Recording Loop

1. Identify the tutorial content, promised scope and source baseline under
   review. Use any explicitly supplied prior evidence as claims to verify.
2. Reuse a supplied record for the same review, or default to
   `.agent-runs/tutorial-review/<document-topic>/review.yaml` in the tutorial
   workspace. Announce the path; do not attach it to another skill's task ID.
3. Record concrete findings as discovered, with tutorial/source locations,
   consequences and minimum corrections. Update checks after executing them.
4. On re-review compare artifact and baseline identities. An old verdict is not
   current after changes. Verify each reported fix before closing its finding,
   and check affected behavior for new defects.
5. Before handoff verify finding IDs, evidence identities, and verdict consistency.
   `ready` needs sufficient current evidence and no open blocking findings.
   Report `needs-revision` for defects and `verification-blocked` for missing
   required evidence; when both apply report defects plus verification limits.

## Template

Use actual evidence or null with a stated limitation. No plan revision or
chapter-progress references are needed.

```yaml
subject:
  tutorial: "/path/to/guide.md"
  content_fingerprint: null
  promised_scope: "Capability being assessed"
  source_repository: "/path/to/project"
  baseline_fingerprint: null
verdict: "verification-blocked"
findings:
  - id: "R1"
    severity: "high"
    location: "Tutorial section and real source path/symbol"
    consequence: "Concrete impact on the promised behavior"
    correction: "Smallest correction needed"
    status: "open"
    resolution_evidence: null
checks:
  - command: "Actual verification command"
    cwd: "/path/to/isolated/replay"
    status: "not-run"
    result: null
    checked_at: null
limitations: []
```

Use `findings: []` when none were identified. A finding is `open` or
`verified-fixed`; checks are `not-run`, `passed`, `failed`, or `blocked`.
Preserve the input identity associated with evidence when updating a review;
do not relabel old checks with a new baseline. A successful author report is
not verification. Do not silently repair the sandbox and report the guide passed.

## Boundaries

The user gets findings, evidence limits and a concise readiness conclusion,
not a raw YAML dump. The tutorial is not edited by review. Missing essential
reader instructions cannot be excused because they exist in a local record.

Only the local review record and necessary local Git ignore entry are allowed
besides disposable verification artifacts. In Git resolve the exclude file via
`git rev-parse --git-path info/exclude`, preserve existing rules, add a local
ignore rule if needed, and check `git check-ignore` and `git ls-files`. Report
tracked conflicts without untracking files. An explicitly read-only request
means no persistence. Keep records after sandbox cleanup, never commit them,
exclude credentials/private data, and report save failures.

No sibling instructions, common run directory or plan/build files are required.
Only read other phase artifacts when explicitly supplied as review inputs.
