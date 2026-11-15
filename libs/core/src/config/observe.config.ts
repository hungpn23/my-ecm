import arkenv from "@arkenv/core";
import { NonEmptyString } from "@libs/contract";
import { type ConfigType, registerAs } from "@nestjs/config";

export const observeConfig = registerAs("observe", () => {
  const env = arkenv({
    OBSERVE_APP_KEY: NonEmptyString,
    OBSERVE_APP_SECRET: NonEmptyString,
    OBSERVE_ENABLE_DEBUG: "boolean = false",
  });

  return {
    observeAppKey: env.OBSERVE_APP_KEY,
    observeAppSecret: env.OBSERVE_APP_SECRET,
    observeEnableDebug: env.OBSERVE_ENABLE_DEBUG,
  };
});

export type ObserveConfig = ConfigType<typeof observeConfig>;
