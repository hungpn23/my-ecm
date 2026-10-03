import { ConfigModule } from "@libs/core";
import { Module } from "@nestjs/common";
import { MailModule, MailTransport, SesTransport, SmtpTransport } from "@nestjs/mail";
import { emailConfig, type EmailConfig } from "./email.config";
import { EmailService } from "./email.service";

@Module({
  imports: [
    MailModule.forRootAsync({
      imports: [ConfigModule.forFeatures(emailConfig)],
      inject: [emailConfig.KEY],
      useFactory: (config: EmailConfig) => {
        let transport: MailTransport;
        switch (config.EMAIL_TRANSPORTER) {
          case "smtp":
            transport = new SmtpTransport({
              host: config.SMTP_HOST,
              port: config.SMTP_PORT,
              secure: config.SMTP_PORT === 465,
              auth: { user: config.SMTP_USER, pass: config.SMTP_PASS },
            });
            break;
          case "ses":
            transport = new SesTransport({
              region: config.AWS_REGION,
              endpoint: config.AWS_ENDPOINT_URL,
              credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
              },
            });
            break;
          default:
            throw new Error(`Unsupported email transporter.`);
        }

        return {
          from: config.EMAIL_SENDER,
          transport,
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
