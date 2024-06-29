import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { PointTransactionsModule } from './point-transactions/point-transactions.module';
import { PointsModule } from './points/points.module';
import { PostsModule } from './posts/posts.module';
import { RedisModule } from './redis/redis.module';
import { TopicsModule } from './topics/topics.module';
import { UserCreatedHandler } from './points/events/handler/user-created.handler';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    CqrsModule,
    AuthModule,
    UsersModule,
    PostsModule,
    TopicsModule,
    ClassroomsModule,
    PointsModule,
    PointTransactionsModule,
    RedisModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserCreatedHandler],
})
export class AppModule {}
