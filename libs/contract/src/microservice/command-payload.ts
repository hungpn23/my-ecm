import { type } from "arktype";
import { Uuid } from "../shared/common.schema";

export const GetUserPayload = type({
  userId: Uuid,
}).or({
  email: "string.email",
});
export type GetUserPayload = typeof GetUserPayload.inferIn;
