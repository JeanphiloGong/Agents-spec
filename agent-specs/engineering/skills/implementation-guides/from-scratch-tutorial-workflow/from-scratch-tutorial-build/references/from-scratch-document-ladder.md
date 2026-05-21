# From-Scratch Document Ladder

Use this reference when the skill needs the full document-first teaching shape
with connected code growth.

## Contents

- Core Rule
- Required Step Shape
- Recommended Ladder
- Good Signs
- Anti-Patterns
- Full-Code Policy

## Core Rule

The output should read like a reusable implementation notebook, not like a
short response and not like a final-code dump.

The guide must grow through connected code versions. Do not alternate between
standalone concept prose, unrelated code blocks, and a late complete-code dump.
Write one problem, one concrete defect, one code change, one check, one new
capability, and one remaining gap at a time. Finish that step before drafting
the next step. Mark every code change as a `patch` or `checkpoint`, and make
the last meaningful code step an assembled complete checkpoint.

Prefer this order:

1. reader and goal
2. external contract
3. constraints and invariants
4. existing evidence, if any
5. from-scratch ladder
6. helper contracts
7. common mistakes
8. verification checklist
9. next small step

## Required Step Shape

Each step in `## From Scratch` should answer these prompts:

- `Question`
- `Naive or Previous Version`
- `What Breaks`
- `New Requirement`
- `Add or Replace`
- `Code Change Type`
- `Code Change Target`
- `Code Change`
- `Why This Change Works`
- `Step Check`
- `Now This Version Can`
- `Freeze This Version`
- `Still Lacks`
- `What To Verify`
- `Step Self-Review`

Keep each step narrow:

- one new pressure
- one new structure
- one new helper
- or one new mutation rule

If a step tries to introduce multiple new ideas, split it.

Use code change roles consistently:

- `patch`: a local addition or replacement applied to the previous visible
  version.
- `checkpoint`: the complete current runnable unit for the named target.

The final meaningful code step must be a `checkpoint`. It should include the
imports, types, helpers, and public API needed for the target to run. It must
not include logic that earlier steps did not explain.

Every code step should be connected to the previous version. Use these
connectors in substance:

1. `The previous version can ...`
2. `What breaks is ...`
3. `Therefore the new requirement is ...`
4. `In the previous version, add ...`
5. `Code Change Type: patch/checkpoint`
6. `Code Change Target: ...`
7. `This works because ...`
8. `Check this version by ...`
9. `Freeze this version as ...`
10. `It still lacks ...`

Do not use a vague teaching pressure. "This is not scalable" is not enough.
Name the exact burden or failure, such as "the caller must know the internal
step order" or "the code cannot identify which step failed."

## Recommended Ladder

### Step 1: Shrink the feature to one visible pressure

- Use the smallest non-trivial behavior.
- Ask what must already be true for that behavior to work.
- If code appears, it should be the smallest useful skeleton or note that can
  become the first version.

### Step 2: Name the first concrete defect in the naive shape

- This is usually where `O(1)`, ordering, idempotency, or mutation safety shows
  up.
- Make the pressure explicit before proposing a structure.
- Translate that defect into exactly one new requirement.

### Step 3: Introduce the first state or data structure

- Explain why the structure exists.
- State what operation or invariant it protects.
- Add or replace exactly one piece of the previous version.

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

### Step 8: Complete the public method or core slice

- Combine the already introduced pieces.
- This should be a connected step that grows from the previous version.

### Step 9: Walk one trace end to end

- Use one concrete example.
- Confirm that each step in the trace matches the stated invariants.
- Confirm that the trace proves the current step's defect was addressed.

### Step 10: Let the final step be the complete code

- The last meaningful step should already yield the complete implementation
  when code is needed.
- Its `Code Change Type` must be `checkpoint`.
- Its `Code Change Target` must name the complete file, module, or script.
- The complete code must not introduce new logic that was never explained.

## Good Signs

- The reader can explain why each helper exists.
- The reader can say what each state variable protects.
- The reader understands why a simpler structure would fail.
- Each `What Breaks` section names a concrete defect in the previous version.
- Each `Why This Change Works` section points back to that defect.
- The reader can implement the next step without re-reading the whole guide.
- Every code block is either an addition to or replacement of the previous
  version.
- Every code block says whether it is a patch or checkpoint and names its
  target.
- The final code is the last version's assembled checkpoint, not a detached
  dump and not a puzzle assembled from earlier snippets.

## Anti-Patterns

Do not do these in from-scratch mode:

- open with full code
- say "use a map/list/tree" without naming the pressure that forces it
- introduce multiple helpers in one step without separate reasons
- hide mutation boundaries
- use the final implementation as the source of truth
- skip from the contract straight to a finished class or service
- write all steps in one thin pass instead of completing and checking one step
  before the next
- duplicate the same code after the connected build already produced it
- present standalone code blocks that do not update a previous version
- add a separate final code block that contains new logic
- call a partial class or helper snippet a checkpoint
- end with a patch when the reader needs complete runnable code
- omit the code change type or target
- omit what the current version can do and what it still lacks
- omit what broke in the previous version

## Full-Code Policy

Default policy:

- the last meaningful incremental step should be a `checkpoint` that yields the
  complete runnable implementation when the user needs code
- the guide should usually end there

Only add a separate wrapper or final-code section if the user explicitly needs a
platform shell, file layout, or delivery format. That section must contain no
new logic.
