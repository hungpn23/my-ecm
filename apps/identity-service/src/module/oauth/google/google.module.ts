import { AuthModule } from "@libs/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { googleConfig } from "./google.config";
import { GoogleController } from "./google.controller";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [AuthModule, ConfigModule.forFeature(googleConfig)],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
})
export class GoogleModule {}
