# Ownership Node Check

Use this reference before choosing path, structure, or create-versus-update.

## Required Questions

- Which system, module, submodule, component, or test-suite owns this
  knowledge?
- Which parent node owns the broader context around it?
- What is the lowest common ancestor of the behavior or change described here?
- Is the candidate node a real code ownership seam, or only a docs grouping
  folder?
- Is this a parent summary or a child detail doc?
- Which existing local docs already live near this node?
- Is the primary subject runtime behavior, or the tests asset that verifies it?

## Rule

Do not decide path or reuse until the ownership node and lowest common
ancestor are explicit.
Do not treat docs-only grouping folders such as `docs/rfcs`, `docs/guides`, or
topic buckets as ownership nodes by default.
