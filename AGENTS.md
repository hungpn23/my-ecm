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

# [my-ecm] recent context, 2026-04-28 4:58pm UTC

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 7 obs (2,704t read) | 137,302t work | 98% savings

### Apr 23, 2026
S22 Code review of compose.local.yml — Docker Compose local dev stack for vocabify_be / my-ecm project (Apr 23 at 6:19 AM)
S7 ADC JSON support inquiry — user asked if ADC (APISIX Declarative CLI) supports JSON format for declarative config files (Apr 23 at 6:19 AM)
22 5:16p 🔵 my-ecm Monorepo Structure and Stack
S25 Kafka ADVERTISED_LISTENERS Uses localhost — Breaks Docker Inter-Container Connectivity (Apr 23 at 5:19 PM)
28 5:27p 🔵 Kafka ADVERTISED_LISTENERS Uses localhost — Breaks Docker Inter-Container Connectivity
S26 Fix Kafka Docker connectivity error #3 — enable NestJS server running as Docker service to connect to Kafka (Apr 23 at 5:27 PM)
S32 Create auth-service and user-service NestJS microservices in apps/ using TCP transport, and configure APISIX to forward requests to them (Apr 23 at 5:28 PM)
39 5:47p 🔴 Kafka Internal Port 9092 No Longer Exposed to Host in compose.local.yml
40 " 🔵 my-ecm Project Structure: Empty apps/, APISIX in Standalone JSON Mode, Bun Monorepo
S36 Create auth-service and user-service NestJS microservices in apps/ using TCP transport, and configure APISIX to forward requests to them (Apr 23 at 5:47 PM)
52 5:56p 🟣 auth-service NestJS Microservice Scaffolded in my-ecm Monorepo
56 5:57p 🟣 auth-service and user-service NestJS Apps Fully Scaffolded with Dual-Transport Architecture
57 " ✅ APISIX Routes Updated to Proxy /auth/* and /user/* to Local Microservices
S41 Review compose.local.yml and scaffold NestJS microservices (auth-service, user-service) with APISIX routing for local dev (Apr 23 at 6:04 PM)
**Investigated**: compose.local.yml was reviewed to understand the local Docker Compose setup. The existing APISIX config (apisix/apisix.json) had only a placeholder /hello route pointing to 127.0.0.1:1980. The monorepo root package.json only had libs/* in workspaces, not apps/*.

**Learned**: - APISIX runs in Docker but NestJS services run on the host via bun dev — requires host.docker.internal as upstream (auto-resolved on macOS/Windows Docker Desktop; needs extra_hosts on Linux native Docker).
    - NestJS ClientsModule lazy-connects to TCP peers, so a service boots successfully even if the other service is not yet running — /ping-other will fail at call time, not at startup.
    - The monorepo uses Bun workspaces with a backend catalog for @nestjs/microservices version pinning (^11.1.19).
    - Each microservice extends a shared root tsconfig.json and adds experimentalDecorators + emitDecoratorMetadata for NestJS decorator support.

**Completed**: - Root package.json workspaces updated: added "apps/*" alongside "libs/*".
    - apps/auth-service fully scaffolded: package.json (@app/auth-service), tsconfig.json, src/main.ts (HTTP :8080, TCP :8180), src/app.module.ts (registers USER_SERVICE TCP client → 127.0.0.1:8181), src/app.controller.ts (GET /, GET /ping-other, @MessagePattern('ping')).
    - apps/user-service fully scaffolded: identical structure — HTTP :8081, TCP :8181, registers AUTH_SERVICE TCP client → 127.0.0.1:8180.
    - apisix/apisix.json updated: /auth/* → proxy-rewrite strip prefix → host.docker.internal:8080; /user/* → host.docker.internal:8081. Old placeholder /hello route removed.
    - bun install ran successfully: 129 packages installed, lockfile saved.

**Next Steps**: Restart APISIX container to load the new routes, then start both NestJS services with bun dev and verify with curl: GET /auth/, /user/, /auth/ping-other, /user/ping-other. May need to add extra_hosts to APISIX service in compose.local.yml if running on Linux.


Access 137k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>