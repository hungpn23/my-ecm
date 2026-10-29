import { ConfigModule } from "@libs/core";
import { Module } from "@nestjs/common";
import { MailModule, SesTransport, SmtpTransport } from "@nestjs/mail";

import { type EmailConfig, emailConfig } from "./email.config";
import { EmailService } from "./email.service";

@Module({
  imports: [
    MailModule.forRootAsync({
      imports: [ConfigModule.forFeatures(emailConfig)],
      inject: [emailConfig.KEY],
      useFactory: (config: EmailConfig) => {
        switch (config.emailTransporter) {
          case "smtp":
            return {
              from: config.emailSender,
              transport: new SmtpTransport({
                host: config.smtpHost,
                port: config.smtpPort,
                secure: config.smtpPort === 465,
                auth: { user: config.smtpUser, pass: config.smtpPass },
              }),
            };
          case "ses":
            return {
              from: config.emailSender,
              transport: new SesTransport({
                region: config.awsRegion,
                endpoint: config.awsEndpointUrl,
                credentials: {
                  accessKeyId: config.awsAccessKeyId,
                  secretAccessKey: config.awsSecretAccessKey,
                },
              }),
            };
          default:
            throw new Error(`Unsupported email transporter.`);
        }
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
