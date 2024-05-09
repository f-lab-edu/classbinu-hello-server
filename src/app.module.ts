import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TopicsModule } from './topics/topics.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    TopicsModule,
    ClassroomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
