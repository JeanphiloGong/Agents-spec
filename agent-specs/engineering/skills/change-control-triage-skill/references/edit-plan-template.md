# Output Template (`mode=fast`)

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
  - `path/to/file`:
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
```
