---
name: implementation-coach-skill
description: v0.1.1 - Produce a document-first, from-scratch implementation guide that derives one feature or method from behavior and invariants into step-by-step structure, helper contracts, small code fragments, and verification; use it when the human wants to learn how to build the core logic rather than trust final code.
---

# Implementation Coach Skill

## Trigger and Scope

Use this skill when the user wants a tutorial-first implementation guide for one
feature, method, or coherent core slice and wants the reasoning preserved as a
durable markdown artifact instead of a short chat reply.

Primary fit:
- the user asks how to implement something from scratch
- the user wants each step to explain why, how to think, and what to code next
- AI already produced draft code but the human does not want to trust-copy the
  core logic
- the human wants a recorded derivation artifact that can be reused later
- the request is small enough to teach as one coherent path

In scope:
- deriving internal structure from external behavior and invariants
- explaining why a data structure, helper, or state variable is necessary
  before presenting it
- sequencing implementation from contract to primitives to full assembly
- teaching with one worked example or trace
- ending with the next smallest implementation step the human can execute
- returning the result as a complete markdown guide by default

Out of scope:
- one-wave landing or integration planning on `main`
- broad multi-wave delivery plans
- final-code-only requests with no teaching intent
- diff migration and commit sequencing

Use `human-core-feature-wave-skill` when there is real landing or integration
context on `main`.

## Core Purpose

Teach one smallest coherent implementation path before helper noise or final
code distracts from the reasoning, and preserve that reasoning as a markdown
artifact the human can revisit.

This skill exists to help you:
- state external behavior first
- name hard constraints and invariants explicitly
- derive the internal model or data structures from those constraints
- make helper contracts feel necessary rather than arbitrary
- show a build order the human can follow without trusting the AI layout
- leave behind a reusable from-scratch implementation guide instead of a
  disposable reply

## Default Operating Model

- The output is a teaching artifact, not a merge plan.
- The default artifact is a complete markdown document, even when returned in
  chat.
- The explanation starts from behavior and constraints, not from final code.
- Stay at one abstraction level at a time: public contract first, helper
  mechanics second.
- Prefer one worked example over many shallow examples.
- If AI code already exists, treat it as evidence and comparison material, not
  the source of truth.

## Fixed Defaults

- `mode=implementation-coach`
- `output_style=tutorial-first`
- `artifact_mode=full-markdown-doc-default`
- `document_shape=from-scratch-implementation-guide`
- `implementation_style=contract-first-with-explicit-helper-boundaries`
- `plan_horizon=one-method-or-one-coherent-slice`
- `step_shape=question-why-think-write-verify`
- `code_generation=optional-after-derivation`
- `agent_mode=single|multi(optional)`

## Artifact Policy (Required)

- Return one self-contained markdown guide by default, not a short advisory
  reply.
- If no output path is provided, still format the response as a durable
  markdown document the user can store or extend later.
- If the user provides a note path or document path, write the same guide there
  when the environment permits.
- Compress only when the user explicitly asks for a terse answer; even then,
  keep the markdown headings and from-scratch progression.

## Mode Selection and Handoff (Required)

- Choose this skill by default when there is no landing context yet and the
  user mainly wants to learn or derive the design.
- Use this skill as a nested subroutine inside `human-core-feature-wave-skill`
  for `Human-Owned` steps that need explicit reasoning before coding.
- Run `reference-core-impl-skill` first when the better teaching artifact is a
  runnable minimal-complete sample rather than an inline walkthrough.

## From-Scratch Teaching Sequence (Required)

Teach the implementation in this order:

1. State the external behavior first.
2. Name the hard constraints and invariants.
3. Ask the first "why is the naive shape insufficient?" question.
4. Derive the first internal model, state variable, or data structure from that
   pressure.
5. Sketch the public methods first and name helper contracts before helper
   bodies.
6. Introduce only the smallest primitive or helper needed for the next step.
7. Show what state changes, what stays stable, and what the caller must still
   do.
8. Assemble the public methods from those primitives.
9. Walk one concrete example end to end.
10. End with the next smallest implementation step or exercise.

The explanation must make the data-structure choice feel inevitable from the
requirements. Do not jump straight to helper internals without first showing
the constraint that forces them.

## Step Contract (Required)

Every numbered step inside the `From Scratch` section should answer the same
teaching questions.

Each step should contain:
- `Question`
- `Why This Matters`
- `How To Think`
- `What To Write Now`
- `Small Code Fragment` when code is introduced
- `What To Verify`

Rules:
- each step should introduce only one new pressure, structure, helper, or
  mutation rule
- do not solve the whole feature in one step
- do not present the full implementation before the ladder is complete
- when code is introduced, keep it fragment-sized until the assembly section

See `references/from-scratch-document-ladder.md` for the detailed ladder and
anti-patterns.

## Workflow

1. State the feature goal, intended reader, and user-visible behavior.
2. Name the hard constraints such as `O(1)`, invariants, API or UX contract,
   failure behavior, and mutation boundaries.
3. If existing code or an AI draft exists, extract only the evidence that
   matters and ignore incidental helper layout.
4. Derive the internal model, state, or data structures from those
   constraints.
5. Sketch the public surface first, such as `get` or `put`, or one
   handler/service boundary.
6. Build the `From Scratch` section as a numbered ladder using the required
   step contract.
7. Summarize the helper contracts after they have been justified by the ladder.
8. Assemble the core slice from the previously introduced fragments.
9. Add a reference implementation only after the derivation and assembly are
   complete, and only when it materially helps.
10. End with verification checks, common mistakes, and the next smallest step
    the human can execute alone.

## Required Inputs (Minimal)

- feature or method goal in one sentence
- optional constraints or invariants
- optional current code, AI draft, or code shape
- optional preferred output depth if the user wants quicker or stricter
  coaching
- optional output path if the guide should be written to a file

## Output Format

```text
# <Feature / Method> From Scratch

## Reader and Goal
- ...

## External Contract
- ...

## Constraints and Invariants
- ...

## Existing Evidence (Optional)
- ...

## From Scratch
### Step 1: ...
- Question:
- Why This Matters:
- How To Think:
- What To Write Now:
- Small Code Fragment:
- What To Verify:

### Step 2: ...
- Question:
- Why This Matters:
- How To Think:
- What To Write Now:
- Small Code Fragment:
- What To Verify:

## Helper Contracts
- ...

## Assemble the Core Slice
- ...

## Reference Implementation (Optional)
- ...

## Common Mistakes
- ...

## Verification Checklist
- ...

## Next Small Step
- ...

## Blocking Questions (Only If Blocking)
- ...
```

## Bundled Resources

- `references/from-scratch-document-ladder.md`
- `references/worked-example-lrucache.md`

## Worked Example Reference

- See `references/worked-example-lrucache.md` for a successful example of
  deriving `dict + doubly linked list` from `LRUCache` requirements using the
  full document-first format.
- Use that example specifically for `Human-Owned` rewrites where AI already has
  a candidate implementation but the human wants to rebuild the core logic with
  full understanding.
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
- Keep one new idea per step in the `From Scratch` ladder.
- Call out mutation boundaries explicitly: what state changes, what does not,
  and what the caller must still do.
- Do not place the full reference implementation before `Assemble the Core
  Slice`.
- When AI code already exists, do not treat the existing helper layout as
  authoritative. Re-derive the core path from requirements first.
- Do not output secrets, tokens, or PII.

## Verification Hooks

- Verify the output is a complete markdown guide, not a short chat-style answer.
- Verify the external contract and hard constraints are stated before any data
  structure is proposed.
- Verify the `From Scratch` section is present and uses numbered steps.
- Verify each step answers `Question`, `Why This Matters`, `How To Think`,
  `What To Write Now`, and `What To Verify`.
- Verify each helper contract has an explicit purpose and mutation or return
  boundary.
- Verify the output teaches "why this structure" before "how do I code it."
- Verify the guide ends with one concrete next step the human could execute
  alone.
