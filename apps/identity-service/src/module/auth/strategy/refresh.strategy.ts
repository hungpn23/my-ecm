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

  async validate(
    payload: AuthenticatedUser,
  ): Promise<Pick<AuthenticatedUser, "userId" | "sessionId">> {
    const { jwtKind, userId, sessionId, jti } = payload;

    if (jwtKind !== JWT_KIND.REFRESH_TOKEN) throw new UnauthorizedException();

    const currentJti = await this.redisService.get(jwtidBy(userId, sessionId));
    if (currentJti !== jti) throw new UnauthorizedException();

    return { userId, sessionId };
  }
}
