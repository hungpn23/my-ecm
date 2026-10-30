---
name: mikro-orm-query
description: Implement or review MikroORM queries, transactions, entity behavior, and data access in my-ecm, including ownership scope, concurrency, and loaded relations.
---

# MikroORM queries in my-ecm

Inspect the owning service, contract, callers, and existing query patterns before changing data access. Apply `design-principles`; use `mikro-orm-schema` for entity metadata and database schema decisions.

- **Ownership:** Apply the required tenant or user scope to each owned-resource read and mutation, using the authenticated context. `ProductService` filters shop-owned products by `ShopContext.shopId`; `AddressService` uses the authenticated user. A policy alone does not scope a query.
- **Dynamic conditions:** Combine dynamic filters with an array of conditions and `$and`. When there are no conditions, handle the empty case explicitly, as `CategoryService.find` returns `{}`. Within a condition, use other operators such as `$or` when needed for the intended semantics.
- **Search:** Preserve input as-is in the agreed product and category `$ilike` searches. SQL `%` and `_` act as wildcards; do not add an escape helper to these searches. Consider different search semantics only when required by the task.
- **Transactions and contexts:** Use the transaction callback's `em` for work belonging to that transaction. Choose transaction boundaries for the operation and its invariants, not a separate transaction for every write by default. Use `fork()` when an independent context is needed; do not fork every read automatically.
- **Concurrency:** Identify the shared invariant and competing operations before choosing a lock. `AddressService` locks the user inside the transaction before changing addresses. Preserve the lock and transaction scope when modifying that flow; assess and validate concurrency for the specific change.
- **External effects:** Emit events or perform other external side effects after the relevant transaction commits when they must not occur on rollback. After-commit emission alone does not guarantee delivery or retry; account for failure after commit according to the requested reliability.
- **Ordering and pagination:** Add a stable tie-breaker when a deterministic order matters, as in `ProductCatalogService`. Offset pagination can still shift when data changes. Preserve the existing offset and metadata formulas; do not introduce a pagination helper solely because they repeat.
- **Loaded relations:** Match `populate` to the relations required by entity methods and use `Loaded<...>` to express those requirements, as in `ProductEntity.toDetailResponse`. Do not assume relations are always loaded.
- **Entity and service:** Keep behavior attached to entity state where appropriate, including state changes such as `ShopEntity.addMember`. Services coordinate queries, transactions, and I/O. Prefer direct `EntityManager` use and introduce a repository or shared query abstraction only for a concrete need that improves clarity or maintainability.

Verify query scope, callers, and response contracts. Distinguish source inspection from actual database, concurrency, or end-to-end validation.
