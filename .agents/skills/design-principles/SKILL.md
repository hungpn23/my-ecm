---
name: design-principles
description: Apply Clean Code and SOLID principles when designing, writing, changing, or reviewing code in my-ecm, including responsibility boundaries, contracts, ownership scope, and transaction side effects.
---

# Design principles for my-ecm

Apply Clean Code strictly when designing, writing, changing, or reviewing code. Apply SOLID after Clean Code, with judgment: preserve the project's preference for readable code over unnecessary abstractions. Inspect the relevant implementation and callers before choosing a design.

## Clean Code

- **Names and intent:** Use precise names that reveal intent. Keep the purpose and control flow of each function clear to a reader unfamiliar with the code.
- **Functions and responsibilities:** Give each function a coherent responsibility. Separate distinct steps when doing so makes the code easier to understand; do not split code merely to reduce line count.
- **Abstraction:** Prefer the clearest implementation that fulfills the requirement. In services, prefer direct `EntityManager` use as in the existing code; introduce a repository or another data-access layer only when it addresses a concrete need and improves clarity or maintainability.
- **Duplication and reuse:** Search for existing behavior before adding a helper. Consolidate duplicated logic when it represents the same rule and sharing it improves clarity; avoid coupling unrelated behavior just because code looks alike.
- **Types and contracts:** Derive related types and schema values from the authoritative definition where practical. `ProductStatus` is built from `PRODUCT_STATUSES`. Verify that a boundary actually validates or transforms data before relying on it.
- **Valid states:** Express domain invariants with types and schema constraints when appropriate. `ShopMember` extracts a user with a non-null `shopId`; inspect the underlying contract and runtime checks rather than treating a type alone as enforcement.
- **Ownership and safety:** Identify the authenticated actor and resource scope before reading or changing owned data. Product operations use the shop from `ShopContext` in scoped queries. Check the actual policy and affected operations; do not infer authorization from a type or a single example.
- **Transaction boundaries:** Keep external side effects after the relevant commit when they must not happen on rollback. `AuthService.signUp` emits after its transaction resolves. This ordering alone does not ensure delivery or retries; consider failures after commit against the required reliability.

## SOLID

- **Responsibility:** Give components coherent reasons to change. `ProductService` handles shop-scoped product operations while `ProductCatalogService` handles the public catalog. Split components when it resolves a real difference.
- **Extension:** Reuse existing contracts when they express a new variation without duplicating definitions. For example, `UpdateCategory` derives from `CreateCategory.partial()`.
- **Substitution:** When introducing interchangeable implementations, preserve the contract and behavior callers rely on, including errors and guarantees.
- **Interfaces:** Expose what callers actually need. `ShopContext` supplies shop context; a new interface is not mandatory for every dependency.
- **Dependencies:** Use existing injected boundaries where they isolate meaningful behavior. `AuthService` uses `PasswordHasher` and `NotificationClient` while also using `EntityManager` directly; do not add a layer solely to satisfy a principle.

When reviewing, explain the concrete risk and tradeoff, cite the relevant code, and propose a change that addresses the requirement. Do not present examples as universal patterns or proof of runtime behavior.
