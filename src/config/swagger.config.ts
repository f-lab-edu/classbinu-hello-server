import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('오늘의 일기 API')
  .setDescription('오늘의 일기 API description')
  .setVersion('0.1')
  .addBearerAuth()
  .build();
