import { GetUserPayload, UserResponse } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserRpcService } from "./user.rpc-service";

@Controller()
export class UserConsumer {
  constructor(private readonly user: UserRpcService) {}

  @MessagePattern<MicroserviceCommand>("get.user")
  async getUser(
    @Payload({ schema: GetUserPayload }) payload: GetUserPayload,
  ): Promise<UserResponse | null> {
    return await this.user.findOne(payload);
  }
}
