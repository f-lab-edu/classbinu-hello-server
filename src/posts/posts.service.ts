import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { PointsService } from 'src/points/points.service';
import { Point } from 'src/points/entities/point.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private pointsService: PointsService,
  ) {}

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

      point.adjustBalance(10);
      await manager.save(point);

      return post;
    });
  }

  async findAll() {
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
    return await this.postRepository.delete(id);
  }
}
