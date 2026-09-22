import { AwsConfig } from "@libs/core";
import { registerAs, type ConfigType } from "@nestjs/config";
import { createEnv } from "arkenv";
import { DefaultEmailConfig } from "../../email.schema";

export const SesConfig = DefaultEmailConfig.merge({
  EMAIL_PROVIDER: "'ses'",
}).merge(AwsConfig);

export const sesConfig = registerAs("ses", () => createEnv(SesConfig));

export type SesConfig = ConfigType<typeof sesConfig>;
