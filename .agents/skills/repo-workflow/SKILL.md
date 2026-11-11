---
name: repo-workflow
description: Work in the my-ecm monorepo using its root scripts, validation, environment checks, service onboarding, entity discovery, and migration workflow.
---

# Repository workflow in my-ecm

Read the applicable `AGENTS.md`, current root `package.json`, and Git status before working. Do not use sub-agents for any task, including research and code review. Respect the user's scope and edits, and stage edits made by the user or formatter. Apply `design-principles` and report what was actually verified.

- **Root scripts:** Run available package scripts from the repository root for Bun monorepo work; do not bypass them by entering an app directory. The root `dev` script is the established development entry point. Inspect scripts and their effects before running them.
- **Dependencies:** If dependencies are missing, try `bun i` from the repository root to install the declared dependencies, then rerun the affected check. Inspect any lockfile changes and preserve unrelated work; report installation or verification failures rather than assuming the environment is complete.
- **Checks:** Always run `bun check:all` from the repository root to verify changes and before every commit. It runs `check:fix`, `check:types`, `check:env`, and `check:fallow` in sequence; `check:fix` can modify files. During code review, `check:*` scripts may modify code automatically, but do not manually modify code. Inspect and report script changes, respect user edits, and stage user and formatter edits when staging is authorized. If a check stops early or reports existing failures, state which steps ran and the evidence for their status. Follow `pull-request-workflow` when the user explicitly says `skip` for a PR check failure.
- **Environment:** `check:env` compares keys found in the root `.env` with `turbo.json` `globalEnv`; it does not prove that values are valid, all required keys exist, or services start. Update relevant examples, configuration consumers, and Turbo declarations when environment changes require them. Do not expose secret values in output.
- **Onboarding:** Use the root `onboard:service` script when the task requires onboarding and inspect its generated files, shared TCP configuration, environment changes, and Turbo entries. Keep generator templates aligned with intentional changes to shared conventions.
- **Discovery and migrations:** Use existing root scripts for entity discovery and ORM-generated migrations; do not create migration files by hand or edit generated discovery output manually. Choose a meaningful migration name when supported and inspect generated SQL, snapshots, and data impact. Run migrations or database-writing commands only when authorized for the target database.
- **Git and hooks:** Inspect staged changes before committing and commit only authorized scope. The current pre-commit hook runs staged formatting and lint fixes, so inspect the resulting staged diff. Do not create branches, commit, push, merge, or rewrite history without user authorization.
- **Verification limits:** Select checks appropriate to the change and applicable instructions. Distinguish formatter, lint, type, Fallow, environment, runtime, database, and end-to-end results; a static check does not prove a live flow works.
