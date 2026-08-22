import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const githubConfig = registerAs("github", () => {
  return arkenv({
    GITHUB_CLIENT_ID: "string >= 1",
    GITHUB_CLIENT_SECRET: "string >= 1",
    GITHUB_CALLBACK_URL: "string >= 1",
  });
});

export type GithubConfig = ConfigType<typeof githubConfig>;
