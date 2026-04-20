# Worked Example: `LRUCache` From Scratch

This example shows the preferred output style for the skill: a reusable
markdown guide that explains why each structure exists before the final code is
assembled.

## Contents

- Reader and Goal
- External Contract
- Constraints and Invariants
- From Scratch
- Helper Contracts
- Assemble the Core Slice
- Reference Implementation
- Common Mistakes
- Verification Checklist
- Next Small Step

## Reader and Goal

- Reader: someone who knows Python classes but does not want to memorize an
  `LRUCache` template blindly.
- Goal: derive the core structure and helper boundaries from the behavior and
  `O(1)` requirement.

## External Contract

- `get(key)` returns the value if present, otherwise `-1`
- `put(key, value)` inserts or updates a key
- when capacity is full, evict the least recently used key

## Constraints and Invariants

- both `get` and `put` should be `O(1)`
- reading a key updates its recency
- the least recently used entry must be removable without scanning all entries

## From Scratch

### Step 1: Why is a plain list not enough?

- Question: can we keep entries in a list ordered by recency?
- Why This Matters: if the structure fails the `O(1)` requirement, the whole
  design is already wrong.
- How To Think: a list can keep order, but finding a key means scanning.
- What To Write Now: note that we need direct lookup by key.
- Small Code Fragment:

```python
# Need: key -> entry lookup in O(1)
```

- What To Verify: explain why a list alone makes `get(key)` too slow.

### Step 2: Why is a plain map not enough?

- Question: if a map gives `O(1)` lookup, why not stop there?
- Why This Matters: `get` is not just a read; it also changes recency.
- How To Think: a map gives direct access by key, but not ordered eviction by
  "least recently used".
- What To Write Now: introduce a second structure that can update recency and
  evict from the tail in `O(1)`.
- Small Code Fragment:

```python
cache = {}  # key -> node
```

- What To Verify: explain why a map alone cannot remove the least recently used
  entry without extra work.

### Step 3: Why should the map store nodes instead of values?

- Question: what should `cache[key]` point to?
- Why This Matters: `get(key)` must both return a value and move the entry in
  the recency structure.
- How To Think: if the map stores only values, we still cannot move the right
  node in `O(1)`.
- What To Write Now: make the map point to nodes that live inside a doubly
  linked list.
- Small Code Fragment:

```python
class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None
```

- What To Verify: answer why eviction still needs the `key` on the node.

### Step 4: What helpers are forced by the recency invariant?

- Question: once we have nodes, what repeated operations appear?
- Why This Matters: helper boundaries should come from repeated mutations, not
  from arbitrary decomposition.
- How To Think: every recency update needs detach, insert-at-front, and tail
  pop behavior.
- What To Write Now: name the helper contracts before their bodies.
- Small Code Fragment:

```python
def _remove(node): ...
def _add_front(node): ...
def _move_front(node): ...
def _pop_lru(): ...
```

- What To Verify: explain what each helper mutates and what it returns.

### Step 5: What is the smallest primitive to implement first?

- Question: which helper unlocks the others?
- Why This Matters: build order should reduce complexity, not introduce it.
- How To Think: both moving and popping depend on correct detach logic.
- What To Write Now: implement `_remove(node)` first.
- Small Code Fragment:

```python
def _remove(self, node):
    prev_node = node.prev
    next_node = node.next
    prev_node.next = next_node
    next_node.prev = prev_node
```

- What To Verify: after removal, neighboring nodes should link to each other.

### Step 6: How does `get` compose these primitives?

- Question: what should happen when the key exists?
- Why This Matters: this is where read behavior and recency behavior meet.
- How To Think: `get` needs lookup, move-to-front, and return.
- What To Write Now: sketch `get` using the map and `_move_front`.
- Small Code Fragment:

```python
def get(self, key):
    if key not in self.cache:
        return -1
    node = self.cache[key]
    self._move_front(node)
    return node.value
```

- What To Verify: a successful read updates recency without changing the value.

### Step 7: How does `put` split into update, insert, and evict?

- Question: what are the three cases hidden inside one method?
- Why This Matters: `put` looks simple, but the branch structure defines the
  cache behavior.
- How To Think: update existing key, insert new key when space exists, or evict
  then insert.
- What To Write Now: write the branch skeleton before the full body.
- Small Code Fragment:

```python
def put(self, key, value):
    if key in self.cache:
        ...
    elif len(self.cache) == self.capacity:
        ...
    else:
        ...
```

- What To Verify: explain why eviction belongs only in the full-capacity insert
  case.

## Helper Contracts

- `_remove(node)`: detach a node from the list
- `_add_front(node)`: insert a node at most-recently-used position
- `_move_front(node)`: reuse remove plus add-front
- `_pop_lru()`: remove and return the least-recently-used node

## Assemble the Core Slice

- Build list sentinels first.
- Implement `_remove` and `_add_front`.
- Implement `_move_front` using those two primitives.
- Implement `_pop_lru` from the list tail.
- Implement `get`.
- Implement `put`.

## Reference Implementation (Optional)

- Only present the full class after the above steps are explained.
- The full code should not introduce new helpers or hidden state.

## Common Mistakes

- storing values instead of nodes in the map
- forgetting that `get` also updates recency
- deleting the map entry without knowing which key was evicted
- writing helper bodies before deciding their mutation boundaries

## Verification Checklist

- Can the learner explain why list-only is too slow?
- Can the learner explain why map-only is insufficient?
- Can the learner explain why the map stores nodes?
- Can the learner say what `_pop_lru()` returns and why?
- Can the learner list the build order without seeing the full code?

## Next Small Step

- Implement the sentinel-node constructor and `_remove(node)` first, then test
  one remove-plus-add-front cycle by hand.
