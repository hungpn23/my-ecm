import { KafkaSchemaByTopic, type KafkaPayloadByTopic, type KafkaTopics } from "@libs/common";
import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafkaProxy, KafkaOptions } from "@nestjs/microservices";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import type { Observable } from "rxjs";
import { KafkaOptionsFactory } from "./kafka-options.factory";
import { KAFKA_CLIENT } from "./kafka.constant";

@Injectable()
export class KafkaService {
  readonly options: KafkaOptions;

  constructor(
    @InjectPinoLogger(KafkaService.name) private readonly logger: PinoLogger,
    @Inject(KAFKA_CLIENT) private readonly client: ClientKafkaProxy,
    private readonly optionsFactory: KafkaOptionsFactory,
  ) {
    this.options = this.optionsFactory.createClientOptions();
  }

  emit<KTopic extends KafkaTopics>(
    topic: KTopic,
    payload: KafkaPayloadByTopic[NoInfer<KTopic>],
  ): Observable<void> {
    const validated = KafkaSchemaByTopic[topic].assert(payload);

    return this.client.emit(topic, validated);
  }
}
