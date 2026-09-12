import { defineConfig, EntitySchema, p } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import { v7 } from "uuid";
import type { DatabaseConfig } from "./database.config";

export function defineDatabaseConfig(
  entities: readonly EntitySchema[],
  config: DatabaseConfig,
): ReturnType<typeof defineConfig> {
  return defineConfig({
    ...config,
    driver: PostgreSqlDriver,
    entities,
    extensions: [SeedManager, Migrator],
    seeder: { pathTs: "src/database/seeders" },
    migrations: {
      path: "dist/database/migration",
      pathTs: "src/database/migration",
    },
  });
}

// oxlint-disable-next-line anti-slop/no-unsafe-dictionary-type
export function useBaseProps<T extends Record<string, unknown>>(props: T) {
  return {
    id: p
      .uuid()
      .primary()
      .onCreate(() => v7()),
    ...props,
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  };
}
