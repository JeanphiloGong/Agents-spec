# From-Scratch Document Ladder

Use this reference when the skill needs the full document-first teaching shape
with connected code growth.

## Contents

- Core Rule
- Required Step Shape
- Public Tutorial Voice
- Recommended Ladder
- Good Signs
- Anti-Patterns
- Full-Code Policy

## Core Rule

The output should read like a reusable implementation notebook, not like a
short response and not like a final-code dump.

The guide must grow through connected code checkpoints. Do not alternate between
standalone concept prose, unrelated code blocks, and a late complete-code dump.
Write one problem, one concrete defect, one code change, one check, one new
capability, and one remaining gap at a time. Finish that step before drafting
the next step. Mark every code change as a `patch` or `checkpoint`, and make
the last meaningful code step an assembled complete checkpoint.

Before the defect statement, show a pressure example: a tiny input, trace, call
site, or extension that makes the naive baseline's weakness visible.

The first baseline should start before the tutorial's first internal
abstraction. Use the caller's real input or current mental model first; do not
open with a run-level context object, registry, node, store, adapter, state
machine, or final class just because the final implementation will need it.

Prefer this order:

1. reader and goal
2. real scenario
3. problem compression
4. core model and invariants
5. external contract
6. existing evidence, if any
7. from-scratch ladder
8. helper contracts
9. common mistakes
10. verification checklist
11. next small step

## Required Step Shape

Each step in `## From Scratch` should answer these prompts internally. They are
quality questions, not mandatory public field labels:

- `Question`
- `Pressure Example`
- `Naive or Previous Baseline`
- `What Breaks`
- `New Requirement`
- `Add or Replace`
- `Code Change Type`
- `Code Change Target`
- `Code Change`
- `Why This Change Works`
- `Step Check`
- `Now This Checkpoint Can`
- `Freeze This Checkpoint`
- `Still Lacks`
- `What To Verify`
- `Checkpoint` or `Before Moving On`

Keep each step narrow:

- one new pressure
- one new structure
- one new helper
- or one new mutation rule

If a step tries to introduce multiple new ideas, split it.

Do not expose internal self-review fields in public tutorial text. The agent
must still run the self-review privately before moving to the next step.
Likewise, do not mechanically print every prompt above unless the human asks
for a structured audit format. In a polished tutorial, translate the prompts
into natural prose, code blocks, `Checkpoint`, `Try This`, and `Before Moving
On` sections.

Use code change roles consistently:

- `patch`: a local addition or replacement applied to the previous visible
  checkpoint.
- `checkpoint`: the complete current runnable unit for the named target.

The final meaningful code step must be a `checkpoint`. It should include the
imports, types, helpers, and public API needed for the target to run. It must
not include logic that earlier steps did not explain.

Every code step should be connected to the previous baseline. Use these
connectors in substance:

1. `The previous baseline can ...`
2. `What breaks is ...`
3. `Therefore the new requirement is ...`
4. `In the previous baseline, add ...`
5. `Code Change Type: patch/checkpoint`
6. `Code Change Target: ...`
7. `This works because ...`
8. `Check this checkpoint by ...`
9. `Freeze this checkpoint as ...`
10. `It still lacks ...`

Do not use a vague teaching pressure. "This is not scalable" is not enough.
Name the exact burden or failure, such as "the caller must know the internal
step order" or "the code cannot identify which step failed."

## Public Tutorial Voice

Public tutorial output should sound like teaching, not compliance.

Use:

- `Checkpoint`
- `Before Moving On`
- `Try This`
- `Checkpoint`

Do not output:

- `Step Self-Review`
- `Concrete defect named: yes`
- `Exactly one change: yes`
- `Check proves the step: yes`

Also avoid public output that is only a repeated field list:

- `Question`
- `Pressure Example`
- `Naive or Previous Baseline`
- `What Breaks`
- `New Requirement`

Those labels can be useful during drafting, but the published guide should
read like a lesson.

## Recommended Ladder

### Step 1: Shrink the feature to one visible pressure

- Use the smallest non-trivial behavior.
- Start from caller-visible input or the reader's current mental model, not
  from a future internal carrier or final class shape.
- Ask what must already be true for that behavior to work.
- Show the first pressure example before naming the defect.
- If code appears, it should be the smallest useful skeleton or note that can
  become the first checkpoint.

### Step 2: Name the first concrete defect in the naive shape

- This is usually where `O(1)`, ordering, idempotency, or mutation safety shows
  up.
- Make the pressure explicit before proposing a structure.
- Translate that defect into exactly one new requirement.

### Step 3: Introduce the first state or data structure

- Explain why the structure exists.
- State what operation or invariant it protects.
- Add or replace exactly one piece of the previous baseline.

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
- This should be a connected step that grows from the previous baseline.

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
- Each `What Breaks` section names a concrete defect in the previous baseline.
- Each `Why This Change Works` section points back to that defect.
- The reader can implement the next step without re-reading the whole guide.
- Every code block is either an addition to or replacement of the previous
  checkpoint.
- Every code block says whether it is a patch or checkpoint and names its
  target.
- The final code is the last connected checkpoint, not a detached
  dump and not a puzzle assembled from earlier snippets.

## Anti-Patterns

Do not do these in from-scratch mode:

- open with full code
- say "use a map/list/tree" without naming the pressure that forces it
- introduce multiple helpers in one step without separate reasons
- hide mutation boundaries
- use the final implementation as the source of truth
- start the first baseline with a future internal abstraction, such as
  `context`, a registry, node, store, adapter, state machine, or final class,
  before the pressure that requires it
- skip from the contract straight to a finished class or service
- write all steps in one thin pass instead of completing and checking one step
  before the next
- duplicate the same code after the connected build already produced it
- present standalone code blocks that do not update a previous baseline
- add a separate final code block that contains new logic
- call a partial class or helper snippet a checkpoint
- end with a patch when the reader needs complete runnable code
- omit the code change type or target
- omit what the current checkpoint can do and what it still lacks
- omit what broke in the previous baseline
- output internal self-review fields as public tutorial prose

## Full-Code Policy

Default policy:

- the last meaningful incremental step should be a `checkpoint` that yields the
  complete runnable implementation when the user needs code
- the guide should usually end there

Only add a separate wrapper or final-code section if the user explicitly needs a
platform shell, file layout, or delivery format. That section must contain no
new logic.
