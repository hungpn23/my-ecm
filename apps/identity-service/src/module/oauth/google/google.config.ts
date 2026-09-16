import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv, { type } from "arkenv";

export const GoogleEnv = type({
  GOOGLE_CLIENT_ID: "string >= 1",
  GOOGLE_CLIENT_SECRET: "string >= 1",
  GOOGLE_CALLBACK_URL: "string >= 1",
});

export const googleConfig = registerAs("google", () => arkenv(GoogleEnv));

export type GoogleConfig = ConfigType<typeof googleConfig>;
