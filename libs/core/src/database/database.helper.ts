import { defineConfig, EntitySchema } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import { DatabaseConfig } from "./database.config";

export function defineDatabaseConfig(
  entities: readonly EntitySchema[],
  config: DatabaseConfig,
): ReturnType<typeof defineConfig> {
  return defineConfig({
    ...config,
    driver: PostgreSqlDriver,
    entities: [...entities, "src/**/*.entity.ts"],
    extensions: [SeedManager, Migrator],
    seeder: { pathTs: "src/database/seeders" },
    migrations: {
      path: "dist/database/migration",
      pathTs: "src/database/migration",
    },
  });
}
