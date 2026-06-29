---
name: workflow-build
description: v0.1.7 - Delivers changes incrementally with skeleton-only first edits before direct implementation. Use when implementing any feature or change that touches more than one file. Use when you're about to write a large amount of code at once, or when a task feels too big to land in one step.
---

# Incremental Implementation

## Overview

Build in thin vertical slices with hard gates: inspect the task and relevant
code, define the slice scope, map implementation targets, make the first code
edit skeleton-only for non-trivial targets, implement directly, check for
coverage drift, test, audit speculative helpers, verify, then expand. Avoid
implementing an entire feature in one pass. Each increment should leave the
system in a working, testable state. This is the execution discipline that
makes large features manageable.

## Why This Order Exists

Normal development separates thinking about structure from filling in details.
A skeleton checkpoint makes the intended control flow, data movement,
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

## Reference Map

- `references/skeleton-gate.md`
  Required when a slice adds or changes a non-trivial function, method, route,
  transaction, cache write, file write, state synchronization path, or
  cross-file data flow. Use it for method-level skeletons, coverage maps, and
  coverage drift checks.

## The Increment Cycle

```
┌──────────────────────────────────────┐
│                                      │
│   Slice scope + coverage map        │
│              │                      │
│              ▼                      │
│   Target skeleton gate              │
│              │                      │
│              ▼                      │
│   Direct implementation             │
│              │                      │
│              ▼                      │
│   Coverage drift check ──→ Test     │
│              │                      │
│              ▼                      │
│ Helper / abstraction audit ─→ Verify│
│              │                      │
│              ▼                      │
│            Commit ──→ Next slice    │
│                                      │
└──────────────────────────────────────┘
```

For each slice:

1. **Understand the task** — inspect the task and relevant code, then state
   the current behavior, requested behavior, and assumptions before editing
2. **Slice scope** — name the smallest complete behavior this increment will
   deliver and the files, contracts, and behaviors it will not touch
3. **Coverage map** — list every file, function, method, route, test, or
   generated artifact the slice is about to change
4. **Target skeleton gate** — make the first code edit skeleton-only for each
   non-trivial target in the coverage map, show the skeleton diff, and state
   invariants, boundaries, and helper-gate status before continuing
5. **Direct implementation** — implement the smallest complete piece of
   functionality in the simplest direct shape that fits the existing codebase
6. **Coverage drift check** — compare the implementation diff with the
   coverage map; if a changed target was not covered by a skeleton checkpoint,
   stop and add a new skeleton-only checkpoint before continuing
7. **Test** — run the test suite (or write a test if none exists)
8. **Helper / abstraction audit** — check for speculative helpers,
   unnecessary abstractions, vague placeholder skeleton comments, and
   accidental scaffolding; inline or remove anything that is not justified by
   the current slice
9. **Verify** — confirm the slice works as expected after the audit and any
   cleanup (tests pass, build succeeds, manual check)
10. **Commit** -- save your progress with a descriptive message (see
   `git-workflow-and-versioning` for atomic commit guidance)
11. **Move to the next slice** — carry forward, don't restart

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

### Rule 0: Hard Skeleton Gates Before Implementation

Before concrete implementation, map the slice targets and create visible
skeleton artifacts for each non-trivial target. A non-trivial target includes
meaningful state changes, loops, transactions, cache writes, file writes,
request flows, cross-file data flow, concurrency, external calls, or
error-boundary behavior. Read `references/skeleton-gate.md` when any of those
signals appear.

This is a checkpoint, not a narration. For every non-trivial task or slice, the
first code-editing step must be a skeleton-only edit. Planning text alone does not satisfy the gate.
A spoken plan, checklist, or coverage map is context, not the skeleton edit. Do
not combine the skeleton artifact and the full implementation in the same edit.
Show the skeleton diff or exact skeleton artifact, state the invariant and
boundary assumptions, then continue to direct implementation. The checkpoint is
automatic after the skeleton diff is shown; it does not require a separate
approval step.

The first skeleton-only edit must not add final fields, full method bodies,
business logic, assertions, persistence behavior, external calls, or completed
error handling. It may add signatures, code-local ordering comments, minimal
control-flow frames, and `pass` or equivalent placeholders needed to keep the
file valid.

Prefer a code-local skeleton:

- code-local comments inside the target function, method, or module that
  express real invariants, ordering rules, or boundaries without process labels
  like `invariant:` or `boundary:`
- pseudocode near the code being changed
- a minimal control-flow frame that keeps the file syntactically valid

The skeleton should express:

- the control flow the slice will follow
- the data that moves through the slice
- the invariant that must stay true during the loop, transaction, state update,
  or request flow
- the boundaries that must not be crossed by this slice

A prose-only skeleton in the agent update is allowed only when a code-local
skeleton would break compilation, require fake stubs, pretend unimplemented
behavior exists, or when the slice is trivial enough that a code-local artifact
would add noise. When using a prose-only skeleton, state why a code-local
skeleton was not used.

The skeleton checkpoint output must include:

- `skeleton_artifact`: where the skeleton was placed, or why prose-only was
  used
- `coverage_map`: each file/function/method/route the implementation is about
  to touch and the skeleton artifact that covers it
- `invariants`: the state, ordering, transaction, cache, loop, or request-flow
  rules that must remain true
- `boundaries`: files, behavior, contracts, or generated output this slice will
  not touch
- `helper_gate`: whether new helpers are allowed in the implementation phase,
  with evidence if yes

Coverage is mandatory. A two-line skeleton in one cache method does not
authorize changing models, tests, routers, services, and graph generation. If
implementation work needs to touch a target that is not in `coverage_map`, stop
and add a new skeleton-only checkpoint for that target before writing the
implementation.

New non-trivial functions and methods require a method-level skeleton before
their full body is implemented. The skeleton does not need many comments, but
it must show ordered steps, state-changing boundaries, and invariants. Trivial
one-line getters, declarations, and thin forwarding code can be covered by the
coverage map alone.

See `references/skeleton-gate.md` for coverage-map examples, method-level
skeleton examples, coverage drift checks, and bad skeleton anti-patterns.

Skeleton artifacts must be meaningful from the start. Do not write vague
placeholder comments such as `# load data`, `# validate input`,
`# process result`, or `# return response`. Keep comments only when they explain
a non-obvious invariant, ordering rule, or boundary.

Skeleton size should match implementation risk. A large implementation can have
short comments, but each changed target still needs a skeleton entry that names
its role in the slice. If the first implementation edit is much broader than
the skeleton coverage, the workflow has failed.

After direct implementation, run a coverage drift check before tests: compare
the actual changed files, functions, methods, routes, and tests against the
coverage map. Any uncovered implementation target is a gate failure, not a
cleanup item.

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
using existing project patterns and the approved skeleton from Rule 0.

In `workflow-build`, treat helper evidence as a keep-or-inline audit gate, not
as a refactoring invitation. A new helper can stay in the build slice only when
it is required for the current slice and the current slice proves at least one
of these signals:

- The same non-trivial logic is repeated in more than one place.
- A stable domain action has emerged and a name makes the caller easier to
  read.
- An invariant, boundary check, or ordering rule needs one owner to avoid
  drift.
- Inline detail is drowning the main flow and extracting it makes the main
  behavior clearer.

Before keeping a new helper, state the evidence: the repeated code, the
invariant, or the specific main-flow noise it removes. If that evidence is not
clear, inline the helper back into the direct implementation.

If helper need is already visible during the skeleton checkpoint, record that
evidence in `helper_gate` before implementation begins. If the need only
appears after direct implementation, keep the helper only when it is required
for this slice and has explicit evidence. Do not extract helpers just to make
the code look more organized in the build slice.

Do not create new utility files for one-time operations. Do not add adapters,
facades, compatibility layers, or generic managers unless the task explicitly
requires them and the current code proves the need.

### Rule 0.3: Build Audit Blocks Extra Helpers

After direct implementation and tests, do a narrow audit:

- remove any vague placeholder skeleton comment that slipped in despite Rule 0
- keep only comments that explain real invariants, ordering rules, or boundaries
- inline speculative helpers that were added without evidence
- remove unused imports, dead code, and accidental scaffolding introduced by
  the slice

Do not perform broad cleanup, optional helper extraction, naming sweeps, file
moves, or behavior-preserving refactors in `workflow-build`. The build slice
should end as the simplest direct implementation for the current task, with no
helpers or abstractions beyond those required by the current slice and justified
by the helper gate.

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
First make a skeleton-only edit for the endpoint control flow and invariants,
show me the skeleton diff and coverage map, then continue to direct implementation.
For any new non-trivial method, first add the method signature plus ordered
step/invariant comments; fill the body only in the implementation edit.
Implement the endpoint directly first; don't add new helpers unless repeated
logic or an invariant appears in this slice.
After tests pass, audit for speculative helpers, vague placeholder skeleton
comments, and accidental scaffolding; inline or remove anything not required by
this slice.

After implementing, run `npm test` and `npm run build` to verify
nothing is broken."
```

Be explicit about what's in scope and what's NOT in scope for each increment.

## Increment Checklist

After each increment, verify:

- [ ] The change does one thing and does it completely
- [ ] Relevant code was inspected and the task/slice assumptions were stated before editing
- [ ] The first code edit for each non-trivial task or slice was skeleton-only
- [ ] Planning text, checklist output, or coverage map text was not counted as the skeleton edit
- [ ] The skeleton checkpoint showed the skeleton artifact, coverage map, invariants, boundaries, and helper-gate status
- [ ] Every file/function/method/route changed by the implementation was covered by the skeleton checkpoint before implementation touched it
- [ ] Every new non-trivial function or method had a method-level skeleton before the full body was implemented
- [ ] The skeleton artifact avoided vague placeholder comments and stated real ordering, invariant, or boundary information
- [ ] The first working version was implemented directly, without speculative helpers or abstractions
- [ ] A coverage drift check found no implementation targets missing from the coverage map
- [ ] Any new helper or abstraction kept in the slice has explicit evidence from repeated logic, a stable domain action, an invariant, or main-flow noise
- [ ] Speculative helpers, generic utilities, and unnecessary abstractions were removed or inlined
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
| "I'll add the skeleton and implementation in one patch" | That skips the checkpoint. Non-trivial slices need a skeleton-only edit before full implementation. |
| "I'll skip the skeleton because the code is obvious" | If the slice has meaningful state, loops, transactions, or boundaries, a short skeleton exposes the invariant before implementation. |
| "One skeleton comment is enough; the rest follows the same idea" | Skeleton coverage must match the implementation targets. Add coverage entries before touching additional files, methods, routes, tests, or graph paths. |
| "The new method is straightforward, so I'll write the whole body first" | New non-trivial methods need a method-level skeleton first so ordering, state writes, and boundaries are visible before implementation. |
| "I'll turn the skeleton into helpers immediately" | Skeletons guide direct implementation. Helpers require current evidence from repetition, stable domain meaning, an invariant owner, or main-flow noise. |
| "I'll add a helper now because we'll probably need it later" | Helpers should be forced by current evidence, not future guesses. Start direct and remove helpers that are not required by this slice. |
| "Tests pass, so I'll clean this up broadly now" | Build audit is narrow. It removes speculative helpers and scaffolding; it does not perform broad refactors. |
| "Let me run the build command again just to be sure" | After a successful run, repeating the same command adds nothing unless the code has changed since. Run it again after subsequent edits, not as reassurance. |

## Red Flags

- More than 100 lines of code written without running tests
- Multiple unrelated changes in a single increment
- "Let me just quickly add this too" scope expansion
- Skipping the test/verify step to move faster
- Build or tests broken between increments
- Large uncommitted changes accumulating
- Skeleton artifact and full implementation appear in the same first edit for a non-trivial slice
- A small skeleton in one file is followed by broad implementation across uncaptured files or methods
- A new cache write, file write, transaction, route, or state-sync method appears fully implemented without a method-level skeleton
- Direct implementation changes targets that were absent from the coverage map
- Non-trivial state changes, loops, transactions, or request flows implemented without naming the invariant first
- Building abstractions before the third use case demands it
- Turning a skeleton into helper names before proving those helpers are needed
- Adding helpers without naming the repeated logic, invariant, or readability pressure they solve
- Performing broad cleanup or refactoring inside a build slice after tests pass
- Touching files outside the task scope "while I'm here"
- Creating new utility files for one-time operations
- Running the same build/test command twice in a row without any intervening code change

## Verification

After completing all increments for a task:

- [ ] Each increment was individually tested and committed
- [ ] Non-trivial increments passed a skeleton checkpoint before implementation
- [ ] Skeleton checkpoints recorded artifact, coverage map, invariants, boundaries, and helper-gate status
- [ ] No implementation target was changed before it appeared in the skeleton coverage map
- [ ] New non-trivial functions and methods were introduced through method-level skeletons before full bodies
- [ ] Coverage drift checks ran after direct implementation and before tests
- [ ] Skeleton artifacts did not rely on vague placeholder comments such as `# load data`, `# validate input`, `# process result`, or `# return response`
- [ ] Each increment started with direct implementation before helper/audit cleanup
- [ ] Any helper or abstraction kept in the build slice had evidence and was retested
- [ ] Speculative helpers, generic utilities, and unnecessary abstractions were not left behind
- [ ] The full test suite passes
- [ ] The build is clean
- [ ] The feature works end-to-end as specified
- [ ] No uncommitted changes remain
