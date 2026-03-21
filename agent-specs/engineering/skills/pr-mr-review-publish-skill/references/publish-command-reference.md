# PR/MR Review Publish Command Reference

Use file-backed comment bodies when possible so long review text does not break shell quoting.

## GitHub CLI (`gh`)

Resolve target:

```bash
# list open PRs in current repo
gh pr list --state open --limit 20

# view one PR with stable JSON fields
gh pr view <pr_number> --json number,title,state,url,headRefName,baseRefName

# target another repo explicitly
gh pr view <pr_number> -R <owner>/<repo> --json number,title,state,url
```

Publish review:

```bash
# publish a non-blocking summary review
gh pr review <pr_number> --comment -F <review_file>

# approve
gh pr review <pr_number> --approve -F <review_file>

# request changes
gh pr review <pr_number> --request-changes -F <review_file>

# add a plain discussion comment instead of a formal review
gh pr comment <pr_number> -F <review_file>
```

## GitLab CLI (`glab`)

Resolve target:

```bash
# list open MRs in current repo
glab mr list --per-page 20

# view one MR
glab mr view <mr_number>

# target another repo explicitly
glab mr view <mr_number> -R <group>/<repo>

# search MRs in an explicit repo
glab mr list -R <group>/<repo> --search "<keyword>" --per-page 20
```

Publish review:

```bash
# add a summary review note
glab mr note <mr_number> -m "$(cat <review_file>)"

# approve
glab mr approve <mr_number>

# revoke approval when prior approval must be removed
glab mr revoke <mr_number>
```

## Publishing Notes

- GitHub supports explicit review states through `gh pr review`.
- GitLab CLI does not expose a first-class `request changes` action; use `glab mr note` for blocking feedback and `glab mr revoke` when approval must be removed.
- If sandboxed network access blocks `gh` or `glab`, request escalation and rerun the same command.
- If the operator only wants a draft, stop after generating the review body and do not publish.
