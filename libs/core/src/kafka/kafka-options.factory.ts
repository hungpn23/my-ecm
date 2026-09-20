import { Inject, Injectable } from "@nestjs/common";
import {
  Transport,
  type ClientsModuleOptionsFactory,
  type KafkaOptions,
} from "@nestjs/microservices";
import { logLevel, type LogEntry } from "kafkajs";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { appConfig, type AppConfig } from "../config";
import { kafkaConfig, type KafkaConfig } from "./kafka.config";
import { KafkaPayloadSerializerService } from "./payload";

@Injectable()
export class KafkaOptionsFactory implements ClientsModuleOptionsFactory {
  constructor(
    @InjectPinoLogger(KafkaOptionsFactory.name)
    private readonly logger: PinoLogger,
    @Inject(kafkaConfig.KEY)
    private readonly config: KafkaConfig,
    @Inject(appConfig.KEY)
    private readonly appConf: AppConfig,
    private readonly serializer: KafkaPayloadSerializerService,
  ) {}

  createClientOptions(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: this.appConf.APP_NAME,
          brokers: [`${this.config.KAFKA_HOST}:${this.config.KAFKA_PORT}`],
          logCreator: () => (entry: LogEntry) => {
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
          groupId: `${this.appConf.APP_NAME}-group`,
          sessionTimeout: this.config.KAFKA_SESSION_TIMEOUT,
          heartbeatInterval: this.config.KAFKA_HEARTBEAT_INTERVAL,
          rebalanceTimeout: this.config.KAFKA_REBALANCE_TIMEOUT,
          maxWaitTimeInMs: this.config.KAFKA_MAX_WAIT_TIME,
        },
        serializer: this.serializer,
      },
    };
  }
}
