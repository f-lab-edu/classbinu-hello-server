import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@nestjs/config';
import { CreatePostDto } from '../dto/create-post.dto';
import { Point } from 'src/points/entities/point.entity';
import { Post } from '../entities/post.entity';
import { PostsService } from '../services/posts.service';
import { Repository } from 'typeorm';
import { find } from 'rxjs';

describe('PostsService', () => {
  let service: PostsService;
  let mockPostRepository: jest.Mocked<Repository<Post>>;
  let mockManager: jest.Mocked<any>;
  let configService: ConfigService;

  beforeEach(async () => {
    mockManager = {
      findOneBy: jest.fn(),
      remove: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockPostRepository = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      find: jest.fn().mockResolvedValue([{ id: 1 }]),
      findOneBy: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
      increment: jest.fn().mockResolvedValue({ id: 1 }),
      delete: jest.fn().mockResolvedValue({ id: 1 }),
      query: jest.fn(),
      manager: {
        transaction: jest.fn().mockImplementation((cb) => cb(mockManager)),
        findOneBy: jest.fn().mockResolvedValue({ id: 1 }),
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
        remove: jest.fn(),
        save: jest.fn(),
      },
    } as any;

    service = new PostsService(mockManager, configService);
    jest.spyOn(service, 'findPostById').mockResolvedValue({ id: 1 });
    jest.spyOn(service, 'removePost').mockResolvedValue();
    jest.spyOn(service, 'adjustPoint').mockResolvedValue();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: 'PostRepository',
          useValue: mockPostRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'points.reward') {
                return 10;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.skip('should create a post', async () => {
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

  it('검색어가 있을 때 만족하는 검색 결과를 반환한다.', async () => {
    const q = 'title';
    const query = `
        SELECT * FROM posts 
        WHERE title LIKE $1
        OR content LIKE $1;
      `;
    mockPostRepository.query.mockResolvedValue([{ id: 1 }]);
    expect(await service.findAll(q)).toEqual([{ id: 1 }]);
    expect(mockPostRepository.query).toHaveBeenCalledWith(query, [`%${q}%`]);
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
    const postId = 1;
    const mockPost = { id: 1, title: 'Test Post', user: { id: 1 } };

    mockManager.findOneBy.mockResolvedValue(mockPost);
    await service.remove(postId);

    expect(mockManager.transaction).toHaveBeenCalled();
    expect(service.findPostById).toHaveBeenCalledWith(mockManager, postId);
    expect(service.removePost).toHaveBeenCalledWith(mockManager, mockPost);
    expect(service.adjustPoint).toHaveBeenCalledWith(
      mockManager,
      mockPost.user,
    );
  });
});
