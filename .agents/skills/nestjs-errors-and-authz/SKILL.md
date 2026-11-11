---
name: nestjs-errors-and-authz
description: Implement or review NestJS authorization and error handling in my-ecm, including policies, resource scope, HTTP exception filters, and RPC error boundaries.
---

# NestJS authorization and errors in my-ecm

Inspect the endpoint, its policy, module registration, service queries, and the relevant HTTP or RPC bootstrap before changing behavior. Apply `design-principles` and preserve the existing contract unless the task requires a change.

- **Authorization:** Use the feature's registered `@Policy()` and `@Can` methods where authorization is required. For example, `ProductPolicy` checks shop membership. Check the actual action and user conditions, including `null`; do not assume every feature needs an identical policy.
- **Authentication and public access:** Check `@Endpoint` metadata and the configured authentication and authorization mechanisms together. The catalog uses `public: true`, while category listing uses `@Can.Anyone()`; do not treat these declarations as interchangeable without tracing both guards.
- **Resource scope:** A policy permitting an action does not itself scope database queries. For owned resources, check how the authenticated user or `ShopContext` supplies ownership and ensure each affected read or mutation applies the required scope.
- **HTTP errors:** Trace `ServerExceptionFilter` and its `APP_FILTER` registration. It maps `NotFoundError` to 404, `OptimisticLockError` to 409, and `TimeoutError` to 504; do not assume all ORM or database errors map to these statuses. The response contains `statusCode`, `error`, `message`, `errorCode`, and `timestamp` when the filter can send it.
- **RPC errors:** Trace the connected microservice's `RpcExceptionFilter` registration in `main.ts`. It serializes errors as the internal `ServerError` payload; the shared client validates it and reconstructs an `HttpException`. The client rethrows other errors unchanged. Do not add exception conversions or transport classifications for hypothetical cases.
- **Error details:** Keep client-facing messages appropriate to the boundary and avoid exposing secrets. Authentication uses a generic invalid-credentials message while recording a more specific cause; review what is logged and serialized before adding detail.
- **Missing data:** Choose nullable results or exceptions according to the endpoint or RPC contract. `UserRpcService.findOne` returns `NullableUser`; do not replace it with a not-found exception without checking callers and schema.

When reviewing, cite the actual policy, registration, and query or error path. Separate what code indicates from behavior verified at runtime; recommend targeted validation when the change affects authorization or error contracts.
