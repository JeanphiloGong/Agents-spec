# From-Scratch Tutorial Review Quality Standards

Use this reference when a tutorial is structurally complete but may still fail
as a teaching artifact. The goal is to catch issues that field headings alone
cannot catch.

## Review Priorities

Review in this order:

1. executable continuity
2. defect-driven teaching depth
3. semantic choice visibility
4. evidence quality
5. reader-facing publishability

## 1. Executable Continuity

Every code version must be runnable from the visible previous version.

Check for:

- stale registries or maps after functions are redefined
- code snippets that assume variables not introduced yet
- examples that pass only if the reader silently resets the environment
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
If Step 3 defines handlers = {"enrich": enrich}, and Step 5 later redefines
def enrich(...): raise ..., Step 5 must also update handlers["enrich"] or use a
separate failing handler registry. Python dictionaries hold the old function
object.
```

## 2. Defect-Driven Teaching Depth

Each step must explain why the previous version is insufficient before it adds
new structure.

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

Finding severity:

- `block` when a core step introduces a helper, data structure, state machine,
  or public API without a concrete previous-version defect.
- `revise` when the defect exists but is too generic to teach why this exact
  change follows.

## 3. Semantic Choice Visibility

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
If early steps teach that handlers share and mutate caller context, but the
final runner uses context=dict(context or {}), the tutorial must explain why the
runner copies caller context and what mutation is now observable.
```

## 4. Evidence Quality

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

## 5. Reader-Facing Publishability

A tutorial can be correct but still read like an internal generation artifact.

Check for:

- long repeated field labels that interrupt reading
- `Step Self-Review` written as author-internal compliance instead of reader
  guidance
- missing opening motivation in real-world terms
- missing "when not to use this" boundary
- missing final mental model or recap
- overly broad next-step promises that distract from the tutorial checkpoint

Finding severity:

- `suggestion` when publishability issues do not affect correctness.
- `revise` when internal scaffolding makes the tutorial hard to learn from.

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
