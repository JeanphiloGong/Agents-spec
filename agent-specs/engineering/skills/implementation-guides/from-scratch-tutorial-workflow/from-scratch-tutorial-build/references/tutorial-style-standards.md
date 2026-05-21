# Tutorial Style Standards

Use this reference when a from-scratch tutorial has the right mechanics but
still reads like a filled template. The goal is a guide that feels like a
teacher walking the reader from a small pressure to a complete implementation.

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

The resulting style should be:

```text
small real pressure
-> naive runnable version
-> concrete thing that breaks
-> one new requirement
-> one code change
-> check the new behavior
-> freeze the new version
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

- The reader sees the naive version run.
- The pressure is a concrete operation.
- The new structure is forced by that operation.

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

Use reader-facing section names:

- `Checkpoint`
- `Before Moving On`
- `Try This`
- `Version Checkpoint`

Do not output internal quality gates such as:

- `Step Self-Review`
- `Concrete defect named: yes`
- `Exactly one change: yes`
- `Check proves the step: yes`

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
