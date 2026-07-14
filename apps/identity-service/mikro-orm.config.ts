import { databaseConfig, defineDatabaseConfig } from "@libs/core";
import "dotenv/config";
import { entities } from "./entities.generated";

export default defineDatabaseConfig(entities, databaseConfig());
