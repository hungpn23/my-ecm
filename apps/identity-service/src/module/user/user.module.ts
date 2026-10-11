import { Module } from "@nestjs/common";
import { UserConsumer } from "./user.consumer";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController, UserConsumer],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
