import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafkaProxy } from "@nestjs/microservices";
import type { Observable } from "rxjs";
import type { KafkaPayloadByTopic } from "./kafka-payload-by-topic.type";
import { KAFKA_CLIENT } from "./kafka.constant";
import type { KafkaTopics } from "@libs/common";

@Injectable()
export class KafkaService {
  constructor(@Inject(KAFKA_CLIENT) private readonly client: ClientKafkaProxy) {}

  emit<KTopic extends KafkaTopics>(
    topic: KTopic,
    payload: KafkaPayloadByTopic[KTopic],
  ): Observable<void> {
    return this.client.emit(topic, payload);
  }
}
