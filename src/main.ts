import * as WinstonCloudWatch from 'winston-cloudwatch';
import * as dotenv from 'dotenv';
import * as winston from 'winston';

import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import config from './config/configuration';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'prod';
  }

  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
  });

  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: 'combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      // new WinstonCloudWatch({
      //   logGroupName: 'flab-hello-nest',
      //   logStreamName: 'flab-hello-nest',
      //   awsRegion: 'ap-northeast-2',
      //   awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      //   awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      //   messageFormatter: ({ level, message, additionalInfo }) =>
      //     `[${level}]: ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}`,
      // }),
    ],
  });

  const app = await NestFactory.create(AppModule, { logger });
  const dataSource = app.get(DataSource);
  const PORT = 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const apiRoot = config().swaggerApi.apiRoot;
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(apiRoot, app, document);

  await app.listen(PORT);
  console.log(
    `✅ [${process.env.NODE_ENV}] Application is running on: ${PORT} port`,
  );

  // Graceful shutdown
  const shtudown = async () => {
    console.log('⏳ Application is Graceful shutting down...');
    await dataSource.destroy();
    await app.close();
    console.log('🔴 Application is shut down');
    process.exit(0);
  };

  process.on('SIGTERM', shtudown);
  process.on('SIGINT', shtudown);
}

bootstrap();
