# Operator Playbook: Reading and Acting on the Triage Output

This playbook explains what to do with the skill output when it feels like “too many checklists”.

## What the output *is*

It is a **decision-and-ownership report**:
- What changed (Evidence Map)
- What must be controlled vs understood vs delegated (Control Map)
- Why you cannot merge yet (Top Findings + Unknowns)
- The minimum verification to reduce risk (Verification Plan)

It is intentionally strict so you don’t ship “black-box core logic”.

## Where to start (always)

1) **Decision**
- If `BLOCK`: do not read everything. Jump to blockers.
- If `CONDITIONAL`: focus on YELLOW verification gaps.
- If `OK`: run the minimal verification and ship.

2) **Top Findings (Critical/High)**
- This is the “real to-do list”. Fix critical items first.

3) **Unknowns / Blocking Questions**
- Anything here is a missing fact that prevents safe ownership. Turn each into a concrete task:
  - missing migration → create migration + rollback notes
  - missing tests → add minimal unit/negative tests
  - unclear contract → write/confirm contract (schema/DTO/event)

4) **Verification Plan**
- Run the smallest set first. Expand only if you find new risks.

Only after the above, read the full RED mastery checklists for the specific RED items you are about to touch.

## The 30-minute “unblock” path (recommended)

When you see `BLOCK`, do this:

1. Confirm the diff target is correct (wrong target = useless output).
2. Fix the single highest-risk missing artifact (usually migration/rollback for persistence changes).
3. Add one negative test per policy gate for the top RED item.
4. Run the minimal tests to prove the gate can move.
5. Re-run triage and check that Top Findings shrink.

## Turning a mastery checklist into tasks

For each RED item, create tasks in this order:

1. **Invariant tasks**
   - Write down invariants in one place (doc, PR description, or test names).
2. **Negative test tasks**
   - For each forbidden combination / policy gate, add a negative test.
3. **Rollback tasks**
   - Define the fastest safe rollback (“stop-the-bleeding”) even if imperfect.
4. **Failure mode tasks**
   - Ensure each failure mode has a deterministic signal and handling path.

## When multi-agent mode helps

Use `agent_mode=multi` (or let `auto` switch) when:
- >= 2 auto-RED surfaces are touched (e.g., pricing + migrations)
- multiple languages/layers are changed
- verification is unclear or tests are missing

Multi-agent mode’s goal is not more text; it is fewer blind spots. The main agent must still distill the result into “Start Here” and “Top Findings”.
