---
name: html-report-plan
description: v0.3.1 - Plans evidence-backed HTML report decks as a Minto-style argument pyramid and closed reader-question chain. Use when a report, proposal, diagnosis, or technical recommendation must progress without topic jumps. Use when main-story conclusions, supporting claims, concept introductions, appendix material, and the final decision need a build-ready contract before slide authoring.
---

# HTML Report Deck Plan

## Overview

Plan a professional HTML report deck before generating slides. Use Barbara
Minto's Pyramid Principle as the default logic model:

- vertical logic: each supporting claim answers the question raised by the
  claim above it
- horizontal logic: sibling claims form a valid inductive group or deductive
  sequence that supports their parent
- storyline logic: each main slide answers the reader's current question and
  creates the exact question answered by the next slide

The output is a v0.3 report-deck plan, not HTML. Action titles are the visible
surface of the argument; they do not replace the claim hierarchy or question
chain.

## When to Use

- The user wants a report, briefing, review, diagnosis, comparison, proposal,
  or recommendation in browser-playable PPT form.
- A previous deck had individually correct slides but introduced unrelated
  concepts from page to page.
- Technical details need to be separated from the decision narrative.
- The final deck must work for independent reading as well as live delivery.

**When NOT to use:** long-form documents, marketing pages, dashboards,
interactive applications, native `.pptx` files, or a deck whose evidence still
needs primary investigation.

## Fixed Defaults

- Artifact: one self-contained fixed 1600 x 900 HTML report deck.
- Logic model: Minto argument pyramid plus a closed reader-question chain.
- Opening: answer the governing question on the first main slide.
- Main story: only claims indispensable to the reader's decision.
- Appendix: supporting detail that proves or implements a main-story claim but
  does not advance the decision.
- Page count: derived from indispensable claims and evidence; never a target.
- Motion: none by default; evidence on the current slide is visible at once.
- Source traceability: exact locations stay in `source_context` and slide
  `evidence_ids`; no repeated visible source footer is planned by default.

## The Planning Process

### Step 1: Define the Report Job

Identify:

- report topic and primary decision-maker
- decision context and the action requested from the reader
- delivery mode: self-read, live, or both
- output directory, filename, language, tone, and real brand constraints

If the reader action is unclear, ask for that one missing input. Do not start
from a requested page count or a list of technical topics.

### Step 2: Gather Evidence

Assign stable IDs such as `E1`, `E2`, and `E3` to inspected files, commands,
screenshots, logs, traces, or approved external sources. Record exact
locations and which claims each source can support.

Keep unverified material in `needs_verification`. An unverified statement may
become an explicit unknown; it may not become a fact for narrative convenience.

Do not plan a visible source note on every slide. Put citations in slide content
or an appendix only when the user or audience needs to inspect them directly.

### Step 3: State the Governing Question and Answer

Write:

- `governing_question`: the single question the whole deck must answer
- `governing_answer_claim_id`: the claim that directly answers it
- `audience_decision`: the decision or action the answer should enable
- `reasoning_mode`: `deductive` or `inductive`

The governing answer becomes the first main slide's action title. It must be
specific enough that the reader can disagree with it and decide on it.

Use SCQA only when it sharpens the opening:

- situation: stable context already accepted by the audience
- complication: the change, conflict, or failure that creates urgency
- question: the governing question
- answer: the governing answer

Do not add an SCQA page for each label. It is an argument setup, not a slide
quota.

### Step 4: Build the Argument Pyramid

Create claims with stable IDs such as `C0`, `C1`, and `C2`.

- `C0` is the governing answer and has no parent.
- Each key-line claim directly sets `supports_claim_id: C0`.
- Every other claim sets one parent and must eventually reach `C0`.
- Sibling claims must be mutually distinct and collectively sufficient for
  their parent at the level of detail required by the decision.
- A deductive group follows premise, observation, and implication.
- An inductive group uses comparable statements under one plural noun.

Reject cycles, orphan claims, repeated claims, and facts that are merely
interesting. Evidence supports claims; claims support other claims.

### Step 5: Build the Reader-Question Chain

Plan main slides only after the argument pyramid exists.

For each main slide define:

- `question_in`: the question the reader brings into the slide
- `action_title`: the answer, copied exactly from its claim statement
- `answer_claim_id`: the claim that answers the question
- `question_out`: the one natural question created by that answer

Apply these hard rules:

- Slide 1 `question_in` equals the governing question.
- Slide N `question_out` equals Slide N+1 `question_in` in ID and wording.
- The final main slide has `question_out: null` and closes on the requested
  decision or action.
- A transition such as "next we discuss" is not a question handoff.
- If several next questions are equally plausible, the current answer is too
  broad or the sequence is not resolved.

Typical handoffs are `why?`, `how do we know?`, `what follows?`, `what should
we do?`, `what could fail?`, and `what must be decided now?`.

### Step 6: License New Concepts

Create a `concept_ledger` for terms essential to the main story.

- `given`: already known from the request, audience context, or opening setup
- `introduced`: first appears on one slide because that slide's incoming
  question requires it

An introduced main-story concept records:

- `introduced_on_slide_id`
- `required_by_question_id`, equal to that slide's `question_in.id`

Prefer at most one new concept per main slide. A service boundary, API shape,
data model, queue, OCR path, or external contract that does not answer the
current question belongs in the appendix.

### Step 7: Separate Main Story and Appendix

Mark every slide `story_section: main | appendix`.

Main slides:

- advance the governing answer toward the audience decision
- belong to the closed question chain
- are indispensable under the deletion test

Appendix slides:

- appear after all main slides
- declare `appendix_for_slide_ids`
- contain evidence, API tables, JSON, data models, detailed flows, ownership
  matrices, or implementation contracts that support named main slides
- never introduce a new decision or conclusion required to understand the
  main story

Do not preserve a requested number of pages. Remove unsupported pages; add
appendix pages only when evidence needs them.

### Step 8: Run the Storyline Gates

Run all gates before build:

1. **Titles-only test**: main titles alone state one coherent argument.
2. **Stranger test**: an informed outsider can state the conclusion, reasons,
   and requested decision without slide bodies.
3. **Question-chain test**: every `question_out` exactly hands off to the next
   `question_in`, and the final question closes.
4. **Deletion test**: remove each main slide in turn; if the decision chain
   still works, move or delete that slide.
5. **Concept-continuity test**: every new main-story concept is required by an
   already-open question and appears first on its licensed slide.
6. **Appendix-separation test**: implementation detail does not interrupt the
   main story, and every appendix slide points back to a main slide.
7. **Decision-closure test**: the final main slide leaves the reader with a
   concrete decision, action, owner, or acceptance boundary.

Record the first break, not a generic pass explanation. Do not mark a gate
passed merely because the corresponding fields are filled.

### Step 9: Validate and Persist the Plan

Write `<report-name>.plan.yaml` using
`references/report-plan-template.yaml`. Run:

```bash
python3 ../html-report-build/scripts/validate_report_plan.py <report-name>.plan.yaml
```

Fix every structural error and review warnings. The validator proves IDs,
references, graph reachability, question handoffs, concept licensing, appendix
order, deletion-test declarations, and absence of target page counts. Human
review still owns semantic sufficiency and whether one answer truly creates
the next question.

If no target directory is known, return the same complete contract in the
conversation. Do not create HTML in this skill.

## Decision Points

- If the governing question cannot be stated, ask for the reader's decision.
- If the governing answer lacks evidence, record an unknown instead of shaping
  a confident storyline around it.
- If a claim does not reach the governing answer, remove it or place its detail
  in an appendix linked to a relevant main slide.
- If a main slide introduces multiple new concepts, narrow its question or
  move technical detail to the appendix.
- If the deletion test removes a slide without breaking the argument, it is
  not a main slide.
- If the user requests a fixed slide count, explain that page count is an
  output of the argument and do not encode the target.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Every slide has an action title, so the story works." | Action titles can still be unrelated conclusions. |
| "The transition explains why the next topic appears." | A narrative sentence cannot replace an exact reader-question handoff. |
| "This technical concept will be useful later." | Main-story concepts must answer the current question; future detail belongs in the appendix. |
| "Twelve pages will look complete." | A target page count manufactures claims and weakens the argument. |
| "All claims have evidence." | Evidence makes a claim supportable, not necessary to the governing answer. |
| "The reader can skip the architecture slide." | A skippable slide fails the main-story deletion test. |

## Red Flags

- No governing question or governing answer exists.
- Claims map to evidence but not to a parent claim.
- A claim cycle or orphan claim exists.
- `question_out` and the next `question_in` differ.
- A main slide is justified only by "next we discuss".
- A main slide introduces several services, interfaces, models, or future
  capabilities not required by its incoming question.
- An appendix slide advances the decision instead of supporting it.
- A page-count target appears anywhere in the plan.
- Storyline checks are marked passed without a recorded test result.

## Verification

- [ ] Reader, governing question, governing answer, and audience decision are explicit.
- [ ] Every claim reaches the governing answer through `supports_claim_id`.
- [ ] Key-line claims form a valid deductive or inductive group.
- [ ] Every main slide has one incoming question, one exact answer claim, and
      one outgoing question or final closure.
- [ ] Question handoffs are exact and the final main slide closes the chain.
- [ ] New concepts are licensed by incoming questions and introduced once.
- [ ] Every main slide is indispensable under the deletion test.
- [ ] All appendix slides follow the main story and point to main slides.
- [ ] No target page count is present.
- [ ] Evidence maps through `source_context` and `evidence_ids` without a
      required visible source footer.
- [ ] `validate_report_plan.py` passes and semantic gates were reviewed.
- [ ] The plan was persisted when a target directory was known.
- [ ] No HTML was created.

## Output Format

```text
## Report Job
## Audience and Decision
## Evidence
## Governing Question and Answer
## Argument Pyramid
## Reader-Question Chain
## Concept Ledger
## Main Story
## Appendix Map
## Storyline Gate Results
## Quality Bar
## Build Handoff
```

## Guardrails

- Do not create or edit the HTML deck in this skill.
- Do not invent evidence, claims, files, command output, or sources.
- Do not keep v0.2 `transition` or topic-sequence fields as a compatibility path.
- Do not put a claim in the main story merely because evidence exists for it.
- Do not introduce a main-story concept before an incoming question requires it.
- Do not mix appendix detail into the main question chain.
- Do not plan to a fixed, minimum, or preferred page count.
- Do not require repeated visible source notes when metadata preserves the
  evidence mapping.
- Do not store secrets, credentials, private data, or raw sensitive logs.

## References

- `references/report-plan-template.yaml`
  Structured v0.3 Minto-pyramid and reader-question-chain contract for build.
