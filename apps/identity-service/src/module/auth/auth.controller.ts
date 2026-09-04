import { SuccessResponseSchema, type SuccessResponse } from "@libs/common";
import { AuthenticatedUserSchema, PublicEndpoint, User, type AuthenticatedUser } from "@libs/core";
import { Body, Controller, Get, Post, SerializeOptions, UseGuards } from "@nestjs/common";
import {
  BaseAuthSchema,
  ChangePasswordSchema,
  TokenResponseSchema,
  type ChangePassword,
  type SignUp,
  type TokenResponse,
} from "./auth.schema";
import { AuthService } from "./auth.service";
import { LocalGuard, RefreshGuard } from "./guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicEndpoint()
  @SerializeOptions({ schema: TokenResponseSchema })
  @Post("sign-up")
  async register(@Body({ schema: BaseAuthSchema }) body: SignUp): Promise<TokenResponse> {
    return await this.authService.register(body);
  }

  @UseGuards(LocalGuard)
  @PublicEndpoint()
  @SerializeOptions({ schema: TokenResponseSchema })
  @Post("sign-in")
  async login(@User("userId") userId: string): Promise<TokenResponse> {
    return await this.authService.login(userId);
  }

  @SerializeOptions({ schema: SuccessResponseSchema })
  @Post("change-password")
  async changePassword(
    @User("userId") userId: string,
    @Body({ schema: ChangePasswordSchema }) body: ChangePassword,
  ): Promise<SuccessResponse> {
    return await this.authService.changePassword(userId, body);
  }

  @SerializeOptions({ schema: SuccessResponseSchema })
  @Post("logout")
  async logout(@User() user: AuthenticatedUser): Promise<SuccessResponse> {
    return await this.authService.logout(user);
  }

  @UseGuards(RefreshGuard)
  @PublicEndpoint()
  @SerializeOptions({ schema: TokenResponseSchema })
  @Post("refresh")
  async refreshToken(@User() user: AuthenticatedUser): Promise<TokenResponse> {
    return await this.authService.refreshToken(user);
  }

  @SerializeOptions({ schema: AuthenticatedUserSchema })
  @Get("profile")
  getProfile(@User() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
