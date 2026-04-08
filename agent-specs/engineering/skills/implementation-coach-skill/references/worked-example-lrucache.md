# Worked Example: Teaching `LRUCache` by Derivation

## Why This Example Matters

This example demonstrates the teaching style the skill should prefer when the
user asks "how do I implement this?" rather than "write it for me."

The goal is not to jump to a memorized template. The goal is to make each
structure feel necessary from the requirements.

## Starting Point

User-visible contract:
- `get(key)` returns the value if present, otherwise `-1`
- `put(key, value)` inserts or updates a key
- when capacity is full, evict the least recently used key

Hard constraint:
- both `get` and `put` should be `O(1)`

## Teaching Sequence

1. State the external behavior.
   - `get` is not just "read a value"; it also updates recency.
   - `put` is not just "write a value"; it may update, insert, or evict.
2. Name the pressure created by the constraint.
   - `O(1)` lookup by key implies a hash map.
   - `O(1)` recency updates and tail eviction imply a doubly linked list.
3. Derive the representation.
   - The map cannot store only values, because `get` must move the entry in
     the recency structure.
   - Therefore the map should store nodes: `key -> node`.
   - The node should store both `key` and `value`, because eviction starts
     from the list node and still must delete the map entry by key.
4. Sketch the public surface before helpers.
   - public methods: `get`, `put`
   - helper contracts:
     - `_remove(node)`: detach node from the list
     - `_add_front(node)`: insert node at MRU side
     - `_move_front(node)`: reuse remove + add_front
     - `_pop_lru()`: remove and return the LRU node
5. Build primitives first, then compose upward.
   - implement `_remove`
   - implement `_add_front`
   - implement `_move_front`
   - implement `_pop_lru`
   - implement `get`
   - implement `put`
6. Walk a concrete why-question.
   - "Why does the map store nodes instead of values?"
   - Answer: because `get(key)` must both read the value and move the existing
     entry to the front in `O(1)`. A plain value is not enough to mutate the
     list without another lookup.

## Success Signals

This example is working well if the learner can answer all of these:
- Why is a list alone too slow?
- Why is a map alone insufficient?
- Why does the map store nodes?
- Why does `_pop_lru()` return a node instead of deleting the map itself?
- Why do we define helper contracts before writing helper bodies?

## What Made The Teaching Successful

- It started from behavior and constraints, not from a memorized template.
- It separated public contract from helper mechanics.
- It made side effects explicit.
- It answered "why this structure?" before "how do I code it?"
- It ended with a next-step implementation order the learner could execute
  alone.
