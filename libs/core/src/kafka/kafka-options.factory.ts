import { Inject, Injectable } from "@nestjs/common";
import { type ClientsModuleOptionsFactory, type KafkaOptions, Transport } from "@nestjs/microservices";
import { type LogEntry, logLevel } from "kafkajs";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { type AppConfig, appConfig } from "#internal/config/app.config";

import { type KafkaConfig, kafkaConfig } from "./kafka.config";
import { MessageSerializerService } from "./message-serializer.service";

@Injectable()
export class KafkaOptionsFactory implements ClientsModuleOptionsFactory {
  constructor(
    @InjectPinoLogger(KafkaOptionsFactory.name)
    private readonly logger: PinoLogger,
    @Inject(kafkaConfig.KEY)
    private readonly config: KafkaConfig,
    @Inject(appConfig.KEY)
    private readonly appConf: AppConfig,
    private readonly serializer: MessageSerializerService,
  ) {}

  createClientOptions(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: this.appConf.appName,
          brokers: [`${this.config.kafkaHost}:${this.config.kafkaPort}`],
          logCreator: () => (entry: LogEntry) => {
            const { message, error, ...rest } = entry.log;

            let msg = message;
            if (Error.isError(error)) {
              msg = error.message;
            }

            this.logger.setContext(`Kafka${entry.namespace}`);

            switch (entry.level) {
              case logLevel.ERROR:
                this.logger.error(rest, msg);
                break;
              case logLevel.WARN:
                this.logger.warn(rest, msg);
                break;
              case logLevel.INFO:
                this.logger.info(rest, msg);
                break;
              case logLevel.DEBUG:
                this.logger.debug(rest, msg);
                break;
              case logLevel.NOTHING:
              default:
                this.logger.trace(rest, msg);
            }
          },
        },
        consumer: {
          groupId: `${this.appConf.appName}-group`,
          sessionTimeout: this.config.kafkaSessionTimeout,
          heartbeatInterval: this.config.kafkaHeartbeatInterval,
          rebalanceTimeout: this.config.kafkaRebalanceTimeout,
          maxWaitTimeInMs: this.config.kafkaMaxWaitTime,
        },
        serializer: this.serializer,
      },
    };
  }
}
