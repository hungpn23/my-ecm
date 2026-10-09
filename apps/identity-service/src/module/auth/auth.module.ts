import { ConfigModule, internalAuthConfig } from "@libs/core";
import { AuthenticationModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { authConfig, type AuthConfig } from "./auth.config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthStore } from "./auth.store";
import { InternalAuthController } from "./internal-auth.controller";
import { InternalAuthGuard } from "./internal-auth.guard";
import { JwtAuthProvider } from "./jwt-auth.provider";

@Module({
  imports: [
    AuthenticationModule.forRootAsync({
      imports: [ConfigModule.forFeatures(authConfig)],
      inject: [authConfig.KEY],
      useFactory: (config: AuthConfig) => config,
    }),
    ConfigModule.forFeatures(internalAuthConfig),
    UserModule,
  ],
  providers: [AuthService, JwtAuthProvider, AuthStore, InternalAuthGuard],
  controllers: [AuthController, InternalAuthController],
})
export class AuthModule {}
