import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { PASSPORT_STRATEGIES } from "../constants/passport-strategies";
import { type JwtConfig, jwtConfig } from "../../../config";
import { decodeBase64 } from "../utils/decode-base64";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGIES.JWT) {
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

  async validate(payload: any) {
    this.logger.debug(JSON.stringify(payload));
    return { userId: payload, email: payload.email };
  }
}
