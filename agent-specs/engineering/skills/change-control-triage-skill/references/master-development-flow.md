# Master Development Flow (One-Wave)

Use this fixed phase order for the current wave:

1. Rules and Invariants
2. Loop Semantics and Domain Logic (no DDL execution)
3. Contract and Compatibility
4. Minimal Executable Slice
5. Data/Infra Landing (if required)
6. Verification and Rollback Drill
7. Release and Observability Handoff

## Ordering Rule

Do not jump to later phases unless prerequisites from earlier phases are materially complete.
Gates may block progression at a phase but must not reorder the phase sequence.
