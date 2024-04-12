import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import config from './config/configuration';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const apiRoot = config().swaggerApi.apiRoot;
  const documnet = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(apiRoot, app, documnet);

  await app.listen(3000);
}
bootstrap();
