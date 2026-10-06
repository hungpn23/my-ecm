import { type } from "arktype";

export const SendWelcomeEmailData = type({
  to: "string.email",
});
export type SendWelcomeEmailData = typeof SendWelcomeEmailData.infer;
