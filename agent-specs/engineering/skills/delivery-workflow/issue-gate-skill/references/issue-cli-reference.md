# Issue CLI Reference

Use these commands as reference snippets for `check`, `create`, and `link`
flows.

## GitHub CLI (`gh`)

```bash
# list open issues in current repo
gh issue list --state open --limit 20

# search open issues in an explicit repo
gh issue list -R <owner>/<repo> --state open --search "<keyword>" --limit 20

# view a single issue with stable JSON fields
gh issue view <issue_number> --json number,title,state,url

# create issue in current repo
gh issue create --title "<title>" --body "<body>" --label "<label>"

# create issue in an explicit repo
gh issue create -R <owner>/<repo> --title "<title>" --body "<body>" --label "<label>"

# add comment for commit or branch linkage
gh issue comment <issue_number> --body "Linked commit: <sha>"
```

## GitLab CLI (`glab`)

```bash
# list open issues in current repo
glab issue list --per-page 20

# search open issues in an explicit repo
glab issue list -R <group>/<repo> --search "<keyword>" --per-page 20

# view a single issue
glab issue view <issue_number>

# view a single issue in an explicit repo
glab issue view <issue_number> -R <group>/<repo>

# create issue in current repo
glab issue create --title "<title>" --description "<body>" --label "<label>"

# create issue in an explicit repo
glab issue create -R <group>/<repo> --title "<title>" --description "<body>" --label "<label>"

# add comment for commit or branch linkage
glab issue note <issue_number> -m "Linked commit: <sha>"
```

## Repository Selection

```bash
# inspect current remotes
git remote -v

# inspect exact remote URLs
git remote get-url origin
git remote get-url upstream

# gh target repository
gh issue list -R <host/owner/repo>

# glab target repository
glab issue list -R <owner/repo>

# confirm GitHub repo identity from current checkout
gh repo view --json nameWithOwner,url

# confirm GitLab repo identity from current checkout
glab repo view
```

## Automation Notes

- Prefer selecting `gh` or `glab` based on the resolved target repository host,
  not just on which binary happens to be installed.
- When an `upstream` remote exists, resolve whether the issue belongs in
  `origin` or `upstream` before running `issue list` or `issue create`.
- Prefer `gh issue view <issue_number> --json number,title,state,url` in
  automation instead of the default formatted output.
- For GitHub, `gh auth status` is the quickest way to verify that the selected
  host is actually authenticated before create.
- For self-managed GitLab, set `GITLAB_HOST=<gitlab-host[:port]>` before
  running `glab issue ... -R <group>/<repo>` and prefer the host or protocol
  already proven by `glab auth status`.
- `glab` flags vary by version; if `--state` is unsupported, rely on the
  default open-issue listing or use `--closed` / `--all` as supported by the
  installed client.
- If `gh` or `glab` fails because of sandboxed network restrictions, request
  escalation and rerun the same command.
