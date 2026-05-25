import { ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export function getAppConfig() {
  return arkenv({
    APP_PORT: "number.port",
    APP_PORT_TCP: "number.port",
  });
}

export const appConfig = registerAs("app", getAppConfig);

export type AppConfig = ConfigType<typeof appConfig>;
