import { UserCreatedPayload } from "../microservice/event-payload.rpc-schema";
import { KafkaMessageIn } from "./kafka-message.schema";

export const UserCreatedMessage = KafkaMessageIn.merge({
  value: UserCreatedPayload,
});
export type UserCreatedMessage = typeof UserCreatedMessage.inferIn;
