import { PublicEndpoint } from "@libs/core";
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
  async login(@Request() req: Express.AuthenticatedRequest) {
    return await this.authService.login(req.user.userId);
  }

  @Get("profile")
  getProfile(@Request() req: Express.MayBeAuthenticatedRequest) {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get("google")
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  googleCallback(@Request() req: Express.Request) {
    return this.authService.googleLogin(req);
  }

  @UseGuards(GithubAuthGuard)
  @Get("github")
  async githubAuth() {}

  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
  githubCallback(@Request() req: Express.Request) {
    return this.authService.githubLogin(req);
  }
}
