import { Module } from '@nestjs/common';
import { PointsModule } from 'src/points/points.module';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostsController } from './controllers/posts.controller';
import { PostsLikeController } from './controllers/posts-like.controllers';
import { PostsLikeService } from './services/posts-like.service';
import { PostsService } from './services/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike]), PointsModule],
  controllers: [PostsController, PostsLikeController],
  providers: [PostsService, PostsLikeService],
})
export class PostsModule {}
