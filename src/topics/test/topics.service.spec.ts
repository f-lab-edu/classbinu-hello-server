import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateTopicDto } from '../dto/create-topic.dto';
import { Topic } from '../entities/topic.entity';
import { TopicsService } from '../topics.service';

describe('TopicsService', () => {
  let service: TopicsService;
  let mockTopicsRepository: jest.Mocked<Repository<Topic>>;

  beforeEach(async () => {
    mockTopicsRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: 'TopicRepository',
          useValue: mockTopicsRepository,
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  describe('create', () => {
    let createTopicDto: CreateTopicDto;

    beforeEach(() => {
      createTopicDto = {
        title: 'title',
        description: 'description',
        status: 'private',
      };
    });

    it('정상 요청인 경우 글쓰기 주제가 생성되어야 한다.', async () => {
      const expectedTopic = {
        id: 1,
        ...createTopicDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTopicsRepository.save.mockResolvedValue(expectedTopic);

      const result = await service.create(createTopicDto);
      expect(result).toEqual(expectedTopic);
      expect(mockTopicsRepository.save).toHaveBeenCalledWith(createTopicDto);
    });

    it('비정상 요청인 경우 에러가 발생해야 한다.', async () => {
      mockTopicsRepository.save.mockRejectedValue(new Error());

      await expect(service.create(createTopicDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('모든 글쓰기 주제를 반환해야 한다.', async () => {
      const expectedTopics = [{ id: 1 }, { id: 2 }] as Topic[];
      mockTopicsRepository.find.mockResolvedValue(expectedTopics);

      const result = await service.findAll();
      expect(result).toEqual(expectedTopics);
      expect(mockTopicsRepository.find).toHaveBeenCalled();
    });

    it('글쓰기 주제가 없는 경우 빈 배열을 반환해야 한다.', async () => {
      mockTopicsRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('비정상 요청인 경우 에러가 발생해야 한다.', async () => {
      mockTopicsRepository.find.mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('특정 글쓰기 주제를 반환해야 한다.', async () => {
      const expectedTopic = { id: 1 } as Topic;
      mockTopicsRepository.findOneBy.mockResolvedValue(expectedTopic);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedTopic);
      expect(mockTopicsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('글쓰기 주제가 없는 경우 null을 반환해야 한다.', async () => {
      mockTopicsRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(1);
      expect(result).toBeNull();
    });

    it('비정상 요청인 경우 에러가 발생해야 한다.', async () => {
      mockTopicsRepository.findOneBy.mockRejectedValue(new Error());

      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    let updateTopicDto: CreateTopicDto;

    beforeEach(() => {
      updateTopicDto = {
        title: 'update-title',
        description: 'description',
        status: 'private',
      };
    });

    it('정상 요청인 경우 글쓰기 주제가 수정되어야 한다.', async () => {
      const updateResult = {
        affected: 1,
      } as UpdateResult;

      mockTopicsRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(1, updateTopicDto);
      expect(result).toEqual(updateResult);
      expect(mockTopicsRepository.update).toHaveBeenCalledWith(
        1,
        updateTopicDto,
      );
    });

    it('비정상 요청인 경우 에러가 발생해야 한다.', async () => {
      mockTopicsRepository.update.mockRejectedValue(new Error());

      await expect(service.update(1, updateTopicDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('정상 요청인 경우 글쓰기 주제가 삭제되어야 한다.', async () => {
      const deleteResult = {
        affected: 1,
      } as DeleteResult;

      mockTopicsRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(1);
      expect(result).toEqual(deleteResult);
      expect(mockTopicsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('글쓰기 주제가 없는 경우, affected가 0인 결과를 반환해야 한다.', async () => {
      const deleteResult = {
        affected: 0,
      } as DeleteResult;

      mockTopicsRepository.delete.mockResolvedValue(deleteResult);

      await expect(service.remove(1)).resolves.toEqual(deleteResult);
    });

    it('비정상 요청인 경우 에러가 발생해야 한다.', async () => {
      mockTopicsRepository.delete.mockRejectedValue(new Error());

      await expect(service.remove(1)).rejects.toThrow();
    });
  });
});
