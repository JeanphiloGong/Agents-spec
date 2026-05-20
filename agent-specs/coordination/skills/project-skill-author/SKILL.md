---
name: project-skill-author
description: v0.1.9 - Author reusable Codex-native skills with development-pack-style operating loops, trigger-quality metadata, misuse defenses, and verification; use when creating or upgrading project skills, onboarding skills, coordination skills, role skills, or reusable skill packages that should ship as native Codex skills.
---

# Project Skill Author

## Overview

Design or upgrade reusable project skills so they behave like executable
operating manuals, not one-off prompts or policy dumps. A good skill tells the
agent when to use it, what loop to follow, how to avoid common failure modes,
and how to verify the result before handing work back.

Default to Codex-native packages. Preserve trigger-quality frontmatter,
`agents/openai.yaml`, progressive disclosure through `references/`, and explicit
verification.

## When to Use

- Creating a reusable project-level skill package.
- Updating an existing skill so it triggers and executes more reliably.
- Turning project, onboarding, coordination, or role guidance into a native
  Codex skill.
- Designing a skill that will be reused across sessions, contributors, or
  teams.
- Adding reviewer or acceptance skills when generation and quality review are
  materially different reusable workflows.

**When NOT to use:** one-off prompts, local task notes, single-use scripts,
pure API integration wrappers, or documentation that does not need agent
execution behavior.

## Core Principles

- Skills are reusable decision systems, not prompt collections.
- Start from real user situations and concrete trigger phrases.
- Put capability and "when to use" signals in frontmatter `description`.
- Make the main body an operating loop the agent can execute.
- Add misuse defenses: common rationalizations, red flags, and verification.
- Keep `SKILL.md` lean; move long reference material into `references/`.
- Prefer one skill by default; split only when workflows or acceptance gates are
  genuinely different.
- Do not invent tools, APIs, metadata fields, or platform capabilities.
- Treat Codex metadata as part of the package contract, not decoration.

## The Skill Authoring Workflow

### Step 1: Understand Real Usage

Collect the concrete situations the skill must handle before drafting structure.

- Identify the project purpose, target users, and primary outcomes.
- Capture at least two realistic trigger prompts when possible.
- Name the current failure mode the skill should prevent.
- Decide whether the user needs creation, upgrade, review, or packaging work.

If the mission is unclear, ask for the smallest missing input that would change
the skill boundary. Do not ask for details that can be inferred from the target
repository or existing skill package.

### Step 2: Set Trigger and Scope

Define the always-loaded trigger layer first.

- Use a lowercase hyphenated `name` under 64 characters.
- Write `description` as: `<version> - <capability>. Use when <situation>. Use when <second situation>.`
- Include user-situation language, not only method names or internal theory.
- State "When to Use" and "When NOT to Use" in the body.
- Keep public boundaries explicit: in scope, out of scope, and escalation
  points.

### Step 3: Design the Operating Loop

Derive the workflow from field practice in the skill's domain.

- Start with an overview that explains the behavior the skill creates.
- Write an operating loop with concrete steps the agent can follow.
- Put decision points where agent behavior commonly branches.
- Prefer action verbs over abstract policies.
- Include examples, command shapes, or templates where they reduce ambiguity.
- Keep `Fixed Defaults` only when they clarify policy; they must not replace
  the operating loop.

### Step 4: Add Misuse Defenses

Prevent predictable weak outputs before they happen.

- Add `Common Rationalizations` as a table: what the agent may be tempted to do
  and why that is wrong.
- Add `Red Flags` for quick review of bad or incomplete skill drafts.
- Add `Verification` checks that prove the skill is triggerable, executable,
  and package-compatible.
- Include a negative test or failure case when the workflow has non-trivial
  risk.

### Step 5: Separate Workflow From References

Use progressive disclosure so the skill stays loadable.

- Keep trigger rules, workflow, output format, verification, and guardrails in
  `SKILL.md`.
- Move long domain libraries, schemas, policy details, examples, and reusable
  templates into `references/` or `assets/`.
- Add `scripts/` only for deterministic repeated operations.
- Keep references one level deep from `SKILL.md`.
- Do not create README, changelog, install notes, or quick references unless
  the user explicitly asks or the runtime requires them.

### Step 6: Add Codex Metadata

For Codex-facing skills, create or update `agents/openai.yaml`.

- Set `interface.display_name` to a clear human-facing title.
- Prefix `interface.short_description` with the same semantic version as
  `SKILL.md`.
- Make `interface.default_prompt` mention the skill by `$skill-name`.
- Add icons, colors, dependencies, or policy fields only when backed by real
  assets or requirements.
- Prefer official scaffolding and validation tools when available; otherwise
  reproduce the same package shape manually and state the fallback.

### Step 7: Validate and Forward-Test

Before shipping the skill, verify both package shape and behavioral usefulness.

- Run the Codex-native compatibility checklist in
  `references/codex-native-authoring.md` for Codex packages.
- Check that the description, "When to Use", workflow, red flags, and
  verification all point to the same purpose.
- Confirm the skill can be applied to at least one realistic trigger prompt.
- For high-reuse or high-freedom skills, forward-test on a representative task
  or create a paired reviewer skill when acceptance is meaningfully distinct.

## Target SKILL.md Body Standard

Default generated or upgraded skills to this development-pack-style structure.
Adapt only when the skill's domain clearly needs a different shape.

```markdown
# <Skill Title>

## Overview
[What behavior this skill creates and why it exists.]

## When to Use
- [Concrete user situation]
- [Concrete task state]

**When NOT to use:** [Clear exclusion cases.]

## The Operating Loop
1. [First executable step]
2. [Second executable step]
3. [Verification or handoff step]

## Decision Points
- If [condition], [action].
- If [risk], [escalation or fallback].

## Common Rationalizations
| Rationalization | Reality |
|---|---|
| "..." | "..." |

## Red Flags
- [Observable sign of misuse or weak output]

## Verification
- [ ] [Concrete check]

## Output Format
[Only when the skill produces structured output.]

## Guardrails
- [Hard safety or scope rule]
```

Optional sections are allowed when they earn their space:

- `Fixed Defaults` for stable policy defaults.
- `Bundled Resources` or `Reference Map` when the package has resources.
- `Examples` when examples materially reduce ambiguity.
- `Role Charter` when the skill defines a long-lived actor.

Do not let optional sections displace the operating loop, misuse defenses, or
verification.

## Codex-Native Defaults

- Default runtime: Codex.
- Default package shape: `SKILL.md` plus `agents/openai.yaml`.
- Frontmatter contains only `name` and `description`.
- Version new skills as `v0.1.0`; bump patch once per completed commit that
  updates the skill.
- Keep `SKILL.md` under roughly 500 lines and under 5k words when feasible.
- Add `references/`, `scripts/`, and `assets/` only when repeated use,
  determinism, or output reuse justifies them.
- Use official Codex scaffold or validation tooling when available:
  `init_skill.py`, `generate_openai_yaml.py`, and `quick_validate.py`.
- If official tooling is unavailable, create the compatible structure manually
  and note the fallback.

## Optional Paired Skill Pattern

- Start with one skill by default.
- Add a paired reviewer skill only when output quality is high freedom, subtle
  misses materially reduce value, and acceptance criteria are reusable.
- Keep one skill when the work is mechanical, format-bound, or easy to judge.
- Add a third shaping or publishing skill only when an already-accepted output
  needs a distinct reusable packaging step.
- Good paired-skill candidates: tutorials, architecture writing, solution
  proposals, prompt or skill design, and complex analysis.
- Weak paired-skill candidates: file renames, frontmatter fills, title
  normalization, fixed-format conversions, and other deterministic transforms.

## Role-Like Skill Standard

When a skill defines a long-lived actor rather than a one-shot helper, include
an AGENTS-style role charter in the package.

Minimum charter sections:

- `Overview`
- `Core Principles`
- `Golden Rules (Why / How / Check)`
- `Mission & Non-Negotiables`
- `Ownership Boundaries`
- `Permission Model`
- `Inputs`
- `Outputs`
- `Execution Rules`
- `Handoff & Escalation`
- `Quality Bar`
- `Done Signal`
- `Risks & Open Questions`

Keep a concise charter in `SKILL.md` when it is central to trigger and
workflow. Move reusable expansion material to
`references/role-charter-template.md`.

## Required Inputs

- Skill name or intended capability.
- Project purpose and target users.
- Primary situations the skill should handle.
- Desired output or workflow outcome.
- Target runtime when it is not Codex.

If inputs are missing, infer from the existing repository or skill package
first. Ask only when the missing answer would change trigger scope, runtime, or
safety boundaries.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The skill just needs a good prompt." | Reusable skills need trigger metadata, an operating loop, failure defenses, and verification. |
| "Defaults and guardrails are enough." | Defaults constrain behavior, but they do not tell the agent what to do next. |
| "This should support every domain." | A generic workflow usually produces generic output. Pick the domains that materially affect execution. |
| "Put every detail in SKILL.md so it is always loaded." | Large bodies dilute the trigger and waste context. Put heavy material in references. |
| "Create a reviewer skill by default." | Paired skills are useful only when generation and acceptance are stable, distinct workflows. |

## Red Flags

- The description names the method but not concrete situations.
- `SKILL.md` has policies but no executable operating loop.
- The generated body template lacks `Common Rationalizations`, `Red Flags`, or
  `Verification`.
- The skill has two competing workflows or output formats.
- Long domain material sits in `SKILL.md` instead of `references/`.
- `agents/openai.yaml` is missing, stale, or version-skewed for a Codex skill.
- Optional `scripts/`, `references/`, or `assets/` exist without a repeated-use
  reason.
- The package invents tools, APIs, metadata fields, or platform behavior.
- Role-like behavior is scattered through prose instead of captured in a
  charter.

## Verification

Before considering a skill package complete, confirm:

- [ ] Frontmatter has only `name` and `description`.
- [ ] `description` contains version, capability, and concrete "when to use"
      signals.
- [ ] The body has `Overview`, `When to Use`, an operating loop, misuse
      defenses, verification, and guardrails.
- [ ] Optional defaults and output formats support the workflow instead of
      replacing it.
- [ ] Long or domain-heavy material is in `references/`, `assets/`, or
      `scripts/` only when justified.
- [ ] Codex-facing skills include `agents/openai.yaml` with matching version,
      display name, short description, and default prompt.
- [ ] References are one level deep from `SKILL.md`.
- [ ] No secrets, invented capabilities, or unsupported metadata are present.
- [ ] Role-like skills include an AGENTS-style charter.
- [ ] At least one realistic trigger prompt can be mapped through the workflow.

## References

- `references/codex-native-authoring.md`
  Codex-native anatomy, metadata rules, official tooling, anti-clutter rules,
  and compatibility validation checklist.
- `references/domain-workflow-library.md`
  Domain workflow library for API, data, AI, security, docs, product, infra,
  compliance, testing, growth, legal, support, observability, accessibility,
  localization, payments, procurement, privacy, incident response,
  architecture, governance, and release management.
- `references/role-charter-template.md`
  Starter template for AGENTS-style role charters inside reusable skills.

## Output Format

```text
## Skill Name and Placement
## Runtime Compatibility
## Trigger and Scope
## Operating Loop Plan
## Package Layout
## Resources
## Metadata Plan
## Misuse Defenses
## Verification Plan
## Open Questions
```

## Guardrails

- Do not include API keys, tokens, or secrets.
- Do not invent endpoints, tools, metadata fields, or runtime behavior.
- Do not ship a Codex-targeted skill without trigger-quality frontmatter.
- Do not omit `agents/openai.yaml` for Codex-facing skills unless the user
  explicitly requests a metadata-free package.
- Do not bury "when to use" only in body text.
- Do not let `Fixed Defaults`, `Output Format`, or role prose replace an
  executable operating loop.
- Do not create auxiliary README, changelog, or install docs by default.
- Do not create paired skills without a distinct reusable acceptance workflow.
