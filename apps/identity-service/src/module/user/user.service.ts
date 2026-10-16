import { User } from "#internal/database/entity/index";
import type { GetUserByIdPayload, UserResponse } from "@libs/contract";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly authCtx: AuthenticationContext,
  ) {}

  getInfo(): UserResponse {
    return this.authCtx.requireUser();
  }

  async findOne(where: GetUserByIdPayload): Promise<UserResponse | null> {
    const em = this.em.fork();

    const user = await em.findOne(User, where, { populate: ["shop"] });
    return user?.toResponse() ?? null;
  }
}
