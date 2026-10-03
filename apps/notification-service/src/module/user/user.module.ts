import { MailModule } from "#internal/module/mail/mail.module";
import { Module } from "@nestjs/common";
import { UserConsumer } from "./user.consumer";

@Module({
  imports: [MailModule],
  controllers: [UserConsumer],
})
export class UserModule {}
