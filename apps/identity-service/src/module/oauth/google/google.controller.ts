import { PublicEndpoint } from "@libs/core";
import { Controller, Get, UseGuards } from "@nestjs/common";
import type { Profile } from "passport-google-oauth20";
import { GoogleProfile } from "./google.decorator";
import { GoogleGuard } from "./google.guard";

@UseGuards(GoogleGuard)
@PublicEndpoint()
@Controller("google")
export class GoogleController {
  @Get()
  async login() {}

  @Get("callback")
  callback(@GoogleProfile() profile: Profile) {
    return {
      message: "User information from google",
      profile,
    };
  }
}
