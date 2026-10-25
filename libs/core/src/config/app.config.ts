import arkenv from "@arkenv/core";
import { NonEmptyString } from "@libs/contract";
import { type ConfigType, registerAs } from "@nestjs/config";
import { type } from "arktype";

const ServiceName = type("string").narrow(
  (s, ctx): s is `${string}-service` => s.endsWith("-service") || ctx.mustBe("a string ending with '-service'"),
);

export const appConfig = registerAs("app", () =>
  arkenv({
    NODE_ENV: "'development' | 'production'",
    APP_NAME: ServiceName,
    APP_HOST: "string.host",
    APP_PORT: "number.port",
    OBSERVE_APP_KEY: NonEmptyString,
    OBSERVE_APP_SECRET: NonEmptyString,
    OBSERVE_ENABLE_DEBUG: "boolean = false",
  }),
);

export type AppConfig = ConfigType<typeof appConfig>;
