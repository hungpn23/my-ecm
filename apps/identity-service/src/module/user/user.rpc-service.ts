import { User } from "#internal/database/entity/index";
import type { GetUserPayload, UserResponse } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRpcService {
  constructor(private readonly em: EntityManager) {}

  async findOne(where: GetUserPayload): Promise<UserResponse | null> {
    const em = this.em.fork();

    const user = await em.findOne(User, where, { populate: ["shop"] });
    return user?.toResponse() ?? null;
  }
}
