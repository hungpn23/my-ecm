import { GetUserByIdPayload, User } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { UserRpcService } from "./user.rpc-service";

@Controller()
export class UserConsumer {
  constructor(private readonly user: UserRpcService) {}

  @MessagePattern<MicroserviceCommand>("get.user.by-id")
  async getUser(@Payload({ schema: GetUserByIdPayload }) payload: GetUserByIdPayload): Promise<User | null> {
    return await this.user.findOne(payload);
  }
}
