import type { AnyRecord, Uuid } from "@libs/contract";
import { defineConfig, p, type UniversalPropertyOptionsBuilder } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import { v7 } from "uuid";

import type { DatabaseConfig } from "./database.config";

export function defineDatabaseConfig({ enableDebug, ...config }: DatabaseConfig): ReturnType<typeof defineConfig> {
  return defineConfig({
    ...config,
    driver: PostgreSqlDriver,
    entities: ["src/database/entity/index.ts"],
    extensions: [SeedManager, Migrator],
    seeder: { pathTs: "src/database/seeders" },
    migrations: {
      path: "dist/database/migration",
      pathTs: "src/database/migration",
    },
    debug: enableDebug,
  });
}

export interface BaseProps {
  id: UniversalPropertyOptionsBuilder<
    Uuid,
    ReturnType<ReturnType<ReturnType<typeof p.uuid>["primary"]>["onCreate"]>["~options"],
    keyof ReturnType<ReturnType<typeof p.uuid>["primary"]>
  >;
  createdAt: ReturnType<ReturnType<typeof p.datetime>["onCreate"]>;
  updatedAt: ReturnType<ReturnType<ReturnType<typeof p.datetime>["onCreate"]>["onUpdate"]>;
}

export function useBaseProps<T extends AnyRecord>(props: T): T & BaseProps {
  return {
    id: p
      .uuid()
      .primary()
      .onCreate(() => v7())
      .$type<Uuid>(),
    ...props,
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  };
}
