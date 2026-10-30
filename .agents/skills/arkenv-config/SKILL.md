---
name: arkenv-config
description: Implement or review environment validation and NestJS configuration using arkenv in my-ecm, including defaults, camelCase mapping, configuration consumers, and root environment tooling.
---

# ArkEnv configuration in my-ecm

Inspect the relevant configuration factory, its registration and consumers, the root environment tooling, and service onboarding before changing configuration. Apply `design-principles` and preserve existing behavior unless the task requires a change.

- **Validation and registration:** Follow existing `registerAs` factories that call `arkenv` with an ArkType-compatible definition and expose a `ConfigType<typeof ...>` type. Validate host, port, required values, and domain-specific formats according to their actual requirements; reuse shared schemas when they express the same constraint.
- **Environment and output names:** Keep environment variable names in their existing uppercase form and return camelCase configuration properties. Update all consumers when changing the returned shape. `appConfig` maps `APP_HOST` to `appHost`; database configuration maps `DB_DATABASE` to `dbName`.
- **Defaults:** Preserve the intended parsed type and behavior. Use inline defaults for inline definitions, such as `"boolean = false"`, and `.default(...)` for separately defined schemas, such as `DurationString.default("15m")`. Check consumers before changing whether a value is required or its default.
- **Configuration variants:** Represent mutually exclusive choices with a discriminated schema union when appropriate. Email config uses `SmtpConfig.or(SesConfig)` and maps each branch to camelCase; check every variant and its consumers when adding or changing a transport.
- **Environment loading:** Verify when and where environment variables are loaded before arkenv validation runs. The root `dev` script loads `.env` through `dotenv`; the MikroORM config loads its environment for ORM tooling. Follow the actual entry point rather than assuming a service-local start workflow.
- **Root environment and onboarding:** When adding or renaming a root environment variable, update the relevant example, schema, mappings, consumers, and `turbo.json` `globalEnv` as applicable. Inspect `scripts/onboard:service.ts` for generated or cross-service configuration changes. Use root scripts, including `check:env`, to verify relevant consistency without exposing secret values.

When reviewing, trace the validated value through its configuration provider to each consumer. Distinguish source and static checks from successful startup or runtime verification.
