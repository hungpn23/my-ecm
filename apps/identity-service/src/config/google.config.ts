import { ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const googleConfig = registerAs("google", () => {
  return arkenv({
    GOOGLE_CLIENT_ID: "string >= 1",
    GOOGLE_CLIENT_SECRET: "string >= 1",
    GOOGLE_CALLBACK_URL: "string >= 1",
  });
});

export type GoogleConfig = ConfigType<typeof googleConfig>;
