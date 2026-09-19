import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { jwtConfig } from "./jwt.config";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [ConfigModule.forFeature(jwtConfig), PassportModule.register({})],
  providers: [JwtStrategy],
  exports: [ConfigModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
