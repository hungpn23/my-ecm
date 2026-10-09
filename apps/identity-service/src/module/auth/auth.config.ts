import { NonEmptyString } from "@libs/contract";
import type { AuthenticationModuleOptions, Duration } from "@nestjs/authentication";
import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";
import { type } from "arktype";
import { createPrivateKey } from "node:crypto";
import { readFileSync } from "node:fs";

const DurationString = type("string").narrow(
  (value, ctx): value is Exclude<Duration, number> =>
    /^\d+(?:\.\d+)?(?:ms|s|m|h|d|w)$/.test(value) ||
    ctx.mustBe("a duration with an explicit unit, such as '15m'"),
);

export const authConfig = registerAs("auth", () => {
  const env = arkenv({
    AUTH_JWT_PRIVATE_KEY_PATH: NonEmptyString,
    AUTH_JWT_ISSUER: NonEmptyString,
    AUTH_JWT_AUDIENCE: NonEmptyString,
    AUTH_ACCESS_TOKEN_TTL: DurationString.default("15m"),
    AUTH_REFRESH_TOKEN_TTL: DurationString.default("30d"),
    AUTH_REFRESH_FAMILY_TTL: DurationString.default("90d"),
  });

  return {
    accessToken: {
      key: createPrivateKey(readFileSync(env.AUTH_JWT_PRIVATE_KEY_PATH)),
      alg: "ES256",
      issuer: env.AUTH_JWT_ISSUER,
      audience: env.AUTH_JWT_AUDIENCE,
      type: "at+jwt",
      ttl: env.AUTH_ACCESS_TOKEN_TTL,
    },
    refreshToken: {
      ttl: env.AUTH_REFRESH_TOKEN_TTL,
      absoluteTtl: env.AUTH_REFRESH_FAMILY_TTL,
    },
  } satisfies AuthenticationModuleOptions;
});

export type AuthConfig = ConfigType<typeof authConfig>;
