# From-Scratch Tutorial Review Quality Standards

Use this reference when a tutorial is structurally complete but may still fail
as a teaching artifact. The goal is to catch issues that field headings alone
cannot catch.

## Review Priorities

Review in this order:

1. executable continuity
2. defect-driven teaching depth
3. code change role clarity and final checkpoint completeness
4. semantic choice visibility
5. evidence quality
6. engineering tutorial completeness
7. reader-facing publishability

## 1. Executable Continuity

Every code version must be runnable from the visible previous version.

Check for:

- stale registries or maps after functions are redefined
- code snippets that assume variables not introduced yet
- examples that pass only if the reader silently resets the environment
- patch snippets that do not say where they apply
- checkpoint snippets that are not complete runnable units for their target
- final code that uses imports, helpers, branches, or defaults not introduced
  earlier
- checks that would fail if copied into the step's visible code

Finding severity:

- `block` when a step check can pass only through hidden state or when the
  connected code would not run.
- `revise` when the code runs but requires an implicit reset, file split, or
  setup that the reader cannot see.

Example:

```text
If Step 3 defines operations = {"divide": divide}, and Step 5 later redefines
def divide(...): raise ..., Step 5 must also update operations["divide"] or use
a separate failing operation registry. Python dictionaries hold the old
function object.
```

## 2. Defect-Driven Teaching Depth

Each step must explain why the previous version is insufficient before it adds
new structure.

Before the defect statement, the step should show a pressure example: a small
input, trace, call site, or extension that makes the weakness visible.

Strong `What Breaks` names:

- caller burden
- missing observation
- broken invariant
- failing trace
- unhandled boundary case
- duplicated policy or divergent behavior risk

Weak `What Breaks` says only:

- "this does not scale"
- "this is not clean"
- "we need abstraction"
- "this is hard to maintain"
- "production needs more"

Weak steps also jump directly from a heading to a fix without showing what the
reader experiences in the naive version.

Finding severity:

- `block` when a core step introduces a helper, data structure, state machine,
  or public API without a concrete previous-version defect.
- `revise` when the defect exists but is too generic to teach why this exact
  change follows.
- `revise` when the step has a concrete defect but no pressure example.

## 3. Code Change Role Clarity And Final Checkpoint Completeness

`Code Change` must have a clear role. It is either a patch or a checkpoint.

Check for:

- every step declares `Code Change Type: patch` or `Code Change Type:
  checkpoint`
- every step declares `Code Change Target`, such as `current script`,
  `models.py`, `runner.py`, or `src/<package>/...`
- a `patch` shows one local addition or replacement from the visible previous
  version
- a `checkpoint` shows the complete current runnable file, module, or script
- the final meaningful step in a code tutorial is a checkpoint
- the final checkpoint contains no logic that was not explained earlier
- the reader does not need to stitch snippets from earlier steps to get the
  final runnable code

Finding severity:

- `block` when the final meaningful step is not an assembled complete
  checkpoint or when the checkpoint introduces unexplained logic.
- `revise` when intermediate steps do not declare patch/checkpoint role or
  target clearly enough.

Example:

```text
If Step 3 introduced Node, Step 5 introduced _remove and _add_front, and Step 8
introduced get, the final LRU cache step must still show the complete runnable
target with Node, LRUCache, helpers, get, and put. It cannot only show the put
method and expect the reader to assemble the rest from earlier steps.
```

## 4. Semantic Choice Visibility

Any meaningful behavior or API choice must be taught at the step where it first
appears.

Check for silent choices such as:

- copying vs mutating caller-provided objects
- raising vs returning errors
- stopping vs continuing after failure
- rejecting invalid input before or after side effects
- preserving vs normalizing caller-supplied names
- one shared context vs per-step contexts
- helper visibility, private method boundaries, or record ownership

Finding severity:

- `block` when the silent choice changes the tutorial's core behavior or makes
  earlier checks misleading.
- `revise` when the choice is reasonable but needs explanation and a small
  check.

Example:

```text
If early steps teach that get(key) updates recency, but the final cache returns
a value without moving the node to the front, the tutorial must explain the
semantic change or restore the mutation that earlier steps promised.
```

## 5. Evidence Quality

Step checks must prove the current step's defect was addressed. They should not
only prove the final implementation works.

Good checks:

- assert the newly introduced invariant
- show a before/after trace
- prove invalid input fails before work starts
- prove a failure record names the failed step
- prove a data-structure operation preserves links or order

Weak checks:

- only run the happy path after several unrelated changes
- assert a value that was already true in the previous step
- rely on manual claims without a concrete trace
- test a later capability before it is introduced

Finding severity:

- `block` when no check proves a core step.
- `revise` when the check exists but does not target the step's named defect.

## 6. Engineering Tutorial Completeness

Engineering tutorials need more than a code ladder. They should also teach the
small system model around the code.

Check for:

- real scenario: who calls the thing, why they need it, and what they observe
- core model: the few concepts the code manipulates
- invariants: rules that must stay true across steps
- verification matrix: happy path, invalid input, failure path, boundary case,
  and one state or event trace when relevant
- "when not to use this" or deferred scope when the topic could expand into a
  heavier architecture

Finding severity:

- `revise` when a working engineering tutorial lacks real scenario, invariants,
  or an engineering verification matrix.
- `suggestion` when the missing item is helpful but not central to the lesson.

## 7. Reader-Facing Publishability

A tutorial can be correct but still read like an internal generation artifact.

Check for:

- long repeated field labels that interrupt reading
- any public `Step Self-Review` section or author-internal compliance bullets
- missing opening motivation in real-world terms
- missing "when not to use this" boundary
- missing final mental model or recap
- overly broad next-step promises that distract from the tutorial checkpoint

Finding severity:

- `suggestion` when publishability issues do not affect correctness.
- `revise` when internal scaffolding makes the tutorial hard to learn from.
- `revise` when `Step Self-Review` appears in public tutorial text.

Recommended reader-facing alternatives:

- `Step Self-Review` -> `Checkpoint` or `Before Moving On`
- `What To Verify` -> `Try This`
- `Freeze This Version` -> `Version Checkpoint`

## Review Output Calibration

Lead with blocking executable or semantic issues. Keep publishability feedback
after correctness findings.

Do not say a tutorial passes merely because:

- every required heading exists
- the final project tests pass
- the final code is correct
- the narrative sounds plausible

The review passes only when a reader can move from one visible version to the
next without hidden code, hidden state, or unexplained behavior choices.
