import { ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const jwtConfig = registerAs("jwt", () => {
  return arkenv({
    JWT_ALGORITHM: '"RS256"',
    JWT_ISSUER: "string >= 1",
    JWT_AUDIENCE: "string >= 1",
    JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS: "number.integer",
    JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS: "number.integer",
    JWT_PRIVATE_KEY_BASE64: "string >= 1",
    JWT_PUBLIC_KEY_BASE64: "string >= 1",
  });
});

export type JwtConfig = ConfigType<typeof jwtConfig>;
