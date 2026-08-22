import { PASSPORT_STRATEGY } from "@libs/core";
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { type Profile, Strategy } from "passport-github2";
import { type GithubConfig, githubConfig } from "../../../config";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.GITHUB) {
  constructor(
    @Inject(githubConfig.KEY)
    githubConf: GithubConfig,
  ) {
    super({
      clientID: githubConf.GITHUB_CLIENT_ID,
      clientSecret: githubConf.GITHUB_CLIENT_SECRET,
      callbackURL: githubConf.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<Profile> {
    return profile;
  }
}
