import type { KafkaTopics } from "@libs/common";
import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafkaProxy, KafkaOptions } from "@nestjs/microservices";
import type { Observable } from "rxjs";
import { KafkaOptionsFactory } from "./kafka-options.factory";
import type { KafkaPayloadByTopic } from "./kafka-payload-by-topic.type";
import { KAFKA_CLIENT } from "./kafka.constant";

@Injectable()
export class KafkaService {
  readonly options: KafkaOptions;

  constructor(
    @Inject(KAFKA_CLIENT) private readonly client: ClientKafkaProxy,
    private readonly optionsFactory: KafkaOptionsFactory,
  ) {
    this.options = this.optionsFactory.createClientOptions();
  }

  emit<KTopic extends KafkaTopics>(
    topic: KTopic,
    payload: KafkaPayloadByTopic[KTopic],
  ): Observable<void> {
    return this.client.emit(topic, payload);
  }
}
