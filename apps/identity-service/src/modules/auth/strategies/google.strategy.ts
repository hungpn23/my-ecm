import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { Inject, Injectable } from "@nestjs/common";
import { PASSPORT_STRATEGIES } from "../constants/passport-strategies";
import { googleConfig, type GoogleConfig } from "../../../config";

export interface GoogleProfile {
  displayName?: string;
  emails?: { value: string; verified: boolean }[];
  _json?: {
    picture?: string;
  };
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, PASSPORT_STRATEGIES.GOOGLE) {
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

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
  ): Promise<GoogleProfile> {
    return profile;
  }
}
