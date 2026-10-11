import { ConfigModule } from "@libs/core";
import { AuthenticationModule as NestAuthModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { authConfig, type AuthConfig } from "./auth.config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthStore } from "./auth.store";
import { JwtAuth } from "./jwt-auth.provider";

@Module({
  imports: [
    NestAuthModule.forRootAsync({
      imports: [ConfigModule.forFeatures(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: AuthConfig) => config,
    }),
    UserModule,
  ],
  providers: [AuthService, JwtAuth, AuthStore],
  controllers: [AuthController],
})
export class AuthModule {}
