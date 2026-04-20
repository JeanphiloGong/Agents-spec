# From-Scratch Document Ladder

Use this reference when the skill needs the full document-first teaching shape.

## Contents

- Core Rule
- Required Step Shape
- Recommended Ladder
- Good Signs
- Anti-Patterns

## Core Rule

The output should read like a reusable implementation notebook, not like a
short answer and not like a final-code dump.

Prefer this order:

1. reader and goal
2. external contract
3. constraints and invariants
4. existing evidence, if any
5. from-scratch ladder
6. helper contracts
7. assemble the core slice
8. optional reference implementation
9. common mistakes
10. verification checklist
11. next small step

## Required Step Shape

Each step in `## From Scratch` should answer these prompts:

- `Question`
- `Why This Matters`
- `How To Think`
- `What To Write Now`
- `Small Code Fragment`
- `What To Verify`

Keep each step narrow:

- one new pressure
- one new structure
- one new helper
- or one new mutation rule

If a step tries to introduce multiple new ideas, split it.

## Recommended Ladder

### Step 1: Shrink the feature to one visible pressure

- Use the smallest non-trivial behavior.
- Ask what must already be true for that behavior to work.

### Step 2: Name the first constraint that breaks the naive shape

- This is usually where `O(1)`, ordering, idempotency, or mutation safety shows
  up.
- Make the pressure explicit before proposing a structure.

### Step 3: Introduce the first state or data structure

- Explain why the structure exists.
- State what operation or invariant it protects.

### Step 4: Define the smaller subproblem or boundary

- If one part is already handled, what remains?
- This step usually introduces one public method boundary or one state-machine
  transition boundary.

### Step 5: Decide what "complete" means

- State the completion or success check.
- Add the first guard clause, base case, or success rule.

### Step 6: Decide the next move or helper

- Name the next transition or helper only after its purpose is clear.
- State inputs, outputs, and mutation boundaries.

### Step 7: Show one concrete state update

- Follow one write, one transition, or one helper mutation slowly.
- Be explicit about what changes and what stays stable.

### Step 8: Assemble the public method or core slice

- Combine the already introduced pieces.
- This is the first time the reader should see the full flow.

### Step 9: Walk one trace end to end

- Use one concrete example.
- Confirm that each step in the trace matches the stated invariants.

### Step 10: Present optional full code only after assembly

- The full code must not introduce new logic that was never explained.

## Good Signs

- The reader can explain why each helper exists.
- The reader can say what each state variable protects.
- The reader understands why a simpler structure would fail.
- The reader can implement the next step without re-reading the whole guide.

## Anti-Patterns

Do not do these in from-scratch mode:

- open with full code
- say "use a map/list/tree" without naming the pressure that forces it
- introduce multiple helpers in one step without separate reasons
- hide mutation boundaries
- use the final implementation as the source of truth
- skip from the contract straight to a finished class or service
- repeat the same content across derivation, assembly, and reference sections
