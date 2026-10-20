import { GetUserByIdPayload, User } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Can } from "@nestjs/authorization";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserRpcService } from "./user.rpc-service";

@Controller()
export class UserConsumer {
  constructor(private readonly user: UserRpcService) {}

  @Can.Anyone()
  @MessagePattern<MicroserviceCommand>("get.user.by-id")
  async getUser(
    @Payload({ schema: GetUserByIdPayload }) payload: GetUserByIdPayload,
  ): Promise<User | null> {
    return await this.user.findOne(payload);
  }
}
