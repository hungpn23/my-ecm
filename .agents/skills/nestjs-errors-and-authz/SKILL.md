---
name: nestjs-errors-and-authz
description: Implement or review NestJS authorization and error handling in my-ecm, including policies, resource scope, HTTP exception filters, and RPC error boundaries.
---

# NestJS authorization and errors in my-ecm

Inspect the endpoint, its policy, module registration, service queries, and the relevant HTTP or RPC bootstrap before changing behavior. Apply `design-principles` and preserve the existing contract unless the task requires a change.

- **Authorization:** Use the feature's registered `@Policy()` and `@Can` methods where authorization is required. For example, `ProductPolicy` checks shop membership. Check the actual action and user conditions, including `null`; do not assume every feature needs an identical policy.
- **Authentication and public access:** Check `@Endpoint` metadata and the configured authentication and authorization mechanisms together. The catalog uses `public: true`, while category listing uses `@Can.Anyone()`; do not treat these declarations as interchangeable without tracing both guards.
- **Resource scope:** A policy permitting an action does not itself scope database queries. For owned resources, check how the authenticated user or `ShopContext` supplies ownership and ensure each affected read or mutation applies the required scope.
- **HTTP errors:** Use existing exception behavior when it expresses the desired contract. Product's `MikroOrmExceptionFilter` maps `NotFoundError` to 404 and `OptimisticLockError` to 409; `RxjsExceptionFilter` maps `TimeoutError` to 504. Verify the relevant filter is registered and applies to the transport; do not assume all ORM or database errors map to these statuses.
- **RPC errors:** Trace the connected microservice's `RpcExceptionFilter` registration in `main.ts`. It preserves the project's `RpcException` payload, maps `HttpException` to `RpcError`, and uses an internal error for other exceptions. The shared client converts payloads accepted by `RpcError` into `HttpException`; do not assume unrelated errors follow this path.
- **Error details:** Keep client-facing messages appropriate to the boundary and avoid exposing secrets. Authentication uses a generic invalid-credentials message while recording a more specific cause; review what is logged and serialized before adding detail.
- **Missing data:** Choose nullable results or exceptions according to the endpoint or RPC contract. `UserRpcService.findOne` returns `User | null`; do not replace it with a not-found exception without checking callers and schema.

When reviewing, cite the actual policy, registration, and query or error path. Separate what code indicates from behavior verified at runtime; recommend targeted validation when the change affects authorization or error contracts.
