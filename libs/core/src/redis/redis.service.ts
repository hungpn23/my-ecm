import { Inject, Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "./redis.constant";

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlInSeconds?: number) {
    if (ttlInSeconds) {
      await this.redis.set(key, value, "EX", ttlInSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async delete(key: string) {
    await this.redis.del(key);
  }

  async increaseAttempts(key: string, ttlInSeconds: number): Promise<number> {
    const count = await this.redis.incr(key);

    // set ttl if first attempt
    if (count === 1) {
      await this.redis.expire(key, ttlInSeconds);
    }

    return count;
  }
}
