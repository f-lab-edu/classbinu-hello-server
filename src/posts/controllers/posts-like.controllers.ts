import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { PostsLikeService } from '../services/posts-like.service';

@ApiTags('post-likes')
@Controller('posts/:postId/likes')
export class PostsLikeController {
  constructor(private readonly postsLikeService: PostsLikeService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('postId') postId: number,
    @User('userId') userId: number,
  ) {
    console.log(userId, postId);
    return await this.postsLikeService.create(postId, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('postId') postId: number,
    @User('userId') userId: number,
  ) {
    return await this.postsLikeService.delete(postId, userId);
  }
}
