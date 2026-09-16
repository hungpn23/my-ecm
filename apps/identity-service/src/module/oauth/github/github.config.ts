import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv, { type } from "arkenv";

export const GithubEnv = type({
  GITHUB_CLIENT_ID: "string >= 1",
  GITHUB_CLIENT_SECRET: "string >= 1",
  GITHUB_CALLBACK_URL: "string >= 1",
});

export const githubConfig = registerAs("github", () => arkenv(GithubEnv));

export type GithubConfig = ConfigType<typeof githubConfig>;
