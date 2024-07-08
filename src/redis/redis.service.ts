import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: any, ttl: number = 600) {
    return await this.redis.set(key, value, 'EX', ttl);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async del(key: string) {
    return await this.redis.del(key);
  }

  async incr(key: string) {
    return await this.redis.incr(key);
  }

  async expire(key: string, ttl: number) {
    return await this.redis.expire(key, ttl);
  }

  async decrby(key: string, decrement: number) {
    return await this.redis.decrby(key, decrement);
  }

  async keys(pattern: string) {
    return await this.redis.keys(pattern);
  }
}
