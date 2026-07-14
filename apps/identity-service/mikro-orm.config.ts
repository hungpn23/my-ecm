import "dotenv/config";
import { databaseConfig, defineDatabaseConfig } from "@libs/core";

export default defineDatabaseConfig(databaseConfig());
