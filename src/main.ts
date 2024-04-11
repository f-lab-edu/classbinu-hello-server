import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documnet = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documnet);

  await app.listen(3000);
}
bootstrap();
