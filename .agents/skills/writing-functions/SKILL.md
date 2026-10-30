---
name: writing-functions
description: Write, change, or review functions and helpers in my-ecm, including responsibility, control flow, reuse, placement, and spacing between logical steps.
---

# Writing functions in my-ecm

Apply `design-principles` and use `naming` for names. Inspect relevant callers, adjacent code, and contracts before changing behavior.

- **Search before adding:** Before writing a function, helper, or utility, search the feature and shared code, including `libs/`, with `rg` for existing behavior. Reuse it only if its semantics, ownership, inputs, and side effects fit; do not couple unrelated behavior just to avoid repetition.
- **Responsibility:** Give a function a coherent purpose and keep its inputs, output, and side effects understandable. Extract a helper when it makes a distinct responsibility clearer or provides useful reuse, not solely to shorten a function or meet a repetition count.
- **Control flow:** Handle exceptional or completed cases early when that makes the main path clearer. `AddressService.setDefault` returns early for an already-default address. Keep necessary validation, ownership checks, and transaction behavior visible; do not bypass them to simplify flow.
- **Logical steps:** Arrange related statements into readable phases and use blank lines to separate meaningful transitions when helpful, as in `ProductService.update`. Do not impose a fixed line count or a blank line after every statement; follow the project's formatter and surrounding code.
- **Placement:** Put behavior near the domain that owns it. Entity methods can express state-related behavior, services coordinate queries and I/O, and shared libraries hold appropriately shared contracts or infrastructure. Check dependencies and callers before moving code across boundaries.
- **Contracts and errors:** Make parameter and return behavior match existing contracts and callers, including nullability, validation, and error behavior. Follow current lint rules and established patterns; do not widen inputs or suppress errors merely to make a helper reusable.
- **Effects:** Make transaction boundaries and external side effects clear in the flow. If an event must not occur on rollback, emit it after the relevant commit; account separately for possible failure after commit.

When reviewing, point to the concrete readability or behavior issue and propose a change proportionate to it. Do not refactor unrelated functions or introduce a shared helper solely because two expressions look alike.
