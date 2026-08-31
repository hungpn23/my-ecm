import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { googleConfig } from "./google.config";
import { GoogleController } from "./google.controller";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [ConfigModule.forFeature(googleConfig), PassportModule.register({})],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
})
export class GoogleModule {}
