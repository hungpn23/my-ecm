import { AwsConfig } from "@libs/core";
import { type } from "arkenv";

const DefaultMailConfig = type({
  EMAIL_SENDER: "string.email",
});

export const SmtpConfig = DefaultMailConfig.merge({
  EMAIL_PROVIDER: "'smtp'",
  SMTP_HOST: "string >= 1",
  SMTP_PORT: "number.port",
  SMTP_USER: "string >= 1",
  SMTP_PASS: "string >= 1",
});

export const SesConfig = DefaultMailConfig.merge({
  EMAIL_PROVIDER: "'ses'",
}).merge(AwsConfig);
