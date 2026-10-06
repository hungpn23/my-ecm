import type { KafkaTopic } from "@libs/contract";
import { EventPattern, MessagePattern } from "@nestjs/microservices";

export const KafkaEvent = (topic: KafkaTopic) => EventPattern<KafkaTopic>(topic);
export const KafkaMessage = (topic: KafkaTopic) => MessagePattern<KafkaTopic>(topic);
