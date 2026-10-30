---
name: naming
description: Choose or review names for functions, variables, types, constants, and files in my-ecm. Use when naming or renaming code, while preserving external contracts.
---

# Naming in my-ecm

Apply `design-principles` and inspect related code and callers before naming or renaming. Choose names that express the domain, role, and actual behavior; avoid abbreviations that obscure meaning. Do not rename unrelated code solely for consistency.

- **Functions and variables:** Name operations for what they do and values for what they represent. Use predicates such as `isShopMember` for boolean checks and distinguish identifiers such as `productId` from entities. Keep short injected names such as `product` or `user` when their role is clear.
- **Authentication and policies:** Keep the agreed `signUp` / `signIn` method names consistent between controller and service. Name the policy's user parameter `user`, including when its type is nullable. Method names do not determine HTTP paths: preserve the existing endpoint contract unless a path change is requested.
- **Constants and schemas:** Use plural names for constant arrays of values, such as `PRODUCT_STATUSES` and `MICROSERVICE_EVENTS`; name the associated schema and inferred type by their domain concept, such as `ProductStatus`. Existing constant objects such as `ENTITY_NAME` are not arrays; follow their established names rather than renaming them to satisfy an array convention.
- **Types and classes:** Use domain-specific PascalCase names and established role suffixes, such as `ProductEntity`, `ProductService`, and `ProductPolicy`. Entity metadata values in `ENTITY_NAME` match entity class names; preserve the explicit database table name when entity names change.
- **Files and private methods:** Follow the feature's existing kebab-case file names and role suffixes, such as `product.controller.ts` and `user.rpc-service.ts`. Existing private methods use a leading underscore, such as `_toWhere`; follow neighboring code and current lint rules when adding them.
- **External names:** Treat HTTP paths, event names, command names, environment variables, and database names as contracts with consumers. Trace those consumers before proposing a rename; an internal naming cleanup alone does not authorize changing the external contract.

When reviewing a name, explain the ambiguity or behavior mismatch and suggest a specific alternative. Use `writing-functions` for function structure and reuse when that skill is available.
