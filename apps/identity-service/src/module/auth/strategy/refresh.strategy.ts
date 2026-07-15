import {
  AuthenticatedUser,
  decodeBase64,
  getUserSessionKey,
  type JwtConfig,
  jwtConfig,
  JwtType,
  PASSPORT_STRATEGY,
  RedisService,
} from "@libs/core";
import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.REFRESH) {
  private readonly logger = new Logger(RefreshStrategy.name);

  constructor(
    private readonly redisService: RedisService,
    @Inject(jwtConfig.KEY)
    jwtConf: JwtConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: decodeBase64(jwtConf.JWT_PUBLIC_KEY_BASE64),
      algorithms: [jwtConf.JWT_ALGORITHM],
      audience: jwtConf.JWT_AUDIENCE,
      issuer: jwtConf.JWT_ISSUER,
    });
  }

  async validate(
    payload: AuthenticatedUser,
  ): Promise<Pick<AuthenticatedUser, "userId" | "sessionId">> {
    const { jwtType, userId, sessionId, jti } = payload;

    if (jwtType !== JwtType.REFRESH_TOKEN) throw new UnauthorizedException();

    const currentJti = await this.redisService.getValue<string>(
      getUserSessionKey(payload.userId, payload.sessionId),
    );
    if (currentJti !== jti) throw new UnauthorizedException();

    return { userId, sessionId };
  }
}
