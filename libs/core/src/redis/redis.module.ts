import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Redis } from "ioredis";
import { PinoLogger } from "nestjs-pino";
import { redisConfig, type RedisConfig } from "./redis.config";
import { REDIS_CLIENT } from "./redis.constant";
import { RedisService } from "./redis.service";

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
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
            logger.info("Redis connected successfully.");
          })
          .catch(() => {
            logger.error("Redis connection failed.");
          });

        redis.on("error", (err) => {
          logger.error(err, err.message);
        });

        return redis;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
