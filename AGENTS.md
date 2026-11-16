# AI Agent Rules

## 1. Coding convention

- Apply Clean Code strictly, without exceptions, when designing, writing, changing, or reviewing code. Follow the `design-principles` skill.

## 2. Database rules

- Do not create migration files directly, use the provided commands/scripts. If the project don't have any commands/scripts, please notice me.

## 3. Agent delegation

- Do not use sub-agents for any task, including research and code review.

## 4. Code review rules

- Do not manually modify code while reviewing. Repository `check:*` scripts may modify code automatically during review; inspect and report their changes.

## 5. Repository workflow

- Run scripts from the repository root. Do not bypass root scripts by changing into an app directory.
- Run `bun check:all` to verify changes and before committing. It can modify files; inspect its changes and report failed or unexecuted checks.
- Use root scripts for entity discovery and migrations; do not manually edit generated discovery output. Inspect generated migrations before use.

## 6. Project conventions

- Scope owned-resource reads and mutations to the authenticated actor or tenant. For service handlers that access the database, use `this.em.transactional(...)` and the callback's entity manager.
- Define contract schemas in `.schema.ts` or `.rpc-schema.ts` files; configuration-specific schemas may stay in their `.config.ts` file. Use named schema-derived types where a boundary needs them, and choose `.infer` or `.inferIn` for that boundary.
- Prefer inference, narrowing, and runtime validation to assertions that hide type errors. Types alone do not validate external input.
- Search for existing behavior before adding helpers. Name code for its domain and behavior, and share logic only when its semantics and ownership fit.
- Preserve external contracts, including HTTP paths, event and command names, environment variables, and database names, unless a change is requested. Do not expose secrets in logs or validation errors.
