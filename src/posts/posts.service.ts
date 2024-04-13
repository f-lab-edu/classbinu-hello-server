import { CreatePostDto } from './dto/create-post.dto';
import { Inject, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { POSTS_REPOSITORY } from './constants/posts.constants';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS_REPOSITORY)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post();
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.status = createPostDto.status;
    post.onlyTeacher = createPostDto.onlyTeacher;
    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findOne(id: number) {
    return await this.postRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async incrementViews(id: number) {
    await this.postRepository.increment({ id }, 'views', 1);
  }

  async remove(id: number) {
    return await this.postRepository.delete(id);
  }
}
