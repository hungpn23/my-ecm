import { type DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";
import { KafkaOptionsFactory } from "./kafka-options.factory";
import { KafkaPayloadSerializerService } from "./kafka-payload-serializer.service";
import { kafkaConfig } from "./kafka.config";
import { KAFKA_CLIENT } from "./kafka.constant";
import { KafkaService } from "./kafka.service";

export class KafkaModule {
  static forRoot(): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      imports: [
        ClientsModule.registerAsync([
          {
            name: KAFKA_CLIENT,
            imports: [ConfigModule.forFeature(kafkaConfig)],
            useClass: KafkaOptionsFactory,
            extraProviders: [KafkaPayloadSerializerService],
          },
        ]),
      ],
      providers: [KafkaService],
      exports: [KafkaService],
    };
  }
}
