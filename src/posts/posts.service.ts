import { CreatePostDto } from './dto/create-post.dto';
import { Inject, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_REPOSITORY')
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
    return await `This action returns all posts`;
  }

  async findOne(id: number) {
    return await `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    return await `This action removes a #${id} post`;
  }
}
