import { type DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";
import { KafkaOptionsFactory } from "./kafka-options.factory";
import { kafkaConfig } from "./kafka.config";
import { KAFKA_CLIENT, KAFKA_CLIENT_ID } from "./kafka.constant";
import { KafkaService } from "./kafka.service";

export class KafkaModule {
  static forRoot(clientId: string): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      imports: [
        ClientsModule.registerAsync([
          {
            name: KAFKA_CLIENT,
            imports: [ConfigModule.forFeature(kafkaConfig)],
            extraProviders: [
              {
                provide: KAFKA_CLIENT_ID,
                useValue: clientId,
              },
            ],
            useClass: KafkaOptionsFactory,
          },
        ]),
      ],
      providers: [KafkaService],
      exports: [ClientsModule, KafkaService],
    };
  }
}
