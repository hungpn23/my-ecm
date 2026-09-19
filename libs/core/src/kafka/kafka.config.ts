import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const kafkaConfig = registerAs("kafka", () =>
  arkenv({
    KAFKA_HOST: "string.host",
    KAFKA_PORT: "number.port",
    KAFKA_SESSION_TIMEOUT: "number.integer",
    KAFKA_HEARTBEAT_INTERVAL: "number.integer",
    KAFKA_REBALANCE_TIMEOUT: "number.integer",
    KAFKA_MAX_WAIT_TIME: "number.integer",
  }),
);

export type KafkaConfig = ConfigType<typeof kafkaConfig>;
