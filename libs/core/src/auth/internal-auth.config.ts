import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";
import { type } from "arktype";

export const INTERNAL_AUTH_HEADER = "x-internal-auth";
export const InternalAuthSecret = type("string.hex == 64").configure({ actual: () => "" });

export const internalAuthConfig = registerAs("internalAuth", () => {
  const env = arkenv({
    AUTH_INTERNAL_SECRET: InternalAuthSecret,
  });

  return { secret: env.AUTH_INTERNAL_SECRET };
});

export type InternalAuthConfig = ConfigType<typeof internalAuthConfig>;
