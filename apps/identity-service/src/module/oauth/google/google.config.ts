import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv, { type } from "arkenv";

const GoogleEnv = type({
  GOOGLE_CLIENT_ID: "string >= 1",
  GOOGLE_CLIENT_SECRET: "string >= 1",
  GOOGLE_CALLBACK_URL: "string >= 1",
});

export const googleConfig = registerAs("google", () => arkenv(GoogleEnv));

export type GoogleConfig = ConfigType<typeof googleConfig>;

export const isGoogleConfigured = (): boolean => {
  try {
    return !!arkenv(GoogleEnv);
  } catch (e: unknown) {
    console.warn(Error.isError(e) ? e.message : "Google configuration error");

    return false;
  }
};
