# Tab Lifecycle and Memory

## Routine Work

1. Choose page lifetime before starting. A page created by
   `connectLinuxBrowser` is temporary: `connection.close()` closes it even if
   it contains unfinished work. A selected existing `targetId` remains open
   when the connection closes. Use an explicitly designated existing page
   when the result must remain visible for a user or later task; the current
   API has no keep-page option for newly created tabs.
2. Reuse the task's own leased page for sequential searches. Save needed
   references before navigating away. Allocate another tab only when the task
   needs parallel work or must preserve the current page state; never reuse a
   sibling target without its lease.
3. Finish or explicitly hand off drafts, generation, uploads, and downloads
   before normal cleanup. On a temporary page, save the result before calling
   `close()`; do not promise that disconnecting will preserve that page.
4. Always use `try/finally` around a connection. After task completion, call
   `connection.close()` promptly rather than leaving a connected Node or REPL
   session idle. Keep the connection and lease only while work is still in
   progress, including an observed wait for generation to finish.
5. Check a fresh tab inventory and lease status after closing. Confirm the
   temporary target and its lease are gone; an existing retained target should
   still be present without this task's lease. Report failures or uncertain
   cleanup rather than claiming success. Closing the last tab may stop Chrome;
   report that result without relaunching it or deleting its persistent profile.

## Cleanup of Retained Pages

Use this workflow when the user requests cleanup or a known task hands back
its completed page for closure. It is not permission to periodically sweep all
unclaimed tabs.

1. Inventory the exact browser and observed targets. Establish which pages are
   in the cleanup scope and which completed task they served. `unclaimed`
   means only that no cooperating agent holds a lease; it says nothing about
   user activity, drafts, or whether results have been saved. Use inventory and
   known task records for this selection; lease a target before inspecting its
   page contents or state.
2. Preserve user-managed, active, and pinned pages unless the user specifically
   selected them for closure. Also preserve pages with drafts, generation,
   uploads, downloads, or an incomplete handoff. If purpose or state cannot be
   established, skip the page. A generic empty-form check cannot prove that
   every application has saved its work.
3. Skip targets with active, unresponsive, unknown, or unresolved leases. Do
   not release or reclaim another controller's lease to enable cleanup.
4. For each approved unclaimed target, acquire its tab lease, assert ownership,
   and recheck identity and task state before `page.close()`. If a competing
   claim wins, skip the target. Always call `connection.close()` in `finally`
   to disconnect and release the cleanup lease. Do not take a browser-wide
   lease merely to bypass occupied tabs.
5. Preserve the final tab during retained-page cleanup unless browser exit is
   already within the user's requested scope. Verify target removal, remaining
   pages, lease release, and desktop focus; report closed and retained targets
   using sanitized inventory metadata.

## Memory Saver and Idle Timeouts

Chrome's [Memory Saver](https://support.google.com/chrome/answer/12929150?hl=en)
can deactivate eligible inactive pages and reload them on access. It keeps
the tab available; it does not close it. Recommend the Balanced setting at
`chrome://settings/performance` as a starting point. Change browser settings
only within the requested scope and with a browser-wide lease.

Drafts, media, downloads, and other activity can prevent deactivation. Debugger
connections can also affect eligibility; verify behavior in the actual CDP
session rather than promising that enabling Memory Saver releases memory.
Disconnect completed tasks promptly.

The bundled scripts do not track last page use or install a scheduler.
`lastHeartbeat` records controller liveness, not user or page activity. A
30-minute threshold is a possible future policy, not an enabled feature.
Timed closure needs an actual activity tracker and scheduler, explicit cleanup
eligibility, and the same lease and unfinished-work checks above. Report those
features as absent until implemented and verified.

## Scenario Checks

| Request or state | Expected decision |
| --- | --- |
| Search several reference posts in sequence | Reuse one task page, save sources, then close the temporary connection. |
| Image generation is still running | Keep the page leased while waiting; save the result before temporary-page cleanup. |
| A result must remain open for the user | Use a designated existing target and disconnect after handoff; report why it remains. |
| An unclaimed page has uncertain state or a draft | Preserve it; absence of a lease is insufficient evidence for closure. |
| A target has an expired heartbeat | Investigate the owner; do not treat expiration as an idle cleanup deadline. |
| Close completed research pages while another agent works | Lease only eligible free targets; leave the other agent's page alone. |
| Enable automatic closure after 30 minutes | Explain the missing tracker and scheduler; do not report documentation as running automation. |
