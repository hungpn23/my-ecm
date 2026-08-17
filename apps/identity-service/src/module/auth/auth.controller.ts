import { PublicEndpoint, User, type AuthenticatedUser } from "@libs/core";
import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { RegisterDto } from "./dto";
import { GithubAuthGuard, GoogleAuthGuard, LocalAuthGuard, RefreshTokenGuard } from "./guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicEndpoint()
  @Post("register")
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @PublicEndpoint()
  @Post("login")
  async login(@User("userId") userId: string) {
    return await this.authService.login(userId);
  }

  @Post("logout")
  async logout(@User() user: AuthenticatedUser) {
    return await this.authService.logout(user);
  }

  @UseGuards(RefreshTokenGuard)
  @PublicEndpoint()
  @Post("refresh")
  async refreshToken(@User() user: AuthenticatedUser) {
    return await this.authService.refreshToken(user);
  }

  @Get("profile")
  getProfile(@User() user: AuthenticatedUser) {
    return user;
  }

  @UseGuards(GoogleAuthGuard)
  @PublicEndpoint()
  @Get("google")
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @PublicEndpoint()
  @Get("google/callback")
  googleCallback(@User() user: AuthenticatedUser) {
    return this.authService.googleLogin(user);
  }

  @UseGuards(GithubAuthGuard)
  @PublicEndpoint()
  @Get("github")
  async githubAuth() {}

  @UseGuards(GithubAuthGuard)
  @PublicEndpoint()
  @Get("github/callback")
  githubCallback(@Request() req: Express.Request) {
    return this.authService.githubLogin(req);
  }
}
