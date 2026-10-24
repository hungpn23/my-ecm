import type { KafkaTopic } from "@libs/contract";
import { EventPattern, MessagePattern } from "@nestjs/microservices";

export const KafkaEvent = (topic: KafkaTopic): MethodDecorator => EventPattern<KafkaTopic>(topic);
export const KafkaMessage = (topic: KafkaTopic): MethodDecorator => MessagePattern<KafkaTopic>(topic);
