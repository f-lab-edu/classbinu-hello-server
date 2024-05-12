import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TopicsModule } from './topics/topics.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { PointsModule } from './points/points.module';
import { PointTransactionsModule } from './point-transactions/point-transactions.module';
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
    PointsModule,
    PointTransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
