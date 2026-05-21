# Tutorial Style Standards

Use this reference before drafting any non-trivial from-scratch tutorial and
again when a tutorial has the right mechanics but still reads like a filled
template. The goal is a guide that feels like a teacher walking the reader from
a small pressure to a complete implementation.

Do not use project-specific examples here. These standards must stay reusable
across algorithm, data-structure, systems, and small engineering tutorials.

## Teaching Lineage

Borrow the mechanism, not the prose, from these teaching styles:

- Robert Nystrom: a complete project chain grows chapter by chapter, and each
  chapter leaves the reader with a working system piece.
- Andrej Karpathy: code appears early, stays runnable, and each new line is
  justified by the behavior it unlocks.
- Peter Norvig: the problem is compressed into a small, complete model that
  can be held in one sitting.

Treat this lineage as an execution standard, not as optional inspiration. The
resulting style should be:

```text
small real pressure
-> naive runnable baseline
-> concrete thing that breaks
-> one new requirement
-> one code change
-> check the new behavior
-> freeze the new checkpoint
```

## Pressure Example First

Before naming `What Breaks`, show a pressure example that lets the reader feel
the problem.

A pressure example can be:

- a tiny input that makes the naive algorithm too slow
- a second call site that would duplicate policy
- a failing trace that loses the error location
- a state transition that cannot be observed
- a small extension that forces a missing boundary

Do not only assert the defect. Let the reader see it.

## Naive Baseline Starts Before The Abstraction

The first runnable baseline should start from the caller's real input or the
reader's current mental model. It should not begin with the internal carrier,
helper, registry, node, store, adapter, state machine, or final class that the
tutorial is supposed to justify.

For example, in a pipeline runner tutorial, starting with
`prepare(context); enrich(context)` can be too late in the learning path if
`context` is the run-level state carrier. A better baseline starts with the
business input and explicit handoff:

```python
def prepare(file_id):
    return {"file_id": file_id, "prepared": True}


def enrich(prepared_file):
    return {"saw_prepared": prepared_file["prepared"]}


prepared = prepare("file-1")
enrich_result = enrich(prepared)
```

That baseline makes the real pressure visible: the caller owns the handoff and
there is no run-level state object or step observation yet. Only after that
pressure is visible should the tutorial introduce a shared `context`.

## Bad And Good Patterns

### Bad: Template-Driven Step

````markdown
### Step 1: Add a cache map

- What Breaks: the list does not scale.
- New Requirement: use a map.
- Code Change:

```python
self.cache = {}
```
````

Why this is weak:

- "does not scale" is vague.
- The reader never sees the operation that gets too slow.
- The map appears as a memorized answer.
- There is no pressure example.

### Good: Pressure-Driven Step

````markdown
### Step 1: Make lookup pressure visible

Start with the direct representation:

```python
entries = [(1, "a"), (2, "b"), (3, "c")]

def get(key):
    for item_key, value in entries:
        if item_key == key:
            return value
    return -1
```

This works for three entries. Now ask what happens when `get(9999)` runs in a
10,000-entry cache. The function must inspect entries one by one.

- What Breaks: lookup time depends on the position of the key.
- New Requirement: keep a direct key-to-entry lookup.
- Code Change Type: patch
- Code Change Target: current script
- Code Change: add `cache = {}` as the direct lookup structure.
````

Why this is strong:

- The reader sees the naive baseline run.
- The pressure is a concrete operation.
- The new structure is forced by that operation.

### Bad: Premature Final Abstraction

````markdown
Start the pipeline from shared context:

```python
context = {"file_id": "file-1"}
prepare(context)
enrich(context)
```
````

Why this is weak:

- `context` is already a run-level state carrier.
- The reader has not yet felt why explicit handoff is painful.
- The tutorial steals the step that should justify shared run state.

### Good: Caller Input Before Internal Carrier

````markdown
Start with the caller's real input:

```python
file_id = "file-1"
prepared_file = prepare(file_id)
enrich_result = enrich(prepared_file)
```

This works, but the caller now owns the intermediate handoff. That pressure can
justify introducing a shared run-level `context` in the next step.
````

## Universal Example Types

Use general-purpose teaching examples in references and tests of the skill:

- Algorithm/data structure: LRU cache, binary search, top-k, trie.
- Small engineering tool: expression parser, template renderer, router, job
  queue.
- Mini ML/system model: bigram model, tiny tokenizer, micrograd-style scalar
  autodiff.
- Problem compression: spelling corrector, small parser, deduper.

Avoid examples tied to a user's current production system, current reference
module, or current business vocabulary.

## Public Tutorial Voice

The public tutorial should read like a lesson, not a compliance report.

The increment fields are internal obligations. A polished guide can satisfy
them through natural paragraphs, code blocks, and reader-facing checkpoints
without printing every field name.

Use reader-facing section names:

- `Checkpoint`
- `Before Moving On`
- `Try This`
- `Checkpoint`

Do not output internal quality gates such as:

- `Step Self-Review`
- `Concrete defect named: yes`
- `Exactly one change: yes`
- `Check proves the step: yes`

Avoid long repeated public field lists such as:

- `Question`
- `Pressure Example`
- `Naive or Previous Baseline`
- `What Breaks`
- `New Requirement`

Use those fields internally, or publicly only when the human asks for a
structured audit-style tutorial.

The agent should still perform those checks internally before moving to the
next step.

## Final Checkpoint

The last meaningful step is where the final code appears.

It should:

- be `Code Change Type: checkpoint`
- name the complete target
- include imports, types, helpers, and public API needed for that target
- contain only logic already explained in prior steps
- be copyable without stitching earlier snippets together

Do not add a separate final code dump after the connected steps. The final
step is the final assembled checkpoint.

## Engineering Tutorial Completeness

For engineering tutorials, include these reader aids when relevant:

- Real scenario: who calls this, why they need it, and what they observe.
- Core model: the small set of concepts the implementation manipulates.
- Invariants: rules the code must preserve.
- Verification matrix: happy path, invalid input, failure path, boundary case,
  and one representative state trace.

These sections should stay source-independent. They describe the teaching
module, not the user's production code.
