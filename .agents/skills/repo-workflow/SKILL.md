---
name: repo-workflow
description: Work in the my-ecm monorepo using its root scripts, validation, environment checks, service onboarding, entity discovery, and migration workflow.
---

# Repository workflow in my-ecm

Read the applicable `AGENTS.md`, current root `package.json`, and Git status before working. Respect the user's scope and edits, apply `design-principles`, and report what was actually verified.

- **Root scripts:** The root `dev` script is the established development entry point. Inspect scripts and their effects before running them.
- **Dependencies:** If dependencies are missing, try `bun i` from the repository root to install the declared dependencies, then rerun the affected check. Inspect any lockfile changes and preserve unrelated work; report installation or verification failures rather than assuming the environment is complete.
- **Checks:** `check:all` runs `check:fix`, `check:types`, `check:env`, and `check:fallow` in sequence. If a check stops early or reports existing failures, state which steps ran and the evidence for their status. Follow `pull-request-workflow` when the user explicitly says `skip` for a PR check failure.
- **Environment:** `check:env` checks root `.env` keys against Turbo `globalEnv` and forbids shared `APP_NAME` / `APP_PORT` in root and Docker env files. It also requires root `.env.example`, compares each app `.env` with its example (missing keys fail; extra keys warn), and requires Docker env/example key parity. It does not validate values, prove all required keys exist, or prove startup. Update relevant examples, consumers, and Turbo declarations without exposing secrets.
- **Onboarding:** Use the root `onboard:service` script when onboarding is required and inspect generated files, TCP configuration, environment changes, and Turbo entries. Also compare generated Observe registration and TCP host schema with current apps, and check whether per-app Compose files and root includes need updates; the generator does not cover every current convention. Keep templates aligned with intentional changes when that work is in scope.
- **Discovery and migrations:** Inspect generated SQL, snapshots, and data impact. Run migrations or database-writing commands only when authorized for the target database.
- **Git and hooks:** Inspect staged changes before committing and commit only authorized scope. The current pre-commit hook runs staged formatting and lint fixes, so inspect the resulting staged diff. Do not create branches, commit, push, merge, or rewrite history without user authorization.
- **Runtime checks:** `check:all` does not run the local identity E2E suite or `check:auth-store`. `bun run test:e2e` requires a running identity service, test database, and `.env.test.local`; successful login creates refresh tokens. `bun check:auth-store` uses a separate test database, may create that database, and creates, clears, and drops a temporary schema. Inspect current scripts and obtain authorization for database writes against the target environment before running them.
- **Verification limits:** Select checks appropriate to the change and applicable instructions. Distinguish formatter, lint, type, Fallow, environment, runtime, database, and end-to-end results; a static check does not prove a live flow works.
