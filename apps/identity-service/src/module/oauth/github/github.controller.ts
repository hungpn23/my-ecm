import { Endpoint } from "@libs/common";
import { User } from "@libs/core";
import { Controller, UseGuards } from "@nestjs/common";
import type { Profile } from "passport-github2";
import { GithubGuard } from "./github.guard";

@UseGuards(GithubGuard)
@Controller("github")
export class GithubController {
  @Endpoint("GET", { isPublic: true })
  async login() {}

  @Endpoint("GET", { path: "callback", isPublic: true })
  callback(@User<Profile>() _profile: Profile) {
    return {
      ok: true,
      message: "User information from github",
    };
  }
}
