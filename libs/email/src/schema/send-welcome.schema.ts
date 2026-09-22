import { SendEmailData } from "./send-email.schema";

export const SendWelcomeEmailData = SendEmailData.pick("to");
export type SendWelcomeEmailData = typeof SendWelcomeEmailData.infer;
