import { AwsConfig } from "@libs/core";
import { type } from "arkenv";

const DefaultEmailConfig = type({
  EMAIL_SENDER: "string.email",
});

export const SmtpConfig = DefaultEmailConfig.merge({
  EMAIL_TRANSPORTER: "'smtp'",
  SMTP_HOST: "string >= 1",
  SMTP_PORT: "number.port",
  SMTP_USER: "string >= 1",
  SMTP_PASS: "string >= 1",
});

export const SesConfig = DefaultEmailConfig.merge({
  EMAIL_TRANSPORTER: "'ses'",
}).merge(AwsConfig);
