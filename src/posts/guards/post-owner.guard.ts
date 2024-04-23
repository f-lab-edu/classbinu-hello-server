import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const postId = request.params.id;

    const post = await this.postRepository.findOneBy({ id: postId });

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    if (post.userId !== userId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
