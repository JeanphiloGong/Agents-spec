---
name: change-control-triage-skill
description: v0.1.8 - Generate lean, master-flow-first modification plans with strict gate prechecks and explicit source anchors.
---

# Change Control Triage Skill

## Trigger and Scope

Use this skill when you need an implementation plan for project changes that follows real development order.

In scope:
- backend, frontend, data, infra, AI workflow, release
- concise modification plan output
- strict gate prechecks before phase progression

Out of scope:
- auto-writing production code
- verbose audit reports by default
- assumptions unsupported by repository evidence

## Defaults

- `mode=fast`
- `development_flow=master` (fixed)
- `gate_policy=strict` (fixed)
- `agent_mode=auto`
- `diff_target=working tree`

## Required Inputs

- `repo_root` (default: current workspace)
- `diff_target` (working tree or `<base>..<head>`)
- `mode` (optional: `fast|deep|audit`)
- `agent_mode` (optional: `auto|single|multi`)

If required facts are missing, ask only blocking questions.

## Master Flow (Fixed Order)

1. Requirements and Invariants
2. Domain and Model Design
3. Contract and Interface Design
4. Core Implementation
5. Integration and Infrastructure
6. Verification
7. Release and Observability

## Source Anchors (Master-Level)

This flow is a composite of proven practices, not a single author:
- Domain and invariants: Eric Evans, Vaughn Vernon
- Refactoring and contract evolution: Martin Fowler
- TDD and fast feedback: Kent Beck
- Delivery and release engineering: Jez Humble, David Farley
- Distributed systems and data correctness: Martin Kleppmann
- Reliability operations: Google SRE practice

## Gates (Strict)

Before normal phase progression, check:
- `Security Gate`
- `Data Gate`
- `Contract Gate`
- `Reliability Gate`

If any blocking gate is unresolved, set `Decision=BLOCK` and place gate fixes first.

Security and reliability gates are grounded in:
- OWASP ASVS (application security verification)
- Threat modeling practice (Adam Shostack-style methodology)
- SRE reliability and rollback discipline

## Workflow

1. Read `diff_target` and identify changed components.
2. Map changes to the fixed master flow phases.
3. Evaluate gate triggers.
4. Build `Start Here (Top 3)` with gate fixes first.
5. Build phase-by-phase file modifications.
6. Define execution order.
7. Define minimal verification and rollback.
8. Output only blocking questions.
9. If `mode=deep`, append concise risk/tradeoff notes.
10. If `mode=audit`, append full evidence/classification sections.

## Output Format (`mode=fast`)

```
## Change Plan Summary
- Goal:
- Decision: BLOCK|CONDITIONAL|OK
- Applied Flow: master
- Triggered Gates: none|Security|Data|Contract|Reliability

## Start Here (Top 3)
- 1) ...
- 2) ...
- 3) ...

## Phase-by-Phase Modifications
- Phase 1 (Requirements and Invariants):
  - `path`:
    - change:
    - reason:
    - done when:
- Phase 2 (Domain and Model Design):
  - ...
- Phase 3 (Contract and Interface Design):
  - ...
- Phase 4 (Core Implementation):
  - ...
- Phase 5 (Integration and Infrastructure):
  - ...
- Phase 6 (Verification):
  - ...
- Phase 7 (Release and Observability):
  - ...

## Execution Order
- 1) ...
- 2) ...
- 3) ...

## Minimal Verification
- command/check:
- expected result:

## Rollback
- immediate stop-the-bleeding:
- rollback step:

## Open Questions (Blocking Only)
- ...

## Notes
- mode: fast|deep|audit
- agent_mode: auto|single|multi
- reviewers (when multi): ...
```

## Guardrails

- Keep output implementation-first and concise.
- Do not jump to entry wiring before upstream phases are ready.
- Do not omit rollback for irreversible or high-impact changes.
- Do not hide unresolved gate issues.
- Do not output secrets, tokens, or PII.

## Verification Hooks

- Includes: `Start Here`, phase modifications, execution order, verification, rollback.
- Phase order follows fixed master flow unless blocked by gates.
- `mode=fast` avoids heavy audit sections.

## References

- `references/master-development-flow.md`
- `references/gate-definitions.md`
- `references/edit-plan-template.md`
- `references/operator-playbook.md`
- `references/acceptance-criteria.md`
