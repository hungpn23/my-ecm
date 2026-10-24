import type { KafkaTopic } from "@libs/contract";
import { Inject, Injectable } from "@nestjs/common";
import type { ClientKafkaProxy, KafkaOptions } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

import { KafkaOptionsFactory } from "./kafka-options.factory";
import { KAFKA_CLIENT } from "./kafka.constant";
import { MessageByTopic } from "./message-by-topic";

@Injectable()
export class KafkaService {
  readonly options: KafkaOptions;

  constructor(
    @Inject(KAFKA_CLIENT) private readonly client: ClientKafkaProxy,
    private readonly optionsFactory: KafkaOptionsFactory,
  ) {
    this.options = this.optionsFactory.createClientOptions();
  }

  async emit<KTopic extends KafkaTopic>(topic: KTopic, payload: MessageByTopic[NoInfer<KTopic>]): Promise<void> {
    const validated = MessageByTopic[topic].assert(payload);

    return await lastValueFrom(this.client.emit(topic, validated));
  }
}
