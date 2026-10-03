import { type ConfigType, registerAs } from "@nestjs/config";
import { createEnv } from "arkenv";
import { SesConfig, SmtpConfig } from "./mail.schema";

export const mailConfig = registerAs("mail", () => createEnv(SmtpConfig.or(SesConfig)));

export type MailConfig = ConfigType<typeof mailConfig>;
