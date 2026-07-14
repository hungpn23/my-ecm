import { PublicEndpoint, type AuthenticatedRequest } from "@libs/core";
import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { RegisterDto } from "./dto/register.dto";
import { GithubAuthGuard } from "./guard/github-auth.guard";
import { GoogleAuthGuard } from "./guard/google-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";

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
  async login(@Request() req: AuthenticatedRequest) {
    return await this.authService.login(req.user.userId);
  }

  @Get("profile")
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @PublicEndpoint()
  @Get("google")
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @PublicEndpoint()
  @Get("google/callback")
  googleCallback(@Request() req: Express.Request) {
    return this.authService.googleLogin(req);
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
