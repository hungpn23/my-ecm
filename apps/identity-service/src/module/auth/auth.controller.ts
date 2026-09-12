import { Endpoint, type SuccessResponse } from "@libs/common";
import { AuthenticatedUserSchema, User, type AuthenticatedUser } from "@libs/core";
import { Body, Controller, UseGuards } from "@nestjs/common";
import {
  BaseAuthSchema,
  ChangePasswordSchema,
  TokenResponseSchema,
  type ChangePassword,
  type SignIn,
  type SignUp,
  type TokenResponse,
} from "./auth.schema";
import { AuthService } from "./auth.service";
import { RefreshGuard } from "./refresh.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Endpoint({
    method: "POST",
    path: "sign-up",
    isPublic: true,
    request: BaseAuthSchema,
    response: TokenResponseSchema,
  })
  async register(@Body({ schema: BaseAuthSchema }) body: SignUp): Promise<TokenResponse> {
    return await this.authService.signUp(body);
  }

  @Endpoint({
    method: "POST",
    path: "sign-in",
    isPublic: true,
    request: BaseAuthSchema,
    response: TokenResponseSchema,
  })
  async login(@Body({ schema: BaseAuthSchema }) body: SignIn): Promise<TokenResponse> {
    return await this.authService.signIn(body);
  }

  @Endpoint({
    method: "POST",
    path: "change-password",
    request: ChangePasswordSchema,
  })
  async changePassword(
    @User("userId") userId: string,
    @Body({ schema: ChangePasswordSchema }) body: ChangePassword,
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
    response: TokenResponseSchema,
  })
  async refreshToken(@User() user: AuthenticatedUser): Promise<TokenResponse> {
    return await this.authService.refreshToken(user);
  }

  @Endpoint({
    method: "GET",
    path: "profile",
    response: AuthenticatedUserSchema,
  })
  getProfile(@User() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
