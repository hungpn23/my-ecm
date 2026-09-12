import { Endpoint, type SuccessResponse } from "@libs/common";
import { AuthenticatedUser, User } from "@libs/core";
import { Body, Controller, UseGuards } from "@nestjs/common";
import { BaseAuth, ChangePassword, type SignIn, type SignUp, TokenResponse } from "./auth.schema";
import { AuthService } from "./auth.service";
import { RefreshGuard } from "./refresh.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Endpoint({
    method: "POST",
    path: "sign-up",
    isPublic: true,
    request: BaseAuth,
    response: TokenResponse,
  })
  async register(@Body({ schema: BaseAuth }) body: SignUp): Promise<TokenResponse> {
    return await this.authService.signUp(body);
  }

  @Endpoint({
    method: "POST",
    path: "sign-in",
    isPublic: true,
    request: BaseAuth,
    response: TokenResponse,
  })
  async login(@Body({ schema: BaseAuth }) body: SignIn): Promise<TokenResponse> {
    return await this.authService.signIn(body);
  }

  @Endpoint({
    method: "POST",
    path: "change-password",
    request: ChangePassword,
  })
  async changePassword(
    @User("userId") userId: string,
    @Body({ schema: ChangePassword }) body: ChangePassword,
  ): Promise<SuccessResponse> {
    return await this.authService.changePassword(userId, body);
  }

  @Endpoint({
    method: "POST",
    path: "logout",
  })
  async logout(@User() user: AuthenticatedUser): Promise<SuccessResponse> {
    return await this.authService.logout(user);
  }

  @UseGuards(RefreshGuard)
  @Endpoint({
    method: "POST",
    path: "refresh",
    isPublic: true,
    response: TokenResponse,
  })
  async refreshToken(@User() user: AuthenticatedUser): Promise<TokenResponse> {
    return await this.authService.refreshToken(user);
  }

  @Endpoint({
    method: "GET",
    path: "profile",
    response: AuthenticatedUser,
  })
  getProfile(@User() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
