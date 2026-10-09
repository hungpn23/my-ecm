import { Endpoint } from "@libs/common";
import { UserResponse, Uuid } from "@libs/contract";
import { Controller, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { InternalAuthGuard } from "./internal-auth.guard";

@ApiExcludeController()
@UseGuards(InternalAuthGuard)
@Controller("internal/auth")
export class InternalAuthController {
  constructor(private readonly userService: UserService) {}

  @Endpoint("GET", {
    path: "users/:userId",
    isPublic: true,
    response: UserResponse,
    headers: [["Cache-Control", "no-store"]],
  })
  async resolve(@Param("userId", { schema: Uuid }) userId: Uuid): Promise<UserResponse> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException();

    return user;
  }
}
