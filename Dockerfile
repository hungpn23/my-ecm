FROM oven/bun:1.4.4

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

RUN bun install --frozen-lockfile --production --filter "@apps/${APP_FOLDER_NAME}..."

COPY apps/${APP_FOLDER_NAME}/ ./apps/${APP_FOLDER_NAME}/
COPY libs ./libs

ENV APP_FOLDER_NAME=${APP_FOLDER_NAME}

# Run without root privileges and forward signals directly to Bun.
USER bun
CMD ["sh", "-c", "exec bun apps/${APP_FOLDER_NAME}/src/main.ts"]
