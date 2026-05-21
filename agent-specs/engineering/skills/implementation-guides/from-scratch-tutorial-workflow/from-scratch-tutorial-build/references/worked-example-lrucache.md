# Worked Example: `LRUCache` From Scratch

This example shows the task-ladder mechanics for the skill: the
implementation grows through connected code checkpoints. Each step explains what
concretely breaks in the previous baseline, changes one thing, marks the code
change as a patch or checkpoint, checks that change, freezes the new checkpoint,
and states what still lacks. The step starts from a small pressure example
rather than a memorized final structure.

This is a structured reference, not the preferred public prose style. When
building a real tutorial, translate these fields into natural teaching prose,
code blocks, and reader-facing checkpoints unless the human asks for a
structured audit-style guide.

## Contents

- Reader and Goal
- Real Scenario
- Problem Compression
- Core Model
- External Contract
- Constraints and Invariants
- From Scratch
- Helper Contracts
- Common Mistakes
- Verification Checklist
- Next Small Step

## Reader and Goal

- Reader: someone who knows Python classes but does not want to memorize an
  `LRUCache` template blindly.
- Goal: derive the core structure and helper boundaries from the behavior and
  `O(1)` requirement.

## Real Scenario

A cache sits between a slow data source and a caller that repeatedly asks for
recent items. The caller wants old results to be reused quickly, but the cache
cannot grow forever. When space runs out, it should discard the item that has
not been used for the longest time.

The outside observer sees only two operations: `get(key)` and `put(key,
value)`. The implementation must preserve recency without asking the caller to
manage ordering.

## Problem Compression

- Full-world problem: production caches involve concurrency, expiration,
  memory pressure, serialization, metrics, and backing stores.
- Compressed tutorial model: one in-memory fixed-capacity cache with integer
  keys and values.
- Included: lookup, insert, update, recency movement, eviction, and the data
  structure invariant that makes these operations `O(1)`.
- Deferred: TTL, locks, async loading, persistence, and distributed eviction.
- Why this compression is complete: LRU's core idea is the coupling between
  direct key lookup and recency order; the compressed model keeps exactly that
  pressure.

## Core Model

- `key -> node` map for direct lookup.
- Doubly linked recency list for oldest/newest order.
- Sentinel boundaries that make insert and remove uniform.
- Capacity rule that evicts the least recent node.

## External Contract

- `get(key)` returns the value if present, otherwise `-1`.
- `put(key, value)` inserts or updates a key.
- When capacity is full, `put` evicts the least recently used key.

## Constraints and Invariants

- Both `get` and `put` should be `O(1)`.
- Reading a key updates its recency.
- The least recently used entry must be removable without scanning all entries.

## From Scratch

### Step 1: Why is a plain list not enough?

- Question: can we keep entries in a list ordered by recency?
- Pressure Example: start with three ordered entries and a direct scan:

```python
entries = [(1, "a"), (2, "b"), (3, "c")]


def get(key):
    for item_key, value in entries:
        if item_key == key:
            return value
    return -1
```

This works for three entries. Now imagine `get(9999)` in a 10,000-entry cache.
The number of checks depends on where the key appears.
- Naive or Previous Baseline: nothing yet; the most obvious starting point is a
  list ordered by recency.
- What Breaks: a list can preserve recency order, but `get(key)` must scan
  entries until it finds the key, so lookup is not `O(1)`.
- New Requirement: the first structure must give direct key-to-entry lookup in
  `O(1)`.
- Add or Replace: create the first checkpoint by adding the direct-lookup need.
- Code Change Type: patch
- Code Change Target: design note
- Code Change:

```python
# Checkpoint 1 need:
# key -> entry lookup in O(1)
```

- Why This Change Works: it turns the vague cache behavior into the first hard
  constraint: every later design must support direct lookup.
- Step Check: explain why finding key `9999` in a 10,000-item list depends on
  position, while direct lookup does not.
- Now This Checkpoint Can: explain why direct lookup is required.
- Freeze This Checkpoint: checkpoint 1 is the direct-lookup requirement.
- Still Lacks: ordered recency updates and eviction.
- What To Verify: explain why a list alone makes `get(key)` too slow.
- Checkpoint: one defect was named, one requirement was added, and the
  check proves list lookup violates the contract.

### Step 2: Why is a plain map not enough?

- Question: if a map gives `O(1)` lookup, why not stop there?
- Pressure Example: a map answers `get(1)` quickly, but after these operations
  it cannot answer which key should be evicted:

```python
put(1, "a")
put(2, "b")
get(1)
put(3, "c")  # Which key is least recently used?
```
- Naive or Previous Baseline: checkpoint 1 says the cache needs direct key
  lookup, so a plain map is the smallest concrete structure.
- What Breaks: a map can find a key, but it does not preserve "least recently
  used" order, so eviction would need extra tracking or a scan.
- New Requirement: add direct key lookup as real state, while keeping the
  ordered-recency problem visible.
- Add or Replace: in the previous baseline, add a map as the first concrete
  state.
- Code Change Type: patch
- Code Change Target: `LRUCache.__init__`
- Code Change:

```python
class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> node
```

- Why This Change Works: the map satisfies the first defect, direct lookup, but
  intentionally exposes the next defect: order is still missing.
- Step Check: after `put(1, 1)` and `put(2, 2)`, explain why `self.cache`
  cannot tell which key is least recently used.
- Now This Checkpoint Can: store something reachable by key in `O(1)`.
- Freeze This Checkpoint: checkpoint 2 is a map-backed cache skeleton.
- Still Lacks: a node shape and an order structure for recency.
- What To Verify: explain why a map alone cannot remove the least recently used
  entry without extra work.
- Checkpoint: the map solves lookup only; the remaining defect is
  recency order.

### Step 3: Why should the map store nodes instead of values?

- Question: what should `cache[key]` point to?
- Naive or Previous Baseline: checkpoint 2 can map a key to something in
  `O(1)`, but that "something" has not been defined.
- What Breaks: if the map stores only values, `get(key)` can return the value
  but cannot move the corresponding item inside a recency order in `O(1)`.
- New Requirement: store entry objects that hold both the value and the links
  needed for future recency movement.
- Add or Replace: replace the map-only skeleton with a checkpoint that also
  defines the node shape.
- Code Change Type: patch
- Code Change Target: current script
- Code Change:

```python
class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> Node
```

- Why This Change Works: the map can now point to a movable object instead of a
  detached value.
- Step Check: given `node = cache[key]`, verify the node has `value`, `prev`,
  and `next`, so later code can both return the value and relink the node.
- Now This Checkpoint Can: represent a cache entry that carries value and list
  links.
- Freeze This Checkpoint: checkpoint 3 is a map from keys to movable nodes.
- Still Lacks: list sentinels and mutation helpers.
- What To Verify: explain why eviction still needs the `key` on the node.
- Checkpoint: the defect was value-only storage; the one change was a
  node shape.

### Step 4: What is the smallest runnable skeleton?

- Question: what list shape lets every insertion and removal avoid edge cases?
- Naive or Previous Baseline: checkpoint 3 has movable nodes, but no actual
  recency list for those nodes to live in.
- What Breaks: without stable list boundaries, insertion and removal need
  separate cases for empty list, front, back, and middle nodes.
- New Requirement: create sentinel `head` and `tail` nodes so every real node
  can sit between two neighbors.
- Add or Replace: replace the node-only skeleton with sentinel nodes connected
  in the constructor.
- Code Change Type: patch
- Code Change Target: current script
- Code Change:

```python
class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head
```

- Why This Change Works: sentinels make the empty list look like every other
  list: there is always a node before and after any real node position.
- Step Check: in a new cache, assert `cache.head.next is cache.tail` and
  `cache.tail.prev is cache.head`.
- Now This Checkpoint Can: maintain an empty recency list with stable boundaries.
- Freeze This Checkpoint: checkpoint 4 is a map plus an empty sentinel recency
  list.
- Still Lacks: helpers that mutate the list.
- What To Verify: `head.next is tail` and `tail.prev is head` in the empty
  cache.
- Checkpoint: the defect was boundary branching; sentinels address only
  that defect.

### Step 5: What helper is forced first?

- Question: which mutation unlocks moving and eviction?
- Naive or Previous Baseline: checkpoint 4 has stable list boundaries, but no
  way to remove an existing node from the list.
- What Breaks: both "move this key to most recent" and "evict the least recent
  key" first need to detach a known node; duplicating that pointer mutation in
  each operation risks inconsistent links.
- New Requirement: add one helper that detaches a known node by reconnecting
  its previous and next neighbors.
- Add or Replace: in the previous baseline, add `_remove(node)`.
- Code Change Type: patch
- Code Change Target: `LRUCache`
- Code Change:

```python
class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
```

- Why This Change Works: `_remove` isolates the one pointer mutation shared by
  recency movement and eviction.
- Step Check: for `a <-> b <-> c`, after `_remove(b)`, assert `a.next is c`
  and `c.prev is a`.
- Now This Checkpoint Can: detach a known node from the list.
- Freeze This Checkpoint: checkpoint 5 can remove a known node from the
  recency list.
- Still Lacks: adding nodes to the most-recent position.
- What To Verify: after removal, neighboring nodes point to each other.
- Checkpoint: the step introduced one helper forced by one repeated
  mutation.

### Step 6: How do we mark a node most recently used?

- Question: where should a newly used node go?
- Naive or Previous Baseline: checkpoint 5 can remove a node, but it cannot
  place a node into a consistent "most recent" position.
- What Breaks: without one recency convention, `get`, `put`, and eviction may
  disagree about which end of the list is most recent.
- New Requirement: define the front of the list, right after `head`, as the
  most-recent position and add helpers for inserting or moving there.
- Add or Replace: in the previous baseline, add `_add_front(node)` and
  `_move_front(node)`.
- Code Change Type: patch
- Code Change Target: `LRUCache`
- Code Change:

```python
    def _add_front(self, node):
        first = self.head.next
        node.prev = self.head
        node.next = first
        self.head.next = node
        first.prev = node

    def _move_front(self, node):
        self._remove(node)
        self._add_front(node)
```

- Why This Change Works: `_add_front` creates one recency convention, and
  `_move_front` composes the already-tested remove operation with that
  convention.
- Step Check: after `_add_front(node)`, assert `cache.head.next is node` and
  `node.prev is cache.head`.
- Now This Checkpoint Can: add or move a node to the most-recent position.
- Freeze This Checkpoint: checkpoint 6 can maintain most-recent order for
  known nodes.
- Still Lacks: removing the least-recently-used node.
- What To Verify: after `_add_front(node)`, `head.next` is that node.
- Checkpoint: the new requirement follows from the missing recency
  convention.

### Step 7: How do we evict in `O(1)`?

- Question: where is the least recently used node now?
- Naive or Previous Baseline: checkpoint 6 keeps the most recent node near
  `head`.
- What Breaks: capacity eviction still needs a way to identify and remove the
  least recent node without scanning the list.
- New Requirement: use the opposite sentinel edge, `tail.prev`, as the
  least-recent node and add a helper that removes it.
- Add or Replace: in the previous baseline, add `_pop_lru()`.
- Code Change Type: patch
- Code Change Target: `LRUCache`
- Code Change:

```python
    def _pop_lru(self):
        node = self.tail.prev
        self._remove(node)
        return node
```

- Why This Change Works: the recency convention from checkpoint 6 makes the
  least recent node a constant-time pointer lookup.
- Step Check: after adding nodes `1` then `2` to the front, `_pop_lru()` should
  return node `1`.
- Now This Checkpoint Can: remove and return the least-recently-used node in
  `O(1)`.
- Freeze This Checkpoint: checkpoint 7 has all internal list primitives needed
  for LRU behavior.
- Still Lacks: public `get` and `put`.
- What To Verify: `_pop_lru()` returns the node before `tail`.
- Checkpoint: eviction was the defect; `_pop_lru` solves only that
  constant-time removal need.

### Step 8: How does `get` compose the primitives?

- Question: what should happen when the key exists?
- Pressure Example: after `put(1, "a")` and `put(2, "b")`, a caller expects
  `get(1)` to both return `"a"` and make key `1` more recent than key `2`.
- Naive or Previous Baseline: checkpoint 7 has internal primitives but no
  public read method.
- What Breaks: callers cannot use the cache contract yet; they need `get(key)`
  to return `-1` for misses and update recency for hits.
- New Requirement: add public `get` by composing lookup, move-to-front, and
  return.
- Add or Replace: in the previous baseline, add public `get`.
- Code Change Type: patch
- Code Change Target: `LRUCache`
- Code Change:

```python
    def get(self, key):
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_front(node)
        return node.value
```

- Why This Change Works: `get` uses the map for `O(1)` lookup and the existing
  move helper to keep read behavior and recency behavior together.
- Step Check: after keys `1` and `2` exist, `get(1)` returns the value for `1`
  and moves key `1` ahead of key `2`.
- Now This Checkpoint Can: read existing keys and update recency.
- Freeze This Checkpoint: checkpoint 8 supports public reads and recency
  updates.
- Still Lacks: insert, update, and capacity eviction.
- What To Verify: a successful read updates recency without changing the value.
- Checkpoint: the public read defect is addressed without adding write
  behavior.

### Step 9: How does `put` handle update, insert, and eviction?

- Question: what are the three cases hidden inside one method?
- Pressure Example: one public method must handle three calls that look similar
  but mean different things:

```python
put(1, "new")  # update existing
put(2, "b")    # insert with room
put(3, "c")    # insert and evict when full
```
- Naive or Previous Baseline: checkpoint 8 can read existing keys, but nothing
  can create or update cache entries.
- What Breaks: the cache contract is incomplete without `put`; writes must
  handle existing keys, new keys with room, and new keys that exceed capacity.
- New Requirement: add public `put` with those three cases, reusing the
  already frozen helpers.
- Add or Replace: in the previous baseline, add public `put`; this step now
  produces the complete class.
- Code Change Type: checkpoint
- Code Change Target: current script
- Code Change:

```python
class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_front(self, node):
        first = self.head.next
        node.prev = self.head
        node.next = first
        self.head.next = node
        first.prev = node

    def _move_front(self, node):
        self._remove(node)
        self._add_front(node)

    def _pop_lru(self):
        node = self.tail.prev
        self._remove(node)
        return node

    def get(self, key):
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_front(node)
        return node.value

    def put(self, key, value):
        if key in self.cache:
            node = self.cache[key]
            node.value = value
            self._move_front(node)
            return

        node = Node(key, value)
        self.cache[key] = node
        self._add_front(node)

        if len(self.cache) > self.capacity:
            lru = self._pop_lru()
            del self.cache[lru.key]
```

- Why This Change Works: each branch maps to one write case, and each branch
  reuses helpers whose pointer behavior was introduced in earlier checkpoints.
- Step Check: with capacity `2`, run `put(1, 1)`, `put(2, 2)`, `get(1)`,
  `put(3, 3)`, then verify `get(2) == -1`.
- Now This Checkpoint Can: run the complete `LRUCache` behavior.
- Freeze This Checkpoint: checkpoint 9 is the complete connected
  implementation.
- Still Lacks: only platform-specific wrapper or tests if the caller needs
  them.
- What To Verify: `put(1,1)`, `put(2,2)`, `get(1)`, `put(3,3)` should evict key
  `2` when capacity is `2`.
- Checkpoint: this final step adds only the public write method; all
  supporting state and helpers were already introduced.

## Helper Contracts

- `_remove(node)`: detach a node from the list.
- `_add_front(node)`: insert a node at most-recently-used position.
- `_move_front(node)`: reuse remove plus add-front.
- `_pop_lru()`: remove and return the least-recently-used node.

## Common Mistakes

- storing values instead of nodes in the map
- forgetting that `get` also updates recency
- deleting the map entry without knowing which key was evicted
- writing helper bodies before deciding their mutation boundaries
- adding final code that contains logic never introduced in the connected steps

## Verification Checklist

- Can the learner explain why list-only is too slow?
- Can the learner explain why map-only is insufficient?
- Can the learner explain why the map stores nodes?
- Can the learner say what `_pop_lru()` returns and why?
- Can the learner point to the step where each helper first became necessary?
- Can the learner verify that Step 9 contains no unexplained logic?

## Next Small Step

- Type Step 4 through Step 6 by hand and test one remove-plus-add-front cycle
  before adding `get` and `put`.
