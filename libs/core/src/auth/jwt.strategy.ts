import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_KIND, PASSPORT_STRATEGY } from "./auth.constant";
import type { AuthenticatedUser } from "./auth.schema";
import { jwtConfig, type JwtConfig } from "./jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.JWT) {
  constructor(
    @Inject(jwtConfig.KEY)
    jwtConf: JwtConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConf.JWT_SECRET,
      algorithms: [jwtConf.JWT_ALGORITHM],
      audience: jwtConf.JWT_AUDIENCE,
      issuer: jwtConf.JWT_ISSUER,
    });
  }

  async validate(payload: AuthenticatedUser): Promise<AuthenticatedUser> {
    if (payload.jwtKind !== JWT_KIND.ACCESS_TOKEN) throw new UnauthorizedException();

    return payload;
  }
}
