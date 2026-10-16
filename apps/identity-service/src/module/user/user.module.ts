import { Module } from "@nestjs/common";
import { UserConsumer } from "./user.consumer";
import { UserController } from "./user.controller";
import { UserRpcService } from "./user.rpc-service";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController, UserConsumer],
  providers: [UserService, UserRpcService],
  exports: [UserService],
})
export class UserModule {}
