import { type } from "arktype";

export const UserCreatedPayload = type({
  email: "string.email",
});
export type UserCreatedPayload = typeof UserCreatedPayload.inferIn;
