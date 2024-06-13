import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import config from './config/configuration';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'prod';
  }

  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
  });

  const app = await NestFactory.create(AppModule);
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
