---
name: project-implementation-tutorial-build
description: v0.1.1 - Write step-by-step feature implementation tutorials against real project code. Use when the user has discussed a solution and wants exact files, complete code examples, caller integration, migrations, and test guidance. Use when rebuilding a vague or standalone tutorial into an actionable existing-project guide.
---

# Project Implementation Tutorial Build

## Overview

Teach the reader to implement the selected capability in the existing project.
Produce a tutorial, not a production patch or a standalone mock application.
Use the actual baseline as the starting point and replay the tutorial changes
in an isolated copy to establish what the document really delivers.

The reader must be able to apply the code in order. Every implementation step
shows the real file path, the symbol or insertion point, the complete code
needed for that step, and the next observable result. At each capability
checkpoint supply a directly runnable check: a minimal invocation with assertions
or expected output, an existing test command, or a supplied verification asset.
Minimal verification code belongs in the guide even when tests were not
explicitly requested. Describe broader test coverage through locations, inputs,
and expected results; expand a full test suite only when requested or when
testing itself is the feature being taught.

Version planning and teaching are both essential. Reuse an agreed plan from
conversation or a document; a separate planning skill invocation is optional.
Read `references/teaching-and-verification.md` before drafting.
Also read [the writing progress guide](references/writing-progress.md).
Persist execution state locally; keep the tutorial independent of these records.

## When to Use

- "We agreed on the feature; write the tutorial against my current code."
- The user needs exact file and method changes, not pseudocode or a mock app.
- An existing implementation guide has missing callers, tests, or explanations.

**When NOT to use:** implementing production changes, extracting a standalone
learning module, or review-only requests. Use the sibling plan skill only if
version boundaries still need meaningful design; use the sibling review skill
for review-only work.

## The Operating Loop

1. Confirm the selected version.
   Recover the latest requirements and decisions, intended reader, starting
   version, promised outcome, exclusions, and document location. When these are
   already clear, proceed without requesting another plan. Ask before choosing
   missing rules that affect contracts, data, authorization, or scope.
   Read this tutorial's progress record if resuming. Accept an agreed conversation
   directly; do not create a planning record. Read upstream plan/review artifacts
   only when explicitly supplied as inputs. Reconcile source and document drift
   before reusing prior verification evidence.
2. Read the baseline and trace the path.
   Read project rules and actual models, entrypoints, services, repositories,
   callers, initialization/migrations, and relevant tests. Record revision and
   relevant dirty changes. Check source names and database dialect rather than
   inferring them from old prose. Distinguish observed behavior from proposed
   changes. Identify the full input -> state -> output path for this version.
3. Establish safe verification.
   Use a disposable copy containing the actual relevant baseline, including
   relevant uncommitted files; do not use HEAD alone if the tutorial targets
   dirty code. Record provenance, exclude credentials, and use isolated test
   databases and fake external transports. Run relevant baseline checks and
   record pre-existing failures. Never send real notifications to verify prose.
4. Open with the real scenario and bounded model.
   Explain who triggers the feature, what is missing today, and what the reader
   will observe after this version. Name the few concepts and invariants needed
   to understand the change. Scope down the feature, not away its required real
   authentication, persistence, caller, or transaction boundaries.
   Verify the chosen scope is small enough to teach and check independently.
   Start with its business behavior, not a tour of configuration files. Keep
   setup in brief prerequisites. An implementation foundation must execute a
   meaningful rule, not merely repeat contracts; do not add a domain framework
   just for teaching.
5. Write and verify one connected code step.
   Show a concrete input, call, or failure exposing the baseline's gap. Explain
   the requirement and why the selected change solves it. Name the exact file,
   class/method, and `patch` or `checkpoint` operation. Supply a code example
   that the reader can paste or apply at that point, including imports,
   signatures, surrounding context, and affected callers. Do not replace a
   required implementation with a prose instruction such as "add this in the
   Service". Explain new fields and helper inputs/outputs, side effects, and
   ownership where non-obvious. Replay this step in the verification copy. At
   its capability freeze, run the reader's exact check against only the edits
   taught so far and state what now works. Apply the failure and environment-
   blocking decisions below before dependent work. A final replay cannot
   retroactively establish intermediate checkpoints. If several edits must land
   together, group them and give that group one small observable result.
   Update `progress.yaml` after this step with its stable ID, drafting status,
   actual check result, input identity, blocker, and next action. Record results
   when checks finish, not by marking all steps verified at the end.
6. Continue through the promised integration.
   Follow the real dependency order. Include API registration, worker invocation,
   transaction ownership, migrations, serializers, or configuration only where
   this capability requires them. Existing code is reused by verified path and
   symbol; newly proposed helpers must be fully implemented before the
   checkpoint that calls them is declared runnable.
   Keep code changes in numbered implementation steps. A migration, model,
   repository, service, route, worker, or caller that the reader must add gets
   its own code example or is included in a clearly ordered complete example.
   Place the runnable reader check after the corresponding change, then describe
   broader test scenarios, setup, expected results, and boundaries in prose.
7. Freeze the complete version.
   Ensure the final connected step leaves all declared targets fully specified;
   no hidden edits or new logic in an appendix. Replay the final tutorial state
   and execute focused plus risk-appropriate regression checks. Record actual
   commands, results, and limits. Inspect the replay diff for undocumented work.
8. Review and hand off.
   Apply this skill's verification checklist, repair tutorial defects, and remove only
   temporary artifacts created for this verification. Report the tutorial path,
   verified baseline, outcome, unverified dependencies, and next agreed version.
   A `commit_when` condition is guidance, not authorization to commit.
   Retain local task records for resumption; verify they parse, reference the
   tutorial chapters, and are ignored and unstaged. Do not delete them with the
   replay sandbox. Keep self-review repair notes in progress, not the lesson;
   do not create a formal review record as a prerequisite to completion.

## Decision Points

- If no separate plan exists but the discussion is sufficient, form a compact
  step list and build. Do not force the user through plan again.
- If an existing method already works, explain and reuse it. Do not rewrite it
  into a deliberately broken naive implementation for dramatic progression.
- If several files must change together to keep imports or contracts valid,
  make them one coherent step with one behavioral check.
- If source has drifted, reconcile the affected steps with current code; ask
  when the drift conflicts with an agreed rule rather than silently changing it.
- If a reader check exposes a defect in the documented code, fix the earliest
  failing step and rerun it before drafting dependent checkpoints.
- If a required runtime, credential, or service is unavailable, record the
  exact check and missing prerequisite. Continue independent checks and, if
  the writing scope calls for later chapters, draft them with affected and
  dependent checkpoints explicitly unverified. Once access is available,
  replay those intermediate states in order before marking them verified.
  Deliver remaining blocked work as an unverified draft with its limits.
- If the user asks for mock responses, mark their exact fields and activation
  boundary, reuse actual routes and models, and explain what the mocks do not
  prove. Do not replace the project with a separate mock server by default.

## Output Format

Write in the user's language and match existing tutorial conventions.

1. Version goal, baseline, prerequisites, and explicit exclusions.
2. A short real scenario and the behavior/contracts to preserve.
3. Numbered implementation steps: why, exact target, complete code example,
   reader check, and test guidance.
4. Each capability checkpoint: before/after behavior, runnable check and expected
   result, and what the next checkpoint reuses (or the final delivered capability).
   State actual verification limits separately from expected reader outcomes.
5. The next agreed capability, without pulling it into this version.

Use natural explanatory paragraphs and ordered code blocks, not repeated
internal compliance forms. Explain decisions and tricky mechanics; do not
narrate every assignment. Keep test guidance concise and prose-based.
Do not add an isolated final code dump that introduces unexplained behavior.
Keep execution logs, step statuses, audit fields, and detailed review history
in local records. Give a concise verification summary and record path in the
handoff. Keep reader-facing checks and essential design reasons in the lesson;
it must remain understandable without the records.

## Common Rationalizations

| Rationalization | Reality |
| --- | --- |
| "The reader can fill in the Service." | Missing required integration means the tutorial has not delivered its promise. |
| "Full code means replacing every large file." | Full new files or full changed methods plus exact import/caller edits are sufficient; preserve unrelated code. |
| "Runnable means standalone." | Runnable can mean inside the actual project's runtime and test harness. |
| "The final code passed, so the tutorial passed." | Replay the documented edits; hidden fixes cannot count as evidence. |
| "Only the schema is ready, so defer the route." | A schema-only checkpoint needs an upfront boundary; do not redefine a promised endpoint as finished. |

## Red Flags

- `pass`, ellipses, undefined helpers, or omitted caller changes in required code.
- A required implementation step has only prose or a fragment the reader
  cannot apply without guessing surrounding code.
- Test source code takes more space than the feature code even though the user
  asked for test guidance only.
- "Put this somewhere in a Service" without a real file and method.
- A function-body fragment is not identified as a patch inside a named method.
- An ORM-only change is described as a completed database migration.
- Teaching code uses different auth, tables, dialect, or API envelopes from source.
- Success claims come only from mocked repositories or JSON parsing.
- The reader must guess which of several competing final snippets to keep.
- The only check is a command targeting tests the reader has not been given.
- Setup or prose-only agreement is labeled a completed implementation version.

## Verification

- [ ] The baseline and agreed version are explicit and source-backed.
- [ ] Every code block is an applicable change or clearly labeled illustration.
- [ ] Each required implementation step has an ordered, complete code example
      with a real path, symbol, imports, and application point.
- [ ] Every changed/new symbol, import, caller, and test fixture is accounted for.
- [ ] Each step explains a real gap, changes it, and checks the new behavior.
- [ ] Each capability checkpoint has a runnable reader check; broader test
      guidance names locations, inputs, expected results, and boundaries.
- [ ] The complete entrypoint-to-output path exists for the promised scope.
- [ ] Boundary/failure tests cover relevant invariants, not only the happy path.
- [ ] Replayed tutorial changes match the verified implementation.
- [ ] Actual results are distinguished from planned or blocked checks.
- [ ] Production worktree, shared data, and external services were not mutated.
- [ ] Progress is current, evidence is not stale, and local records are unstaged.
- [ ] The lesson stands alone without execution bookkeeping or `.agent-runs/`.

## Guardrails

- Write only tutorial documents, disposable verification artifacts, local task
  records, and their necessary local Git exclusion entry by default.
- Production edits, external sends, shared database writes, commits, and pushes
  require the appropriate explicit request; tutorial creation does not authorize them.
- Do not add adapters, optional configuration, or alternate interfaces without
  a requirement and approval where applicable.
- Never embed credentials or use production connection settings for tests.
- Preserve user changes and clean up only artifacts created by this task.
- Do not require reference-core or from-scratch installation to use this skill.
