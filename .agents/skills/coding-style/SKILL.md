---
name: coding-style
description: >
  Match my-ecm coding style when writing or editing TypeScript, TSX, or JavaScript:
  naming, parameters, types, interfaces, return types, imports, comments, and formatting.
  Also use for explicit coding-style reviews or refreshing this skill from current source.
  Excludes business-rule decisions, architecture design, and prose-only changes.
---

# Coding style

Match how this repository writes code. Preserve behavior and the user's requested scope.

## Establish the current style

1. Locate the my-ecm repository root. Resolve source paths in this skill from that root.
2. Read applicable `AGENTS.md` instructions, `oxfmt.config.ts`, `oxlint.config.ts`, the relevant
   `tsconfig.json`, and root `package.json` scripts. Explicit task instructions take precedence.
3. Read the target file and nearby handwritten files with the same role. For new files, find
   comparable maintained files using `rg`. Use the [style guide](references/style-guide.md)
   for the relevant naming, signature, typing, import, or layout choices.
4. Follow active formatter, linter, and compiler requirements first. For choices those tools
   leave open, follow the closest consistent local pattern. Confirm broader preferences in
   more than one comparable file before making them repository-wide rules.

The guide is a source-derived reference, not a fixed copy of every historical choice.
Generated files, ORM migrations, dependency code, build output, and dormant templates do
not establish handwritten style. Respect deliberate local differences, including the
formatter-excluded lint plugin sources under `tools/oxlint/anti-slop/`.

## Apply only the relevant conventions

- Match existing identifier vocabulary, casing, filename suffixes, and import paths.
- Reuse existing parameter types and preserve the local choice between positional
  arguments, typed object arguments, and destructuring.
- Derive types from their existing schemas or owners. Keep framework declaration merging
  and useful inferred return types. Do not force every declaration into one syntax.
- Preserve runtime imports required by decorators and dependency injection. A type-only
  import must not erase a value the program needs.
- Follow formatter output for indentation, wrapping, commas, quotes, and blank lines.
  Do not invent additional layout rules or change formatter/linter configuration for a task.
- Preserve parameter order, exports, external names, nullability, serialization, and async
  behavior during style-only work. Renaming a local symbol requires checking its references.
- Keep edits within the requested scope. Do not normalize unrelated files or redesign
  business rules, authorization, transactions, transports, or module ownership for style.

For an explicit style review, report deviations with source locations and matching examples.
Keep the review read-only unless the user also requests edits.

## Verify

Use the existing root scripts required by the task and repository instructions. For code
changes, run `bun run check:all` from the repository root.
Inspect any formatter changes before accepting them. Avoid repo-wide autofixes for a local
style change. Report existing failures separately from failures caused by the change.

## Refresh when requested

When the user asks to update this skill, scan current first-party code across `apps/`,
`libs/`, `scripts/`, root tooling, and maintained `tools/` sources. Separate generated and
ignored files from handwritten examples. Recheck active configuration and actual rule
implementations before describing a restriction.

Update only conventions supported by current evidence. Keep context-specific alternatives
and link each preference to source examples. Do not persist a new convention merely because
it appeared once, and do not rewrite this skill automatically after ordinary coding tasks.
