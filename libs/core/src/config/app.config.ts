import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";
import { type } from "arktype";

const ServiceName = type("string").narrow(
  (s, ctx): s is `${string}-service` =>
    s.endsWith("-service") || ctx.mustBe("a string ending with '-service'"),
);

export const appConfig = registerAs("app", () =>
  arkenv({
    NODE_ENV: "'development' | 'production'",
    APP_NAME: ServiceName,
    APP_HOST: "string.host",
    APP_PORT: "number.port",
  }),
);

export type AppConfig = ConfigType<typeof appConfig>;
