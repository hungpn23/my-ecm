import {
  type KafkaPayload,
  type KafkaTopics,
  PRODUCT,
  USER,
  type UserCreatedPayload,
} from "@libs/common";

type TopicPayloadMap<T extends Record<KafkaTopics, KafkaPayload>> = T;

export type KafkaPayloadByTopic = TopicPayloadMap<{
  [USER.CREATED]: UserCreatedPayload;
  [USER.UPDATED]: UserCreatedPayload;
  [USER.GET]: KafkaPayload;
  [PRODUCT.CREATED]: KafkaPayload;
  [PRODUCT.UPDATED]: KafkaPayload;
}>;
