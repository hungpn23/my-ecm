import { type } from "arktype";

import { USER_TOPICS } from "./user-topic.schema";

export const KafkaTopic = type.enumerated(...USER_TOPICS);
export type KafkaTopic = typeof KafkaTopic.infer;
