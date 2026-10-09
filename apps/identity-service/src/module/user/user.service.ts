import { User } from "#internal/database/entity/index";
import type { UserResponse, Uuid } from "@libs/contract";
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

  async findById(userId: Uuid): Promise<UserResponse | null> {
    const user = await this.em.findOne(User, { id: userId }, { populate: ["shop"] });
    if (!user) return null;

    return user.toResponse();
  }
}
