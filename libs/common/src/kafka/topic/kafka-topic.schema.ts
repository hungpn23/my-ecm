import { ProductTopic } from "./product-topic.schema";
import { UserTopic } from "./user-topic.schema";

export const KafkaTopics = UserTopic.or(ProductTopic);
export type KafkaTopics = typeof KafkaTopics.infer;
