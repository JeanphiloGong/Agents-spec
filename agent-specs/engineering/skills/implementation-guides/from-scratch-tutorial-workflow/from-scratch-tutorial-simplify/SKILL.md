---
name: from-scratch-tutorial-simplify
description: v0.2.0 - Simplify a working from-scratch tutorial without breaking Nystrom/Karpathy/Norvig standards or the tutorial increment cycle. Use when a guide is correct but too repetitive, wordy, checklist-like, or hard to scan, while real scenario, problem compression, core model, invariants, pressure, naive version, break, one patch/checkpoint change, check, freeze, final assembled checkpoint, and helper boundaries must be preserved.
---

# From-Scratch Tutorial Simplify

## Overview

Simplify a completed from-scratch tutorial while preserving its teaching
behavior. The goal is not shorter at any cost. The goal is a guide that is
easier to follow without losing external contract, teaching pressure,
connected code versions, step checks, freeze points, helper boundaries, or
final-code traceability.

Preserve the teaching standard:

- Nystrom complete engineering chain: connected working versions remain intact.
- Karpathy runnable from-zero coding: code still appears early and stays
  runnable.
- Norvig small complete problem compression: the real scenario, compressed
  model, included scope, and deferred scope remain explicit.

## The Tutorial Increment Cycle

```text
+------------------------------------------------+
|                                                |
|  Pressure -> Naive version -> Break -> Change  |
|      ^                                |        |
|      +------ Freeze <- Check <--------+        |
|                 |                              |
|                 v                              |
|             Next step                          |
|                                                |
+------------------------------------------------+
```

Simplify prose around the cycle, not the cycle itself. Every step must still
show pressure, naive version, break, one change, check, and freeze.

Defect-driven depth is protected content. Do not shorten away the explanation
of what breaks in the naive or previous version, why the new requirement
follows, or how the step check proves that one defect was addressed.

Scenario and compression are protected content. Do not delete who uses the
thing, why the naive approach hurts, what the compressed model includes or
defers, the core model, or the invariants.

Pressure examples are protected content too. Do not remove the tiny input,
trace, call site, or extension that lets the reader feel the problem before the
fix appears.

Code-change semantics are also protected content. Do not remove `Code Change
Type`, `Code Change Target`, or the final assembled checkpoint while tightening
the prose.

Internal self-review is not protected public content. If a tutorial includes
`Step Self-Review` sections, replace them with reader-facing `Checkpoint`,
`Before Moving On`, or `Try This` language while preserving the actual teaching
check.

## When to Use

- A from-scratch tutorial has passed or mostly passed review but feels heavy.
- The guide repeats the same explanation across steps.
- Step wording is too long for readers to scan.
- The human wants clearer prose without changing the tutorial's logic.

**When NOT to use:** first-draft generation, planning, fixing broken teaching
logic, changing final code behavior, or removing required verification to make
the guide shorter.

## The Simplification Loop

1. Establish the Baseline
   - Identify reader goal, external contract, version steps, helper contracts,
     and final code.
   - Verify: the current tutorial is complete enough to simplify.
2. Protect Required Fields
   - Preserve `Question`, `Pressure Example`, `Naive or Previous Version`,
     `What Breaks`, `New Requirement`, `Add or Replace`, `Code Change`,
     `Why This Change Works`, `Code Change Type`, `Code Change Target`, `Step
     Check`, `Now This Version Can`, `Freeze This Version`, `Still Lacks`, and
     `What To Verify` when present.
   - Preserve real scenario, problem compression, core model, invariants, and
     verification matrix when present.
   - Verify: no step loses the connected build loop.
3. Remove Repetition
   - Delete repeated rationale that does not add new pressure.
   - Merge duplicate warnings only when the result remains explicit.
   - Verify: each remaining sentence earns its place.
4. Tighten Prose
   - Prefer concrete verbs, shorter bullets, and direct reader-facing language.
   - Convert checklist-like field repetition into natural tutorial prose when
     doing so does not remove required content.
   - Keep source facts and assumptions clear.
   - Verify: no ambiguity is introduced.
5. Preserve Code Traceability
   - Do not alter code behavior unless the user explicitly asks.
   - If code snippets are shortened, keep the add/replace relation obvious.
   - Preserve whether each code block is a patch or checkpoint.
   - Keep the final assembled checkpoint complete.
   - Verify: final code still traces to the connected steps.
6. Report Changes
   - Summarize what was simplified and what was intentionally preserved.
   - Note any remaining teaching risk.

## Decision Points

- If a guide has broken version continuity, use `from-scratch-tutorial-review`
  or rebuild before simplifying.
- If simplification would remove a step check, keep the check and shorten
  surrounding prose instead.
- If code needs behavior changes, stop and ask whether this is now a build
  task.
- If the tutorial is already concise, report that no simplification is needed.

## Output Format

```markdown
## Simplification Summary
- ...

## Preserved Teaching Chain
- ...

## Remaining Risks
- ...
```

When editing a file directly, keep this report brief and include changed paths.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Shorter is clearer." | Removing pressure, checks, or gaps makes the guide harder to learn from. |
| "The freeze line is repetitive." | Freeze lines prevent hidden rewrites between versions. |
| "Step checks can move to the end." | End-only verification loses per-version evidence. |
| "Code can be compacted while simplifying prose." | Code behavior changes belong to build, not simplify. |
| "What Breaks is obvious after simplification." | The defect explanation is the teaching engine; preserve it explicitly. |
| "Patch/checkpoint labels are mechanical noise." | They tell the reader whether to apply a local edit or copy a complete version. |
| "Step Self-Review should stay because it is accurate." | It is internal scaffolding; public tutorials should use reader-facing checkpoints. |
| "Scenario and compression can be shortened away." | They are the reason the tutorial is not just a code walkthrough. |
| "Removing field labels removes the structure." | The structure can remain as natural prose plus checkpoints. |

## Red Flags

- A step loses `Step Check` or `Still Lacks`.
- A step loses the concrete `What Breaks` explanation or the link from defect
  to new requirement.
- A step loses the pressure example that made the defect visible.
- A helper remains but its first-needed explanation is removed.
- A step loses `Code Change Type` or `Code Change Target`.
- The real scenario, compressed model, core model, invariants, or verification
  matrix are removed from a non-trivial tutorial.
- Final code no longer traces to prior versions.
- The final assembled checkpoint is shortened into a partial snippet.
- Source facts and assumptions are merged together.
- Simplification changes code behavior.

## Verification

- [ ] The connected build loop remains intact in every step.
- [ ] Real scenario, problem compression, core model, invariants, and
      verification matrix remain intact when relevant.
- [ ] Nystrom/Karpathy/Norvig standards are preserved.
- [ ] Concrete previous-version defects and defect-to-change explanations are
      preserved.
- [ ] Pressure examples are preserved or rewritten into clearer reader-facing
      examples.
- [ ] Code change type, target, and final assembled checkpoint are preserved.
- [ ] Step checks and freeze points are preserved.
- [ ] Helper contracts still have purpose and boundaries.
- [ ] No source facts or assumptions were invented.
- [ ] Code behavior was not changed unless explicitly requested.
- [ ] Remaining risks are reported.

## Guardrails

- Do not simplify by deleting required teaching fields.
- Do not simplify by deleting scenario, compression, core model, invariants, or
  verification matrix from non-trivial tutorials.
- Do not change code behavior as part of prose simplification.
- Do not remove concrete examples or traces when they are the only evidence.
- Do not compress a step so far that it no longer explains what breaks in the
  prior version.
- Do not preserve `Step Self-Review` as public prose; convert it to a
  reader-facing checkpoint when simplifying for publication.
- Do not remove patch/checkpoint labels or make the final checkpoint
  incomplete.
- Do not collapse multiple version steps into one unless the user explicitly
  asks for a shorter non-teaching summary.
