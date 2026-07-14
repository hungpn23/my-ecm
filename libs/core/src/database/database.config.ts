import { ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const databaseConfig = registerAs("database", () => {
  const config = arkenv({
    DB_HOST: "string >= 1",
    DB_PORT: "number.port",
    DB_USER: "string >= 1",
    DB_PASSWORD: "string >= 1",
    DB_DATABASE: "string >= 1",
  });

  return {
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    dbName: config.DB_DATABASE,
  };
});

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
