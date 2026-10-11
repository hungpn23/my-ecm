import { User } from "#internal/database/entity/index";
import type { GetUserPayload, UserResponse } from "@libs/contract";
import { EnsureRequestContext } from "@mikro-orm/decorators/legacy";
import { EntityManager } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly authCtx: AuthenticationContext,
  ) {}

  async getInfo(): Promise<UserResponse> {
    return this.authCtx.requireUser();
  }

  @EnsureRequestContext()
  async findOne(where: GetUserPayload): Promise<UserResponse | null> {
    const user = await this.em.findOne(User, where, { populate: ["shop"] });
    return user?.toResponse() ?? null;
  }
}
