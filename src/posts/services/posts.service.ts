import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Point } from 'src/points/entities/point.entity';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PostsService {
  private readonly pointsReward: number;

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    this.pointsReward = this.configService.get('points.reward');
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

      point.adjustBalance(this.pointsReward);
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

  async incrementViewsCached(id: number) {
    const COUNT_UNIT = 7;
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    const newViewCount = await this.redisService.incr(`posts:${id}:views`);
    if (newViewCount % COUNT_UNIT === 0) {
      await this.postRepository.increment({ id }, 'views', newViewCount);
      await this.redisService.set(`posts:${id}:views`, 0);
    }
  }

  async remove(id: number) {
    return await this.postRepository.manager.transaction(async (manager) => {
      const post = await this.findPostById(manager, id);
      await this.removePost(manager, post);
      await this.adjustPoint(manager, post.user);
    });
  }

  // 기존 remove 메서드를 분리한 메서드
  async findPostById(manager, id) {
    const post = await manager.findOneBy(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  // 기존 remove 메서드를 분리한 메서드
  async removePost(manager, post) {
    await manager.remove(post);
  }

  // 기존 remove 메서드를 분리한 메서드
  async adjustPoint(manager, user) {
    const point = await manager.findOne(Point, {
      where: { user },
    });

    if (!point) {
      throw new NotFoundException(`Point for user ${user.id} not found`);
    }

    point.adjustBalance(-this.configService.get('points.reward'));
    await manager.save(point);
  }
}
