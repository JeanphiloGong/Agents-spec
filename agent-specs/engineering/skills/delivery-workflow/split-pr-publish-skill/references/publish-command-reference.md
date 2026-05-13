# Split PR Publish Command Reference

Use these commands after the split plan is accepted.

## Git Preparation

Resolve branches and diff:

```bash
git fetch --all --prune
git merge-base <target_branch> <source_branch>
git diff --name-only <target_branch>...<source_branch>
git diff --stat <target_branch>...<source_branch>
```

Create a slice branch:

```bash
git switch <target_branch>
git switch -c split/<slug>
```

Create a stacked slice branch:

```bash
git switch split/<prior-slice>
git switch -c split/<next-slice>
```

Land whole-file slice changes:

```bash
git restore --source <source_branch> -- <path>...
```

For mixed files, stop unless the operator explicitly approved manual hunk work.

Push branch:

```bash
git push -u origin split/<slug>
```

## GitHub CLI (`gh`)

Create a draft PR:

```bash
gh pr create \
  --base <base_branch> \
  --head split/<slug> \
  --title "<title>" \
  --body-file <body_file> \
  --draft
```

Create a ready PR:

```bash
gh pr create \
  --base <base_branch> \
  --head split/<slug> \
  --title "<title>" \
  --body-file <body_file>
```

## GitLab CLI (`glab`)

Create a draft MR:

```bash
glab mr create \
  --source-branch split/<slug> \
  --target-branch <base_branch> \
  --title "<title>" \
  --description "$(cat <body_file>)" \
  --draft
```

Create a ready MR:

```bash
glab mr create \
  --source-branch split/<slug> \
  --target-branch <base_branch> \
  --title "<title>" \
  --description "$(cat <body_file>)"
```

## Publishing Notes

- Use `draft` publication by default for newly split work.
- Publish one PR or MR per accepted slice only after the branch has the
  intended files and commit.
- In stacked mode, use the prior slice branch as the PR or MR base when that
  dependency is real.
- If CLI auth, remote targeting, or network access is blocked, stop and report
  the exact blocker instead of claiming publication succeeded.
