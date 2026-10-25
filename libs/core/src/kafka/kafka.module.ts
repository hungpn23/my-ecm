import type { DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";

import { KafkaOptionsFactory } from "./kafka-options.factory";
import { kafkaConfig } from "./kafka.config";
import { KAFKA_CLIENT } from "./kafka.constant";
import { KafkaService } from "./kafka.service";
import { MessageSerializerService } from "./message-serializer.service";

/**
 * @ignore Currently Unused.
 * @deprecated The Kafka/outbox/Debezium pipeline is deprecated. Do not use it for new integrations.
 */
export class KafkaModule {
  static forRoot(): DynamicModule {
    return {
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- Retained for existing integrations.
      module: KafkaModule,
      global: true,
      imports: [
        ClientsModule.registerAsync([
          {
            name: KAFKA_CLIENT,
            imports: [ConfigModule.forFeature(kafkaConfig)],
            useClass: KafkaOptionsFactory,
            extraProviders: [MessageSerializerService],
          },
        ]),
      ],
      providers: [KafkaService],
      exports: [KafkaService],
    };
  }
}
