import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { githubConfig } from "./github.config";
import { GithubController } from "./github.controller";
import { GithubStrategy } from "./github.strategy";

@Module({
  imports: [ConfigModule.forFeature(githubConfig), PassportModule.register({})],
  controllers: [GithubController],
  providers: [GithubStrategy],
})
export class GithubModule {}
