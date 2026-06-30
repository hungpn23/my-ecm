import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable } from "@nestjs/common";
import { PASSPORT_STRATEGIES } from "../constants/passport-strategies";
import { type GithubConfig, githubConfig } from "../../../config";
import { Strategy } from "passport-github2";

export interface GithubProfile {
  displayName?: string;
  emails?: { value: string }[];
  _json?: {
    avatar_url?: string;
  };
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGIES.GITHUB) {
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

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GithubProfile,
  ): Promise<GithubProfile> {
    return profile;
  }
}
