import { Module } from "@nestjs/common";
import { EmailModule } from "#internal/module/email/email.module";
import { UserConsumer } from "./user.consumer";

@Module({
  imports: [EmailModule],
  controllers: [UserConsumer],
})
export class UserModule {}
