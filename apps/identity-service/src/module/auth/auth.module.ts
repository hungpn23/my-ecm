import { decodeBase64, jwtConfig, JwtConfig, JwtStrategy } from "@libs/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { User } from "../../data-access/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubStrategy } from "./strategy/github.strategy";
import { GoogleStrategy } from "./strategy/google.strategy";
import { LocalStrategy } from "./strategy/local.strategy";

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
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, GithubStrategy],
})
export class AuthModule {}
