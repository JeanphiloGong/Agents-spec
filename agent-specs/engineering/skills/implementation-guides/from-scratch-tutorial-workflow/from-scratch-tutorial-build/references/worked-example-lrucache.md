# Worked Example: `LRUCache` From Scratch

This example shows the preferred output style for the skill: a reusable
markdown guide where the implementation grows through connected code versions.
Each step explains the pressure, changes the previous version, names what the
new version can do, and states what still lacks.

## Contents

- Reader and Goal
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
- Why This Matters: if the structure fails the `O(1)` requirement, the whole
  design is already wrong.
- How To Think: a list can keep order, but finding a key means scanning.
- Previous Version Can: nothing yet; we only know the public behavior.
- Add or Replace: create the first version by adding the direct-lookup need.
- Code Change:

```python
# Version 1 need:
# key -> entry lookup in O(1)
```

- Now This Version Can: explain why direct lookup is required.
- Still Lacks: ordered recency updates and eviction.
- What To Verify: explain why a list alone makes `get(key)` too slow.

### Step 2: Why is a plain map not enough?

- Question: if a map gives `O(1)` lookup, why not stop there?
- Why This Matters: `get` is not just a read; it also changes recency.
- How To Think: a map gives direct access by key, but not ordered eviction by
  "least recently used".
- Previous Version Can: name the need for `O(1)` key lookup.
- Add or Replace: in the previous version, add a map as the first concrete
  state.
- Code Change:

```python
class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> node
```

- Now This Version Can: store something reachable by key in `O(1)`.
- Still Lacks: a node shape and an order structure for recency.
- What To Verify: explain why a map alone cannot remove the least recently used
  entry without extra work.

### Step 3: Why should the map store nodes instead of values?

- Question: what should `cache[key]` point to?
- Why This Matters: `get(key)` must both return a value and move the entry in
  the recency structure.
- How To Think: if the map stores only values, we still cannot move the right
  recency item in `O(1)`.
- Previous Version Can: store key-addressable entries.
- Add or Replace: replace the map-only skeleton with a version that also
  defines the node shape.
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

- Now This Version Can: represent a cache entry that carries value and list
  links.
- Still Lacks: list sentinels and mutation helpers.
- What To Verify: explain why eviction still needs the `key` on the node.

### Step 4: What is the smallest runnable skeleton?

- Question: what list shape lets every insertion and removal avoid edge cases?
- Why This Matters: helper correctness depends on stable list boundaries.
- How To Think: sentinel `head` and `tail` nodes let every real node sit
  between two neighbors.
- Previous Version Can: represent node objects and map keys to nodes.
- Add or Replace: replace the node-only skeleton with sentinel nodes connected
  in the constructor.
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

- Now This Version Can: maintain an empty recency list with stable boundaries.
- Still Lacks: helpers that mutate the list.
- What To Verify: `head.next is tail` and `tail.prev is head` in the empty
  cache.

### Step 5: What helper is forced first?

- Question: which mutation unlocks moving and eviction?
- Why This Matters: both recency updates and eviction need correct detach logic.
- How To Think: if a node is already in the list, removing it means linking its
  previous and next neighbors to each other.
- Previous Version Can: keep an empty sentinel list.
- Add or Replace: in the previous version, add `_remove(node)`.
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

- Now This Version Can: detach a known node from the list.
- Still Lacks: adding nodes to the most-recent position.
- What To Verify: after removal, neighboring nodes point to each other.

### Step 6: How do we mark a node most recently used?

- Question: where should a newly used node go?
- Why This Matters: a single recency convention keeps `get`, `put`, and eviction
  consistent.
- How To Think: put the most recently used node right after `head`; the least
  recently used node will be right before `tail`.
- Previous Version Can: detach an existing node.
- Add or Replace: in the previous version, add `_add_front(node)` and
  `_move_front(node)`.
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

- Now This Version Can: add or move a node to the most-recent position.
- Still Lacks: removing the least-recently-used node.
- What To Verify: after `_add_front(node)`, `head.next` is that node.

### Step 7: How do we evict in `O(1)`?

- Question: where is the least recently used node now?
- Why This Matters: eviction must not scan the map or list.
- How To Think: with the most recent node near `head`, the least recent node is
  always `tail.prev`.
- Previous Version Can: move any known node to the most-recent position.
- Add or Replace: in the previous version, add `_pop_lru()`.
- Code Change:

```python
    def _pop_lru(self):
        node = self.tail.prev
        self._remove(node)
        return node
```

- Now This Version Can: remove and return the least-recently-used node in
  `O(1)`.
- Still Lacks: public `get` and `put`.
- What To Verify: `_pop_lru()` returns the node before `tail`.

### Step 8: How does `get` compose the primitives?

- Question: what should happen when the key exists?
- Why This Matters: this is where read behavior and recency behavior meet.
- How To Think: `get` needs lookup, move-to-front, and return.
- Previous Version Can: maintain and mutate recency order.
- Add or Replace: in the previous version, add public `get`.
- Code Change:

```python
    def get(self, key):
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_front(node)
        return node.value
```

- Now This Version Can: read existing keys and update recency.
- Still Lacks: insert, update, and capacity eviction.
- What To Verify: a successful read updates recency without changing the value.

### Step 9: How does `put` handle update, insert, and eviction?

- Question: what are the three cases hidden inside one method?
- Why This Matters: `put` looks simple, but the branch structure defines the
  cache behavior.
- How To Think: update existing key, insert new key when space exists, or evict
  then insert.
- Previous Version Can: support reads and recency updates for existing nodes.
- Add or Replace: in the previous version, add public `put`; this step now
  produces the complete class.
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

- Now This Version Can: run the complete `LRUCache` behavior.
- Still Lacks: only platform-specific wrapper or tests if the caller needs
  them.
- What To Verify: `put(1,1)`, `put(2,2)`, `get(1)`, `put(3,3)` should evict key
  `2` when capacity is `2`.

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
