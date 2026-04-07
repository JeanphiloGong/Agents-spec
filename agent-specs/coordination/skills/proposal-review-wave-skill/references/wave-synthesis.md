# Wave Synthesis

Use this file after lens selection to keep the review structured and comparable
across runs.

## Per-Lens Return Schema

Each selected lens should return exactly:

- `working_view`: current leaning, not a final vote
- `reasoning_path`: how this lens interprets the proposal
- `key_risks`: top 3 risks
- `promising_angles`: top 1 to 3 promising directions
- `required_conditions`: must-have preconditions for a safe path
- `assumptions_or_unknowns`: what this lens cannot safely infer
- `control_map_flags`: `Human-Owned|AI-Assist|AI-Auto`

## Discussion Map

Aggregate the wave into these synthesis buckets:

- `shared_ground`: where multiple lenses align
- `disagreement_clusters`: where the lenses disagree materially
- `assumptions_and_unknowns`: missing facts that reduce confidence
- `decision_shaping_tensions`: tradeoffs that should shape the next decision
- `confidence_notes`: why confidence is strong, weak, or conditional

## Option Shapes

Draft exactly three shapes:

- strongest case for progress
- strongest case for delay or rejection
- conditional middle path

If helpful, add `what_would_change_the_discussion` to name the smallest missing
input that could shift the current lean.

## Six-Dimension Score

Use this score as support material, not as the decision itself.

Score each dimension `1-5`:

- User Value
- Implementation Complexity
- Risk
- Observability
- Rollback Readiness
- Delivery Cost

## Closure Gate

Close the wave only when all of these are true:

1. Core conflicts are identified.
2. Key assumptions and unknowns are explicit.
3. The next-wave input checklist is concrete.

Direction selection is optional. If the lenses do not naturally converge, close
with an open discussion state instead of forcing a verdict.

## Control Map

For each key decision, mark one:

- `Human-Owned`: human decides and approves
- `AI-Assist`: AI drafts and human approves
- `AI-Auto`: AI can propose directly and human spot-checks

Default to `Human-Owned` when the discussion touches:

- security, auth, or permissions
- data model, migration, backfill, or deletion
- public contract, API, or event schema
- reliability guarantees such as idempotency, retry, or ordering
