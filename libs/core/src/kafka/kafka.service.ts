import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafkaProxy } from "@nestjs/microservices";
import type { Observable } from "rxjs";
import type { KafkaPayload } from "./kafka-payload.schema";
import type { KafkaTopics } from "./kafka-topic.schema";
import { KAFKA_CLIENT } from "./kafka.constant";

@Injectable()
export class KafkaService<
  KTopic extends KafkaTopics = KafkaTopics,
  KPayload extends KafkaPayload = KafkaPayload,
> {
  constructor(@Inject(KAFKA_CLIENT) private readonly client: ClientKafkaProxy) {}

  emit(pattern: KTopic, payload: KPayload): Observable<void> {
    return this.client.emit(pattern, payload);
  }
}
