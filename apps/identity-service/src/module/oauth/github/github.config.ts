import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv, { type } from "arkenv";

const GithubEnv = type({
  GITHUB_CLIENT_ID: "string >= 1",
  GITHUB_CLIENT_SECRET: "string >= 1",
  GITHUB_CALLBACK_URL: "string >= 1",
});

export const githubConfig = registerAs("github", () => arkenv(GithubEnv));

export type GithubConfig = ConfigType<typeof githubConfig>;

export const isGithubConfigured = (): boolean => {
  try {
    return !!arkenv(GithubEnv);
  } catch (e: unknown) {
    console.warn(Error.isError(e) ? e.message : "Github configuration error");

    return false;
  }
};
