import { ConfigModule } from "@libs/core";
import { Module } from "@nestjs/common";
import { MailModule as NestMailModule, SesTransport, SmtpTransport } from "@nestjs/mail";
import { mailConfig, type MailConfig } from "./mail.config";
import { MailService } from "./mail.service";

@Module({
  imports: [
    NestMailModule.forRootAsync({
      imports: [ConfigModule.forFeatures(mailConfig)],
      inject: [mailConfig.KEY],
      useFactory: (config: MailConfig) => ({
        from: config.EMAIL_SENDER,
        transport:
          config.EMAIL_PROVIDER === "smtp"
            ? new SmtpTransport({
                host: config.SMTP_HOST,
                port: config.SMTP_PORT,
                secure: config.SMTP_PORT === 465,
                auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
              })
            : new SesTransport({
                region: config.AWS_REGION,
                endpoint: config.AWS_ENDPOINT_URL,
                credentials: {
                  accessKeyId: config.AWS_ACCESS_KEY_ID,
                  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
                },
              }),
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
