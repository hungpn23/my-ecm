import { ConfigModule } from "#internal/config/index";
import { AuthenticationModule as NestAuthModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { MicroserviceModule } from "../microservice";
import { JwtAuth } from "./jwt-auth.provider";
import { jwtConfig } from "./jwt.config";

@Module({
  imports: [
    NestAuthModule.forRoot(),
    ConfigModule.forFeatures(jwtConfig),
    MicroserviceModule.registerAsync("IDENTITY_SERVICE"),
  ],
  providers: [JwtAuth],
})
export class AuthModule {}
