---
name: pull-request-workflow
description: Create or update a pull request in my-ecm using the user's staged scope, root validation, and the current workspace.
---

# Pull request workflow

Apply this workflow when the user asks to create a PR, unless they explicitly direct otherwise.

1. Inspect the current branch, staged and unstaged changes, existing PRs, base, and intended scope. Use the current workspace; do not create a worktree. Switch to the requested or appropriate branch while carrying the intended changes and preserving unrelated work.
2. Inspect staged and unstaged changes, respect the user's edits, and stage user and formatter edits alongside the requested changes. Report the resulting scope.
3. Run `bun check:all` from the repository root before committing. It formats and fixes lint, then runs type, environment, and Fallow checks. Inspect the result and stage user and formatter edits.
4. Proceed to commit and push if the entire `bun check:all` succeeds. If it fails, report the failed stage and stop before commit, push, or PR creation. If the user replies `skip` to explicitly bypass that failure, continue the authorized PR workflow and report the failed and unexecuted checks accurately.
5. Commit the staged scope with a conventional commit title of at most 100 characters, inspect the commit and any hook changes, push the branch, then create the PR. If a matching PR already exists, update it as appropriate instead of creating a duplicate. Verify the account, base, head, commit, and final PR state.

Respect explicit instructions about branch, account, scope, review, and draft status. Report validation results accurately and do not claim runtime verification from static checks.
