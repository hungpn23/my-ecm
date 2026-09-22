import { awsConfig } from "@libs/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { emailConfig } from "./email.config";
import { EmailService } from "./email.service";

@Module({
  imports: [ConfigModule.forFeature(awsConfig), ConfigModule.forFeature(emailConfig)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
