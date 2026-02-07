# Acceptance Criteria (Change Control Triage Skill)

## Universal (Always)

- Outcome is defined (what the operator gets).
- Inputs are explicit; missing inputs are labeled `UNKNOWN`.
- Workflow steps are actionable and sequenced.
- Guardrails prevent unsafe/ambiguous behavior.
- Verification describes how to validate correctness.
- Unknowns are explicitly listed as blockers when relevant.

## Skill-Specific (Must Pass)

- Evidence Map includes a real diff-based file inventory.
- Every changed file/group is classified as RED/YELLOW/GREEN (or explicitly excluded with justification).
- No auto-RED category is classified as GREEN.
- Every RED item has a complete mastery checklist:
  - >= 3 invariants
  - explicit preconditions/state boundaries
  - explicit state transitions
  - >= 3 failure modes + handling
  - at least 1 negative test per policy gate
  - a rollback/stop-the-bleeding step
- Decision gate is emitted and is consistent with the rubric:
  - Missing RED mastery → `BLOCK`
  - Missing rollback notes for irreversible changes → `BLOCK`
  - Missing negative tests for auth/pricing/migrations/contracts → `BLOCK`

## Reviewer Challenge Checklist

- What would make this triage output misleading or unsafe?
- Which assumption is weakest, and how would you verify it quickly?
- What failure signal would appear first if a RED item is wrong?
- Is the suggested verification plan minimal but sufficient?
