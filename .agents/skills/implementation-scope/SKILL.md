---
name: implementation-scope
description: Implement features, bug fixes, and refactors in small, reviewable scopes, then stop for user review before starting the next scope.
---

# Implementation scope

Implement one small, cohesive scope at a time. Read surrounding code and plan later scopes as needed, but change only the current scope before handing it to the user for review.

## Choose a small scope

Before editing, briefly state the current scope, its intended result, and the files expected to change. Use these approximate reference points:

- About 3 changed files.
- One small NestJS module, such as its controller, service, consumer, and RPC service.
- About 200 changed lines, counting both additions and deletions.

These are alternative guides to review effort, not requirements that must all be met or allowances to fill. Include supporting contracts, module registration, and other required edits when judging the scope. Split a large module or a change that is difficult to review into smaller scopes.

Choose a boundary that leaves the code coherent and can be verified on its own, even when the overall feature needs more scopes. Preserve existing user changes and measure the current scope separately from earlier reviewed work.

If implementation reveals that the scope needs substantial expansion, finish a coherent smaller part where possible and explain the remaining work. Stop for the user's direction before expanding beyond a small scope.

## Hand off for review

After completing the current scope:

1. Run the applicable checks using the repository's existing root scripts and follow its testing rules.
2. Report what changed, the files and approximate diff size, the checks run and their results, and any remaining limitations.
3. Describe the proposed next scope without implementing it.
4. Stop and wait for the user's review and instruction to continue.

Treat review feedback as work on the current scope. Apply requested corrections, verify them, and hand the scope back for review before moving on.

When the user replies `approve` to a scope, stage the changes from that approved scope before beginning the next scope. Inspect the staged and unstaged diffs first; stage only the approved changes, preserving unrelated changes and any existing partial staging. If a file contains mixed changes, stage only the approved hunks. Report what was staged. Approval to stage does not authorize a commit or push.

Do not start the next scope merely because checks pass or the original request covers the whole feature. Continue only when the user authorizes continuation after review.
