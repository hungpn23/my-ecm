import { Endpoint } from "@libs/common";
import { Controller, UseGuards } from "@nestjs/common";
import type { Profile } from "passport-github2";
import { GithubProfile } from "./github.decorator";
import { GithubGuard } from "./github.guard";

@UseGuards(GithubGuard)
@Controller("github")
export class GithubController {
  @Endpoint({
    method: "GET",
    isPublic: true,
  })
  async login() {}

  @Endpoint({
    method: "GET",
    path: "callback",
    isPublic: true,
  })
  callback(@GithubProfile() _profile: Profile) {
    return {
      ok: true,
      message: "User information from github",
    };
  }
}
