import { type } from "arktype";

export const SendWelcomeMailData = type({
  to: "string.email",
});
export type SendWelcomeMailData = typeof SendWelcomeMailData.infer;
