# Acceptance Criteria for Project AGENTS.md

Use these checks after drafting or revising a project-level `AGENTS.md`.

## Core Checks

- Project purpose and owner are explicit.
- Default focus area and high-risk directories are explicit.
- Approval requirements for code, config, deployment, or other risky changes
  are explicit.
- The file stays repository-specific rather than generic.
- Testing expectations and `not run` behavior are explicit.
- Risks and open questions call out unknown boundaries instead of guessing.
- No secrets, tokens, credentials, or PII appear in the output.

## Domain Checks

- Every selected domain philosophy maps to a real project risk or constraint.
- Omitted domains are omitted for a reason, not by accident.
- Domain statements stay operational: `Goal`, `Constraints`, `Evidence`,
  `Failure Cost`, `Tradeoffs`, and `Non-negotiables` are concrete.

## Rule Quality Checks

- Each golden rule is explainable in one sentence.
- Each golden rule contains a visible `Why / How / Check` shape.
- Scope boundaries, permission rules, and execution rules do not contradict one
  another.
- The file does not widen edit authority without explicit approval language.

## Reviewer Challenge

- Which directory or workflow would still be ambiguous to an operator?
- Which approval rule is missing for the highest-risk path?
- Which selected domain philosophy looks generic rather than project-specific?
- What evidence would prove this AGENTS contract is being followed in practice?
