import { ConfigService } from '@nestjs/config';
import { DATA_SOURCE } from './constants/database.constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        port: configService.get<number>('db.port'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: ['query', 'error', 'schema'],
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
