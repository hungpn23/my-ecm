import { PASSPORT_STRATEGY } from "@libs/core";
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { type Profile, Strategy } from "passport-google-oauth20";
import { googleConfig, type GoogleConfig } from "../../../config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGY.GOOGLE) {
  constructor(
    @Inject(googleConfig.KEY)
    googleConf: GoogleConfig,
  ) {
    super({
      clientID: googleConf.GOOGLE_CLIENT_ID,
      clientSecret: googleConf.GOOGLE_CLIENT_SECRET,
      callbackURL: googleConf.GOOGLE_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<Profile> {
    return profile;
  }
}
