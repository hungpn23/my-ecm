import arkenv from "@arkenv/core";
import { type ConfigType, registerAs } from "@nestjs/config";

export const kafkaConfig = registerAs("kafka", () => {
  const env = arkenv({
    KAFKA_HOST: "string.host",
    KAFKA_PORT: "number.port",
    KAFKA_SESSION_TIMEOUT: "number.integer",
    KAFKA_HEARTBEAT_INTERVAL: "number.integer",
    KAFKA_REBALANCE_TIMEOUT: "number.integer",
    KAFKA_MAX_WAIT_TIME: "number.integer",
  });

  return {
    kafkaHost: env.KAFKA_HOST,
    kafkaPort: env.KAFKA_PORT,
    kafkaSessionTimeout: env.KAFKA_SESSION_TIMEOUT,
    kafkaHeartbeatInterval: env.KAFKA_HEARTBEAT_INTERVAL,
    kafkaRebalanceTimeout: env.KAFKA_REBALANCE_TIMEOUT,
    kafkaMaxWaitTime: env.KAFKA_MAX_WAIT_TIME,
  };
});

export type KafkaConfig = ConfigType<typeof kafkaConfig>;
