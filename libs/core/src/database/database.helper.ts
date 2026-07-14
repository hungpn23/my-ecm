import { DatabaseConfig } from "./database.config";
import { SeedManager } from "@mikro-orm/seeder";
import { Migrator } from "@mikro-orm/migrations";
import { defineConfig } from "@mikro-orm/core";

export function defineDatabaseConfig(config: DatabaseConfig): ReturnType<typeof defineConfig> {
  return defineConfig({
    ...config,
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    extensions: [SeedManager, Migrator],
    seeder: { pathTs: "src/db/seeders" },
    migrations: {
      path: "dist/db/migrations",
      pathTs: "src/db/migrations",
    },
  });
}
