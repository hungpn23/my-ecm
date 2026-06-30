import { Injectable, Inject } from "@nestjs/common";
import { jwtConfig, type JwtConfig } from "../../config";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConf: JwtConfig,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateCredentials(email: string, _password: string) {
    const user = await this.usersService.findByEmail(email);

    // && (await verify(user.hashedPassword, password))
    if (user) {
      const { hashedPassword: _, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.jwtConf.JWT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      }),
    };
  }

  googleLogin(req: any) {
    if (!req.user) {
      return "No user from google";
    }

    return {
      message: "User information from google",
      user: req.user,
    };
  }

  githubLogin(req: any) {
    if (!req.user) {
      return "No user from github";
    }

    return {
      message: "User information from github",
      user: req.user,
    };
  }
}
