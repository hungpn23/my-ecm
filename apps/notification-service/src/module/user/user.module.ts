import { EmailModule } from "#internal/module/email/email.module";
import { Module } from "@nestjs/common";
import { UserConsumer } from "./user.consumer";

@Module({
  imports: [EmailModule],
  controllers: [UserConsumer],
})
export class UserModule {}
