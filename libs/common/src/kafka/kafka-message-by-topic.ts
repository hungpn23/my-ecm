import { KafkaMessageIn, type KafkaTopic, UserCreatedMessage } from "@libs/contract";
import type { Type } from "arktype";

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
