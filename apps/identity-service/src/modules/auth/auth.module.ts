import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig, jwtConfig } from "../../config";
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { GithubStrategy } from "./strategies/github.strategy";
import { decodeBase64 } from "./utils/decode-base64";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (jwtConf: JwtConfig) => ({
        privateKey: decodeBase64(jwtConf.JWT_PRIVATE_KEY_BASE64),
        publicKey: decodeBase64(jwtConf.JWT_PUBLIC_KEY_BASE64),
        signOptions: {
          algorithm: jwtConf.JWT_ALGORITHM,
          keyid: jwtConf.JWT_KEY_ID,
          audience: jwtConf.JWT_AUDIENCE,
          issuer: jwtConf.JWT_ISSUER,
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, GithubStrategy],
})
export class AuthModule {}
