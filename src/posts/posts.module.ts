import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PointsModule } from 'src/points/points.module';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostsController } from './controllers/posts.controller';
import { PostsLikeController } from './controllers/posts-like.controllers';
import { PostsLikeService } from './services/posts-like.service';
import { PostsService } from './services/posts.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from 'src/redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import postsConfig from './config/posts.config';

@Module({
  imports: [
    ConfigModule.forFeature(postsConfig),
    TypeOrmModule.forFeature([Post, PostLike]),
    PointsModule,
    RedisModule,
  ],
  controllers: [PostsController, PostsLikeController],
  providers: [PostsService, PostsLikeService, RedisService],
})
export class PostsModule {}
