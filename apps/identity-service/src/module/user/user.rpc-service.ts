import type { GetUserByIdPayload, User } from "@libs/contract";
import { Injectable } from "@nestjs/common";

import { UserService } from "./user.service";

@Injectable()
export class UserRpcService {
  constructor(private readonly user: UserService) {}

  async findOne(where: GetUserByIdPayload): Promise<User | null> {
    return await this.user.findOne(where);
  }
}
