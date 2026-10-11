import { GetUserPayload, UserResponse } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "./user.service";

@Controller()
export class UserConsumer {
  constructor(private readonly user: UserService) {}

  @MessagePattern<MicroserviceCommand>("get.user")
  async getUser(
    @Payload({ schema: GetUserPayload }) payload: GetUserPayload,
  ): Promise<UserResponse | null> {
    return await this.user.findOne(payload);
  }
}
