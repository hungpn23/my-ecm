import { Endpoint } from "@libs/common";
import { User } from "@libs/core";
import { Controller, UseGuards } from "@nestjs/common";
import type { Profile } from "passport-google-oauth20";
import { GoogleGuard } from "./google.guard";

@UseGuards(GoogleGuard)
@Controller("google")
export class GoogleController {
  @Endpoint("GET", { isPublic: true })
  async login() {}

  @Endpoint("GET", { path: "callback", isPublic: true })
  callback(@User<Profile>() _profile: Profile) {
    return {
      ok: true,
      message: "User information from google",
    };
  }
}
