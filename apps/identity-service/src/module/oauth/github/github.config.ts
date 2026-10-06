import { NonEmptyString } from "@libs/contract";
import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv, { type } from "arkenv";

export const GithubEnv = type({
  GITHUB_CLIENT_ID: NonEmptyString,
  GITHUB_CLIENT_SECRET: NonEmptyString,
  GITHUB_CALLBACK_URL: NonEmptyString,
});

export const githubConfig = registerAs("github", () => arkenv(GithubEnv));

export type GithubConfig = ConfigType<typeof githubConfig>;
