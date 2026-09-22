import { InjectRepository } from "@mikro-orm/nestjs";
import { wrap, type EntityRepository } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@src/database/entity";
import type { UserResponse } from "./user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  async getInfo(userId: string): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ id: userId });
    if (!user) throw new NotFoundException();

    return wrap(user).toObject();
  }
}
