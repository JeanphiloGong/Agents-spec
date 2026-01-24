# Acceptance Criteria & Review Standards

## Usage

Select criteria by domain and risk level. Do not randomize. Use the tightest applicable criteria to ensure auditability.

## Universal Acceptance Criteria (Always)

- **Outcome defined**: A measurable result is stated.
- **Inputs clear**: Required inputs are explicit.
- **Workflow valid**: Steps are actionable and sequenced.
- **Guardrails present**: Safety/abuse boundaries are explicit.
- **Verification**: How to verify success is stated.
- **Unknowns**: Missing facts are labeled as unknowns.

## Domain-Specific Criteria (Pick Relevant)

### Engineering
- No silent regressions for critical paths.
- Interfaces remain stable or have migration notes.
- Changes are reviewable and traceable.

### Security
- Threat model considered.
- Least-privilege enforced.
- Incident response steps documented.

### Data
- Lineage and ownership documented.
- Quality checks defined.
- Privacy constraints met.

### Product
- Success metrics defined.
- Acceptance criteria per feature.
- Scope boundaries explicit.

### Compliance/Legal
- Regulatory constraints mapped.
- Audit trails defined.
- Approval gates listed.

### Operations/SRE
- Rollback defined.
- Monitoring and alerts configured.
- On-call escalation documented.

## Reviewer Challenge Checklist

- What would make this unusable?
- What would cause harm if misapplied?
- Which assumption is weakest?
- What failure signal would appear first?
- What should be verified before declaring done?
