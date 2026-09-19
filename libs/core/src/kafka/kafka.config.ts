import { type ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const kafkaConfig = registerAs("kafka", () =>
  arkenv({
    KAFKA_HOST: "string.host",
    KAFKA_PORT: "number.port",
  }),
);

export type KafkaConfig = ConfigType<typeof kafkaConfig>;
