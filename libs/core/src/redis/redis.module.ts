import { Global, Module } from "@nestjs/common";
import { Redis } from "ioredis";
import { PinoLogger } from "nestjs-pino";
import { redisConfig, type RedisConfig } from "./redis.config";
import { REDIS_CLIENT } from "./redis.constant";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [
    {
      inject: [redisConfig.KEY, PinoLogger],
      provide: REDIS_CLIENT,
      useFactory: async (redisConf: RedisConfig, logger: PinoLogger) => {
        logger.setContext(RedisModule.name);

        const redis: Redis = new Redis(redisConf);

        redis
          .ping()
          .then(() => {
            logger.info("RedisModule dependencies initialized");
          })
          .catch(() => {
            logger.error("RedisModule dependencies failed to initialize");
          });

        redis.on("error", (err) => {
          logger.error(err.message);
        });

        return redis;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
