import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const jwtConfig = registerAs("jwt", () => {
  return arkenv({
    JWT_ALGORITHM: '"HS256"',
    JWT_ISSUER: "string >= 1",
    JWT_AUDIENCE: "string >= 1",
    JWT_SECRET: "string.hex == 64",
    JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS: "number.integer",
    JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS: "number.integer",
  });
});

export type JwtConfig = ConfigType<typeof jwtConfig>;
