import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export function getAppConfig() {
  return arkenv({
    NODE_ENV: "'development' | 'production'",
    APP_HOST: "string.host",
    APP_PORT: "number.port",
    APP_PORT_TCP: "number.port",
  });
}

export const appConfig = registerAs("app", getAppConfig);

export type AppConfig = ConfigType<typeof appConfig>;
