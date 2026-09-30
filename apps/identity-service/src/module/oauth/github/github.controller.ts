import { Endpoint } from "@libs/common";
import { Controller, UseGuards } from "@nestjs/common";
import { GithubGuard } from "./github.guard";

@UseGuards(GithubGuard)
@Controller("github")
export class GithubController {
  @Endpoint("GET", { isPublic: true })
  async login() {}

  @Endpoint("GET", { path: "callback", isPublic: true })
  callback() {
    return {
      ok: true,
      message: "User information from github",
    };
  }
}
