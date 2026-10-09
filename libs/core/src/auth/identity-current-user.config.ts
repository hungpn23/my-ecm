import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";
import { type } from "arktype";

export const identityCurrentUserConfig = registerAs("identityCurrentUser", () => {
  const env = arkenv({
    IDENTITY_SERVICE_URL: type("string.url").configure({ actual: () => "" }),
  });
  const url = new URL(env.IDENTITY_SERVICE_URL);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new TypeError("IDENTITY_SERVICE_URL must be an HTTP(S) origin without credentials.");
  }

  return { origin: url.origin };
});

export type IdentityCurrentUserConfig = ConfigType<typeof identityCurrentUserConfig>;
