# Commit Message Standard

Use this reference when writing or reviewing the actual commit message.

## Table of Contents

- [Task Model](#task-model)
- [Evidence Card](#evidence-card)
- [Commit Message Format](#commit-message-format)
- [Subject Rules](#subject-rules)
- [Information Ownership](#information-ownership)
  - [Conditional Impact And Verification](#conditional-impact-and-verification)
- [Body Quality Bar](#body-quality-bar)
- [Type Selection](#type-selection)
- [Full Examples](#full-examples)
- [Anti-Patterns](#anti-patterns)
- [Verification](#verification)

## Task Model

A commit message is the shortest complete account of one staged change for a
future engineer reading history. It must identify the observable change,
explain the reason, and preserve only useful boundary, proof, and traceability
evidence.

The task is not to praise the change, summarize the author's intention, or
turn the diff into polished prose. Phrases such as "clarify responsibility,"
"improve consistency," and "strengthen handling" describe desired qualities;
they do not tell the reader what the commit did.

The required `Why / What` core forms the durable story. Conditional sections
extend it only when they add independent information:

```text
previous problem -> concrete change [-> independent effect] [-> evidence] [-> reference]
       Why              What              [Impact]       [Verification]   [Refs]
```

Keep the two-section core visible. Improve readability by selecting one useful
fact for each rendered field, not by filling every conditional section or
rendering the entire evidence card.

## Evidence Card

Build this private evidence card before drafting the message:

```text
primary_action: <rename | extract | move | remove | add | prevent | ...>
primary_object: <behavior, symbol, document, contract, or state transition>
before: <specific previous behavior, ambiguity, failure, or request>
after: <specific resulting behavior or structure>
impact_boundary: <independent effect or preserved boundary; omit when none>
verification_boundary:
  suite_outcome: <relevant suite name, total, and result when useful>
  condition_result: <checked condition and observed result>
execution_checks: <commands that ran, results, or skipped-check reason>
refs: <verified issue/spec/incident/PR; omit this key when none applies>
```

`verification_boundary` supplies `Verification` only when it contains durable
result evidence. `execution_checks` belongs in CI or the execution report. Do
not turn it into `PASS: <command>` commit prose.

Use these sources in this order:

1. The staged diff is authoritative for the action, object, and contained
   behavior.
2. The issue or user request supplies the trigger and intended outcome.
3. Executed checks establish verified behavior; they do not justify claims they
   do not exercise.
4. Recent repository history supplies concrete verbs, behavior phrasing, and
   project vocabulary when those patterns are consistent.
5. Repository conventions determine type, scope, and reference syntax.

Do not draft the subject until `primary_action` and `primary_object` are both
known. Inspect the diff again when either field would otherwise contain an
intent word such as "clarify," "optimize," or "improve."

After gathering evidence, select only what a future reader needs. Evidence can
remain unrendered when the diff already carries it and omitting it does not
make the message ambiguous.

Default to omitting internal fields, files, helper names, call-site counts, and
private types because the diff already records them. Keep an identifier only
when it is a public contract, the direct object of a rename or move, or needed
to distinguish a state transition such as `error` to `completed`. Never invent
a symbol name that is not in the staged diff.

## Commit Message Format

Use this exact required core:

```text
<type>(optional-scope): <subject>

Why:
- ...

What:
- ...
```

Append supported conditional sections in this order:

```text
Impact:
- ...

Verification:
- ...

Refs:
- ...
```

`Why` and `What` are mandatory and appear exactly once. `Impact`,
`Verification`, and `Refs` are conditional and appear at most once. Omit a
conditional section when it has no independent evidence; never render an empty
section or fill it with `n/a`, `none`, or another placeholder. When several
verification results matter, list them as bullets under the single
`Verification` section. Use one bullet with one sentence in every rendered
section by default. Add another bullet only for a separate fact required to
understand the commit.

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
| `Impact` (conditional) | independent post-merge effects, compatibility, and explicitly preserved boundaries | restated `What`, test commands, verification steps |
| `Verification` (conditional) | useful suite outcomes or checked conditions paired with observed results | bare coverage inventories, raw commands, `PASS:` prefixes, repeated `Impact` |
| `Refs` (conditional) | verified traceability | placeholders, extra explanation |
| Execution report | raw commands, detailed pass or fail output, skipped checks | behavior rationale |

State each supporting detail once. Repeat the core behavior only when needed to
connect `Why` and `What`; do not repeat call-site counts, full state tables,
function ownership, or assertions merely because they are true.

### Conditional Impact And Verification

`Impact` states an independent consequence of merging the change.
`Verification` states durable evidence used to check the change. Neither
section exists merely to complete the template.

Apply these rendering checks:

1. Hide `Impact`. If `What` loses no independent consequence, omit `Impact`.
2. Hide `Verification`. If no useful suite outcome, checked condition, or
   observed result disappears, omit `Verification`.
3. If one sentence can fill both sections unchanged, keep the consequence in
   `Impact` and the evidence in `Verification`, or omit the redundant section.

For documentation and configuration changes, use the same boundary. `Impact`
states what readers, operators, or consumers can rely on after the change.
`Verification` records only an actual consistency, completeness, parsing,
rendering, or other relevant result. Never invent a runtime behavior check for
a static change.

Example for a documented six-digit business-code contract:

| Section | Example |
|---|---|
| `Impact` | `调用方可以按统一的六位数字格式处理业务码；现有请求字段和响应结构不变。` |
| `Verification` | `公开契约与联调说明对合法六位码、位数错误和非数字字符给出一致的接受或拒绝结果。` |

A concise suite outcome and a measured representative sample are also valid:

```text
Verification:
- 源文档服务、响应矩阵抽取和源表物化的 50 项相关测试全部通过。
- 真实公告转换后，Markdown 从 518,705 字符降至 4,828 字符，且不再包含 data:image 或 base64,。
```

Write natural project language:

- Reuse terms already present in the code, issue, or repository vocabulary.
- Keep code values such as `completed` unchanged when no established Chinese
  term exists.
- Do not coin noun stacks such as "完成态缓存恢复函数" or "完成态边界".
- Prefer a plain verb phrase such as "重命名缓存恢复函数" over a more compressed
  but less natural technical label.
- Do not hard-wrap inside an identifier. Wrap surrounding prose or omit a long
  identifier when the established project noun is sufficient.
- Use repository history to learn sentence style, not to copy its issue IDs,
  generated trailers, internal names, or section layout.

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
- Describe the resulting behavior before implementation mechanics. Use a real
  function name, state value, or contract term only when it carries meaning
  under the internal-detail rule.
- When both rename identifiers are long, name only the new identifier; the diff
  already records the old one.
- Every bullet must be supported by the staged diff or verification evidence.
- Leave suite outcomes and observed results to `Verification` unless tests are
  the primary change.
- Do not report how many call sites were updated; a rename already implies
  updating its callers.

### Impact

- Omit this section when `What` already carries the full result and no separate
  consequence or preserved boundary remains.
- State the observable user, interface, runtime, release, or maintenance
  boundary.
- For a behavior-preserving refactor, identify the behavior that remains
  unchanged instead of claiming only that code is "clearer."
- Do not claim that a change is safer, faster, clearer, or more reliable unless
  supplied evidence demonstrates that result.
- State migration, rollout, or compatibility consequences when they exist.
- For a local rename, one short behavior-preservation statement is enough. Do
  not enumerate every state returned by the function.
- Do not mention the checked scenario or verification method; those belong in
  `Verification`.

### Verification Section

- Render this section only for actual, useful result evidence.
- Record either a concise relevant suite outcome, including its total when
  useful, or a checked condition paired with the observed result.
- Reject noun lists such as "cover images, cache invalidation, extraction, and
  materialization boundaries." They name areas, not verified outcomes.
- Do not list raw commands, `PASS:` prefixes, test file names, or "added a
  regression test." Those describe execution or the diff, not durable evidence.
- If verification did not run or produced no useful result, omit this section
  and keep the operational reason in the execution report.
- Do not claim that one check guarantees behavior beyond its exercised scenario.
- Do not repeat the `Impact` consequence without adding a suite outcome or
  checked condition and observed result.
- For documentation or configuration changes, name the static check that
  actually established consistency or completeness; do not claim runtime
  behavior was tested.

### Refs

- Record verified decision and context references, not an attachment list.
- If `issue-gate-skill` returned a `refs_line`, use it directly as the bullet
  content unless repository policy requires another representation.
- Omit the entire `Refs` section when no canonical issue, spec, incident, or PR
  applies and repository policy does not require one.
- If repository policy requires traceability but no verified reference exists,
  block the commit instead of using a placeholder.
- Never use `n/a`, `none`, an empty bullet, or similar filler.
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

Verification:
- 空矩阵缓存仍恢复为 completed，缓存缺失仍返回 None。

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

Verification:
- 空矩阵缓存恢复为 completed，不再进入抽取失败结果。

Refs:
- ISSUE: #168
```

### Minimal Documentation Change

```text
docs(onboarding): 补充本地启动所需环境变量

Why:
- 启动命令已经读取 CACHE_URL，但入门文档没有说明该变量。

What:
- 在本地环境变量表中补充 CACHE_URL 的用途和示例值。
```

### Repository-Language Contrasts

The following scenarios are sanitized from recurring language patterns in a
mature repository history. They teach wording only; this skill keeps its own
required `Why / What` core and conditional section rules.

| Section | Avoid | Prefer |
|---|---|---|
| `Why` | `The metadata sources need better consistency.` | `A saved working directory can become stale after thread metadata changes, so reads and lists report different locations.` |
| `What` | `Update the state overlay and recompute internal metadata.` | `Prefer the persisted working directory when it belongs to the requested thread, while retaining the saved fallback for older records.` |
| `Impact` | `This improves thread reliability.` | `Thread reads and lists now agree on the saved location; older records without one keep their previous behavior.` |
| `Verification` | `PASS: cargo test -p core thread_read` | `Stale and empty saved locations select the expected value, while a resumed thread still uses its requested live location.` |
| `Verification` | `Add regression coverage for path handling.` | `Safe path forms remain allowed, encoded traversal is rejected, and ambiguous hosts require inspection.` |

Both preferred `Verification` examples name checked conditions and observed
results. A `Cover ...` phrase followed only by a list is invalid even when
`What` already states the intended behavior.

### Complete Behavior-First Example

```text
fix(proxy): reject ambiguous paths before authorization

Why:
- Authorization runs before upstream parsing, so a path that normalizes to
  another resource could match the wrong allowlist entry.

What:
- Reject traversal, malformed encoding, and encoded separators before matching
  the request against allowed paths.

Impact:
- An allowed path cannot be reinterpreted as another resource; ordinary safe
  paths keep their previous behavior.

Verification:
- Safe paths remain allowed, while ambiguous paths are rejected before they can
  reach another resource.

Refs:
- ISSUE: #123
```

This message uses internal concepts only where they explain the authorization
boundary. Parser helpers, changed files, assertions, and commands stay in the
diff or execution report.

### Overloaded Version of the Same Change

```text
fix(proxy): harden authorization consistency

Why:
- Path validation needed to be more robust.

What:
- Update parse_hook_path, normalize_percent_encoding, and three proxy callers.

Impact:
- Authorization is safer and more reliable.

Verification:
- PASS: cargo test -p network-proxy authorization

Refs:
- ISSUE: #123
```

The subject states a quality, `Why` is generic, `What` narrates the diff,
`Impact` is unsupported, and `Verification` is a raw execution log. Optional
sections do not make the behavior transition clearer.

## Anti-Patterns

| Traceability condition | Avoid | Required behavior |
|---|---|---|
| Optional and no verified reference exists. | Append `Refs:` with `n/a`, `none`, or an empty bullet. | Omit the entire `Refs` section. |
| Required and no verified reference exists. | Use a placeholder so the commit can continue. | Block the commit and report the missing traceability. |

| Verification evidence | Avoid | Required behavior |
|---|---|---|
| Results exist for converted images and stale caches, but other areas have no recorded outcome. | `覆盖内嵌和链接图片、旧缓存失效、真实公告转换、响应矩阵抽取及源表物化边界。` | State that converted images remain accessible and stale caches regenerate instead of reusing old results; omit the other claims and keep missing-check reasons in the execution report. |

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
| `Why` | `空矩阵也是有效缓存结果，需要用测试固定其完成态边界，避免后续重新引入失败状态判断。` | `原名称暗示会恢复所有抽取状态，实际只处理 completed 缓存结果。` |
| `What` | `同步两处工作流调用，并验证 completed、100% 且无错误。` | State the rename once; report the result under `Verification`. |
| `Impact` | `成功和空矩阵返回 completed，缺失缓存返回 None；运行时抽取失败仍写入 error。` | `缓存恢复和响应检查行为不变。` |
| `Verification` | `PASS: pytest ...` | `空矩阵缓存仍恢复为 completed，缓存缺失仍返回 None。` |
| `Verification` | `增加空矩阵回归测试。` | `空矩阵缓存恢复为 completed，不再进入抽取失败结果。` |

## Verification

Before accepting a message, confirm:

- [ ] The staged diff supports the selected type and scope.
- [ ] The subject contains a concrete action and real object.
- [ ] The subject passes all four reader checks.
- [ ] The message contains exactly one `Why` and `What`; conditional `Impact`,
      `Verification`, and `Refs` appear at most once in that order.
- [ ] `Why` names the previous problem or trigger.
- [ ] `What` names the actual behavior or structural change.
- [ ] `Impact`, when present, adds an independent observable consequence or
      precisely preserved boundary beyond `What`.
- [ ] `Verification`, when present, records an actual suite outcome or checked
      condition with an observed result.
- [ ] Documentation and configuration changes report only checks that actually
      ran and do not invent runtime behavior verification.
- [ ] Raw commands, `PASS:` markers, and skipped-check details stay in the
      execution report rather than the commit message.
- [ ] `Refs` appears after the other rendered conditional sections only when it
      contains verified traceability; otherwise it is absent.
- [ ] `Why -> What` reads as one causal chain and each conditional section
      extends it with independent information.
- [ ] Each supporting detail appears in its owning location only.
- [ ] Every rendered section has one bullet unless another independent fact is
      required.
- [ ] The message uses established project terms and no coined noun stack.
- [ ] Internal identifiers appear only when they carry public contract,
      change-object, or state-transition meaning.
- [ ] No generic benefit, vague intent phrase, invented identifier, or
      unsupported impact remains.
