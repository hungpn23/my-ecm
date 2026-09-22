import { type } from "arktype";

export const BaseEmailData = type({
  to: "string.email",
});
export type BaseEmailData = typeof BaseEmailData.infer;
