import { UserEntity } from "#internal/database/entity/index";
import type { GetUserByIdPayload, UserResponse } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly authContext: AuthenticationContext,
  ) {}

  getInfo(): UserResponse {
    return this.authContext.requireUser();
  }

  async findOne(where: GetUserByIdPayload): Promise<UserResponse | null> {
    const em = this.em.fork();

    const user = await em.findOne(UserEntity, where, { populate: ["shop"] });
    return user?.toResponse() ?? null;
  }
}
