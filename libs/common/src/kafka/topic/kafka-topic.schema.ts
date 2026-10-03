import { ProductTopic } from "./product-topic.schema";
import { UserTopic } from "./user-topic.schema";

export const KafkaTopic = UserTopic.or(ProductTopic);
export type KafkaTopic = typeof KafkaTopic.infer;
