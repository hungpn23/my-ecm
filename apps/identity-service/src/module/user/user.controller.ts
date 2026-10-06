import { Endpoint } from "@libs/common";
import { UserResponse } from "@libs/contract";
import { User } from "@libs/core";
import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Endpoint("GET", {
    path: "info",
    response: UserResponse,
  })
  async getInfo(@User("userId") userId: string): Promise<UserResponse> {
    return await this.userService.getInfo(userId);
  }
}
