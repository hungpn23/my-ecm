import { type } from "arktype";

export const SendEmailData = type({
  to: "string.email",
  subject: "string >= 1",
  html: "string >= 1",
  text: "string >= 1",
});
export type SendEmailData = typeof SendEmailData.infer;
