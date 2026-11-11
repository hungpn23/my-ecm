import { type } from "arktype";

export const ServerError = type({
  statusCode: "400 <= number.integer <= 599",
  message: "string | string[]",
  errorCode: "string >= 1",
});
export type ServerError = typeof ServerError.infer;

export const ServerErrorMessage = ServerError.pick("message");
