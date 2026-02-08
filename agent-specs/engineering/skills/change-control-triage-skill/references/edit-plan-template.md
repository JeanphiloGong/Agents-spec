# Output Template (`fast`)

```
## Change Plan Summary
- Goal:
- Decision: BLOCK|CONDITIONAL|OK
- Applied Flow: 1->7 master
- Triggered Gates: none|Security|Data|Contract|Reliability
- Migration Strategy: existing-files-first
- New File Policy: deny-by-default

## Main Mapping Plan (1->7)
- Phase 1 (Rules and Invariants):
  - ai_diff:
  - main_target:
  - change:
  - done_when:
- Phase 2 (Domain and Model Design):
  - ai_diff:
  - main_target:
  - change:
  - done_when:
- Phase 3 (Contract and Interface Design):
  - ai_diff:
  - main_target:
  - change:
  - done_when:
- Phase 4 (Core Implementation):
  - ai_diff:
  - main_target:
  - change:
  - done_when:
- Phase 5 (Integration and Infrastructure):
  - ai_diff:
  - main_target:
  - change:
  - done_when:
- Phase 6 (Verification):
  - ai_diff:
  - main_target:
  - change:
  - done_when:
- Phase 7 (Release and Observability):
  - ai_diff:
  - main_target:
  - change:
  - done_when:

## Per-Step Gate
- Phase 1:
  - must_pass:
  - block_when:
- Phase 2:
  - must_pass:
  - block_when:
- Phase 3:
  - must_pass:
  - block_when:
- Phase 4:
  - must_pass:
  - block_when:
- Phase 5:
  - must_pass:
  - block_when:
- Phase 6:
  - must_pass:
  - block_when:
- Phase 7:
  - must_pass:
  - block_when:

## Minimal Landing Batch (Top 3)
- 1) ...
- 2) ...
- 3) ...

## Minimal Verification
- check:
- expected result:

## Rollback (If High Risk)
- immediate stop-the-bleeding:
- rollback step:

## Multi-Agent Plan (When multi)
- mode: single|multi
- reviewers:
- reviewer_focus:

## Blocking Questions (Only If Blocking)
- ...
```
