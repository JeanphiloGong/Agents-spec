# Commit Message Standard

Use this reference when writing or reviewing the actual commit message.

## Table of Contents

- [Task Model](#task-model)
- [Evidence Card](#evidence-card)
- [Commit Message Format](#commit-message-format)
- [Subject Rules](#subject-rules)
- [Information Ownership](#information-ownership)
- [Body Quality Bar](#body-quality-bar)
- [Type Selection](#type-selection)
- [Full Examples](#full-examples)
- [Anti-Patterns](#anti-patterns)
- [Verification](#verification)

## Task Model

A commit message is the shortest complete account of one staged change for a
future engineer reading history. It must identify the observable change,
explain the reason, record its boundary and proof, and preserve traceability.

The task is not to praise the change, summarize the author's intention, or
turn the diff into polished prose. Phrases such as "clarify responsibility,"
"improve consistency," and "strengthen handling" describe desired qualities;
they do not tell the reader what the commit did.

The five required sections still form a story:

```text
previous problem -> concrete change -> observable result -> proof -> reference
       Why              What              Impact       Tests      Refs
```

Keep the structure visible. Improve readability by selecting one useful fact
for each field, not by removing fields or rendering the entire evidence card.

## Evidence Card

Build this private evidence card before drafting the message:

```text
primary_action: <rename | extract | move | remove | add | prevent | ...>
primary_object: <behavior, symbol, document, contract, or state transition>
before: <specific previous behavior, ambiguity, failure, or request>
after: <specific resulting behavior or structure>
impact_boundary: <observable effect or behavior explicitly preserved>
tests: <commands or checks that actually ran, with results>
refs: <verified issue/spec/incident/PR, or n/a when allowed>
```

Use these sources in this order:

1. The staged diff is authoritative for the action, object, and contained
   behavior.
2. The issue or user request supplies the trigger and intended outcome.
3. Tests establish verified behavior; they do not justify claims they do not
   exercise.
4. Repository conventions determine type, scope, and reference syntax.

Do not draft the subject until `primary_action` and `primary_object` are both
known. Inspect the diff again when either field would otherwise contain an
intent word such as "clarify," "optimize," or "improve."

After gathering evidence, select only what a future reader needs. Evidence can
remain unrendered when the diff already carries it and omitting it does not
make the message ambiguous.

Use real identifiers and state values only when they improve recognition. Long
identifiers belong in `What` or may stay in the diff when a familiar project
noun is sufficient. Never invent a symbol name that is not in the staged diff.

## Commit Message Format

Use this exact structure:

```text
<type>(optional-scope): <subject>

Why:
- ...

What:
- ...

Impact:
- ...

Tests:
- ...

Refs:
- ...
```

This structure is mandatory. Do not add, omit, rename, or duplicate sections.
When several checks ran, list them as separate bullets under the single
`Tests` section. Use one bullet with one sentence in every section by default.
Add another bullet only for a separate fact required to understand the commit.

## Subject Rules

Write the subject from `primary_action + primary_object`.

- Use a concise, imperative, present-tense subject.
- Name the staged action or corrected behavior, not its intended quality.
- Add a short condition only when it is needed to distinguish the behavior.
- Prefer the shortest established project noun that identifies the object.
- Put a renamed identifier in the subject only when it is short and more
  recognizable than the project noun.
- Keep reasons and consequences out of the subject; put them in `Why` and
  `Impact`.
- Follow the user's language or the repository's recent commit language. Code
  identifiers may remain in their original language.
- Keep the subject under 72 characters when practical; shorten context before
  removing the action or object.

Choose verbs that expose the actual change:

| Type | Prefer concrete verbs | Do not substitute |
|---|---|---|
| `feat` | add, expose, support, enable | improve capability |
| `bugfix` | prevent, reject, preserve, return, mark | fix consistency |
| `hotfix` | restore, stop, disable, roll back | stabilize service |
| `refactor` | rename, extract, move, inline, split, remove | clarify responsibility |
| `docs` | document, correct, add, remove | improve documentation |
| `test` | cover, reproduce, verify | strengthen tests |
| `chore` | bump, remove, regenerate, configure | update maintenance |

Apply these reader checks:

1. After removing the scope, can the reader answer "what did this commit do?"
2. Does the subject contain only the detail needed in `git log --oneline`?
3. Does every important noun use established project language rather than a
   newly translated or compressed domain label?
4. Would replacing the verb with "improve" preserve the same meaning? If yes,
   the subject is still too abstract.

## Information Ownership

Assign each fact to one location before writing:

| Location | Owns | Does not own |
|---|---|---|
| Subject | shortest recognizable action and object | identifiers, reasons, tests, impact details |
| `Why` | one previous problem or trigger | test motivation, future speculation, solution details |
| `What` | one resulting code, behavior, or document change | call-site counts, assertion lists, impact claims |
| `Impact` | one observable effect or preserved boundary | repeated state tables, implementation details |
| `Tests` | checks that ran and their result | why the production change was needed |
| `Refs` | verified traceability | extra explanation |

State each supporting detail once. Repeat the core behavior only when needed to
connect `Why`, `What`, and `Impact`; do not repeat call-site counts, full state
tables, function ownership, or test assertions merely because they are true.

Write natural project language:

- Reuse terms already present in the code, issue, or repository vocabulary.
- Keep code values such as `completed` unchanged when no established Chinese
  term exists.
- Do not coin noun stacks such as "完成态缓存恢复函数" or "完成态边界".
- Prefer a plain verb phrase such as "重命名缓存恢复函数" over a more compressed
  but less natural technical label.
- Do not hard-wrap inside an identifier. Wrap surrounding prose or omit a long
  identifier when the established project noun is sufficient.

## Body Quality Bar

### Why

- State the concrete previous behavior, trigger, or maintenance pressure.
- Explain why the change was necessary, not merely desirable.
- Use domain nouns from the issue or diff instead of generic phrases such as
  "there was confusion" or "consistency needed improvement."
- Do not repeat the subject in past tense.
- Do not explain why a test was added or speculate that it will prevent a
  future regression.

### What

- State the resulting behavior or structural change.
- Use real function names, state values, or contract terms when they make the
  change verifiable and easier to locate.
- When both rename identifiers are long, name only the new identifier; the diff
  already records the old one.
- Every bullet must be supported by the staged diff or tests.
- Leave test additions and assertions to `Tests` unless tests are the primary
  change.
- Do not report how many call sites were updated; a rename already implies
  updating its callers.

### Impact

- State the observable user, interface, runtime, release, or maintenance
  boundary.
- For a behavior-preserving refactor, identify the behavior that remains
  unchanged instead of claiming only that code is "clearer."
- Do not claim that a change is safer, faster, clearer, or more reliable unless
  supplied evidence demonstrates that result.
- State migration, rollout, or compatibility consequences when they exist.
- For a local rename, one short behavior-preservation statement is enough. Do
  not enumerate every state returned by the function.

### Tests

- State what actually ran and whether it passed.
- Put every test, compile command, lint command, manual check, or skipped-test
  reason under the single `Tests` section.
- If tests did not run, use a real reason such as:
  - `not run (docs-only change)`
  - `not run (config-only change)`
  - `not run (blocked: <reason>)`
- Do not use `not requested`.

### Refs

- Record verified decision and context references, not an attachment list.
- If `issue-gate-skill` returned a `refs_line`, use it directly as the bullet
  content unless repository policy requires another representation.
- Use `n/a` only when no canonical issue, spec, incident, or PR applies and
  repository policy permits that fallback.
- Never invent a reference.

## Type Selection

- `feat`: adds a user-facing capability.
- `bugfix`: changes incorrect behavior on the normal release cadence.
- `hotfix`: restores or mitigates urgent production behavior.
- `refactor`: changes code structure without changing runtime behavior.
- `docs`: changes documentation only.
- `test`: changes test coverage without production or documentation changes.
- `chore`: changes tooling, dependencies, generated artifacts, or maintenance
  configuration.

Choose the type from the staged result, not the author's motivation:

- A rename plus a test that records existing behavior is `refactor`.
- A change that makes an empty matrix produce `completed` when it previously
  did not is `bugfix`.
- A test that exposes a defect without changing production behavior is `test`.
- Use `hotfix` only when the evidence establishes urgent production impact.

When the message claims both "behavior is unchanged" and "the incorrect result
is now corrected," stop and inspect the diff. Those claims require different
commit types or a split.

## Full Examples

### Behavior-Preserving Rename

Evidence: the staged production diff only renames
`restore_response_matrix_extract_status_from_cache` to
`restore_completed_response_matrix_status` and updates its callers. The
empty-matrix test records behavior that already passed before the rename.

```text
refactor(response-check): 重命名缓存恢复函数

Why:
- 原名称暗示会恢复所有抽取状态，实际只处理 completed 缓存结果。

What:
- 将缓存恢复函数改名为 restore_completed_response_matrix_status。

Impact:
- 缓存恢复和响应检查行为不变。

Tests:
- PASS: pytest tests/test_response_check.py -k empty_matrix_cache

Refs:
- ISSUE: #168
```

### Behavior Correction

Evidence: the staged production diff changes empty-matrix cache handling from
failure to `completed`.

```text
bugfix(response-check): 将空矩阵缓存恢复为 completed

Why:
- 空矩阵是有效的已完成结果，但缓存恢复路径此前将它当作抽取失败。

What:
- 允许缓存恢复路径接受空矩阵，并返回 completed 状态。

Impact:
- 命中空矩阵缓存的任务不再被错误标记为抽取失败。

Tests:
- PASS: pytest tests/test_response_check.py -k empty_matrix_cache

Refs:
- ISSUE: #168
```

### Documentation Change Without External Reference

```text
docs(onboarding): 补充本地启动所需环境变量

Why:
- 启动命令已经读取 CACHE_URL，但入门文档没有说明该变量。

What:
- 在本地环境变量表中补充 CACHE_URL 的用途和示例值。

Impact:
- 读者可以仅按入门文档完成本地配置；运行时代码不变。

Tests:
- PASS: markdownlint docs/onboarding.md

Refs:
- n/a
```

## Anti-Patterns

| Evidence | Avoid | Prefer |
|---|---|---|
| Rename `restore_response_matrix_extract_status_from_cache`. | `refactor(response-check): 明确已完成缓存恢复职责` | `refactor(response-check): 重命名缓存恢复函数` |
| Rename a cache helper that only handles `completed`. | `refactor(response-check): 重命名完成态缓存恢复函数` | `refactor(response-check): 重命名缓存恢复函数` |
| Empty extraction results must fail validation. | `bugfix(response-check): 修正抽取状态一致性` | `bugfix(response-check): 将空抽取结果标记为检查失败` |
| Later validation overwrites an extraction failure. | `bugfix(response-check): 优化抽取失败处理` | `bugfix(response-check): 保留抽取失败状态` |
| Token validation is duplicated in three handlers. | `refactor(auth): 理清令牌校验边界` | `refactor(auth): 提取重复的令牌校验` |

The preferred wording is valid only when the evidence column matches the
staged change. These examples teach evidence-to-language mapping; they do not
authorize invented facts or identifiers.

For the behavior-preserving rename example, reject this overloaded body shape:

| Section | Avoid | Prefer |
|---|---|---|
| `Why` | `空矩阵也是有效缓存结果，需要用测试固定其完成态边界，避免后续重新引入失败状态判断。` | Omit it; test motivation and speculative regressions do not explain the production rename. |
| `What` | `同步两处工作流调用，并验证 completed、100% 且无错误。` | State the rename once; report the check under `Tests`. |
| `Impact` | `成功和空矩阵返回 completed，缺失缓存返回 None；运行时抽取失败仍写入 error。` | `缓存恢复和响应检查行为不变。` |

## Verification

Before accepting a message, confirm:

- [ ] The staged diff supports the selected type and scope.
- [ ] The subject contains a concrete action and real object.
- [ ] The subject passes all four reader checks.
- [ ] The message contains exactly one `Why`, `What`, `Impact`, `Tests`, and
      `Refs` section in that order.
- [ ] `Why` names the previous problem or trigger.
- [ ] `What` names the actual behavior or structural change.
- [ ] `Impact` names an observable result or precisely preserved boundary.
- [ ] `Tests` reports every relevant check that actually ran, or a real
      operational reason for not running it.
- [ ] `Refs` contains only verified traceability or an allowed `n/a` fallback.
- [ ] `Why -> What -> Impact` reads as one causal chain.
- [ ] Each supporting detail appears in its owning location only.
- [ ] Every section has one bullet unless another independent fact is required.
- [ ] The message uses established project terms and no coined noun stack.
- [ ] No generic benefit, vague intent phrase, invented identifier, or
      unsupported impact remains.
