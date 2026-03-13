# Acceptance Criteria & Review Standards

## Usage

Apply the universal criteria to every run. Add the domain-specific checks when
the memory content affects architecture, product direction, operations, or
formal repository docs.

## Universal Acceptance Criteria

- **Explicit write trigger**: The operator clearly asked for a write.
- **External root by default**: Storage resolves to `~/.agents` unless explicitly overridden.
- **Deterministic filenames**: Session and decision records follow the documented naming rules.
- **Type fit**: The content is stored as the correct record type.
- **Required metadata present**: Each record includes the mandatory fields for that template.
- **Navigation updated**: `index.md` or another stable index points to the new record when needed.
- **No sensitive content**: Secrets, tokens, credentials, and PII are excluded.
- **Promotion boundary respected**: Repository docs are updated only when explicitly requested.

## Domain-Specific Criteria

### Architecture / Engineering
- Decisions state the affected boundary or interface.
- Tradeoffs and failure risks are explicit.
- Superseded records link to the replacing decision.

### Product / Planning
- User outcome or success metric is named.
- Scope boundaries and open questions are explicit.
- Next actions name an owner or follow-up checkpoint.

### Operations / Infra
- Paths, environments, and rollback implications are explicit.
- Worktree or branch fragmentation risk is called out when relevant.
- Follow-up verification steps are named.

## Reviewer Challenge Checklist

- What would cause duplicate or conflicting memory records?
- Which record should have been updated instead of creating a new file?
- What failure signal would show that repo-local writes are happening by accident?
- Which accepted decision is most likely to become stale first?
- What should be promoted into the repository, and what should remain external memory?
