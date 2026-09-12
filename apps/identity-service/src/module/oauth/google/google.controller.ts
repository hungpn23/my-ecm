import { Endpoint } from "@libs/common";
import { Controller, UseGuards } from "@nestjs/common";
import type { Profile } from "passport-google-oauth20";
import { GoogleProfile } from "./google.decorator";
import { GoogleGuard } from "./google.guard";

@UseGuards(GoogleGuard)
@Controller("google")
export class GoogleController {
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
  callback(@GoogleProfile() _profile: Profile) {
    return {
      ok: true,
      message: "User information from google",
    };
  }
}
