import arkenv from "@arkenv/core";
import { ServiceName } from "@libs/contract";
import { type ConfigType, registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => {
  const env = arkenv({
    NODE_ENV: "'development' | 'production'",
    APP_NAME: ServiceName,
    APP_HOST: "string.host",
    APP_PORT: "number.port",
  });

  return {
    nodeEnv: env.NODE_ENV,
    appName: env.APP_NAME,
    appHost: env.APP_HOST,
    appPort: env.APP_PORT,
  };
});

export type AppConfig = ConfigType<typeof appConfig>;
