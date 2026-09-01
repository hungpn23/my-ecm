import { JwtStrategy } from "@libs/core";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [PassportModule.register({})],
  providers: [JwtStrategy],
})
export class AuthModule {}
