# Gate Definitions

Gates are preemption conditions applied before normal phase progression.

Source anchors:
- OWASP ASVS (security verification baseline)
- Threat modeling practice (Adam Shostack)
- Martin Kleppmann style data integrity and irreversibility concerns
- SRE rollback and reliability discipline

## Gate Policy

- `strict`:
  - unresolved blocking gates force `Decision=BLOCK`
  - gate fixes are placed first in `Start Here`
- `advisory`:
  - gates are listed as warnings
  - phase flow may continue with explicit caution

## Security Gate

Trigger examples:
- missing auth verification
- privilege escalation path
- token/signature checks bypassed
- unsafe secret handling

Placement:
- preempt to top priority before other phase tasks

## Data Gate

Trigger examples:
- irreversible migration without rollback
- destructive data operation without recovery path
- schema changes that can corrupt reads/writes

Placement:
- preempt before persistence or integration execution

## Contract Gate

Trigger examples:
- public API/schema/event break without compatibility strategy
- interface rename/removal without migration notes
- client-facing payload shape break

Placement:
- preempt before interface and release tasks

## Reliability Gate

Trigger examples:
- no minimal verification path for critical flows
- no rollback/stop-the-bleeding strategy
- changes with high blast radius and no failure handling

Placement:
- preempt before release progression

## Gate Resolution Requirement

A triggered gate is resolved only when:
- a concrete fix step is defined
- a verification check exists
- rollback behavior is stated
