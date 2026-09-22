import { type ConfigType, registerAs } from "@nestjs/config";
import { createEnv } from "arkenv";
import { SesConfig, SmtpConfig } from "./provider";

export const emailConfig = registerAs("email", () => createEnv(SmtpConfig.or(SesConfig)));

export type EmailConfig = ConfigType<typeof emailConfig>;
