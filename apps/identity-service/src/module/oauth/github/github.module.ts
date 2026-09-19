import { AuthModule } from "@libs/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { githubConfig } from "./github.config";
import { GithubController } from "./github.controller";
import { GithubStrategy } from "./github.strategy";

@Module({
  imports: [AuthModule, ConfigModule.forFeature(githubConfig)],
  controllers: [GithubController],
  providers: [GithubStrategy],
})
export class GithubModule {}
