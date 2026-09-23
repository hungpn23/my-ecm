import type { Type } from "arktype";
import { KafkaPayload } from "./payload/kafka-payload.schema";
import { UserCreatedPayload } from "./payload/user-payload.schema";
import type { KafkaTopics } from "./topic/kafka-topic.schema";

export const KafkaSchemaByTopic = {
  "user.created": UserCreatedPayload,
  "user.updated": UserCreatedPayload,
  "user.get": KafkaPayload,
  "product.created": KafkaPayload,
  "product.updated": KafkaPayload,
} as const satisfies Record<KafkaTopics, Type>;

export type KafkaPayloadByTopic = {
  [KTopic in KafkaTopics]: (typeof KafkaSchemaByTopic)[KTopic]["inferIn"];
};
