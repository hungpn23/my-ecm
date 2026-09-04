import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtidBy, RedisService } from "../redis";
import { JWT_KIND, PASSPORT_STRATEGY } from "./auth.constant";
import type { AuthenticatedUser } from "./auth.schema";
import { jwtConfig, type JwtConfig } from "./jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.JWT) {
  constructor(
    @Inject(jwtConfig.KEY)
    jwtConf: JwtConfig,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConf.JWT_SECRET,
      algorithms: [jwtConf.JWT_ALGORITHM],
      audience: jwtConf.JWT_AUDIENCE,
      issuer: jwtConf.JWT_ISSUER,
    });
  }

  async validate(user: AuthenticatedUser): Promise<AuthenticatedUser> {
    const { jwtKind, userId, sessionId } = user;
    if (jwtKind !== JWT_KIND.ACCESS_TOKEN) throw new UnauthorizedException();

    const jwtid = await this.redisService.get(jwtidBy(userId, sessionId));
    if (!jwtid) throw new UnauthorizedException();

    return user;
  }
}
