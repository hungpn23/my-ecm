# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

<claude-mem-context>
# Memory Context

# [my-ecm] recent context, 2026-08-20 8:20am UTC

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 38 obs (13,684t read) | 905,622t work | 98% savings

### Apr 23, 2026
S22 Code review of compose.local.yml — Docker Compose local dev stack for vocabify_be / my-ecm project (Apr 23 at 6:19 AM)
22 5:16p 🔵 my-ecm Monorepo Structure and Stack
S25 Kafka ADVERTISED_LISTENERS Uses localhost — Breaks Docker Inter-Container Connectivity (Apr 23 at 5:19 PM)
28 5:27p 🔵 Kafka ADVERTISED_LISTENERS Uses localhost — Breaks Docker Inter-Container Connectivity
S26 Fix Kafka Docker connectivity error #3 — enable NestJS server running as Docker service to connect to Kafka (Apr 23 at 5:27 PM)
S32 Create auth-service and user-service NestJS microservices in apps/ using TCP transport, and configure APISIX to forward requests to them (Apr 23 at 5:28 PM)
39 5:47p 🔴 Kafka Internal Port 9092 No Longer Exposed to Host in compose.local.yml
40 " 🔵 my-ecm Project Structure: Empty apps/, APISIX in Standalone JSON Mode, Bun Monorepo
S36 Create auth-service and user-service NestJS microservices in apps/ using TCP transport, and configure APISIX to forward requests to them (Apr 23 at 5:47 PM)
S41 Review compose.local.yml and scaffold NestJS microservices (auth-service, user-service) with APISIX routing for local dev (Apr 23 at 5:54 PM)
52 5:56p 🟣 auth-service NestJS Microservice Scaffolded in my-ecm Monorepo
56 5:57p 🟣 auth-service and user-service NestJS Apps Fully Scaffolded with Dual-Transport Architecture
57 " ✅ APISIX Routes Updated to Proxy /auth/* and /user/* to Local Microservices
S87 Removed Redundant format and lint Scripts from Root package.json (Apr 23 at 6:04 PM)
### May 4, 2026
152 4:05p ✅ Removed Redundant format and lint Scripts from Root package.json
S88 cart-service Debug: Service Running on Port 8084, Returns 200 Directly (May 4 at 4:05 PM)
153 4:27p 🔵 cart-service Debug: Service Running on Port 8084, Returns 200 Directly
S123 Session Recap Request — User Reviewing Last Work on feat/ticketing-ndc (May 4 at 4:27 PM)
154 4:40p 🔵 APISIX JWT Architecture Gap: No JWT Plugin Configured, Identity-Service Skeleton Only
### May 7, 2026
191 4:43a 🔵 Session Recap Request — User Reviewing Last Work on feat/ticketing-ndc
S124 How APISIX upstream connects to cart-service via host.docker.internal in Docker Desktop (May 7 at 4:44 AM)
### May 31, 2026
494 4:27p 🔵 dotenv Resolution Order in my-ecm NestJS Monorepo
495 4:36p 🔵 dotenv Resolution in Turborepo + Bun Monorepo — App-Level .env Wins
### Aug 15, 2026
785 4:05p 🔵 my-ecm Monorepo — Full ESM Confirmed Across All Packages
### Aug 17, 2026
829 6:25p ⚖️ JWT Public/Private Key Storage Format: Raw PEM vs Base64
830 6:40p 🔄 identity-service: File structure reorganization with barrel exports and @src path alias
831 " 🔵 MikroORM migration path mismatch: helper hardcodes "migrations" but identity-service folder is "migration"
832 " 🔵 identity-service type-check and build pass cleanly after refactor
833 " 🔵 identity-service initial migration creates user table with UUID PK and unique email
834 6:45p 🔴 libs/core database helper migration path fixed to match renamed folder
835 " 🔵 libs/core auth files staged with individual imports, not barrel imports
### Aug 18, 2026
852 1:50p 🔵 bun build --no-bundle Flag — Build Without Bundling
853 " 🔵 bun build --no-bundle Flag — Transpile Without Bundling
854 1:51p 🔵 Bun Build — No-Bundle Mode via --target=node Flag
855 1:53p 🔵 Bun Build — No-Bundle Mode Flag
856 1:54p 🔵 identity-service Source Structure Mapped
857 " 🔵 bun build --no-bundle: --outdir Fails, --outfile Succeeds for Single File
858 " 🔵 identity-service tsconfig Uses moduleResolution: bundler
859 1:57p 🔵 tsc --rootDir Fails on identity-service Due to Monorepo include Pattern
861 1:58p 🔵 bun 1.3.5 --no-bundle --outdir Is Broken; --outfile Only Workaround
### Aug 19, 2026
868 4:03a 🔵 TS2307 — @src/database/entity Path Alias Unresolved in identity-service During Monorepo Type Check
869 4:04a 🔵 TS2307 in identity-service — @src Path Alias Not Resolved by shipping-service check-types
870 4:19a 🔵 TS2307 Path Alias @src/database/entity Unresolved in identity-service
871 4:23a ✅ TypeScript include Scope Moved from Root to Per-App tsconfig
872 4:26a 🔵 my-ecm Monorepo tsconfig Structure — include Lives Only at Root
874 4:27a 🔵 my-ecm App tsconfigs — Full Content Confirmed Before include Migration
875 " ✅ TypeScript include Scope Migrated from Root to Each App tsconfig
876 " ✅ tsconfig include Migration Verified — All 16 Packages Pass Type Check

Access 906k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>
