import { Module } from "@nestjs/common";
import { UserConsumer } from "./user.consumer";

@Module({
  controllers: [UserConsumer],
})
export class UserModule {}
