import { DocumentBuilder } from '@nestjs/swagger';
import config from './configuration';

export const swaggerConfig = new DocumentBuilder()
  .setTitle(config().swaggerApi.title)
  .setDescription(config().swaggerApi.description)
  .setVersion(config().swaggerApi.version)
  .addBearerAuth()
  .build();
