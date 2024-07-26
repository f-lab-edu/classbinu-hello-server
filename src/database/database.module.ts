import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('db.url'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        subscribers: ['post.subscriber.ts'],
        synchronize: true,
        logging: true,
        extra: {
          max: 90, // 최대 커넥션 수 (기본값 10)
          idleTimeoutMillis: 10000, // 비활성 커넥션 타임아웃 (기본값 100000)
          connectionTimeoutMillis: 2000, // 커넥션 타임아웃 (기본값 없으면 무한 대기?)
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
