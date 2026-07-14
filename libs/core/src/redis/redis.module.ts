import { Global, Logger, Module } from "@nestjs/common";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "./redis.constant";
import { RedisService } from "./redis.service";
import { redisConfig, RedisConfig } from "./redis.config";

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (redisConf: RedisConfig) => {
        const logger = new Logger(REDIS_CLIENT);
        let redis: Redis = new Redis(redisConf);

        redis
          .ping()
          .then(() => {
            logger.debug(`Redis client connected`);
          })
          .catch(() => {
            logger.error(`Redis client connection failed`);
          });

        redis.on("error", (err) => {
          logger.error(err.message);
        });

        return redis;
      },
      inject: [redisConfig.KEY],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
