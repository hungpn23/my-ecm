import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { GithubAuthGuard } from "./guards/github-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: any) {
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
