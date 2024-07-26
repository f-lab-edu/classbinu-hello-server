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
      }),
    }),
  ],
})
export class DatabaseModule {}
