import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { postsProviders } from './providers/posts.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [...postsProviders, PostsService],
})
export class PostsModule {}
