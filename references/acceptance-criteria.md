# Acceptance Criteria

## Purpose
- Define acceptance checks for skill updates.
- Provide a reviewer checklist for auditable approvals.

## Acceptance Checklist
- Skill has a clear trigger and scope statement.
- Workflow steps are imperative and unambiguous.
- Required inputs are listed; missing inputs are called out.
- Defaults are explicit and safe.
- Guardrails prevent unsafe or ambiguous behavior.
- Verification hooks describe how to validate correctness.
- Audit artifacts are defined with paths.
- Iteration loop and reinforcement plan are present.
- References are one level deep and non-fabricated.

## Reviewer Challenge Checklist
- Any hidden coupling across modules?
- Any invented policies, APIs, or infrastructure?
- Any missing approval gates for high-risk changes?
- Any required references or scripts missing?
