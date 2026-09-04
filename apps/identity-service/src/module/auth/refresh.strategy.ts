import {
  type AuthenticatedUser,
  JWT_KIND,
  jwtConfig,
  type JwtConfig,
  jwtidBy,
  PASSPORT_STRATEGY,
  RedisService,
} from "@libs/core";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.REFRESH) {
  constructor(
    private readonly redisService: RedisService,
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

  async validate(user: AuthenticatedUser): Promise<AuthenticatedUser> {
    const { jwtKind, userId, sessionId, jti } = user;

    if (jwtKind !== JWT_KIND.REFRESH_TOKEN) throw new UnauthorizedException();

    const jwtid = await this.redisService.get(jwtidBy(userId, sessionId));
    if (jwtid !== jti) throw new UnauthorizedException();

    return user;
  }
}
