import { NonEmptyString } from "@libs/common";
import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv, { type } from "arkenv";

export const GoogleEnv = type({
  GOOGLE_CLIENT_ID: NonEmptyString,
  GOOGLE_CLIENT_SECRET: NonEmptyString,
  GOOGLE_CALLBACK_URL: NonEmptyString,
});

export const googleConfig = registerAs("google", () => arkenv(GoogleEnv));

export type GoogleConfig = ConfigType<typeof googleConfig>;
