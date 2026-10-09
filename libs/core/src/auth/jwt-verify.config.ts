import { NonEmptyString } from "@libs/contract";
import type { JwtVerifierOptions } from "@nestjs/authentication";
import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";
import { createPublicKey } from "node:crypto";
import { readFileSync } from "node:fs";

export const jwtVerifyConfig = registerAs("jwtVerify", () => {
  const env = arkenv({
    AUTH_JWT_PUBLIC_KEY_PATH: NonEmptyString,
    AUTH_JWT_ISSUER: NonEmptyString,
    AUTH_JWT_AUDIENCE: NonEmptyString,
  });

  return {
    key: createPublicKey(readFileSync(env.AUTH_JWT_PUBLIC_KEY_PATH)),
    algorithms: ["ES256"],
    issuer: env.AUTH_JWT_ISSUER,
    audience: env.AUTH_JWT_AUDIENCE,
    type: "at+jwt",
  } satisfies JwtVerifierOptions;
});

export type JwtVerifyConfig = ConfigType<typeof jwtVerifyConfig>;
