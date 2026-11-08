import type { GetUserByIdPayload, NullableUser } from "@libs/contract";
import { Injectable } from "@nestjs/common";

import { UserService } from "./user.service";

@Injectable()
export class UserRpcService {
  constructor(private readonly user: UserService) {}

  async findOne(where: GetUserByIdPayload): Promise<NullableUser> {
    return await this.user.findOne(where);
  }
}
