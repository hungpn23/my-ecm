import type { KafkaTopics } from "@libs/common";
import { EventPattern } from "@nestjs/microservices";

export const KafkaTopic = (topic: KafkaTopics) => EventPattern<KafkaTopics>(topic);
