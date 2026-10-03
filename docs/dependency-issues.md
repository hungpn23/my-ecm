# Dependency issues

Known dependency issues encountered in this project, their workarounds, and checks to revisit when upgrading libraries.

## Index

| Library | Issue                                                                              | Project resolution                                    |
| ------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| ArkType | [Exported branded types cannot be named portably](#arktype-exported-branded-types) | Pin `@ark/util` to ArkType's exact dependency version |

## ArkType: exported branded types

Upstream: [arktypeio/arktype#1577](https://github.com/arktypeio/arktype/issues/1577).

### Symptom

Exporting a branded schema in `libs/common/src/common.schema.ts` causes a TypeScript portability error:

```ts
export const NonEmptyString = type("string >= 1").brand("NonEmptyString");
export type NonEmptyString = typeof NonEmptyString.infer;
```

```text
The inferred type of 'NonEmptyString' cannot be named without a reference to 'Brand' from '.bun/@ark+util@0.56.2/node_modules/@ark/util'. This is likely not portable. A type annotation is necessary.
```

The diagnostic was `TS2883` in this project. The upstream report uses `TS2742`.

### Cause

The inferred schema type references `Brand` from ArkType's `@ark/util` dependency. TypeScript cannot name that type through a portable package reference in the affected dependency layout.

Adding a different version of `@ark/util` does not resolve the reference. Here, `arktype@2.2.3` requires `@ark/util@0.56.2`, while the initial direct dependency used `^0.56.6`.

### Applied workaround

Declare `@ark/util` directly in the affected workspace. Match the exact version and version range declared by the installed ArkType package.

In the root `package.json`, under `workspaces.catalogs.common`:

```json
{
  "@ark/util": "0.56.2",
  "arktype": "2.2.3"
}
```

In `libs/common/package.json`, under `dependencies`:

```json
{
  "@ark/util": "catalog:common",
  "arktype": "catalog:common"
}
```

Refresh dependencies and validate from the repository root:

```sh
bun install
bun check:types
```

The schema retains `.brand("NonEmptyString")` and its inferred type alias.

### Upgrade check

When upgrading ArkType, check its installed `package.json` dependency on `@ark/util` and update the catalog entry to match. For this workspace, the package is available at `libs/common/node_modules/arktype/package.json`.

Revisit the upstream issue before removing the workaround. Run `bun check:types` after changing the dependency versions.

## Adding an issue

Add one section per issue, grouped by library, and link it from the index. Include:

- **Upstream:** issue or documentation link.
- **Symptom:** affected project file, error, and minimal example when useful.
- **Cause:** confirmed explanation; label any uncertainty.
- **Applied workaround:** relevant versions, configuration, and root validation command.
- **Upgrade check:** when to update or remove the workaround.
