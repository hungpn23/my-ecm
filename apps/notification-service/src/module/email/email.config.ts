import { NonEmptyString } from "@libs/contract";
import { AwsConfig } from "@libs/core";
import { type ConfigType, registerAs } from "@nestjs/config";
import { createEnv, type } from "arkenv";

const DefaultEmailConfig = type({
  EMAIL_SENDER: "string.email",
});

const SmtpConfig = DefaultEmailConfig.merge({
  EMAIL_TRANSPORTER: "'smtp'",
  SMTP_HOST: NonEmptyString,
  SMTP_PORT: "number.port",
  SMTP_USER: NonEmptyString,
  SMTP_PASS: NonEmptyString,
});

const SesConfig = DefaultEmailConfig.merge({
  EMAIL_TRANSPORTER: "'ses'",
}).merge(AwsConfig);

export const emailConfig = registerAs("email", () => createEnv(SmtpConfig.or(SesConfig)));

export type EmailConfig = ConfigType<typeof emailConfig>;
