import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const emailConfig = registerAs("email", () =>
  arkenv({
    EMAIL_SENDER: "string.email",
  }),
);

export type EmailConfig = ConfigType<typeof emailConfig>;
