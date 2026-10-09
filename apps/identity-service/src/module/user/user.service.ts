import { User } from "#internal/database/entity/index";
import type { UserResponse, Uuid } from "@libs/contract";
import { InjectRepository } from "@mikro-orm/nestjs";
import { type EntityRepository } from "@mikro-orm/postgresql";
import { AuthenticationContext } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly authCtx: AuthenticationContext,
  ) {}

  async getInfo(): Promise<UserResponse> {
    return this.authCtx.requireUser();
  }

  async findById(userId: Uuid): Promise<UserResponse | null> {
    const user = await this.userRepo.findOne({ id: userId }, { populate: ["shop"] });
    if (!user) return null;

    return user.toResponse();
  }
}
