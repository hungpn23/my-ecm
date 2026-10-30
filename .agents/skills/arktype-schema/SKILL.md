---
name: arktype-schema
description: Design, change, or review ArkType schemas and inferred types in my-ecm, including schema composition, boundary validation, transforms, and sensitive values.
---

# ArkType schemas in my-ecm

Inspect the contract, boundary, and callers before changing a schema. Apply `design-principles` and preserve existing input, output, and validation behavior unless the task requires a change.

- **Definition order:** Define underlying constants first, then the ArkType schema, then its inferred type. For example, `PRODUCT_STATUSES` uses `as const`, `ProductStatus` uses `type.enumerated(...PRODUCT_STATUSES)`, and its type uses `typeof ProductStatus.infer`. Export a constant when another module needs it, such as an entity enum.
- **Reuse and composition:** Reuse shared schemas and compose them with operations such as `.merge()`, `.partial()`, and `.or()` where they represent the same contract. `UpdateCategory` derives from `CreateCategory`; `Paginated(Product)` composes a paginated response. Check field constraints and existing data before changing shared definitions.
- **Input and output types:** Choose `.inferIn` for a schema's input type and `.infer` for its output type according to where the value is used. Request types commonly use `.infer` after validation. `Product` uses `.inferIn` for the service response before `EntityHttpResponse` transforms dates to ISO strings. Inspect transforms, defaults, and the actual boundary rather than applying one choice to all HTTP or RPC contracts.
- **Validation boundaries:** Follow the existing endpoint or RPC payload schema and serializer registration. Verify where the schema is actually applied; a TypeScript type alone does not validate runtime data. Check dependent consumers when changing validation or serialization.
- **Sensitive values:** Prevent secrets from appearing in validation errors. The shared password and refresh-token schemas configure `actual: () => ""`; custom validation errors must also avoid echoing sensitive inputs. Inspect other error and log paths when handling secrets.
- **Global configuration:** Keep `@libs/contract/arktype-global` as the first import in service `main.ts` when editing bootstrap, as in the current services. Check the initialization path when adding a new entry point.
- **Dependency issue:** For branded-type portability errors such as TS2883, consult `docs/dependency-issues.md` and inspect the currently installed ArkType / `@ark/util` versions and affected workspace. Verify the documented workaround still matches the dependency graph before changing versions; run the root type-check script after dependency changes.

When reviewing, distinguish schema input, validated output, and serialized output. Cite the relevant contract and boundary; do not claim runtime validation without verifying that path.
