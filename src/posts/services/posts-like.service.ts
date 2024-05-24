import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from '../entities/post-like.entity';

@Injectable()
export class PostsLikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) {}

  async create(postId: number, userId: number) {
    try {
      const like = this.postLikeRepository.create({
        user: { id: userId },
        post: { id: postId },
      });
      return await this.postLikeRepository.save(like);
    } catch (error) {
      console.error(error);
      throw new ConflictException(error.message);
    }
  }

  async delete(postId: number, userId: number) {
    const like = await this.postLikeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    return await this.postLikeRepository.remove(like);
  }
}
