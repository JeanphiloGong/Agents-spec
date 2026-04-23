---
name: project-skill-author
description: v0.1.8 - Create a project-specific Codex skill package with native Codex defaults and master-grade governance; use when building reusable skill folders, onboarding skills, coordination skills, or general project skills that should ship as native Codex skills (not API-only), including optional paired reviewer skills for high-freedom outputs.
---

# Project Skill Author

## Trigger and Scope (Required)

Use this skill when you must design or update a reusable, project-level skill
package for external or cross-team users. This is not for single prompts or
one-off task guides.

In scope: project-wide skills, onboarding skills, coordination skills, and
multi-domain guidance with auditable workflows.
Out of scope: pure API integration skills, internal-only prompts, or
single-use task scripts.

Unless the user explicitly asks for another runtime, treat Codex as the target
runtime and produce a Codex-compatible skill package by default.

## Skill Philosophy (Master-Level)

- Skills are reusable decision systems, not one-off prompts.
- Optimize for stable outputs under changing context.
- Prefer clear constraints over elaborate instructions.
- Minimize cognitive load and context size.
- Always separate workflow from reference material.
- Guard against hallucinated APIs or fake capabilities.
- Treat defaults as policy: safe, conservative, and explicit.
- Treat `name` and `description` as trigger-critical metadata, not decoration.
- Derive domain-specific workflows from expert practice, not generic templates.
- Make the workflow justify itself with evidence and tradeoffs.
- Ensure outputs are actionable without follow-up prompting.
- Avoid shallow coverage; favor depth in the chosen domain.
- When a skill represents a long-lived actor, encode its operating identity with
  an AGENTS-style role charter rather than leaving behavior implicit.
- Prefer decision artifacts that can be audited later.
- Maintain a clear separation between “guidance” and “evidence.”
- Keep `SKILL.md` lean; move long Codex-native rules and domain libraries into
  `references/`.
- Do not default every capability to a creator/reviewer pair.
- Split a capability into paired skills only when production and acceptance are
  materially different phases with stable, reusable quality criteria.

## Optional Paired Skill Pattern

- Start with one skill by default.
- Add a paired reviewer skill when the output is high freedom, quality is not
  obvious at a glance, small misses materially reduce value, or the likely
  failure modes are clear enough to encode as an acceptance gate.
- Keep a single skill when the work is mechanical, format-bound, or easy to
  judge as correct/incorrect without nuanced review.
- Add a third shaping or publishing skill only when already-accepted output
  still needs a distinct packaging step.
- Good candidates for paired skills include tutorials, blog posts, architecture
  writing, prompt or skill design, code explanations, solution proposals, and
  complex analysis.
- Weak candidates for paired skills include file renames, frontmatter fills,
  fixed-format conversions, title normalization, simple routing, and other
  short deterministic transforms.

## Reference Map (Read As Needed)

- `references/codex-native-authoring.md`
  Read when defining package layout, `agents/openai.yaml`, official Codex
  tooling, anti-clutter rules, or final compatibility validation.
- `references/domain-workflow-library.md`
  Read only the domain sections that materially affect the skill being authored.
- `references/role-charter-template.md`
  Read when the skill defines a reusable role, control-plane owner, reviewer,
  operator, or other long-lived actor.

## Codex Native Defaults

- Default runtime: Codex.
- Default package shape: `SKILL.md` plus `agents/openai.yaml`; add
  `references/`, `scripts/`, and `assets/` only when repeated use,
  determinism, or output reuse justifies them.
- Default trigger policy: put both capability and usage context in frontmatter
  `description`, not only in the body.
- Default toolchain: prefer `init_skill.py`, `generate_openai_yaml.py`, and
  `quick_validate.py` when available; otherwise create the same structure
  manually and note the fallback.
- Default context policy: keep `SKILL.md` focused on workflow and guardrails;
  load detailed reference material only as needed.
- Default size target: keep `SKILL.md` under 500 lines and under 5k words when
  feasible; start splitting content into `references/` before crossing that
  threshold.

## Master Workflow (Decision-Grade)

1. Clarify mission and audience.
   - Define project purpose, primary users, and core outcomes.
   - Capture at least 2 concrete usage examples or trigger prompts when
     possible; use them to shape package contents and frontmatter.
   - If the skill is role-like, define the role charter boundary using an
     AGENTS-style structure and 12 role-specific `Why / How / Check` golden
     rules by default.
2. Identify domain scope.
   - Independently infer domains that materially affect usage.
   - Read only the relevant sections from
     `references/domain-workflow-library.md`.
   - Map each domain to a high-signal workflow and explicitly note why it fits.
   - Decide whether the capability should stay single-skill or split into
     production and acceptance skills; only split when the acceptance gate is
     meaningfully different from generation.
3. Define the skill name and placement.
   - Use a lowercase hyphen name under 64 chars.
   - Default placement is `skills/<skill-name>` unless a project path is
     specified.
4. Define runtime compatibility.
   - Default to Codex unless the user explicitly names another runtime.
   - State whether the package must be Codex-native only or cross-runtime.
5. Add versioning to frontmatter.
   - Prefix `description` with a semantic version such as `v0.1.0 - ...`.
   - If no version exists yet, start at `v0.1.0`.
   - Bump the patch version once per completed commit that updates the skill.
6. Design the package structure.
   - Use the Codex-native anatomy in
     `references/codex-native-authoring.md`.
   - Keep `SKILL.md` lean and move detailed material into `references/`.
   - Treat 500 lines and 5k words as the default `SKILL.md` ceiling; split
     detailed rules, schemas, examples, and domain libraries into `references/`
     before the body grows past that range.
   - Create `scripts/`, `references/`, and `assets/` only when they clearly
     reduce repeated reasoning or manual rewriting.
   - For role-like skills, keep the concise charter in `SKILL.md` and use
     `references/role-charter-template.md` when reusable scaffolding helps.
7. Draft `SKILL.md` with explicit triggers and workflow.
   - Use imperative steps.
   - Keep trigger-critical "what/when to use" language in `description`, not
     only in body sections.
   - Make any role charter explicit instead of scattering it across workflow
     prose.
8. Add Codex metadata and toolchain hooks.
   - For Codex targets, generate or update `agents/openai.yaml`.
   - Define `display_name`, `short_description`, and `default_prompt` from the
     actual skill intent rather than placeholders.
   - Prefix `short_description` with the current skill version so the UI
     metadata stays traceable to the package revision.
   - Add icons, brand color, dependencies, or policy flags only when supported
     by real assets or requirements.
   - Prefer official Codex tooling when available.
9. Provide defaults and guardrails.
   - Include safe defaults that reduce user input and prevent misuse.
10. Validate and scope.
   - Ensure no secrets, no fabricated facts, and references one level deep.
   - Run the Codex-native compatibility checklist in
     `references/codex-native-authoring.md` for Codex-targeted skills.
11. Verify domain fitness.
   - Confirm the workflow reflects expert practice in the relevant domains.
12. Produce a fit-for-purpose template.
   - Provide a short, standard, and strict output format.
13. Add verification hooks.
   - Define how correctness and safety are validated for the skill.
   - Forward-test complex or high-reuse skills on realistic tasks when the
     validation cost is justified.

## Design Layers (Use As Needed)

1. **Trigger Layer**: `name` + `description`; clear "when to use" signals.
2. **Workflow Layer**: concise steps with minimal ambiguity.
3. **Codex Adapter Layer**: `agents/openai.yaml` and other runtime-facing metadata.
4. **Reference Layer**: detailed docs in `references/`.
5. **Asset Layer**: templates, examples, or boilerplate in `assets/`.
6. **Script Layer**: deterministic or repeated logic in `scripts/`.

## Required Inputs (Minimal)

- Project name and one-sentence purpose
- Target users (role and context)
- Primary outcomes or workflows
- Delivery environment or distribution target
- Target runtime or agent platform if it is not Codex

## Defaults (Use Unless User Specifies)

- Domain scope: Engineering + Product by default; add Security, Data, AI, or
  other domains only when the task justifies them.
- Runtime target: Codex.
- Skill placement: `skills/<skill-name>` unless a project path is specified.
- Package layout: `SKILL.md` plus `agents/openai.yaml` by default.
- References: add only when details are needed repeatedly.
- Size target: keep `SKILL.md` under 500 lines and under 5k words when
  feasible; split before the body crosses that range.
- Resource selection: start from concrete usage examples and add resource
  folders only when they reduce repeated reasoning or manual rewriting.
- Trigger policy: put "what the skill does" and "when to use it" in
  frontmatter `description`.
- Codex metadata: generate `agents/openai.yaml` by default for Codex-facing
  skills, populating `display_name`, `short_description`, and `default_prompt`.
- Metadata versioning: include the current semantic version in
  `interface.short_description`.
- Initialization mode: use official Codex scaffold tools when available;
  otherwise create a manual-compatible package.
- Validation mode: use official Codex validation tools when available;
  otherwise run the checklist in `references/codex-native-authoring.md`.
- Auxiliary docs: do not create README, changelog, or install docs unless
  explicitly required.
- Role charter: required when the skill defines a reusable long-lived actor.
- Role golden rules: required for role-like skills; default to 12 concise
  `Why / How / Check` rules unless the role is too small to justify that many.
- Pairing mode: default to a single skill; add a reviewer skill only when the
  acceptance phase has distinct quality gates worth reusing across tasks.

## Failure Modes to Avoid

- Overfitting the skill to a single project.
- Mixing workflow and reference content.
- Overly verbose `SKILL.md` that bloats context.
- Letting `SKILL.md` grow past roughly 500 lines or 5k words without splitting
  heavy material into `references/`.
- Missing guardrails that allow unsafe edits.
- Unclear triggers that cause accidental activation.
- Burying "when to use" only in the body instead of frontmatter `description`.
- Omitting or staling `agents/openai.yaml` for a Codex-targeted skill.
- Letting `interface.short_description` drift from the current skill version.
- Shipping a package layout that Codex cannot consume without manual adaptation.
- Adding `scripts/`, `references/`, or `assets/` without a repeated-use case.
- Stuffing long reference content back into `SKILL.md` instead of using
  progressive disclosure.
- Creating auxiliary docs that native Codex skills do not need.
- Filling `openai.yaml` with guessed icons, dependencies, or branding.
- Relying on a single generic workflow for all domains.
- Using “best practices” language without concrete operational steps.
- Missing domain-specific risk controls or validation gates.
- Shipping a skill without verification or example usage.
- Omitting audit trails for high-risk workflows.
- Mechanically creating a reviewer skill for every capability without a real
  acceptance-stage need.
- Forcing one skill to both generate and accept high-freedom output when the
  failure modes are subtle but predictable.

## Output Tiers (Pick One)

**Short**: skill name, placement, minimal workflow, guardrails.  
**Standard**: add required inputs, defaults, and output format.  
**Strict**: add validation rules and risk notes.

## Decision Rubric (Use to Choose a Workflow)

- **Risk**: higher risk requires stricter validation and guardrails.
- **Reuse**: higher reuse favors assets and references.
- **Fragility**: fragile operations favor scripts and low degrees of freedom.
- **Audience**: external users require clearer constraints and examples.
- **Regulatory**: regulated domains require explicit compliance hooks.
- **Learning Value**: prefer workflows that create measurable feedback loops.

## Validation Hooks (Required for Strict)

- Provide a minimal “how to verify” section.
- Include a negative test or failure case when risk is non-trivial.
- Require explicit “unknowns” where facts are missing.
- Require a lightweight evidence note of what was checked, by whom, and when.
- For Codex-targeted skills, run the compatibility checklist in
  `references/codex-native-authoring.md`.
- If `SKILL.md` is unusually long, explain why it could not be split further
  without harming usability.
- For Codex-targeted skills, verify that `interface.short_description` includes
  the current skill version.
- When the skill is role-like, verify that the charter uses an AGENTS-style
  structure and makes mission, boundaries, permission model, execution rules,
  outputs, and escalation conditions explicit.
- When the skill is role-like, verify that the golden rules are role-specific,
  operational, and written in `Why / How / Check` form.

## AGENTS-Style Role Charter Standard (Required For Role-Like Skills)

When a skill defines a long-lived actor rather than a one-shot helper, include
an AGENTS-style role charter as part of the skill package.

The charter should feel structurally similar to a strong project `AGENTS.md`:
boundary-first, measurable, and operational rather than persona-heavy.

Minimum sections:

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

Placement rules:

- Keep the concise charter in `SKILL.md` when the role is central to trigger
  and workflow.
- Move reusable expansions or starter templates into
  `references/role-charter-template.md`.
- Do not bury charter elements only inside examples or optional notes.

## Domain-Specific Variants (Optional)

- API Integration
- Data / Analytics
- DevTools / CLI
- Docs / Onboarding
- Collaboration
- Compliance / Legal
- Security
- Quality / Testing
- Architecture / Systems Design
- Other domains that materially affect the workflow

The agent must decide which domains apply by reasoning from the project and
task context. Use field-proven workflows as the basis and read only the
relevant sections in `references/domain-workflow-library.md`.

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

## SKILL.md Body Template (Use Imperatives)

```markdown
# <Skill Title>

## Workflow
1. ...

## Required Inputs
- ...

## Bundled Resources
- ...

## Output Format
...

## Guardrails
- ...
```

## Output Format (This Skill)

```text
## Skill Name and Placement
## Runtime Compatibility
## Package Layout
## Required Inputs Missing
## Files Created
## Metadata Plan
## Validation Plan
## Open Questions
```

## Guardrails

- Do not include API keys, tokens, or secrets.
- Do not invent endpoints or behaviors; mark unknowns as TODO.
- Do not provide bypass or evasion guidance for security controls.
- Keep the skill self-contained and minimal.
- Do not ship a Codex-targeted skill without trigger-quality frontmatter.
- Do not omit the Codex metadata adapter unless the user explicitly asks for a
  metadata-free package.
