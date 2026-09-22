import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { emailConfig, type EmailConfig } from "./email.config";
import { EmailService } from "./email.service";
import { AbstractEmailProvider, SesProvider, SmtpProvider } from "./provider";

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  providers: [
    {
      provide: AbstractEmailProvider,
      inject: [emailConfig.KEY],
      useFactory: (config: EmailConfig) => {
        switch (config.EMAIL_PROVIDER) {
          case "smtp":
            return new SmtpProvider(config);
          case "ses":
            return new SesProvider(config);
        }
      },
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
