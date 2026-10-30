---
name: mikro-orm-schema
description: Design, change, or review MikroORM entities, database constraints, relationships, discovery, and migrations in my-ecm. Use when the persisted schema or entity metadata is affected.
---

# MikroORM schema in my-ecm

Inspect the owning service's entities, contracts, migrations, and existing data implications before changing a schema. Apply `design-principles`; keep query and transaction decisions in `mikro-orm-query` when available.

- **Entity metadata:** Follow the local `defineEntity` / entity class / `setClass` pattern. Use the existing `ENTITY_NAME` values with the `Entity` suffix and an explicit `tableName`, as in `ProductEntity`. Entity `name` identifies metadata and can influence the default table name; preserve the intended table name explicitly when renaming.
- **Shared properties and types:** Use `useBaseProps` where the entity needs the project's UUID and timestamp properties. Apply domain types such as `Uuid` and `NonNegativeDecimal` to columns where appropriate; TypeScript types alone do not enforce database constraints.
- **Columns and contracts:** Align nullability, string lengths, integer limits, and decimal precision and scale with the domain, contract, and stored data. Product and checkout prices use `decimal(12,2)`; verify the actual contract and migration rather than assuming every monetary field has the same requirements. Mark secrets hidden and load them deliberately, as with `UserEntity.password`.
- **Enums and invariants:** Use the contract's values with `p.enum(...)` for constrained enum columns, as with `Product.status`. Add database checks, uniqueness, and foreign keys for actual invariants: stock constrains quantities and reservation makes `checkoutId` unique. Check existing data and compatibility before changing allowed values or constraints.
- **Relationships and ownership:** Model relationships within the owning service where appropriate, such as reservation to stock. Cross-service references like product and shop IDs are UUID columns in stock; do not invent cross-service foreign keys. Check relation ownership, nullability, deletion behavior, and existing data for each change.
- **Migration and discovery:** Generate migrations through the ORM using the existing root package script; never hand-create migration files. Choose a meaningful name where supported, and inspect generated `up` / `down`, constraints, snapshots, and data effects. When entity discovery changes, check entity exports and use the root discovery script when needed; do not hand-edit generated discovery files. Do not run migrations or write to a database without authorization.

Verify that entity definitions, contracts, and migration output agree. Distinguish static inspection from a migration or runtime check actually performed; do not assume examples prove every workflow or concurrent behavior.
