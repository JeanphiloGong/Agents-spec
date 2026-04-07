---
name: proposal-review-wave-skill
description: v0.1.5 - Deliberate on a new feature idea or plan through one parallel review wave that surfaces tradeoffs, dissent, and next questions before implementation.
---

# Proposal Review Wave Skill

## Trigger and Scope

Use this skill when a new feature idea, requirement, or plan needs structured
cross-angle review before implementation starts.

In scope:
- one-wave proposal review for direction shaping
- scope classification and council selection
- parallel multi-lens critique with explicit disagreement capture
- discussion-first synthesis with human-owned final decisions
- concrete next-wave questions when the proposal is still immature

Out of scope:
- direct implementation planning or file-level task breakdown
- migration sequencing or rollout playbooks
- long meeting transcripts or unstructured brainstorming dumps
- forcing a final `go` or `block` decision when the evidence is still mixed

## Workflow

1. Frame the proposal.
   - Capture the idea, intended outcome, and the specific question this wave
     should answer.
2. Classify scope before reviewing.
   - Choose `frontend`, `backend`, `system`, or `auto`.
   - Use `references/council-lenses.md` to pick the primary council.
3. Define the wave boundary.
   - State the wave goal, explicit non-goals, and any constraints that should
     shape the review.
4. Select review lenses.
   - Start with the primary council and add cross-domain lenses only when
     coupling or risk justifies them.
5. Run one review pass per selected lens.
   - Prefer one parallel sub-agent per selected lens when the runtime and user
     request allow parallel delegation.
   - Otherwise run the same lens protocol sequentially and disclose the
     fallback.
6. Synthesize the wave.
   - Build shared ground, disagreement clusters, unknowns, control boundaries,
     and option shapes using `references/wave-synthesis.md`.
7. State a tentative lean only when it is real.
   - If the discussion does not naturally converge, keep the wave open and say
     why.
8. Close the wave.
   - End with mandatory human decision points and a minimal next-wave input
     checklist.

## Required Inputs

- `idea`: one-sentence feature or proposal statement
- `goal`: intended user, product, or system outcome
- `scope_hint`: `frontend|backend|system|auto`
- `constraints`: optional limits such as compatibility, time, cost, or policy
- `depth`: optional `quick|standard`; default `standard`

## Defaults

- review mode: `discussion-first`
- decision owner: `human-final`
- council strategy: `layered-domain-councils`
- default primary council size: `3`
- delegation mode: `parallel-when-allowed`
- max parallel lenses: `6`
- scoring mode: `six-dimension-supporting-score`
- artifact mode: `session-only`
- recommendation strength: `tentative`
- closure mode: `open-unless-converged`

## Bundled Resources

- `references/council-lenses.md`
- `references/wave-synthesis.md`

## Output Format

```text
## Wave Goal
## Scope Classification
## Agent Execution
## Council Deliberation
## Discussion Map
## Option Shapes
## Tentative Lean
## Human Decision Needed
## Next-Wave Inputs
```

## Guardrails

- Keep the output to one review wave by default.
- Do not force all councils when the proposal scope is narrow.
- Do not let one review lens become the final decision by itself.
- Do not suppress dissent, unknowns, or unresolved tension just to sound
  decisive.
- Do not output implementation, migration, or rollout steps unless the user
  explicitly asks for them.
- Do not fabricate facts, constraints, or convergence.
- Do not hide when parallel delegation was unavailable; disclose the fallback.
- Default high-risk decisions around security, data, public contracts, and
  reliability guarantees to `Human-Owned`.

## Verification Hooks

- Verify the wave goal and non-goals are explicit before review starts.
- Verify scope classification and council selection rationale are visible.
- Verify every selected lens returns reasoning, risks, promising angles,
  required conditions, unknowns, and control ownership signals.
- Verify shared ground and disagreement clusters are separated instead of
  blended together.
- Verify the tentative lean is omitted or clearly labeled when convergence is
  weak.
- Verify the output ends with human decision points and next-wave inputs.
