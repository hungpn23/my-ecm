import { type } from "arktype";

export const SuccessResponseSchema = type({
  ok: "true",
  "message?": "string",
});
export type SuccessResponse = typeof SuccessResponseSchema.inferIn;
