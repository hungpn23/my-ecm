FROM oven/bun:1.4.4 AS base

WORKDIR /work

# Skip husky setup.
ENV CI=true

ARG APP_FOLDER_NAME

COPY package.json bun.lock bunfig.toml tsconfig.json ./
COPY .husky/install.mjs .husky/install.mjs

COPY apps/${APP_FOLDER_NAME}/package.json apps/${APP_FOLDER_NAME}/package.json

COPY libs/common/package.json libs/common/package.json
COPY libs/contract/package.json libs/contract/package.json
COPY libs/core/package.json libs/core/package.json
COPY libs/email/package.json libs/email/package.json

FROM base AS local

RUN bun install --frozen-lockfile --filter "@apps/${APP_FOLDER_NAME}..."

COPY apps/${APP_FOLDER_NAME}/ ./apps/${APP_FOLDER_NAME}/
COPY libs ./libs

RUN chown -R bun:bun /work

ENV APP_FOLDER_NAME=${APP_FOLDER_NAME}

USER bun
CMD ["sh", "-c", "exec bun --filter @apps/${APP_FOLDER_NAME} dev"]

FROM base AS production

RUN bun install --frozen-lockfile --production --filter "@apps/${APP_FOLDER_NAME}..."

COPY apps/${APP_FOLDER_NAME}/ ./apps/${APP_FOLDER_NAME}/
COPY libs ./libs

ENV APP_FOLDER_NAME=${APP_FOLDER_NAME}

USER bun
CMD ["sh", "-c", "exec bun apps/${APP_FOLDER_NAME}/src/main.ts"]
