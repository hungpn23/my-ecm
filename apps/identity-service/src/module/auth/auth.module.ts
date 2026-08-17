import { decodeBase64, jwtConfig, JwtConfig, JwtStrategy } from "@libs/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { User } from "@src/database/entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubStrategy, GoogleStrategy, LocalStrategy, RefreshStrategy } from "./strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory: (jwtConf: JwtConfig) => ({
        privateKey: decodeBase64(jwtConf.JWT_PRIVATE_KEY_BASE64),
        publicKey: decodeBase64(jwtConf.JWT_PUBLIC_KEY_BASE64),
        signOptions: {
          algorithm: jwtConf.JWT_ALGORITHM,
          issuer: jwtConf.JWT_ISSUER,
          audience: jwtConf.JWT_AUDIENCE,
        },
      }),
    }),
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
})
export class AuthModule {}
