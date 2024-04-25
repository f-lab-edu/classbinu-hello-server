import { Test, TestingModule } from '@nestjs/testing';

import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';
import { PostOwnerGuard } from '../guards/post-owner.guard';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PostsController', () => {
  let controller: PostsController;
  let mockPostsService: jest.Mocked<Partial<PostsService>>;
  let mockPostOwnerGuard: jest.Mocked<Partial<PostOwnerGuard>>;
  let mockRepository: Partial<Repository<Post>>;
  const userId = 1;

  beforeEach(async () => {
    mockPostsService = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      findAll: jest.fn().mockResolvedValue([{ id: 1 }]),
      findOne: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
      incrementViews: jest.fn().mockResolvedValue({ id: 1 }),
      remove: jest.fn().mockResolvedValue({ id: 1 }),
    };

    mockPostOwnerGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: PostOwnerGuard,
          useValue: mockPostOwnerGuard,
        },
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostDto = {
      title: 'title',
      content: 'content',
    } as CreatePostDto;

    expect(await controller.create(createPostDto, userId)).toEqual({
      id: 1,
    });
    expect(mockPostsService.create).toHaveBeenCalledWith(createPostDto);
  });

  it('should find all posts', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1 }]);
    expect(mockPostsService.findAll).toHaveBeenCalled();
  });

  it('should find one post', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1 });
    expect(mockPostsService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a post', async () => {
    const updatePostDto = {
      title: 'title',
      content: 'content',
    } as CreatePostDto;

    expect(await controller.update(1, updatePostDto)).toEqual({
      id: 1,
    });
    expect(mockPostsService.update).toHaveBeenCalledWith(1, updatePostDto);
  });

  it('should increment views', async () => {
    expect(await controller.incrementViews(1)).toEqual({ id: 1 });
    expect(mockPostsService.incrementViews).toHaveBeenCalledWith(1);
  });

  it('should remove a post', async () => {
    expect(await controller.remove(1)).toEqual({
      id: 1,
    });
    expect(mockPostsService.remove).toHaveBeenCalledWith(1, 1);
  });
});
