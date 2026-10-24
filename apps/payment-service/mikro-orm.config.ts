import { resolve } from "node:path";

import { databaseConfig, defineDatabaseConfig } from "@libs/core";
import { config } from "dotenv";

config({
  path: [resolve(import.meta.dirname, "../../.env"), resolve(import.meta.dirname, ".env")],
});

export default defineDatabaseConfig(databaseConfig());
