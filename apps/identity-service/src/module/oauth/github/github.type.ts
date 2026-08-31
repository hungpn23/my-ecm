import type { Profile } from "passport-github2";

export type GithubAuthenticatedRequest = Request & {
  user: Profile;
};
