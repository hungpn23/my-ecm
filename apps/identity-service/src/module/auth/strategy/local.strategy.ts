import { PASSPORT_STRATEGY } from "@libs/core";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.LOCAL) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<Pick<Express.User, "userId">> {
    const user = await this.authService.validateCredentials(email, password);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    return { userId: user.id };
  }
}
