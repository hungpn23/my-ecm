import { registerAs, type ConfigType } from "@nestjs/config";
import { createEnv } from "arkenv";
import { DefaultEmailConfig } from "../../email.schema";

export const SmtpConfig = DefaultEmailConfig.merge({
  EMAIL_PROVIDER: "'smtp'",
  SMTP_HOST: "string >= 1",
  SMTP_PORT: "number.port",
  SMTP_USER: "string >= 1",
  SMTP_PASS: "string >= 1",
});

export const smtpConfig = registerAs("smtp", () => createEnv(SmtpConfig));

export type SmtpConfig = ConfigType<typeof smtpConfig>;
