import { NonEmptyString } from "@libs/common";
import { AwsConfig } from "@libs/core";
import { type } from "arkenv";

const DefaultEmailConfig = type({
  EMAIL_SENDER: "string.email",
});

export const SmtpConfig = DefaultEmailConfig.merge({
  EMAIL_TRANSPORTER: "'smtp'",
  SMTP_HOST: NonEmptyString,
  SMTP_PORT: "number.port",
  SMTP_USER: NonEmptyString,
  SMTP_PASS: NonEmptyString,
});

export const SesConfig = DefaultEmailConfig.merge({
  EMAIL_TRANSPORTER: "'ses'",
}).merge(AwsConfig);
