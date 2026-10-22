import { Endpoint } from "@libs/common";
import { User } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Controller } from "@nestjs/common";

import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly user: UserService) {}

  @Can.Anyone()
  @Endpoint("GET", {
    path: "info",
    response: User,
  })
  getInfo(): User {
    return this.user.getInfo();
  }
}
