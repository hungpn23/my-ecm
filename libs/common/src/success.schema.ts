import { type } from "arktype";

export const SuccessResponseSchema = type({
  ok: "boolean",
  "message?": "string",
});

export type SuccessResponse = typeof SuccessResponseSchema.inferIn;
