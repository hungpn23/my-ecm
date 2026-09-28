import { type } from "arktype";
import { KafkaMessageIn } from "./kafka-payload.schema";

export const UserCreatedData = type({
  email: "string.email",
});
export type UserCreatedData = typeof UserCreatedData.infer;

export const UserCreatedMessage = KafkaMessageIn.merge({
  value: UserCreatedData,
});
export type UserCreatedMessage = typeof UserCreatedMessage.inferIn;
