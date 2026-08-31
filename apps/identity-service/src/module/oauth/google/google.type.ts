import type { Profile } from "passport-google-oauth20";

export type GoogleAuthenticatedRequest = Request & {
  user: Profile;
};
