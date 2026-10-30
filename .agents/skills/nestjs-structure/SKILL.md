---
name: nestjs-structure
description: Organize and modify NestJS modules, HTTP controllers, providers, and microservice consumers in my-ecm. Use when implementing or reviewing their structure and dependency registration.
---

# NestJS structure in my-ecm

Inspect the feature and its app's `AppModule` before changing structure. Follow `design-principles`: make responsibilities and dependencies clear without adding layers solely for symmetry.

- **Feature modules:** Keep feature-specific controllers, services, policies, and supporting files together under `apps/<service>/src/module/<feature>/`. Register controllers and providers in the feature module; import the modules that supply its dependencies. Export a provider only when another module needs it, as `UserModule` exports `UserService` for `AuthModule`.
- **HTTP controllers:** Keep HTTP routing, request binding, contract schemas, and endpoint metadata in the controller; delegate domain operations to a service. Follow the neighboring controller's `@Endpoint` and parameter schema conventions. Where authorization is required, `ProductController` places `@Can` before `@Endpoint`; public catalog endpoints explicitly use `public: true`.
- **Services and injection:** Keep business orchestration in injectable services and register their dependencies with Nest. Use meaningful short names for injected services when the role is clear, such as `product` or `user`. Preserve transaction and ownership boundaries rather than moving them into controllers.
- **Microservice consumers:** Register consumers as controllers in their feature module. `UserConsumer` in identity handles a command with `@MessagePattern`, validates its payload through `@Payload({ schema: ... })`, and delegates to `UserRpcService`. Notification's consumer handles the `user.created` event with `@EventPattern` and delegates to `EmailService`. Check the active transport and contract before adding a handler.
- **Cross-module reuse:** Import the module that exports a needed provider instead of registering a duplicate provider. `UserRpcService` delegates to the injected `UserService`; keep an RPC-specific service only when it has a useful transport-facing responsibility.
- **App-wide providers:** The current apps register global filters, pipes, and interceptors through `APP_*` providers in their `AppModule`. Check each app's existing registration and transport behavior before adding or changing a global provider; do not assume all apps have the same configuration.
- **Logging:** Where a feature needs a Pino logger, follow existing injection such as `@InjectPinoLogger(EmailService.name)` with `PinoLogger`. Log meaningful context without exposing sensitive data.

Use `nestjs-errors-and-authz` for detailed error and authorization decisions and `microservice-contract` for command and event contract changes when those skills are available. Verify registration, callers, and contract behavior rather than assuming that file placement alone makes a feature active.
