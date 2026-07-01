---
name: semantic-naming-review
description: v0.1.0 - Review code names against behavior, side effects, return semantics, and interface intent. Use when a user questions a function, helper, variable, or method name. Use when renaming helpers after a tutorial, refactor, review, or production mapping pass.
---

# Semantic Naming Review

## Overview

Review names as executable interface claims. A good name tells the reader what
operation is happening, what kind of value is returned, whether state changes,
and how failure behaves. This skill checks whether function, method, helper,
variable, class, and field names match the code's actual semantics before
renaming or approving them.

This is narrower than a full code review and more specific than general
simplification. Use it when naming itself is the work: the code may already be
correct, but readers cannot tell whether a helper finds, resolves, validates,
creates, projects, records, or mutates something.

## When to Use

- A user asks why a function or helper is named a certain way.
- A user asks whether production names should match a reference or tutorial.
- A review finds names that hide side effects, failure behavior, or data flow.
- A refactor changes a helper's responsibility and the old name may now lie.
- A tutorial or reference-core checkpoint needs names that teach the operation.
- A production mapping pass needs to compare reference names with existing
  project conventions.

**When NOT to use:** broad code review, behavior debugging, API contract design,
formatting-only cleanup, mass style preference renaming, or public API renames
without migration planning. Use `workflow-review`, `debugging-and-error-recovery`,
`api-and-interface-design`, or `deprecation-and-migration` instead.

## The Operating Loop

1. **Locate Usage Before Judging**
   - Read the definition and at least two call sites when available.
   - Identify whether the name is private/internal, public API, persisted data,
     log/metric key, test fixture, or documentation term.
   - Note existing local naming conventions before proposing a different style.

2. **Classify The Actual Semantics**
   - Query: returns information without mutation.
   - Predicate: returns `bool`.
   - Resolver: converts an external name or key into an internal object and may
     fail when unknown.
   - Validator: checks a contract and raises or returns errors.
   - Creator/Builder: constructs a new object or derived structure.
   - Projector/Serializer: converts internal state into an external/read model.
   - Mutator/Marker/Applier: changes state, records status, appends data, or
     publishes side effects.
   - Orchestrator: coordinates multiple operations and owns control flow.

3. **Check Name Against Semantics**
   - Compare the current name with the classification.
   - Flag names that imply no side effect but mutate state.
   - Flag `get_*` names that validate, create, block, or raise for normal
     absence.
   - Flag `resolve_*` names that merely filter a collection or return an empty
     result for normal absence.
   - Flag noun-like helper names when parameters or side effects make the
     operation ambiguous.
   - Preserve project conventions when the existing name is already clear in
     local context.

4. **Propose The Smallest Better Name**
   - Prefer a direct verb plus object: `find_ready_nodes`,
     `mark_dependents_skipped`, `validate_graph`.
   - Keep domain vocabulary stable; do not rename business terms for taste.
   - For private helpers, prefer clarity over backward compatibility.
   - For public APIs, propose a migration or deprecation path instead of a
     drive-by rename.
   - If no rename clearly improves readability, say so and leave the name.

5. **Apply Or Report**
   - If the user asked for edits, rename definitions, call sites, tests, docs,
     and examples in the same slice.
   - If the user asked for review only, return findings with current name,
     observed behavior, recommended name, and reason.
   - Run the narrowest relevant test or static check after edits.
   - Keep naming-only changes separate from behavior changes unless they are
     inseparable.

## Naming Heuristics

| Semantics | Prefer | Avoid When Misleading |
| --- | --- | --- |
| Returns matching items | `find_*`, `select_*`, plural noun | `resolve_*` |
| Returns a boolean | `is_*`, `has_*`, `can_*`, `should_*` | noun-only names |
| Key/name to internal object | `resolve_*` | `get_*` if missing is exceptional |
| Simple read by key | `get_*` | `resolve_*` if no conversion happens |
| Contract check | `validate_*`, `ensure_*` | `check_*` when failure semantics matter |
| Object creation | `create_*`, `build_*` | `get_*` |
| State mutation | `mark_*`, `set_*`, `apply_*`, `record_*`, `append_*` | noun names or `get_*` |
| Read model conversion | `project_*`, `to_*`, `serialize_*` | `get_*` |
| Control flow owner | `run_*`, `execute_*`, `trigger_*`, `orchestrate_*` | overly broad `process_*` |

## Examples

```python
# Weak for a helper with a record parameter and computed result.
def ready_nodes(record): ...

# Clearer: scans the record and returns the current ready set.
def find_ready_nodes(record): ...
```

```python
# Weak because it hides mutation.
def skip_dependents(record, failed_node): ...

# Clearer: modifies downstream node status.
def mark_dependents_skipped(record, failed_node): ...
```

```python
# Appropriate because absence is an invalid external request.
def resolve_handler(node_name): ...

# Appropriate because the function validates structure and raises.
def validate_graph(dependencies): ...
```

## Decision Points

- If the name is public, persisted, logged, or documented as an external
  contract, do not rename directly; plan a migration or ask for approval.
- If the name is internal and call sites are local, rename directly when the new
  name is clearly more truthful.
- If the project has a strong local convention, prefer consistency unless the
  name actively lies about behavior.
- If a proposed rename changes how readers understand behavior, check whether
  behavior or documentation should change too.
- If many names are weak, group by semantic category and change one coherent
  slice at a time.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The code works, so the name is fine." | Working code can still teach the wrong mental model. |
| "Shorter is always better." | Short names are good only when they remain truthful in context. |
| "`get_` is harmless." | `get_` hides validation, creation, blocking, or mutation semantics. |
| "Private helper names do not matter." | Private helpers are where readers build the main-flow model. |
| "We should rename everything now." | Naming changes need tight scope or review becomes noisy. |
| "The reference-core name must replace production naming." | Production conventions and public contracts may justify a different name. |

## Red Flags

- A function name lacks a verb but takes parameters and computes a result.
- A function mutates state but the name sounds like a read.
- A function returns `[]` for normal absence but is named `resolve_*`.
- A function raises on unknown input but is named as a casual getter.
- A helper name says what data it touches, not what operation it performs.
- A rename crosses public APIs, persistence fields, logs, metrics, or docs
  without migration planning.
- A naming-only change is bundled with behavior edits.

## Verification

- [ ] Definition and call sites were read before judging the name.
- [ ] The actual semantics were classified.
- [ ] Suggested names describe operation, result shape, failure behavior, and
      side effects.
- [ ] Public contract risk was identified before any rename.
- [ ] Edits, if made, updated definitions, call sites, tests, docs, and examples.
- [ ] Relevant tests, type checks, or docs checks ran after edits.
- [ ] Naming-only changes stayed separate from behavior changes.

## Output Format

For review-only work:

```text
## Semantic Naming Review
- scope:
- contract_risk: low | medium | high

## Findings
| Current Name | Observed Semantics | Recommendation | Reason |
| --- | --- | --- | --- |

## Safe Rename Plan
- ...

## Verification
- ...
```

For edit work, report changed names, files, tests, and any public contract risk.

## Guardrails

- Do not rename for personal taste alone.
- Do not infer behavior from the name; inspect implementation and call sites.
- Do not rename public APIs without explicit approval or migration handling.
- Do not broaden a naming pass into unrelated simplification.
- Do not use a reference/tutorial name as automatic authority over production
  naming.
