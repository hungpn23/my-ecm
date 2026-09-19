import { Inject, Injectable } from "@nestjs/common";
import {
  Transport,
  type ClientsModuleOptionsFactory,
  type KafkaOptions,
} from "@nestjs/microservices";
import { logLevel } from "kafkajs";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { kafkaConfig, type KafkaConfig } from "./kafka.config";
import { KAFKA_CLIENT_ID } from "./kafka.constant";

@Injectable()
export class KafkaOptionsFactory implements ClientsModuleOptionsFactory {
  constructor(
    @InjectPinoLogger(KafkaOptionsFactory.name)
    private readonly logger: PinoLogger,
    @Inject(kafkaConfig.KEY)
    private readonly config: KafkaConfig,
    @Inject(KAFKA_CLIENT_ID)
    private readonly clientId: string,
  ) {}

  createClientOptions(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: this.clientId,
          brokers: [`${this.config.KAFKA_HOST}:${this.config.KAFKA_PORT}`],
          logCreator: () => (entry) => {
            const { message, error, ...rest } = entry.log;

            const data = {
              ...rest,
              context: `Kafka${entry.namespace}`,
              msg: error ?? message,
            };

            switch (entry.level) {
              case logLevel.ERROR:
                this.logger.error(data);
                break;
              case logLevel.WARN:
                this.logger.warn(data);
                break;
              case logLevel.INFO:
                this.logger.info(data);
                break;
              case logLevel.DEBUG:
                this.logger.debug(data);
                break;
            }
          },
        },
        consumer: {
          groupId: `${this.clientId}-group`,
        },
      },
    };
  }
}
