---
name: arktype-schema
description: Design, change, or review ArkType schemas and inferred types in my-ecm, including schema composition, boundary validation, transforms, and sensitive values.
---

# ArkType schemas in my-ecm

Inspect the contract, boundary, and callers before changing a schema. Apply `design-principles` and preserve existing input, output, and validation behavior unless the task requires a change.

- **Definition order:** Define underlying constants first, then the ArkType schema, then its inferred type. For example, `PRODUCT_STATUSES` uses `as const`, `ProductStatus` uses `type.enumerated(...PRODUCT_STATUSES)`, and its type uses `typeof ProductStatus.infer`. Export a constant when another module needs it, such as an entity enum. Controllers, consumers, and services use named schema-derived types, not inline `typeof Schema.infer` or `typeof Schema.inferIn`.
- **Reuse and composition:** Reuse shared schemas and compose them with operations such as `.merge()`, `.partial()`, and `.or()` where they represent the same contract. `UpdateCategory` derives from `CreateCategory`; `Paginated(Product)` composes a paginated response. Check field constraints and existing data before changing shared definitions.
- **Nullable types:** Before writing `T | null`, look for a matching nullable schema and reuse its inferred input or output type for the boundary.
- **Input and output types:** Choose `.inferIn` for a schema's input type and `.infer` for its output type according to where the value is used. Request types commonly use `.infer` after validation. `Product` uses `.infer`; its `EntityResponse` dates use `DateValue`, which accepts a `Date` or ISO string and parses the string to a `Date`. Inspect transforms, defaults, the serializer, and the actual boundary instead of assuming the schema converts dates to strings.
- **Validation boundaries:** Follow the existing endpoint or RPC payload schema and serializer registration. Verify where the schema is actually applied; a TypeScript type alone does not validate runtime data. Check dependent consumers when changing validation or serialization.
- **Sensitive values:** Prevent secrets from appearing in validation errors. The shared password and refresh-token schemas configure `actual: () => ""`; custom validation errors must also avoid echoing sensitive inputs. Inspect other error and log paths when handling secrets.
- **Global configuration:** Keep `@libs/contract/arktype-global` as the first import in service `main.ts` when editing bootstrap, as in the current services. Check the initialization path when adding a new entry point.
- **Dependency issue:** For branded-type portability errors such as TS2883, consult `docs/dependency-issues.md` as historical guidance. Identify the workspace that currently owns the affected schema and inspect its installed ArkType / `@ark/util` versions; the document can refer to old paths. Verify the workaround against the current dependency graph and run the root type-check script after dependency changes.

When reviewing, distinguish schema input, validated output, and serialized output. Cite the relevant contract and boundary; do not claim runtime validation without verifying that path.
