import type { GetUserById, NullableUser, User } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

import { UserEntity } from "#internal/database/entity/index";

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly authContext: AuthenticationContext,
  ) {}

  getInfo(): User {
    return this.authContext.requireUser();
  }

  async findOne({ userId }: GetUserById): Promise<NullableUser> {
    const em = this.em.fork();

    const user = await em.findOne(UserEntity, { id: userId }, { populate: ["shop"] });
    return user?.toResponse() ?? null;
  }
}
