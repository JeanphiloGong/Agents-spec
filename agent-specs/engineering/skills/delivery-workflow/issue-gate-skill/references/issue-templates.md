# Issue Templates

Use this reference when resolving a template family, drafting an issue body,
or validating template-specific required fields.

## Table of Contents

- [Rendering Contract](#rendering-contract)
- [Issue Title Rule](#issue-title-rule)
- [Information Ownership](#information-ownership)
- [Bug or Incident Template](#bug-or-incident-template)
- [Feature or Change Template](#feature-or-change-template)
- [Engineering Child Issue Template](#engineering-child-issue-template)
- [Task or Maintenance Template](#task-or-maintenance-template)
- [Investigation or Spike Template](#investigation-or-spike-template)
- [Examples](#examples)
- [Anti-Patterns](#anti-patterns)
- [Template Validation](#template-validation)
- [Template-to-Command Mapping](#template-to-command-mapping)

## Rendering Contract

These templates are fallback body contracts. A repository-provided canonical
template overrides them when its required fields are explicit.

- Select exactly one template family and render one body schema.
- Render required sections and only those optional sections backed by facts.
- Omit empty optional headings, placeholder bullets, and `n/a` rows.
- Use one short paragraph or one to three facts per section by default.
- Expand only when another fact changes scope, acceptance, risk, or a decision.
- Keep internal gate fields, CLI commands, prefix sources, and warnings outside
  the issue body.
- Use plain headings. Requiredness belongs in validation, not visible labels or
  decorative heading markers.
- Follow the user's language or the repository's established issue language;
  localize headings consistently without changing their semantic ownership.
- Square brackets around an optional template block mark a drafting condition;
  never copy the brackets into a rendered issue.
- Use issue references such as #123 or owner/repo#123 as plain Markdown text so
  they remain clickable.

Completeness means that another person can understand, bound, and accept the
work. It does not mean rendering every field the agent inferred.

## Issue Title Rule

New titles use `<prefix>: <short title>`. Resolve the prefix from `change_type`:

- `feat|integration|workflow|api` => `feat`
- `fix|bugfix|incident` => `bugfix`
- `hotfix` => `hotfix`
- `docs` => `docs`
- `refactor` => `refactor`
- `test` => `test`
- `tooling` => `tooling`
- `config` => `config`
- `chore` => `chore`
- `spike|research|proposal|investigation` => `proposal`

The short title must carry meaning after the prefix is removed:

- bugs: name the failing condition and incorrect result
- features: name the capability or observable outcome being added
- tasks and maintenance: name the concrete action and recognizable object
- investigations: name the decision or uncertainty to resolve

Prefer established repository language. Do not coin compressed domain labels
or use quality-only summaries such as "improve consistency", "clarify
workflow", "optimize handling", or "align behavior".

Examples:

| Evidence | Avoid | Prefer |
|---|---|---|
| Non-trivial builds can skip a code-local skeleton. | `docs: improve workflow clarity` | `docs: require code-local skeletons before non-trivial builds` |
| Tutorial checkpoints can proceed after self-review. | `bugfix: fix tutorial consistency` | `bugfix: require independent review before tutorial checkpoint commits` |
| Empty extraction results pass validation. | `bugfix: align extraction status` | `bugfix: reject empty extraction results` |

Existing issues without a recognized prefix may still be reused. Emit a
warning instead of creating a duplicate.

## Information Ownership

Assign each fact before rendering:

| Section | Owns | Does not own |
|---|---|---|
| Problem or Background | current behavior, trigger, and why it matters | solution steps, acceptance checklist |
| Outcome | externally visible or decision-relevant success state | implementation plan |
| Scope | included work and meaningful exclusions | repeated problem statement |
| Expected and Actual | observed behavioral contrast | speculative root cause |
| Acceptance or Done | observable completion conditions | file-by-file edits or test commands |
| Verification | commands, checks, or review method | another copy of acceptance |
| Risks or Dependencies | real blockers, constraints, or coordination | generic cautions |
| Evidence | logs, screenshots, IDs, or links that exist | empty attachment slots |

State each supporting fact once. Repeat the core behavior only when necessary
to connect the problem, expected outcome, and acceptance criteria.

## Bug or Incident Template

Required semantic fields:

- problem
- reproduction steps or triggering condition
- expected result
- actual result
- fix acceptance

Optional sections, rendered only with evidence:

- impact and severity
- evidence such as logs, screenshots, environment, or sample IDs
- regression scope when it adds more than the acceptance criteria

Canonical body:

```text
## Problem
<what fails, under which condition, and who or what is affected>

## Reproduction
1. <first necessary step>
2. <second necessary step>
3. <observed failure>

## Expected
<expected behavior>

## Actual
<observed behavior>

## Acceptance
- [ ] <observable corrected behavior>
- [ ] <material regression boundary, when needed>

[## Impact]
<only when severity, affected users, or workaround is known>

[## Evidence]
<only existing logs, links, environment facts, or sample identifiers>
```

Do not invent reproduction steps for a non-reproducible incident. Use a
concrete triggering condition and available evidence instead, and rename the
section to `Trigger` when that is more accurate.

## Feature or Change Template

Required semantic fields:

- problem or opportunity
- target outcome
- scope boundary
- acceptance criteria

Optional sections, rendered only when material:

- external contract or user impact
- dependencies or risks
- verification method

Canonical body:

```text
## Problem
<current limitation and why it matters now>

## Outcome
<capability or observable result this work should deliver>

## Scope
- Include: <included delivery boundary>
- Exclude: <one exclusion needed to prevent scope drift>

## Acceptance
- [ ] <observable success condition>
- [ ] <second independent success condition, when needed>

[## External Contract]
<only externally visible input, output, compatibility, or migration behavior>

[## Dependencies]
<only real dependencies, risks, or coordination requirements>

[## Verification]
<only when the verification method adds information beyond acceptance>
```

Keep parent feature issues outcome-facing. Move internal modules, files,
schemas, migration steps, and implementation sequencing to an engineering
child issue when they are needed for execution.

## Engineering Child Issue Template

Required semantic fields:

- parent relationship
- engineering goal
- scope boundary
- acceptance criteria

Optional sections, rendered only when needed:

- affected internal contract
- technical constraints
- migration or rollback steps
- risks or dependencies

Canonical body:

```text
## Parent
- Parent issue: <clickable issue reference>
- Contribution: <which parent outcome this task advances>

## Goal
<one engineering result this child issue must deliver>

## Scope
- Include: <owned execution boundary>
- Exclude: <boundary delegated elsewhere>

## Acceptance
- [ ] <observable or verifiable engineering result>
- [ ] <second independent result, when needed>

[## Constraints]
<only approved internal contracts, dependencies, compatibility, or rollback>

[## Verification]
<checks specific to this engineering task>
```

Do not turn a child issue into a repository-wide implementation plan. Split it
again when it contains independent delivery and rollback units.

## Task or Maintenance Template

Required semantic fields:

- concrete problem or maintenance pressure
- scope
- done criteria
- verification

Optional sections, rendered only when material:

- risk or dependency
- compatibility or rollback consequence
- related issue

Canonical body:

```text
## Problem
<current concrete problem or maintenance pressure>

## Scope
- <primary change>
- <meaningful exclusion, only when needed>

## Done
- [ ] <observable completion condition>
- [ ] <second independent condition, when needed>

## Verification
- <check that proves completion>

[## Risks]
<only real risk, dependency, compatibility, or rollback information>
```

Do not add an `Impact Module` or `Other Information` section by default. Paths,
tools, links, logs, metrics, compatibility, and rollback belong only when they
change execution or review decisions.

## Investigation or Spike Template

Required semantic fields:

- research question
- context and uncertainty
- expected output
- exit condition and scope boundary

Optional sections, rendered only when useful:

- hypotheses or alternatives
- verification method
- next decision

Canonical body:

```text
## Question
<decision or uncertainty this investigation must resolve>

## Context
<why the answer is needed and what is currently unknown>

## Deliverables
- <decision, comparison, prototype, or evidence to produce>

## Exit Criteria
- <what must be known or demonstrated to stop>
- Out of scope: <boundary that prevents open-ended research>

[## Hypotheses]
<only credible alternatives or assumptions to test>

[## Verification]
<how evidence will be collected or compared>
```

## Examples

### Compact Maintenance Issue

```text
docs: require code-local skeletons before non-trivial builds

## Problem
`workflow-build` accepts prose-only skeletons, so an agent can start a
non-trivial implementation before exposing its control flow and invariants in
the code context.

## Scope
- Require a code-local skeleton before non-trivial implementation.
- Keep simple edits exempt and preserve the direct-implementation rule.

## Done
- [ ] The workflow distinguishes code-local skeletons from prose-only exceptions.
- [ ] The default prompt and skill version describe the same requirement.

## Verification
- Check the skill, metadata, and negative fixture for the same skeleton rule.
```

This issue does not need module inventories, compatibility rows, metrics,
rollback text, or an `Other Information` section.

### Detailed Bug Issue

```text
bugfix: require independent review before tutorial checkpoint commits

## Problem
The tutorial build workflow lets the author treat its own self-check as an
acceptance verdict and continue to the next checkpoint.

## Reproduction
1. Build one tutorial step.
2. Run the build skill's self-check.
3. Continue to the next step without an independent review verdict.

## Expected
A checkpoint commit requires an independent review pass.

## Actual
The build agent can continue after its own self-check.

## Acceptance
- [ ] Build stops after one step and requests review.
- [ ] Checkpoint commit requires review-pass evidence.
- [ ] The next step starts only after the review gate passes.
```

This bug is longer because reproduction and expected/actual behavior are
decision-critical, not because every optional template field was rendered.

## Anti-Patterns

| Pattern | Avoid | Prefer |
|---|---|---|
| Repeated background | Three bullets restating the same limitation and risk | One concrete current problem |
| Module inventory | Paths and repositories already obvious from scope | Omit, or keep one affected contract when it changes ownership |
| Empty optional data | `日志：n/a`, `设计稿：n/a`, `指标：n/a` | Omit the entire section |
| Scope as implementation plan | File-by-file edits and speculative helper names | Delivery boundary and meaningful exclusion |
| Acceptance as diff list | "Update file X" and "rename function Y" | Observable behavior or reviewable result |
| Verification duplication | Restate every acceptance checkbox | Name the check or command that proves them |
| Parent over-specification | Internal modules, schemas, and sequencing in a product issue | Keep the parent outcome-facing and create a child issue |

## Template Validation

Before accepting a draft:

- [ ] One template family and one canonical body schema are used.
- [ ] The title prefix matches `change_type`.
- [ ] The short title names a concrete problem or outcome, or a concrete action
      and object.
- [ ] Every required semantic field is supported by user, issue, plan, diff, or
      repository evidence.
- [ ] Every supporting fact appears in one owning section.
- [ ] Acceptance criteria describe observable completion.
- [ ] Verification describes proof rather than repeating acceptance.
- [ ] Empty optional sections, `n/a` rows, and placeholder bullets are absent.
- [ ] Parent issues contain no unnecessary internal implementation detail.
- [ ] Unknown required facts remain TODOs in dry-run and block confirmed
      creation until resolved.

## Template-to-Command Mapping

Render the selected canonical template once into `<issue-body-file>`. GitHub
and GitLab commands consume that same body; command examples must not redefine
the issue schema.

GitHub:

```bash
gh issue create -R <owner>/<repo> \
  --title "<resolved-prefix>: <concrete title>" \
  --body-file <issue-body-file>
```

GitLab:

```bash
glab issue create -R <group>/<repo> \
  --title "<resolved-prefix>: <concrete title>" \
  --description "$(cat <issue-body-file>)"
```

Existing issue commit bridge:

```bash
# GitHub
gh issue comment <issue_number> --body "Linking commit: <sha>"
```

```bash
# GitLab
glab issue note <issue_number> -m "Linking commit: <sha>"
```
