---
name: typescript-strictness
description: Write or review TypeScript types in my-ecm, including inference, literal types, unions, satisfies, type utilities, assertions, and runtime validation boundaries.
---

# TypeScript strictness in my-ecm

Apply `design-principles` and inspect the relevant contract, callers, TypeScript configuration, and lint rules. Prefer precise, readable types that represent the actual behavior without unnecessary widening or abstraction.

- **Inference and annotations:** Let TypeScript infer known values when the inferred type is appropriate; avoid annotations that merely widen a known value. Add an annotation when it supplies necessary context, such as `FilterQuery<CategoryEntity>[]` for an empty array or a variable that will be reassigned. Choose function return annotations based on the public contract and surrounding conventions.
- **Literal values and unions:** Prefer `as const` when a constant array or object should preserve literal values, as with `PRODUCT_STATUSES`. Model meaningful alternatives with unions, including discriminated unions when appropriate; avoid making impossible states representable solely for convenience.
- **Shape checking:** Prefer `satisfies` to check compatibility while retaining useful inferred information. `PayloadByCommand` uses `as const satisfies Record<MicroserviceCommand, Type>` to check the command registry. Keep the registry and its actual consumers aligned when adding a command.
- **Type utilities:** Derive related types from existing definitions when the relationship is real and remains readable. Examples include `Extract` for `ShopMember`, `Pick` for membership fields, and `NoInfer` in microservice clients. Do not add generic layers just to reuse a type expression.
- **Assertions and narrowing:** Prefer validation, narrowing, and correct type definitions over `as` assertions; do not use chained assertions to bypass a mismatch. If an assertion is genuinely required by an API or generated code, inspect its boundary and current lint rules rather than claiming assertions can never be used. Do not hand-edit generated files to change their types.
- **Runtime boundaries:** Types do not validate external data. Use the appropriate ArkType schema and existing validation boundary, and choose `.infer` or `.inferIn` for the actual input or output. Preserve meaningful nullability and handle absent values explicitly.
- **Validation:** Respect the root TypeScript configuration and current lint rules, including strict null and indexed access settings. Run the root `check:types` script after changes; distinguish type-check results from runtime or database verification.

When reviewing, identify the concrete type mismatch or lost guarantee, check the affected callers, and propose a targeted correction.
