# Topic Concurrency

## Six Active Topics per Account

A topic is one user-defined content task or team-owned direction, such as an AI
coding tip or a startup case study. The default scheduling allowance is six
active topics per account, including research, drafting, independent
generation jobs, and waiting for their results. It is not six writers in one
tab, a fixed number of teams, or permission to submit duplicate posts.

This topic allowance is separate from a platform-specific publish preflight
slot pool. A topic can remain in research or review without claiming a publish
slot; a ready topic claims a preflight slot only when it begins browser
preparation. The platform skill defines that slot pool and may use a different
capacity.

The coordinating agent tracks the account, topic, owner, phase, and observed
target IDs in its task record. Admit a seventh topic only after an existing
topic finishes and releases its task pages and leases, or completes an explicit
handoff. Do not count a still-running generation as a free slot. Reuse each
topic's working page where possible instead of creating a tab per search.

The lease scripts enforce target and resource exclusivity; they do not count
topics or implement a configurable account semaphore. Use one coordinator for
an account's task record so independent agents do not each assume they have
six additional slots. Another profile or browser does not reset the allowance.

## Keep Submission Locks Short

Separate the tab's lifetime from an account submission. Hold its tab lease
throughout the topic's browser work. Hold an account resource such as
`social:x:ACCOUNT_ID` only while submitting and verifying the publication.
Research and drafting on other leased pages can continue in parallel.

The current connection takes resources at acquisition time; it has no dynamic
resource-claim method. For a topic that already owns its page, use the existing
`acquireLease` API for a separate account submission lease. Omit `targetId`
on that extra lease so it does not conflict with the topic's own target claim:

```javascript
const { acquireLease } = await import(
  `${process.env.HOME}/.codex/skills/linux-browser-control/scripts/lease.mjs`
);
const submission = acquireLease({
  endpoint: connection.profile.cdp_endpoint,
  instance: connection.profile.name,
  browserId: connection.version.browserId,
  owner: topicOwner,
  task: `${topicId}-submit`,
  scope: "tab",
  resources: [accountResource],
});
try {
  connection.lease.assertOwned();
  submission.assertOwned();
  // Submit through connection.page and verify the visible result.
} finally {
  submission.release();
}
```

Use the same verified account resource identifier across topics and profiles.
If it is occupied, keep the topic queued for submission and report the holder;
do not use numbered account resources to bypass the conflict. Check both leases
before each submission action. Always close the original connection in the
topic's outer `finally` after its work finishes.

For independent generation requests, release the account submission resource
after visible acceptance only if the site's behavior allows separate jobs to
run together; retain each page's lease while its job runs. For public posts,
verify the resulting post before release. An ambiguous result requires
reconciliation before retrying, rather than another click on Submit.

The six-topic allowance does not override the platform's own concurrency or
rate limits. Respect a lower limit when the service reports one. Browser-wide
login operations and shared-document editing keep their existing exclusive
lease rules; they are not shortened to the submission interval.

## Scenario Checks

| State | Expected decision |
| --- | --- |
| Six topics research or draft on distinct tabs | Allow parallel work with distinct owners and target leases. |
| A seventh topic is ready to start | Queue it in the account's coordinating task record. |
| Several user-defined teams share the account | Treat each team's active topic as one topic allowance; do not invent a fixed team count. |
| One topic is submitting a post | Hold the account resource; other topics may continue research. |
| Another topic is ready to publish | Wait for the same account resource rather than creating a numbered lock. |
| An independent image job was accepted | Keep its topic slot and page lease until completion; release the submission resource when allowed. |
| A topic finishes | Save results, close temporary pages, release leases, then admit a waiting topic. |
