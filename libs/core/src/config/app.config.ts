import arkenv from "@arkenv/core";
import { type ConfigType, registerAs } from "@nestjs/config";
import { type } from "arktype";

const ServiceName = type("string").narrow(
  (s, ctx): s is `${string}-service` => s.endsWith("-service") || ctx.mustBe("a string ending with '-service'"),
);

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
