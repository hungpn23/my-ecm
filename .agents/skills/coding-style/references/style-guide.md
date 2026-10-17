# Source-derived style guide

Read the sections relevant to the current change. Source paths below are relative to the
my-ecm repository root. Reopen the live files before relying on an example.

## Evidence and precedence

- `oxfmt.config.ts` controls formatting and its ignore patterns.
- `oxlint.config.ts` selects active rules. Read a rule under `tools/oxlint/anti-slop/rules/`
  when its name or message leaves the restriction unclear.
- Root and workspace `tsconfig.json` files control compiler requirements.
- Nearby handwritten code determines choices the tools do not prescribe.

The current source contains meaningful alternatives. Service signatures, generic helpers,
framework extensions, scripts, and TSX components do not all use the same declaration style.
Examples illustrate syntax and naming only. They do not prescribe business behavior.

## Names and file conventions

- Use `camelCase` for variables, properties, parameters, and ordinary functions.
- Prefix private class methods with `_` followed by camelCase, including async and static
  methods. Preserve an existing prefix and update every reference when renaming.
  Private properties and constructor parameters keep their existing names.
  Examples: `_fork` in `apps/identity-service/src/module/auth/auth.store.ts`,
  `_authenticate`, `_lockUserAndVerifyProof`, and `_issueTokens` in
  `apps/identity-service/src/module/auth/auth.service.ts`, and `_requireShopId` in
  `apps/product-service/src/module/product/product.service.ts`.
- Use `PascalCase` for classes, type aliases, interfaces, schema values, and components.
  A schema and its inferred type may intentionally share a name.
- Use `UPPER_SNAKE_CASE` for fixed registries, enum source values, injection tokens, and
  environment-variable keys. This does not apply to every `const` binding.
- Keep the existing kebab-case stems and descriptive suffixes, such as `.controller.ts`,
  `.service.ts`, `.module.ts`, `.schema.ts`, `.config.ts`, `.entity.ts`, and `.type.ts`.
  Generated migration filenames follow their generator, not this convention.
- Name values by their role. Existing vocabulary includes `body`, `query`, `payload`,
  `data`, `options`, `config`, `env`, `record`, `proof`, `result`, and `response`.
  Choose the term used by comparable code instead of mechanically renaming every input.
- Keep established short dependency names such as `em`, `authContext`, and `logger` where they
  already identify the same role. Use plural names for collections and descriptive names
  for intermediate values, such as `passwordHash`, `replacementHash`, or `response$`.
- Do not introduce `I` prefixes for interfaces or structural suffixes solely to announce
  a TypeScript construct. The active linter specifically forbids `shape`, case-insensitively,
  in symbol names. Preserve external API names when a task does not authorize changing them.
- Name generics for their role when that adds meaning: `Command`, `Event`, `TTarget`, and
  `TSource` exist here. Short `T`, `K`, and `P` also exist in compact utility types.

Examples: `apps/product-service/src/module/product/product.service.ts`,
`libs/core/src/microservice/microservice-clients.ts`,
`libs/core/src/microservice/microservice.schema.ts`,
`libs/common/src/all-or-never.type.ts`, and
`tools/oxlint/anti-slop/rules/no-shape-in-symbol-names.ts`.

## Parameters and function declarations

- Reuse the type that already owns an input. Controller parameters commonly use `body`,
  `query`, and a descriptive identifier together with the matching parameter decorator.
- Keep positional arguments for separate inputs when comparable methods use them:
  `update(productId: Uuid, body: UpdateProduct)` and
  `set(key: string, value: string, ttlInSeconds?: number)` are existing patterns.
- Typed object parameters are also established. Destructure at the signature when the
  method directly uses a few fields, as in
  `signIn({ email, password }: BaseAuth): Promise<TokenResponse>`.
- Keep an options/config object when it represents an existing coherent contract.
  Do not bundle unrelated positional arguments only to make signatures uniform.
- Use `?` for an optional parameter when omission is supported. Preserve meaningful
  distinctions between absent values, `undefined`, and `null`.
- Constructor injection commonly uses parameter properties with `private readonly`.
  Preserve access modifiers and decorators needed by the existing class.
- Named helpers commonly use `function` or `export function`. Short decorator adapters
  use `export const` arrow functions. Callbacks use arrow functions. Keep the local form.

The rule named `no-object-parameters` rejects the broad TypeScript `object` type and aliases
that resolve to it. It does **not** ban typed object arguments or parameter destructuring.
Its implementation is `tools/oxlint/anti-slop/rules/no-object-parameters.ts`.

Examples: `apps/product-service/src/module/product/product.controller.ts`,
`apps/identity-service/src/module/auth/auth.service.ts`,
`libs/core/src/redis/redis.service.ts`,
`libs/core/src/database/database.helper.ts`, and
`libs/core/src/microservice/microservice.decorator.ts`.

## Types, interfaces, and generics

- Prefer existing owner-provided types and inference to duplicate definitions.
  Local reusable contracts commonly use `type` aliases.
- Keep a schema and its inferred type together, with the same exported name when the
  surrounding schema files use that pattern:

  ```ts
  export type CreateProduct = typeof CreateProduct.infer;
  export type ProductDetailResponse = typeof ProductDetailResponse.inferIn;
  ```

- Select `.infer` or `.inferIn` for the actual value being typed. Defaults and transforms
  can change the input/output contract. Match the caller, not a blanket rule for responses.
- Reuse `ConfigType<typeof config>`, `Parameters`, `ReturnType`, `Pick`, `Omit`, `Exclude`,
  mapped types, or existing library types when those already express the desired contract.
- Use `interface` for supported declaration merging or framework augmentation. The current
  `AuthenticationTypes` augmentation is intentional. Do not convert it to a type alias.
- Retain small inline object types or unions when comparable local code uses them once.
  Create a named alias when the concept is reused or the signature becomes hard to read.
- Keep literal information. Existing registries use `as const`, sometimes with `satisfies`.
  Do not widen a known object into a broad annotation and later assert the precision back.
- Keep generics where they connect actual inputs and outputs. Do not add class-level
  generics, wrapper interfaces, or universal helper types just for stylistic uniformity.

Examples: `libs/contract/src/product/product.schema.ts`,
`libs/contract/src/shared/common.schema.ts`,
`libs/core/src/config/app.config.ts`,
`libs/core/src/auth/auth.type.ts`,
`libs/core/src/microservice/payload-by-command.ts`,
`libs/common/src/deep-merge.ts`, and `scripts/onboard:service.ts`.

## Return types and async code

- Controllers and many service methods explicitly declare their public return contracts,
  such as `Promise<ProductDetailResponse>`, `Promise<SuccessResponse>`, or `Promise<void>`.
  Use the existing named response type instead of restating its properties.
- Framework-facing methods use the required contract, such as `DynamicModule` or
  `boolean`. Keep `override` when the compiler or existing superclass requires it.
- Generic clients, callbacks, private helpers, and several simple infrastructure methods
  intentionally infer return types. Preserve useful inference rather than adding a broad
  annotation that loses the relationship between a command and its response.
- Existing code frequently uses `return await` for async delegation. Match comparable
  methods and preserve behavior. Adding or removing `await` can affect error handling.
- Await side effects when their completion belongs to the current call. Do not turn an
  awaited operation into a detached call as a style cleanup.
- Keep existing `null` versus `undefined` results and `void` contracts. Style does not
  authorize changing failure, missing-value, or serialization behavior.

Examples: `apps/product-service/src/module/product/product.controller.ts`,
`apps/identity-service/src/module/auth/auth.store.ts`,
`libs/core/src/microservice/microservice-clients.ts`,
`libs/core/src/config/config.module.ts`, and `libs/core/src/redis/redis.service.ts`.

## Imports and exports

- Use `#internal/*` for package-internal paths where the workspace declares that alias.
  Sibling files commonly use `./...`; shared libraries use their `@libs/...` exports.
  Preserve special aliases such as `#mikro-orm/generated` when relevant.
- Use `node:` for Node built-ins, following existing scripts and configuration files.
- Use `import type` for exclusively type-level dependencies. Mixed value/type imports
  commonly use inline `type` specifiers. Preserve the surrounding grouping and ordering.
- Keep value imports for classes and schemas used at runtime, including decorator
  metadata and injected classes. Do not apply type-only imports based only on a symbol's
  apparent use in a constructor annotation.
- Match local extension conventions. App/library source commonly omits `.ts`; custom
  lint plugin source explicitly includes it. Do not rewrite both into one global form.
- Maintain existing barrel exports and public export names when the change requires them.
  Side-effect imports must stay in their required execution position.

Examples: `apps/product-service/package.json`,
`apps/product-service/src/module/product/product.service.ts`,
`apps/identity-service/src/main.ts`, `libs/core/src/auth/jwt-auth.provider.ts`,
`libs/contract/src/index.ts`, and `tools/oxlint/anti-slop/index.ts`.

## Control flow, expressions, and comments

- Prefer `const` for stable bindings; use `let` when an existing branch updates a value.
- Short early-return and early-throw guards are common. Keep braces for longer branches
  and let the formatter handle short guards instead of inventing a blanket brace rule.
- Use destructuring, property shorthand, and object spread when they directly express
  the existing operation. Preserve the distinctions between `||`, `??`, optional chaining,
  omitted properties, and explicit `undefined`.
- Keep a ternary for a small value choice and a branch for multi-step work when that
  matches nearby code. The active linter rejects conditional spreads with an empty object.
- Write concise comments for a non-obvious reason, invariant, or workaround. Follow the
  surrounding comment language. Do not copy typos or make every statement narrate itself.
- Preserve meaningful TODOs, JSDoc, and tooling directives. An unavoidable non-const type
  assertion requires a nearby `SAFETY:` comment explaining the actual checked invariant.
  `as const` is exempt. A comment does not make an unsupported cast correct.

Respect the active anti-slop rules for chained assertions, known-value widening,
`Reflect.get`, `Reflect.apply`, runtime `typeof` checks, broad input/return types, and
unsafe dictionary value types. Read the actual rule before choosing an alternative.
Compiler flags also require care with unchecked indexes, optional properties, and overrides.
For a style-only task, report any issue requiring a behavioral redesign instead of adding
new validation or changing input contracts without the user's requested scope.

Examples: `apps/product-service/src/module/product/product.service.ts`,
`apps/identity-service/src/module/auth/auth.service.ts`, `scripts/check:env.ts`,
`scripts/onboard:service.ts`, `oxlint.config.ts`, and `tsconfig.json`.

## Formatting and TSX

- Root Oxfmt output is the layout authority. Current formatted app/library/script code
  generally uses two-space indentation, double-quoted strings, semicolons, and trailing
  commas in multiline constructs. Recheck config and installed formatter instead of
  freezing its defaults into a separate style policy.
- Let the formatter choose wrapping for imports, decorators, signatures, generics, call
  arguments, and object literals. Do not hardcode a line width or parameter-count rule.
- Keep blank lines separating imports, local declarations, decorators/classes, and
  logical steps when the target file uses them. Do not vertically align declarations.
- Respect formatter exclusions. The custom lint plugin contains deliberate tab-indented
  files; generated entities and migrations also have their own output conventions.
- TSX components use PascalCase names and the JSX runtime selected by their workspace
  config. Match the component's existing named/default exports and multiline JSX layout.
  Preserve props, children, text, and rendering behavior during formatting work.

Examples: `oxfmt.config.ts`, `libs/email/tsconfig.json`,
`libs/email/src/templates/welcome.tsx`, and `tools/oxlint/anti-slop/index.ts`.
