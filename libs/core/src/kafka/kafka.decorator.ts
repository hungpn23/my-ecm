import type { KafkaTopics } from "@libs/common";
import { EventPattern, MessagePattern } from "@nestjs/microservices";

export const KafkaEvent = (topic: KafkaTopics) => EventPattern<KafkaTopics>(topic);
export const KafkaMessage = (topic: KafkaTopics) => MessagePattern<KafkaTopics>(topic);
