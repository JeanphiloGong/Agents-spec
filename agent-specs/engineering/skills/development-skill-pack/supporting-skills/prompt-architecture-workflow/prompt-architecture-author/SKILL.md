---
name: prompt-architecture-author
description: v0.1.0 - Author or refactor LLM prompts from task model, input schema, decision process, hard rules, few-shots, and output schema. Use when a prompt is becoming a rule pile, when classification/extraction/routing/attribution behavior needs reliable structure, or when an LLM prompt must be made testable before use.
---

# Prompt Architecture Author

## Overview

Design prompts as task architectures, not rule dumps. This skill turns a rough
prompt or task idea into a structured prompt that gives the model a role, input
schema, decision path, hard constraints, boundary examples, and parseable output
contract.

The default failure this skill prevents is a prompt that says "do not do A, do
not do B, do not do C" without explaining the actual task model.

## When to Use

- A prompt is mostly policy, negative constraints, or repeated rules.
- A classification, extraction, routing, attribution, matching, review, or
  tool-use prompt needs reliable behavior.
- The model must choose among candidates, bind evidence to an entity, reject
  uncertain cases, or tolerate noisy inputs such as OCR.
- A production prompt needs a clear input schema, output schema, and few-shot
  boundary cases.
- A human asks to rewrite, strengthen, or create a prompt for an LLM-powered
  workflow.

**When NOT to use:** casual one-off chat prompts, copywriting prompts where
style is the only concern, jailbreak research, model-provider API setup, or
tasks where the input/output contract is intentionally exploratory.

## The Operating Loop

1. Classify the Task
   - Name the task family: classification, extraction, attribution, routing,
     matching, review, generation, planning, or tool use.
   - State what the task is not. For example, attribution is not entity
     extraction, and routing is not general relevance search.
   - Verify: the task family explains why the prompt exists.
2. Build the Task Model
   - Define the business or product context.
   - Name the downstream consumer of the result.
   - Define the model's decision authority and what evidence it should use.
   - Reframe weak roles such as "you are a classifier" into domain roles such
     as "you are the attribution judge for an asset graph detail page."
   - Verify: the role changes the model's decision perspective, not only its
     tone.
3. Define the Input Schema
   - List every top-level input object and required field.
   - Explain field meaning in caller terms, not only variable names.
   - Define candidate object shape when the prompt selects from candidates.
   - Mark optional, noisy, derived, or unreliable fields.
   - Verify: a model can know what `candidate.id` or any required return value
     refers to.
4. Define the Decision Process
   - Write numbered steps that match the model's cognition path.
   - Put the strongest disambiguation step before narrow rules.
   - Include conflict handling, uncertainty handling, and rejection criteria.
   - Verify: the process tells the model what to do before listing what not to
     do.
5. Extract Hard Rules
   - Keep only rules that must never be violated.
   - Remove duplicate policy language.
   - Convert broad prohibitions into positive decision rules where possible.
   - Verify: each rule changes an output decision under at least one realistic
     case.
6. Design Few-Shots
   - Add positive examples for the common path.
   - Add boundary examples for noisy inputs, OCR mistakes, ambiguous
     candidates, explicit conflicts, and empty/reject outputs.
   - Include at least one counterexample where a superficially related
     candidate must not be selected.
   - Verify: examples teach behavior that rules alone would not reliably teach.
7. Define the Output Schema
   - Specify exact fields, allowed values, null/empty behavior, and whether
     reasoning is private or returned.
   - Require IDs from the input when selecting candidates.
   - Define confidence or reason fields only when the caller will use them.
   - Verify: downstream code can parse the response without guessing.
8. Assemble the Prompt
   - Use this order by default:
     `SYSTEM`, `INPUT_SCHEMA`, `DECISION_PROCESS`, `HARD_RULES`,
     `FEW_SHOTS`, `OUTPUT_SCHEMA`.
   - Keep the prompt natural and direct; avoid repeating the same rule in
     system, policy, and examples.
   - Verify: the final prompt starts from the task model, not a rule list.
9. Self-Check Before Handoff
   - Run the verification checklist.
   - Name any missing examples, unverified assumptions, or schema gaps.
   - Recommend `prompt-architecture-review` when the prompt will be used in a
     production or repeated workflow.

## Decision Points

- If the task is candidate selection, define candidate schema before writing
  selection rules.
- If the prompt handles noisy text, include a near-match few-shot and a true
  conflict few-shot.
- If the prompt has many "do not" rules, rewrite the decision process before
  adding more prohibitions.
- If the downstream consumer only needs an ID, keep output minimal and avoid
  verbose explanation fields unless needed for audit.
- If the model must call tools or inspect external data, stop and define tool
  inputs, tool outputs, and failure handling before final prompt assembly.
- If examples require private or sensitive data, replace them with realistic
  synthetic examples.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The rules are detailed, so the model will follow them." | Rules without task model and schema often compete for attention. |
| "The role can just say classifier." | A weak role does not tell the model which perspective to optimize. |
| "The input shape is obvious from variable names." | The model needs field semantics, especially for candidates and IDs. |
| "Few-shot is optional." | Boundary examples often teach noisy, ambiguous, or reject behavior better than more rules. |
| "More negative constraints make the prompt safer." | Too many prohibitions dilute the positive decision path. |
| "The final JSON schema is enough." | Output schema does not explain how to decide what belongs in it. |

## Red Flags

- The prompt begins with rules before defining the task.
- The role does not distinguish the task from adjacent tasks such as extraction,
  search, recall, or summarization.
- The prompt references `candidates`, `id`, `context`, `image`, or other
  objects without schema.
- The decision process is a paragraph of policy rather than numbered steps.
- Rules repeat across system, policy, and examples.
- There are no few-shots for noisy, ambiguous, conflict, or reject cases.
- More than half the prompt is negative constraints.
- The output schema allows values that cannot be traced to the input.

## Verification

- [ ] The task family and non-task are named.
- [ ] The role changes decision perspective, not just tone.
- [ ] Input schema defines all top-level objects and candidate IDs when used.
- [ ] Decision process is numbered and executable.
- [ ] Hard rules are minimal and non-duplicative.
- [ ] Few-shots include common path and at least two boundary cases.
- [ ] Output schema is parseable and tied to input fields.
- [ ] The prompt avoids unsupported tools, hidden data, invented fields, and
      private facts.
- [ ] The prompt can be reviewed by `prompt-architecture-review`.

## Output Format

```text
## Task Model
## Input Schema
## Decision Process
## Hard Rules
## Few-Shots
## Output Schema
## Final Prompt
## Verification Notes
```

## Guardrails

- Do not start by writing rules. Define task model and input schema first.
- Do not invent candidate fields, business context, tools, or downstream
  consumers when the user has not supplied them; label assumptions.
- Do not include secrets, private data, or real personal data in few-shots.
- Do not make the prompt depend on hidden chain-of-thought.
- Do not add confidence scores or reason fields unless the caller can use them.
- Do not optimize for generic prompt elegance over the actual decision task.
