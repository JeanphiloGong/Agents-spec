---
name: from-scratch-implementation-skill
description: v0.1.4 - Teach one feature or method from first principles through a connected incremental implementation ladder. Use when the human wants core logic built from behavior, constraints, invariants, helper contracts, code versions, and verification before trusting final code.
---

# From-Scratch Implementation Skill

## Overview

Produce a tutorial-first markdown guide that derives one feature, method, or
coherent core slice from external behavior into connected code versions. The
goal is not to dump final code. The goal is to make the internal model, helper
contracts, mutation boundaries, and final runnable implementation grow from the
requirements one version at a time.

Use this skill when reasoning must be preserved as a durable artifact the human
can revisit, extend, or use to reimplement the core logic by hand.

## When to Use

- The user asks how to implement something from scratch.
- The user wants each step to explain why, how to think, and what to code next.
- AI already produced draft code but the human does not want to trust-copy the
  core logic.
- The human wants a recorded derivation artifact that can be reused later.
- The request is small enough to teach as one coherent path.
- A `Human-Owned` step in `human-led-main-landing-skill` needs explicit
  reasoning before coding.

**When NOT to use:** one-wave landing plans, broad multi-wave delivery plans,
final-code-only requests with no teaching intent, diff migration, commit
sequencing, or runnable mini-project extraction better handled by
`reference-core-impl-skill`.

## The From-Scratch Operating Loop

Teach one abstraction layer at a time. Do not introduce a helper, data
structure, or full implementation before the requirement pressure that makes it
necessary is visible. Once code growth starts, every step must connect to the
previous version.

1. State Behavior
   - Name the feature goal, intended reader, and user-visible behavior.
   - Identify the external contract before any internal structure.
   - Verify: the reader can say what must happen without seeing code.
2. Name Constraints and Invariants
   - State hard constraints such as `O(1)`, ordering rules, API or UX contract,
     failure behavior, consistency rules, and mutation boundaries.
   - Verify: at least one constraint explains why a naive implementation may
     fail.
3. Question the Naive Shape
   - Ask the first "why is the simple shape insufficient?" question.
   - Use that pressure to derive the first internal model, state variable, or
     data structure.
   - Verify: the data structure follows from an operation or invariant, not
     from preference.
4. Sketch the Public Surface
   - Name the public methods, handler boundary, or service surface before
     helper bodies.
   - Define helper contracts only after the public behavior needs them.
   - Verify: each helper has a caller, input, output, and mutation boundary.
5. Start the Smallest Working Version
   - Create the smallest skeleton or partial version that can be reasoned about
     as code.
   - State what this version can do and what it still lacks.
   - Verify: the first code version is connected to the contract and is not an
     isolated code block.
6. Grow Through Connected Versions
   - Write the `From Scratch` section as numbered steps using the connected
     build contract.
   - Each step solves one concrete problem by adding to or replacing part of the
     previous version.
   - Verify: every step states what changed, what the new version can do, and
     what still lacks.
7. Let the Final Step Become the Complete Code
   - The last meaningful build step should yield the complete runnable version
     when the user needs code.
   - Do not add a separate final code section that introduces new logic.
   - Verify: the final code contains no unexplained state, helper, branch, or
     mutation rule.
8. Close With Practice
   - Walk one concrete example or trace end to end.
   - List common mistakes, verification checks, and the next smallest step the
     human can execute alone.
   - Verify: the output is a complete markdown guide, not a short chat response.

## Connected Build Contract

Every numbered step inside the `From Scratch` section should answer the same
teaching questions:

- `Question`
- `Why This Matters`
- `How To Think`
- `Previous Version Can`
- `Add or Replace`
- `Code Change`
- `Now This Version Can`
- `Still Lacks`
- `What To Verify`

Rules:
- Each step introduces only one new pressure, structure, helper, or mutation
  rule.
- Do not solve the whole feature in one step.
- Do not present disconnected code blocks that cannot be related to the previous
  version.
- When replacing code, show the old shape briefly and the new code explicitly.
- In `Add or Replace`, use connector wording in substance:
  `In the previous version, add ...` or `Replace this part with ...`.
- The final complete code must come from the last connected step, not from a
  separate unexplained section.

See `references/from-scratch-document-ladder.md` for the detailed ladder and
anti-patterns.

## Decision Points

- If the user wants a runnable mini-project rather than an inline walkthrough,
  use `reference-core-impl-skill` first.
- If there is real landing or integration context on `main`, hand off to
  `human-led-main-landing-skill` and use this skill only for `Human-Owned`
  derivation steps.
- If constraints are missing but the goal is clear, infer lightweight
  assumptions and label them before teaching.
- If missing constraints would change the data structure or public contract,
  ask before drafting the guide.
- If the user asks for a terse response, compress the guide but keep behavior,
  constraints, from-scratch progression, and verification.

## Required Inputs

- feature or method goal in one sentence
- optional constraints or invariants
- optional current code, AI draft, or code shape
- optional preferred output depth if the user wants quicker or stricter
  coaching
- optional output path if the guide should be written to a file

## Fixed Defaults

- `mode=from-scratch-implementation`
- `output_style=tutorial-first`
- `artifact_mode=full-markdown-doc-default`
- `document_shape=from-scratch-implementation-guide`
- `implementation_style=contract-first-with-explicit-helper-boundaries`
- `plan_horizon=one-method-or-one-coherent-slice`
- `step_shape=question-why-think-previous-add-now-lacks-verify`
- `code_generation=connected-version-growth`
- `final_code_policy=last-step-yields-complete-code`
- `agent_mode=single|multi(optional)`

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
- Previous Version Can:
- Add or Replace:
- Code Change:
- Now This Version Can:
- Still Lacks:
- What To Verify:

### Step 2: ...
- Question:
- Why This Matters:
- How To Think:
- Previous Version Can:
- Add or Replace:
- Code Change:
- Now This Version Can:
- Still Lacks:
- What To Verify:

## Helper Contracts
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

Use `references/worked-example-lrucache.md` when the user needs a concrete
example of deriving a data structure from requirements. Use
`references/from-scratch-document-ladder.md` when the guide risks jumping too
quickly from requirement to helper internals.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The final code will teach the idea." | Final code hides the reasoning path; derive the structure before showing full code. |
| "I'll explain helpers first so the solution is easier." | Helpers should feel forced by behavior and invariants, not introduced as arbitrary machinery. |
| "The user asked for implementation, so skip the contract." | The external contract is what makes the implementation choices defensible. |
| "One big step is shorter." | A large step prevents the human from seeing which pressure created which structure. |
| "The AI draft already has a good layout." | Existing helper layout is evidence, not the source of truth. Re-derive the core path. |
| "I'll add a separate final code block after the tutorial." | The final code must grow out of the last connected step and must not smuggle in new logic. |

## Red Flags

- A data structure appears before the external contract and hard constraints.
- A helper is recommended before its caller, purpose, and mutation boundary are
  explained.
- The `From Scratch` section is missing or not numbered.
- A step contains multiple new ideas, helpers, or state changes.
- A step does not say what the previous version could do and what the new
  version can do.
- Code blocks are standalone explanations rather than additions or
  replacements to the previous version.
- A separate final code block introduces logic not grown through the steps.
- The guide never walks a concrete example end to end.
- The output ends without a verification checklist or next small step.
- AI draft structure is copied instead of re-derived from requirements.

## Verification

Before finishing, confirm:

- [ ] The output is a complete markdown guide, not a short chat-style response.
- [ ] The external contract and hard constraints appear before any data
      structure is proposed.
- [ ] The `From Scratch` section is present and uses numbered steps.
- [ ] Each step answers `Question`, `Why This Matters`, `How To Think`,
      `Previous Version Can`, `Add or Replace`, `Code Change`,
      `Now This Version Can`, `Still Lacks`, and `What To Verify`.
- [ ] Each helper contract has an explicit purpose and mutation or return
      boundary.
- [ ] Every code step is an addition to or replacement of the previous version.
- [ ] The guide teaches "why this structure" before "how do I code it."
- [ ] The guide includes one concrete example or trace.
- [ ] The final complete code, when present, comes from the last connected step
      and introduces no new logic.
- [ ] The guide ends with one concrete next step the human could execute alone.

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
- Do not add disconnected explanation/code/explanation blocks; each code
  step must name what it adds to or replaces in the previous version.
- Do not add a separate final code section that contains new logic.
- When AI code already exists, do not treat the existing helper layout as
  authoritative. Re-derive the core path from requirements first.
- Do not output secrets, tokens, or PII.
