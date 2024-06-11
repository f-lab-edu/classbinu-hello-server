import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Point } from 'src/points/entities/point.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  private static readonly POINT_REWARD = 10;
  public getPointReward(): number {
    return PostsService.POINT_REWARD;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return await this.postRepository.manager.transaction(async (manager) => {
      const post = manager.create(Post, createPostDto);
      await manager.save(post);

      let point = await manager.findOne(Point, {
        where: { user: post.user },
      });

      if (!point) {
        point = manager.create(Point, {
          user: post.user,
          balance: 0,
        });
      }

      point.adjustBalance(PostsService.POINT_REWARD);
      await manager.save(point);

      return post;
    });
  }

  async findAll(q?: string) {
    if (q) {
      const query = `
        SELECT * FROM posts 
        WHERE title LIKE $1
        OR content LIKE $1;
      `;
      return await this.postRepository.query(query, [`%${q}%`]);
    }
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    return await this.postRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async incrementViews(id: number) {
    return await this.postRepository.increment({ id }, 'views', 1);
  }

  async remove(id: number) {
    return await this.postRepository.manager.transaction(async (manager) => {
      const post = await manager.findOneBy(Post, { id });

      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      await manager.remove(post);

      const point = await manager.findOne(Point, {
        where: { user: post.user },
      });

      if (!point) {
        throw new NotFoundException(
          `Point for user with id ${post.user.id} not found`,
        );
      }

      point.adjustBalance(-PostsService.POINT_REWARD);
      await manager.save(point);
    });
  }
}
