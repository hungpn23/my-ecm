import { type } from "arktype";

export const SuccessResponse = type({
  ok: "true",
  "message?": "string",
});
export type SuccessResponse = typeof SuccessResponse.inferIn;
