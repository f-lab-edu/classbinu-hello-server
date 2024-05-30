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
        host: config.get<string>('db.host'),
        username: config.get<string>('db.username'),
        password: config.get<string>('db.password'),
        port: config.get<number>('db.port'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        subscribers: ['post.subscriber.ts'],
        synchronize: true,
        logging: ['query', 'error', 'schema'],
      }),
    }),
  ],
})
export class DatabaseModule {}
