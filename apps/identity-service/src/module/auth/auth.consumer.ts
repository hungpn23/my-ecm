import { GetUserPayload, UserResponse } from "@libs/contract";
import type { MicroserviceCommand } from "@libs/core";
import { RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "../user/user.service";

@Controller()
export class AuthConsumer {
  constructor(
    private readonly user: UserService,
    private readonly em: EntityManager,
  ) {}

  @MessagePattern<MicroserviceCommand>("get.user")
  async getUser(
    @Payload({ schema: GetUserPayload }) payload: GetUserPayload,
  ): Promise<UserResponse | null> {
    return await RequestContext.create(this.em, () => this.user.findOne(payload));
  }
}
