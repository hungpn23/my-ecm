import { UserEntity } from "#internal/database/entity/index";
import type { GetUserByIdPayload, User } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRpcService {
  constructor(private readonly em: EntityManager) {}

  async findOne(where: GetUserByIdPayload): Promise<User | null> {
    const em = this.em.fork();

    const user = await em.findOne(UserEntity, where, { populate: ["shop"] });
    return user?.toResponse() ?? null;
  }
}
