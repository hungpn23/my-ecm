import type { MicroserviceCommand } from "@libs/core";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class AuthConsumer {
  @MessagePattern<MicroserviceCommand>("get.user")
  async getUser(@Payload() payload: { userId: string }) {}
}
