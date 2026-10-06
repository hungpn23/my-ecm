import { User } from "#internal/database/entity/index";
import type { UserResponse, Uuid } from "@libs/contract";
import { InjectRepository } from "@mikro-orm/nestjs";
import { type EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  async getInfo(userId: Uuid): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ id: userId }, { populate: ["shop"] });
    if (!user) throw new NotFoundException();

    return user.toResponse();
  }
}
