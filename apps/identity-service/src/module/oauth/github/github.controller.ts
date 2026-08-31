import { PublicEndpoint } from "@libs/core";
import { Controller, Get, UseGuards } from "@nestjs/common";
import type { Profile } from "passport-github2";
import { GithubProfile } from "./github.decorator";
import { GithubGuard } from "./github.guard";

@UseGuards(GithubGuard)
@PublicEndpoint()
@Controller("github")
export class GithubController {
  @Get()
  async login() {}

  @Get("callback")
  callback(@GithubProfile() profile: Profile) {
    return {
      message: "User information from github",
      profile,
    };
  }
}
