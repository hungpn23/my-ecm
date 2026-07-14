import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PASSPORT_STRATEGY } from "../constant/passport-strategy";
import { AuthenticatedUser } from "../type/authenticated-user.type";
import { decodeBase64 } from "../util/decode-base64";
import { JwtType } from "./jwt-type.enum";
import { jwtConfig, type JwtConfig } from "./jwt.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.JWT) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
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

  async validate(payload: AuthenticatedUser): Promise<AuthenticatedUser> {
    if (payload.jwtType !== JwtType.ACCESS_TOKEN) throw new UnauthorizedException();

    return payload;
  }
}
