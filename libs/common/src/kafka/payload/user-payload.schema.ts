import { type } from "arktype";
import { KafkaPayload } from "./kafka-payload.schema";

export const UserCreatedPayload = KafkaPayload.merge({
  value: type({
    email: "string.email",
  }),
});
export type UserCreatedPayload = typeof UserCreatedPayload.inferIn;
