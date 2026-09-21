import { type } from "arktype";
import { KafkaPayload } from "./kafka-payload.schema";

export const UserCreatedData = type({
  email: "string.email",
});
export type UserCreatedData = typeof UserCreatedData.infer;

export const UserCreatedPayload = KafkaPayload.merge({
  value: UserCreatedData,
});
export type UserCreatedPayload = typeof UserCreatedPayload.inferIn;
