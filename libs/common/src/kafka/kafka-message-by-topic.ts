import type { Type } from "arktype";
import { KafkaMessageIn, UserCreatedMessage } from "./message";
import type { KafkaTopic } from "./topic/kafka-topic.schema";

export const KafkaMessageByTopic = {
  "user.created": UserCreatedMessage,
  "user.updated": UserCreatedMessage,
  "user.get": KafkaMessageIn,
  "product.created": KafkaMessageIn,
  "product.updated": KafkaMessageIn,
} as const satisfies Record<KafkaTopic, Type>;

export type KafkaMessageByTopic = {
  [KTopic in KafkaTopic]: (typeof KafkaMessageByTopic)[KTopic]["inferIn"];
};
