import { ConfigType, registerAs } from "@nestjs/config";
import arkenv from "arkenv";

export const redisConfig = registerAs("redis", () => {
  const config = arkenv({
    REDIS_HOST: "string >= 1",
    REDIS_PORT: "number.port",
    REDIS_PASSWORD: "string",
    REDIS_USERNAME: "string",
  });

  return {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    username: config.REDIS_USERNAME,
    password: config.REDIS_PASSWORD,
  };
});

export type RedisConfig = ConfigType<typeof redisConfig>;
