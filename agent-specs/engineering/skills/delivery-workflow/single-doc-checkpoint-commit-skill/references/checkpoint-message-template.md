# Checkpoint Message Template

Use this template for single-document learning checkpoint commits.

## Tutorial Checkpoint

```text
docs(tutorial): freeze <checkpoint-name>

Pressure:
- <the small reader-visible pressure this checkpoint answers>

Naive:
- <what the previous document version or mental model could do>

Break:
- <what the previous version could not explain, observe, protect, or support>

Change:
- <the one document/tutorial change introduced in this checkpoint>

Check:
- <the assertion, trace, manual read-through, or document check that validates it>

Freeze:
- <the capability now frozen as the baseline for the next checkpoint>

Still lacks:
- <what remains deliberately out of scope>

Next:
- <the next checkpoint direction>
```

## Learning Asset Checkpoint

Use `docs(asset)` when the target is a learning asset document but not a
tutorial.

```text
docs(asset): freeze <asset-checkpoint-name>

Pressure:
- ...

Naive:
- ...

Break:
- ...

Change:
- ...

Check:
- ...

Freeze:
- ...

Still lacks:
- ...

Next:
- ...
```

## Example

```text
docs(tutorial): freeze v2 workflow resolution

Pressure:
- A caller should trigger one named pipeline mode instead of hand-coding steps.

Naive:
- The document previously taught direct `prepare(); enrich()` calls.

Break:
- The caller still owned step-order knowledge and there was no reusable plan.

Change:
- Add mode-to-workflow resolution as the v2 checkpoint.

Check:
- `standard` resolves to `["prepare", "enrich"]`; unknown mode fails early.

Freeze:
- v2 now teaches external intent to internal workflow list.

Still lacks:
- Handler execution.
- Run and step records.

Next:
- Teach resolving workflow names into executable handlers.
```
