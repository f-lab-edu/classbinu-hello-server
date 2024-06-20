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
        replication: {
          master: {
            host: config.get<string>('db.host'),
            username: config.get<string>('db.username'),
            password: config.get<string>('db.password'),
            database: config.get<string>('db.name'),
            port: config.get<number>('db.port'),
          },
          slaves: [
            {
              host: config.get<string>('slaveDb.host'),
              username: config.get<string>('slaveDb.username'),
              password: config.get<string>('slaveDb.password'),
              database: config.get<string>('slaveDb.name'),
              port: config.get<number>('slaveDb.port'),
            },
          ],
        },
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        subscribers: ['post.subscriber.ts'],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
