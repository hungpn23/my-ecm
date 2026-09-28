import type { Type } from "arktype";
import { KafkaMessageIn, UserCreatedMessage } from "./payload";
import type { KafkaTopics } from "./topic/kafka-topic.schema";

export const KafkaSchemaByTopic = {
  "user.created": UserCreatedMessage,
  "user.updated": UserCreatedMessage,
  "user.get": KafkaMessageIn,
  "product.created": KafkaMessageIn,
  "product.updated": KafkaMessageIn,
} as const satisfies Record<KafkaTopics, Type>;

export type KafkaPayloadByTopic = {
  [KTopic in KafkaTopics]: (typeof KafkaSchemaByTopic)[KTopic]["inferIn"];
};
