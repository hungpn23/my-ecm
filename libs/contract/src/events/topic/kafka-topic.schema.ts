import { UserTopic } from "./user-topic.schema";

export const KafkaTopic = UserTopic;
export type KafkaTopic = typeof KafkaTopic.infer;
