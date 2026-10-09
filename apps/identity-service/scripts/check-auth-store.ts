import { MfaFailure, RecoveryCode, RefreshToken, Totp } from "#internal/database/entity/index";
import { AuthStore } from "#internal/module/auth/auth.store";
import { NonEmptyString } from "@libs/contract";
import { databaseConfig } from "@libs/core";
import { MikroORM, SqlSchemaGenerator } from "@mikro-orm/postgresql";
import { AuthenticationStorage } from "@nestjs/authentication";
import { authenticationStoreContract } from "@nestjs/authentication/testing";
import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import "reflect-metadata";

config({ path: resolve(import.meta.dirname, "../.env"), quiet: true });

const applicationDatabase = databaseConfig();
const testDatabase = NonEmptyString.assert(
  process.env["AUTH_STORE_TEST_DATABASE"] ?? "identity-auth-contract",
);
if (
  !/^[a-z][a-z0-9_-]*-auth-contract$/.test(testDatabase) ||
  testDatabase === applicationDatabase.dbName
) {
  throw new Error(
    "AUTH_STORE_TEST_DATABASE must end in -auth-contract and differ from DB_DATABASE.",
  );
}

// Only this run's namespace is created, truncated and dropped, in a separate test database.
const schema = `auth_contract_${randomUUID().replaceAll("-", "")}`;
const orm = await MikroORM.init({
  ...applicationDatabase,
  dbName: "postgres",
  schema,
  entities: [RefreshToken, Totp, RecoveryCode, MfaFailure],
  debug: false,
});
const schemaGenerator = new SqlSchemaGenerator(orm.em.fork({ disableContextResolution: true }));
let databaseReady = false;

function countRows() {
  const em = orm.em.fork({ useContext: false });
  return Promise.all([
    em.count(RefreshToken, {}),
    em.count(Totp, {}),
    em.count(RecoveryCode, {}),
    em.count(MfaFailure, {}),
  ]);
}

try {
  const schemaHelper = orm.driver.getPlatform().getSchemaHelper();
  if (!schemaHelper) throw new Error("The PostgreSQL schema helper is unavailable.");
  const exists = await schemaHelper.databaseExists(orm.em.getConnection(), testDatabase);
  if (exists) await orm.reconnect({ dbName: testDatabase });
  else await orm.schema.createDatabase(testDatabase);
  databaseReady = true;
  await orm.schema.create();

  const cases = authenticationStoreContract(
    async () => {
      await schemaGenerator.clear();
      const storage = new AuthenticationStorage({
        contracts: ["refreshTokens", "mfa"],
        allowInMemoryStorage: false,
      });
      const store = new AuthStore(orm.em, storage);
      return { refreshTokens: store, mfa: store };
    },
    { contracts: ["refreshTokens", "mfa"], concurrent: true },
  );

  const rollback = new Error("Roll back the runner's business transaction.");
  // Store forks commit independently while sharing the outer transaction's connection pool.
  try {
    await orm.em.fork().transactional(async () => {
      for (const contractCase of cases) {
        await contractCase.run();
        console.log(`PASS ${contractCase.name}`);
      }
      console.log(
        "Rows before business rollback [refresh, totp, recovery, failures]:",
        await countRows(),
      );
      throw rollback;
    });
  } catch (error) {
    if (error !== rollback) throw error;
  }
  console.log(
    "Rows after business rollback [refresh, totp, recovery, failures]:",
    await countRows(),
  );
  console.log(
    `Passed ${cases.length} package contract cases with concurrent=true and a shared connection pool.`,
  );
} finally {
  try {
    if (databaseReady) {
      await orm.schema.drop({ dropMigrationsTable: false });
      await orm.schema.dropNamespace(schema);
    }
  } finally {
    await orm.close();
  }
}
