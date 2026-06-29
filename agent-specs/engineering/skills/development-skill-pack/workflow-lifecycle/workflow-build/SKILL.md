---
name: workflow-build
description: v0.1.3 - Delivers changes incrementally with code-local skeleton-first, direct-first implementation. Use when implementing any feature or change that touches more than one file. Use when you're about to write a large amount of code at once, or when a task feels too big to land in one step.
---

# Incremental Implementation

## Overview

Build in thin vertical slices — create a code-local skeleton for non-trivial control flow and invariants, implement one piece directly, test it, simplify only when the code proves the need, verify it, then expand. Avoid implementing an entire feature in one pass. Each increment should leave the system in a working, testable state. This is the execution discipline that makes large features manageable.

## Why This Order Exists

Normal development separates thinking about structure from filling in details.
A code-local skeleton makes the intended control flow, data movement,
invariants, and boundaries visible before implementation starts. That gives the
agent and reviewer something concrete to check before the code has already
committed to one shape.

Jumping straight into implementation hides weak assumptions inside working-looking
code. Common failure modes are partial state updates, incorrect ordering, stale
cache or transaction behavior, helper functions invented before their
responsibility is stable, and broad changes that cross the slice boundary. The
skeleton-first pass reduces those risks by making the shape of the change
reviewable before the details are filled in.

## When to Use

- Implementing any multi-file change
- Building a new feature from a task breakdown
- Refactoring existing code
- Any time you're tempted to write more than ~100 lines before testing

**When NOT to use:** Single-file, single-function changes where the scope is already minimal.

## The Increment Cycle

```
┌──────────────────────────────────────┐
│                                      │
│   Skeleton / invariant pass         │
│              │                      │
│              ▼                      │
│   Direct implementation ──→ Test    │
│              │                      │
│              ▼                      │
│      Simplification pass ──→ Verify │
│              │                      │
│              ▼                      │
│            Commit ──→ Next slice    │
│                                      │
└──────────────────────────────────────┘
```

For each slice:

1. **Skeleton / invariant pass** — create a visible skeleton artifact for the
   current slice's control flow, data flow, core invariants, and boundaries
   before filling in the code
2. **Direct implementation** — implement the smallest complete piece of
   functionality in the simplest direct shape that fits the existing codebase
3. **Test** — run the test suite (or write a test if none exists)
4. **Simplification pass** — remove obvious noise and extract helpers only
   when the helper/abstraction gate below is satisfied
5. **Verify** — confirm the slice works as expected after any simplification
   (tests pass, build succeeds, manual check)
6. **Commit** -- save your progress with a descriptive message (see
   `git-workflow-and-versioning` for atomic commit guidance)
7. **Move to the next slice** — carry forward, don't restart

## Slicing Strategies

### Vertical Slices (Preferred)

Build one complete path through the stack:

```
Slice 1: Create a task (DB + API + basic UI)
    → Tests pass, user can create a task via the UI

Slice 2: List tasks (query + API + UI)
    → Tests pass, user can see their tasks

Slice 3: Edit a task (update + API + UI)
    → Tests pass, user can modify tasks

Slice 4: Delete a task (delete + API + UI + confirmation)
    → Tests pass, full CRUD complete
```

Each slice delivers working end-to-end functionality.

### Contract-First Slicing

When backend and frontend need to develop in parallel:

```
Slice 0: Define the API contract (types, interfaces, OpenAPI spec)
Slice 1a: Implement backend against the contract + API tests
Slice 1b: Implement frontend against mock data matching the contract
Slice 2: Integrate and test end-to-end
```

### Risk-First Slicing

Tackle the riskiest or most uncertain piece first:

```
Slice 1: Prove the WebSocket connection works (highest risk)
Slice 2: Build real-time task updates on the proven connection
Slice 3: Add offline support and reconnection
```

If Slice 1 fails, you discover it before investing in Slices 2 and 3.

## Implementation Rules

### Rule 0: Skeleton Is Allowed; Premature Decomposition Is Not

Before concrete implementation, create a small visible skeleton artifact for
the slice when the code change is non-trivial. A non-trivial slice includes
meaningful state changes, loops, transactions, cache writes, request flows,
cross-file data flow, concurrency, or error-boundary behavior.

Prefer a code-local skeleton:

- temporary comments inside the target function, method, or module
- pseudocode near the code being changed
- a minimal control-flow frame that keeps the file syntactically valid

The skeleton should express:

- the control flow the slice will follow
- the data that moves through the slice
- the invariant that must stay true during the loop, transaction, state update,
  or request flow
- the boundaries that must not be crossed by this slice

A prose-only skeleton in the agent update is allowed only when a code-local
skeleton would break compilation, require fake stubs or misleading placeholder
code, or when the slice is trivial enough that a code-local artifact would add
noise. When using a prose-only skeleton, state why a code-local skeleton was
not used.

Good skeleton:

```python
def import_users(rows):
    # validate every row before writing anything
    # invariant: no partial database mutation before validation succeeds

    # normalize valid rows into records

    # persist records in one transaction

    # return an import summary
```

Bad skeleton when these helpers do not already exist and the slice has not
proved they are needed:

```python
def import_users(rows):
    validated = validate_rows(rows)
    normalized = normalize_rows(validated)
    result = persist_users(normalized)
    return build_summary(result)
```

The bad version decomposes the work into helpers before the current slice has
proved that those helpers are needed. Skeletons should shape direct
implementation first; helper extraction belongs in the simplification pass.

Temporary skeleton comments are allowed during editing, but the completed slice
must either fill them in or remove them. Keep only comments that explain a
non-obvious invariant, ordering rule, or boundary.

### Rule 0.1: Simplicity First

Before writing any code, ask: "What is the simplest thing that could work?"

After writing code, review it against these checks:
- Can this be done in fewer lines?
- Are these abstractions earning their complexity?
- Would a staff engineer look at this and say "why didn't you just..."?
- Am I building for hypothetical future requirements, or the current task?

```
SIMPLICITY CHECK:
✗ Generic EventBus with middleware pipeline for one notification
✓ Simple function call

✗ Abstract factory pattern for two similar components
✓ Two straightforward components with shared utilities

✗ Config-driven form builder for three forms
✓ Three form components
```

Three similar lines of code is better than a premature abstraction. Implement the naive, obviously-correct version first. Optimize only after correctness is proven with tests.

### Rule 0.25: Helper / Abstraction Gate

During direct implementation, default to no new helper, wrapper, adapter,
utility, manager, framework, or abstraction layer. Reuse existing project
helpers and patterns normally, but do not invent new ones before the slice
proves the need. First write the current slice in the clearest direct form
using existing project patterns and the skeleton from Rule 0.

Create or extract a helper only when the current slice proves at least one of
these signals:

- The same non-trivial logic is repeated in more than one place.
- A stable domain action has emerged and a name makes the caller easier to
  read.
- An invariant, boundary check, or ordering rule needs one owner to avoid
  drift.
- Inline detail is drowning the main flow and extracting it makes the main
  behavior clearer.

Before adding the helper, state the evidence: the repeated code, the invariant,
or the specific main-flow noise it removes. After extracting it, rerun the
relevant tests or checks because helper extraction is still a code change.

Do not create new utility files for one-time operations. Do not add adapters,
facades, compatibility layers, or generic managers unless the task explicitly
requires them and the current code proves the need.

### Rule 0.5: Scope Discipline

Touch only what the task requires.

Do NOT:
- "Clean up" code adjacent to your change
- Refactor imports in files you're not modifying
- Remove comments you don't fully understand
- Add features not in the spec because they "seem useful"
- Modernize syntax in files you're only reading

If you notice something worth improving outside your task scope, note it — don't fix it:

```
NOTICED BUT NOT TOUCHING:
- src/utils/format.ts has an unused import (unrelated to this task)
- The auth middleware could use better error messages (separate task)
→ Want me to create tasks for these?
```

### Rule 1: One Thing at a Time

Each increment changes one logical thing. Don't mix concerns:

**Bad:** One commit that adds a new component, refactors an existing one, and updates the build config.

**Good:** Three separate commits — one for each change.

### Rule 2: Keep It Compilable

After each increment, the project must build and existing tests must pass. Don't leave the codebase in a broken state between slices.

### Rule 3: Feature Flags for Incomplete Features

If a feature isn't ready for users but you need to merge increments:

```typescript
// Feature flag for work-in-progress
const ENABLE_TASK_SHARING = process.env.FEATURE_TASK_SHARING === 'true';

if (ENABLE_TASK_SHARING) {
  // New sharing UI
}
```

This lets you merge small increments to the main branch without exposing incomplete work.

### Rule 4: Safe Defaults

New code should default to safe, conservative behavior:

```typescript
// Safe: disabled by default, opt-in
export function createTask(data: TaskInput, options?: { notify?: boolean }) {
  const shouldNotify = options?.notify ?? false;
  // ...
}
```

### Rule 5: Rollback-Friendly

Each increment should be independently revertable:

- Additive changes (new files, new functions) are easy to revert
- Modifications to existing code should be minimal and focused
- Database migrations should have corresponding rollback migrations
- Avoid deleting something in one commit and replacing it in the same commit — separate them

## Working with Agents

When directing an agent to implement incrementally:

```
"Let's implement Task 3 from the plan.

Start with just the database schema change and the API endpoint.
Don't touch the UI yet — we'll do that in the next increment.
Sketch the endpoint control flow and invariants first.
Implement the endpoint directly first; don't add new helpers unless repeated
logic or an invariant appears in this slice.

After implementing, run `npm test` and `npm run build` to verify
nothing is broken."
```

Be explicit about what's in scope and what's NOT in scope for each increment.

## Increment Checklist

After each increment, verify:

- [ ] The change does one thing and does it completely
- [ ] The slice started with a control-flow, data-flow, invariant, or boundary skeleton when the logic was non-trivial
- [ ] The first working version was implemented directly, without speculative helpers or abstractions
- [ ] Temporary skeleton comments were filled in or removed unless they explain a real invariant or boundary
- [ ] Any new helper or abstraction has explicit evidence from repeated logic, a stable domain action, an invariant, or main-flow noise
- [ ] All existing tests still pass (`npm test`)
- [ ] The build succeeds (`npm run build`)
- [ ] Type checking passes (`npx tsc --noEmit`)
- [ ] Linting passes (`npm run lint`)
- [ ] The new functionality works as expected
- [ ] The change is committed with a descriptive message

**Note:** Run each verification command after a change that could affect it. After a successful run, don't repeat the same command unless the code has changed since — re-running on unchanged code adds no information.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll test it all at the end" | Bugs compound. A bug in Slice 1 makes Slices 2-5 wrong. Test each slice. |
| "It's faster to do it all at once" | It *feels* faster until something breaks and you can't find which of 500 changed lines caused it. |
| "These changes are too small to commit separately" | Small commits are free. Large commits hide bugs and make rollbacks painful. |
| "I'll add the feature flag later" | If the feature isn't complete, it shouldn't be user-visible. Add the flag now. |
| "This refactor is small enough to include" | Refactors mixed with features make both harder to review and debug. Separate them. |
| "I'll just implement it; the structure will become clear while coding" | Direct implementation without a visible skeleton hides ordering, state, and boundary mistakes until they are harder to unwind. |
| "I'll skip the skeleton because the code is obvious" | If the slice has meaningful state, loops, transactions, or boundaries, a short skeleton exposes the invariant before implementation. |
| "I'll turn the skeleton into helpers immediately" | Skeletons guide direct implementation. Helpers require current evidence from repetition, stable domain meaning, an invariant owner, or main-flow noise. |
| "I'll add a helper now because we'll probably need it later" | Helpers should be forced by current evidence, not future guesses. Start direct and extract during the simplification pass. |
| "Let me run the build command again just to be sure" | After a successful run, repeating the same command adds nothing unless the code has changed since. Run it again after subsequent edits, not as reassurance. |

## Red Flags

- More than 100 lines of code written without running tests
- Multiple unrelated changes in a single increment
- "Let me just quickly add this too" scope expansion
- Skipping the test/verify step to move faster
- Build or tests broken between increments
- Large uncommitted changes accumulating
- Non-trivial state changes, loops, transactions, or request flows implemented without naming the invariant first
- Building abstractions before the third use case demands it
- Turning a skeleton into helper names before proving those helpers are needed
- Adding helpers without naming the repeated logic, invariant, or readability pressure they solve
- Touching files outside the task scope "while I'm here"
- Creating new utility files for one-time operations
- Running the same build/test command twice in a row without any intervening code change

## Verification

After completing all increments for a task:

- [ ] Each increment was individually tested and committed
- [ ] Non-trivial increments identified their skeleton, invariant, or boundary before implementation
- [ ] Each increment started with a direct implementation before simplification
- [ ] Temporary skeleton comments were not left behind as empty narration
- [ ] Any helper or abstraction added during simplification had evidence and was retested
- [ ] The full test suite passes
- [ ] The build is clean
- [ ] The feature works end-to-end as specified
- [ ] No uncommitted changes remain
