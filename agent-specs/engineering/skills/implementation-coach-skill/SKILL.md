---
name: implementation-coach-skill
description: v0.1.0 - Teach one feature or method from behavior and invariants to derived structure, helper contracts, build order, and verification so the human can implement the core logic step by step instead of starting from the final code.
---

# Implementation Coach Skill

## Trigger and Scope

Use this skill when the user wants a tutorial-first explanation for how to
implement one feature, method, or coherent core slice without losing the
reason behind each data structure and helper.

Primary fit:
- the user asks how to implement something step by step
- AI already produced draft code but the human does not want to trust-copy the
  core logic
- the human wants to rederive the internal structure from requirements and
  constraints
- the request is small enough to teach as one coherent path

In scope:
- deriving internal structure from external behavior and invariants
- explaining why a data structure or helper is necessary before presenting it
- sequencing the implementation from contract to primitives to full assembly
- walking one concrete example end to end
- ending with the next smallest implementation step the human can execute

Out of scope:
- one-wave landing or integration planning on `main`
- broad multi-wave delivery plans
- final-code-only requests with no teaching intent
- diff migration and commit sequencing

Use `human-core-feature-wave-skill` when there is real landing or integration
context on `main`.

## Core Purpose

Teach one smallest coherent implementation path before helper noise or final
code distracts from the reasoning.

This skill exists to help you:
- state external behavior first
- name hard constraints and invariants explicitly
- derive the internal model or data structures from those constraints
- make helper contracts feel necessary rather than arbitrary
- show a build order the human can follow without trusting the AI layout

## Default Operating Model

- The output is a teaching artifact, not a merge plan.
- The explanation starts from behavior and constraints, not from final code.
- Stay at one abstraction level at a time: public contract first, helper
  mechanics second.
- Prefer one worked example over many shallow examples.
- If AI code already exists, treat it as evidence and comparison material, not
  the source of truth.

## Fixed Defaults

- `mode=implementation-coach`
- `output_style=tutorial-first`
- `implementation_style=contract-first-with-explicit-helper-boundaries`
- `plan_horizon=one-method-or-one-coherent-slice`
- `artifact_mode=session-output`
- `code_generation=optional-after-derivation`
- `agent_mode=single|multi(optional)`

## Mode Selection and Handoff (Required)

- Choose this skill by default when there is no landing context yet and the
  user mainly wants to learn or derive the design.
- Use this skill as a nested subroutine inside `human-core-feature-wave-skill`
  for `Human-Owned` steps that need explicit reasoning before coding.
- Run `reference-core-impl-skill` first when the better teaching artifact is a
  runnable minimal-complete sample rather than an inline walkthrough.

## Teaching Sequence (Required)

Teach the implementation in this order:

1. State the external behavior first.
2. Name the hard constraints and invariants.
3. Derive the internal model or data structures from those constraints.
4. Sketch the public methods first and name helper contracts before helper
   bodies.
5. Implement or explain the smallest primitives first.
6. Assemble the public methods from those primitives.
7. Walk one concrete example end to end.
8. State what each helper mutates or returns, and avoid hidden side effects.
9. End with the next smallest implementation step or exercise.

The explanation must make the data-structure choice feel inevitable from the
requirements. Do not jump straight to helper internals without first showing
the constraint that forces them.

## Workflow

1. State the feature goal and user-visible behavior.
2. Name the hard constraints such as `O(1)`, invariants, API or UX contract,
   and failure behavior.
3. If existing code or an AI draft exists, extract only the evidence that
   matters and ignore incidental helper layout.
4. Derive the internal model, state, or data structures from those
   constraints.
5. Sketch the public surface first, such as `get` or `put`, or one
   handler/service boundary.
6. Introduce helper contracts only after their purpose is justified.
7. Implement or explain the lowest-level helper primitives first.
8. Build back up to the public methods.
9. Verify the reasoning by answering: why this structure, and why not a
   simpler one?
10. End with the next smallest implementation step or exercise.

## Required Inputs (Minimal)

- feature or method goal in one sentence
- optional constraints or invariants
- optional current code, AI draft, or code shape
- optional preferred output depth if the user wants quicker or stricter
  coaching

## Output Format

```text
## Feature Goal
- ...

## External Contract
- ...

## Constraints and Invariants
- ...

## Derived Structure
- ...

## Skeleton First
- public methods:
- helper contracts:

## Build Order
- Step 1:
- Step 2:
- Step 3:

## Worked Example
- ...

## Verification
- check:
- expected:

## Next Small Step
- ...

## Blocking Questions (Only If Blocking)
- ...
```

## Worked Example Reference

- See `references/worked-example-lrucache.md` for a successful example of
  deriving `dict + doubly linked list` from `LRUCache` requirements before
  dropping into helper details.
- Use that example specifically for `Human-Owned` rewrites where AI already
  has a candidate implementation but the human wants to rebuild the core logic
  with full understanding.
- Use `reference-core-impl-skill` first when the better teaching artifact is a
  runnable mini-project rather than an inline explanation.

## Guardrails

- Do not collapse this skill into "here is the final code" without first
  explaining the requirements-to-structure path.
- Do not recommend a helper before explaining what pressure or requirement
  created it.
- Do not say "store X in a map or list" without explaining what operation must
  stay `O(1)` or what invariant it protects.
- Keep one abstraction level at a time: contract first, helper details second.
- Call out mutation boundaries explicitly: what state changes, what does not,
  and what the caller must still do.
- Prefer one worked example over many shallow examples.
- When AI code already exists, do not treat the existing helper layout as
  authoritative. Re-derive the core path from requirements first.
- Do not output secrets, tokens, or PII.

## Verification Hooks

- Verify the external contract and hard constraints are stated before any data
  structure is proposed.
- Verify each helper contract has an explicit purpose and mutation or return
  boundary.
- Verify the build order ends with one concrete next step the human could
  execute alone.
- Verify the output teaches "why this structure" before "how do I code it."
