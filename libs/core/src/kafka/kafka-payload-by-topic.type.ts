import { type KafkaPayload, type UserCreatedPayload } from "./payload";
import { type KafkaTopics, PRODUCT, USER } from "./topic";

type TopicPayloadMap<T extends Record<KafkaTopics, KafkaPayload>> = T;

export type KafkaPayloadByTopic = TopicPayloadMap<{
  [USER.CREATED]: UserCreatedPayload;
  [USER.GET]: KafkaPayload;
  [PRODUCT.CREATED]: KafkaPayload;
}>;
