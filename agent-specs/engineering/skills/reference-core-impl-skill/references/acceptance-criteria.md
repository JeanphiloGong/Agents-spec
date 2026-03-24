# Acceptance Criteria: Reference Core Implementation Skill

## Universal Pass Criteria

- The output contains a runnable or directly testable minimal-complete sample.
- The sample preserves the feature's defining invariant, ordering rule, or state transition.
- The sample is meaningfully smaller and cleaner than the production module or AI draft it abstracts from.
- Deferred production constraints are listed explicitly.
- The output includes a mapping back to the real codebase.
- The next human rewrite step is concrete and actionable.

## Quality Criteria

- **Minimality**: no non-core frameworks or infrastructure remain unless they define the core.
- **Completeness**: at least one end-to-end path works.
- **Faithfulness**: the sample still behaves like the real core, not a toy with different rules.
- **Teachability**: a human could plausibly rederive the sample in one focused sitting.
- **Transferability**: the mapping back to `main` identifies the real modules/boundaries to reintroduce next.

## Failure Conditions

- The output is pseudocode rather than runnable/reference-quality code.
- The sample drops the very invariant that makes the feature hard or interesting.
- The sample keeps too much production ceremony and is no longer minimal.
- The sample has no explicit deferred-constraints list.
- The mapping-back section is vague enough that another engineer could not continue safely.

## Reviewer Challenge Checklist

- What core invariant would be lost if this sample were simplified one more step?
- What production concern was deferred, and was that deferment safe?
- Could a human reimplement this sample without opening the original production module?
- Does the sample prove the real core, or only mimic the happy path?
- Is the mapping back to `main` specific enough to prevent drift?

