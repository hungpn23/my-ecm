import arkenv, { type } from "@arkenv/core";
import { NonEmptyString } from "@libs/contract";
import { AwsConfig } from "@libs/core";
import { type ConfigType, registerAs } from "@nestjs/config";

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

export const emailConfig = registerAs("email", () => {
  const env = arkenv(SmtpConfig.or(SesConfig));

  if (env.EMAIL_TRANSPORTER === "smtp") {
    return {
      emailTransporter: env.EMAIL_TRANSPORTER,
      emailSender: env.EMAIL_SENDER,
      smtpHost: env.SMTP_HOST,
      smtpPort: env.SMTP_PORT,
      smtpUser: env.SMTP_USER,
      smtpPass: env.SMTP_PASS,
    };
  }

  return {
    emailTransporter: env.EMAIL_TRANSPORTER,
    emailSender: env.EMAIL_SENDER,
    awsRegion: env.AWS_REGION,
    awsEndpointUrl: env.AWS_ENDPOINT_URL,
    awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  };
});

export type EmailConfig = ConfigType<typeof emailConfig>;
