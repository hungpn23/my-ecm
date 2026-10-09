import { Endpoint } from "@libs/common";
import {
  BaseAuth,
  ChangePassword,
  RefreshTokenBody,
  TokenResponse,
  type SuccessResponse,
} from "@libs/contract";
import { Body, Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Endpoint("POST", {
    path: "sign-up",
    isPublic: true,
    request: BaseAuth,
    response: TokenResponse,
    headers: [["Cache-Control", "no-store"]],
  })
  async register(@Body({ schema: BaseAuth }) body: BaseAuth): Promise<TokenResponse> {
    return await this.authService.signUp(body);
  }

  @Endpoint("POST", {
    path: "token",
    isPublic: true,
    request: BaseAuth,
    response: TokenResponse,
    headers: [["Cache-Control", "no-store"]],
  })
  async login(@Body({ schema: BaseAuth }) body: BaseAuth): Promise<TokenResponse> {
    return await this.authService.signIn(body);
  }

  @Endpoint("POST", { path: "change-password", request: ChangePassword })
  async changePassword(
    @Body({ schema: ChangePassword }) body: ChangePassword,
  ): Promise<SuccessResponse> {
    return await this.authService.changePassword(body);
  }

  @Endpoint("POST", { path: "token/revoke", isPublic: true, request: RefreshTokenBody })
  async revokeToken(
    @Body({ schema: RefreshTokenBody }) body: RefreshTokenBody,
  ): Promise<SuccessResponse> {
    return await this.authService.revokeToken(body);
  }

  @Endpoint("POST", {
    path: "token/refresh",
    isPublic: true,
    request: RefreshTokenBody,
    response: TokenResponse,
    headers: [["Cache-Control", "no-store"]],
  })
  async refreshToken(
    @Body({ schema: RefreshTokenBody }) body: RefreshTokenBody,
  ): Promise<TokenResponse> {
    return await this.authService.refreshToken(body);
  }
}
