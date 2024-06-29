import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    IORedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `redis://:${configService.get<string>('redis.password')}@${configService.get<string>('redis.host')}:${configService.get<string>('redis.port')}`,
        retryStrategy: (times: number) => {
          const baseInterval = configService.get<number>('redis.base_interval');
          const maxInterval = configService.get<number>('redis.max_interval');
          const maxAttempts = configService.get<number>('redis.max_attempts');
          const delay = Math.min(times * baseInterval, maxInterval);
          if (times > maxAttempts) {
            return null;
          }
          return delay;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
