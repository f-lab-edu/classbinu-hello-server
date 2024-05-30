import { Test, TestingModule } from '@nestjs/testing';

import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';
import { PostsService } from '../services/posts.service';
import { Repository } from 'typeorm';

describe('PostsService', () => {
  let service: PostsService;
  let mockPostRepository: jest.Mocked<Repository<Post>>;

  beforeEach(async () => {
    mockPostRepository = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      find: jest.fn().mockResolvedValue([{ id: 1 }]),
      findOneBy: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
      increment: jest.fn().mockResolvedValue({ id: 1 }),
      delete: jest.fn().mockResolvedValue({ id: 1 }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: 'PostRepository',
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostDto = {
      title: 'title',
      content: 'content',
    } as CreatePostDto;
    expect(await service.create(createPostDto)).toEqual({ id: 1 });
    expect(mockPostRepository.save).toHaveBeenCalledWith(createPostDto);
  });

  it('should find all posts', async () => {
    expect(await service.findAll()).toEqual([{ id: 1 }]);
    expect(mockPostRepository.find).toHaveBeenCalled();
  });

  it('should find one post', async () => {
    expect(await service.findOne(1)).toEqual({ id: 1 });
    expect(mockPostRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should update a post', async () => {
    const updatePostDto = {
      title: 'title',
      content: 'content',
    } as CreatePostDto;
    expect(await service.update(1, updatePostDto)).toEqual({ id: 1 });
    expect(mockPostRepository.update).toHaveBeenCalledWith(1, updatePostDto);
  });

  it('should increment views', async () => {
    expect(await service.incrementViews(1)).toEqual({ id: 1 });
    expect(mockPostRepository.increment).toHaveBeenCalledWith(
      { id: 1 },
      'views',
      1,
    );
  });

  it('should remove a post', async () => {
    expect(await service.remove(1)).toEqual({ id: 1 });
    expect(mockPostRepository.delete).toHaveBeenCalledWith(1);
  });
});
