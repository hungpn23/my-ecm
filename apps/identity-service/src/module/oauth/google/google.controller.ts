import { Endpoint } from "@libs/common";
import { Controller, UseGuards } from "@nestjs/common";
import { GoogleGuard } from "./google.guard";

@UseGuards(GoogleGuard)
@Controller("google")
export class GoogleController {
  @Endpoint("GET", { isPublic: true })
  async login() {}

  @Endpoint("GET", { path: "callback", isPublic: true })
  callback() {
    return {
      ok: true,
      message: "User information from google",
    };
  }
}
