import { Endpoint } from "@libs/common";
import { BaseAuth, ChangePassword, RefreshTokenBody, type SuccessResponse, TokenResponse } from "@libs/contract";
import { Can } from "@nestjs/authorization";
import { Body, Controller } from "@nestjs/common";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Endpoint("POST", {
    path: "sign-up",
    public: true,
    request: BaseAuth,
    response: TokenResponse,
    headers: [["Cache-Control", "no-store"]],
  })
  async signUp(@Body({ schema: BaseAuth }) body: BaseAuth): Promise<TokenResponse> {
    return await this.auth.signUp(body);
  }

  @Endpoint("POST", {
    path: "token",
    public: true,
    request: BaseAuth,
    response: TokenResponse,
    headers: [["Cache-Control", "no-store"]],
  })
  async signIn(@Body({ schema: BaseAuth }) body: BaseAuth): Promise<TokenResponse> {
    return await this.auth.signIn(body);
  }

  @Can.Anyone()
  @Endpoint("POST", { path: "change-password", request: ChangePassword })
  async changePassword(@Body({ schema: ChangePassword }) body: ChangePassword): Promise<SuccessResponse> {
    return await this.auth.changePassword(body);
  }

  @Endpoint("POST", {
    path: "token/revoke",
    public: true,
    request: RefreshTokenBody,
  })
  async revokeToken(@Body({ schema: RefreshTokenBody }) body: RefreshTokenBody): Promise<SuccessResponse> {
    return await this.auth.revokeToken(body);
  }

  @Endpoint("POST", {
    path: "token/refresh",
    public: true,
    request: RefreshTokenBody,
    response: TokenResponse,
    headers: [["Cache-Control", "no-store"]],
  })
  async refreshToken(@Body({ schema: RefreshTokenBody }) body: RefreshTokenBody): Promise<TokenResponse> {
    return await this.auth.refreshToken(body);
  }
}
